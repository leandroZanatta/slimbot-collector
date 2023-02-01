package br.com.slimbot.collector.worker;

import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Log;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import br.com.slimbot.collector.ScriptExecutor;
import br.com.slimbot.collector.repository.ConfiguracaoRepository;
import br.com.slimbot.collector.repository.FaucetRepository;
import br.com.slimbot.collector.repository.model.Configuracao;
import br.com.slimbot.collector.repository.model.Faucet;
import br.com.slimbot.collector.service.CaptchaService;
import br.com.slimbot.collector.vo.CaptchaPropsVO;
import br.com.slimbot.collector.vo.DadosPaginaVO;
import br.com.slimbot.collector.vo.SiteConfigVO;
import br.com.slimbot.collector.vo.TaskVO;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class FaucetWorker implements Runnable {

    private final static String LOG_TAG = "FaucetWorker";
    private final ScriptExecutor scriptExecutor;

    private CaptchaService captchaService=new CaptchaService();
    private final String dbPath;
    private Configuracao configuracao;
    private OkHttpClient client = new OkHttpClient().newBuilder().build();

    public FaucetWorker(String dbPath, ScriptExecutor scriptExecutor) {
        this.dbPath = dbPath;
        this.scriptExecutor = scriptExecutor;
    }

    @Override
    public void run() {
        Log.i(LOG_TAG, "Checando existência do banco de dados:" + this.dbPath);

        if (checkDataBase()) {
            Log.i(LOG_TAG, "Banco de dados existe. Continuando");

            Configuracao modeloConfiguracao = new ConfiguracaoRepository(this.dbPath).obterConfiguracao();

            if (modeloConfiguracao == null) {
                Log.w(LOG_TAG, "Não foi possível iniciar o worker. Motivo: configuração inexistente");
                return;
            }

            this.configuracao = modeloConfiguracao;

            Log.i(LOG_TAG, "Trabalhando com a configuração de usuário: " + modeloConfiguracao.getDescricao());

            this.iniciarWorker();
        }
    }

    private void iniciarWorker() {

        while (true) {

            try {

                List<Faucet> faucetsExecutar = new ArrayList<>();
                Date dataAtual = new Date();
                List<Faucet> faucetsSalvos = new FaucetRepository(this.dbPath).obterFaucetExecucao();

                String captchaId = getCaptchaId();

                for (Faucet faucet : faucetsSalvos) {
                    if (faucet.getDataExecucao().after(dataAtual)) {
                        faucetsExecutar.add(faucet);
                    }
                }

                Log.i(LOG_TAG, "Número de faucets a executar: " + faucetsExecutar.size());

                for (Faucet faucet : faucetsSalvos) {

                    this.executarFaucet(faucet, captchaId);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }

            sleep(5 * 60 * 1000L);
        }
    }

    private void executarFaucet(Faucet faucet, String captchaId) {
        Log.i(LOG_TAG, faucet.toString());

        boolean valid = false;

        //      while (!valid) {
        DadosPaginaVO dadosPaginaVO = this.obterDadosPagina(faucet.getHost());

        Log.i(LOG_TAG, String.format("Dados da página: host: %s - Logado: %s - Token: %s", faucet.getHost(), dadosPaginaVO.isLogged(), dadosPaginaVO.getCrsfToken()));

        if (!dadosPaginaVO.isLogged()) {
            this.efetuarLogin(dadosPaginaVO, faucet, captchaId);
        }

        //    valid = dadosPaginaVO.isLogged();
        //   }


    }

    private void efetuarLogin(DadosPaginaVO dadosPaginaVO, Faucet faucet, String captchaId) {
        Log.i(LOG_TAG, String.format("Host: %s, SiteKey: %s, captchaId: %s", faucet.getHost(), dadosPaginaVO.getSiteKey(), captchaId));

        String captchaKey = captchaService.resolverCaptcha(new CaptchaPropsVO(faucet.getHost(), dadosPaginaVO.getSiteKey(), captchaId, faucet.getHcaptchaHost()));

        Log.i(LOG_TAG, captchaKey);
    }










    private DadosPaginaVO obterDadosPagina(String host) {

        DadosPaginaVO dadosPaginaVO = new DadosPaginaVO();

        MediaType mediaType = MediaType.parse("text/plain");

        Request request = createDefaultRequet(host)
                .method("GET", null)
                .addHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
                .addHeader("Sec-Fetch-Dest", "document")
                .addHeader("Sec-Fetch-Mode", "navigate")
                .addHeader("Sec-Fetch-Site", "none")
                .addHeader("Upgrade-Insecure-Requests", "1")
                .build();

        try {
            Response response = client.newCall(request).execute();

            if (response.code() == 200) {
                String data = response.body().string();
                dadosPaginaVO.setLogged(data.indexOf("<a href=\"/logout\">") > 0);
                dadosPaginaVO.setCrsfToken(this.getCrsfToken(data));
                dadosPaginaVO.setSiteKey(this.getSiteKey(data));
            }

        } catch (IOException io) {

        }

        return dadosPaginaVO;
    }

    private String getCaptchaId() {

        Request request = new Request.Builder().url("https://hcaptcha.com/1/api.js").method("GET", null).build();

        try {
            Response response = client.newCall(request).execute();

            if (response.code() == 200) {
                String data = response.body().string();

                int starts = data.indexOf("https://newassets.hcaptcha.com/captcha/v1/") + 42;
                return data.substring(starts, data.indexOf("/", starts));
            }

        } catch (IOException io) {

        }

        return "";
    }


    private String getSiteKey(String data) {

        String strIndex = "sitekey: '";

        int indexInicial = data.indexOf(strIndex);

        return data.substring((indexInicial + strIndex.length()), data.indexOf("',", indexInicial)).trim();
    }

    private String getCrsfToken(String data) {

        String strIndex = "<meta name=\"csrf-token\" content=\"";

        int indexInicial = data.indexOf(strIndex);

        String retorno = data.substring((indexInicial + strIndex.length()), data.indexOf("/>", indexInicial) - 1);

        if (retorno.endsWith("\"")) {
            return retorno.substring(0, retorno.length() - 1);
        }

        return retorno;
    }


    private Request.Builder createDefaultRequet(String host) {

        return new Request.Builder().url(String.format("https://%s", host))
                .addHeader("host", host)
                .addHeader("sec-ch-ua", "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"")
                .addHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36")
                .addHeader("sec-ch-ua-mobile", "?0")
                .addHeader("sec-ch-ua-platform", "\"Windows\"")
                .addHeader("host", host);

    }


    private void sleep(long mils) {
        try {
            Thread.sleep(mils);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private boolean checkDataBase() {
        SQLiteDatabase checkDB = null;
        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READONLY);
            checkDB.close();
        } catch (SQLiteException e) {

        }
        return checkDB != null;
    }

}
