package br.com.slimbot.collector.repository;

import android.content.ContentValues;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import br.com.slimbot.collector.repository.model.Faucet;
import br.com.slimbot.collector.repository.projection.FaucetProjection;

public class FaucetRepository extends AbstractRepository {

    private final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);

    public FaucetRepository(String dbPath) {
        super(dbPath);
    }

    public Integer salvarFaucet(Faucet faucet) {

        SQLiteDatabase checkDB = null;

        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READWRITE);

            ContentValues contentValues = new ContentValues();
            contentValues.put("cd_carteira", faucet.getCodigoCarteira());
            contentValues.put("cd_usuario", faucet.getCodigoUsuario());
            contentValues.put("dt_proximaexecucao", faucet.getProximaExecucao());
            contentValues.put("vl_saldoatual", faucet.getSaldoAtual());

            return (int) checkDB.insert("tb_faucet", "id_faucet", contentValues);
        } catch (SQLiteException e) {
            e.printStackTrace();
        } finally {
            if (checkDB != null) {
                checkDB.close();
            }
        }

        return null;
    }

    public void atualizarFaucet(Integer codigoFaucet, Integer timeout, BigDecimal valorBalanco) {

        SQLiteDatabase checkDB = null;

        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READWRITE);

            ContentValues contentValues = new ContentValues();
            contentValues.put("dt_proximaexecucao", simpleDateFormat.format(new Date(new Date().getTime() + (timeout * 1000))));
            contentValues.put("vl_saldoatual", valorBalanco.doubleValue());

            checkDB.update("tb_faucet", contentValues, "id_faucet=" + codigoFaucet.toString(), null);

        } catch (SQLiteException e) {
            e.printStackTrace();
        } finally {
            if (checkDB != null) {
                checkDB.close();
            }
        }

    }

    public List<FaucetProjection> obterFaucetExecucao() {

        List<Object[]> tupla = super.executeQuery("select faucet.id_faucet, carteira.tx_descricao, carteira.tx_host, usuario.tx_email, usuario.tx_senha, faucet.dt_proximaexecucao, faucet.vl_saldoatual from tb_faucet faucet inner join tb_usuario usuario on faucet.cd_usuario=usuario.id_usuario inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where faucet.fl_ativo=1 order by faucet.dt_proximaexecucao asc");
        List<FaucetProjection> faucetProjections = new ArrayList<>();

        if (tupla.isEmpty()) {
            return Collections.emptyList();
        }

        for (int i = 0; i < tupla.size(); i++) {
            Object[] conf = tupla.get(i);

            FaucetProjection faucetProjection = new FaucetProjection();
            faucetProjection.setCodigoFaucet((Integer) conf[0]);
            faucetProjection.setCarteira((String) conf[1]);
            faucetProjection.setHost((String) conf[2]);
            faucetProjection.setEmail((String) conf[3]);
            faucetProjection.setSenha((String) conf[4]);
            faucetProjection.setDataExecucao((String) conf[5]);
            faucetProjection.setSaldoAtual(Double.valueOf(conf[6].toString()));

            faucetProjections.add(faucetProjection);
        }
        return faucetProjections;
    }


    public FaucetProjection obterFaucet(Integer codigoFaucet) {

        List<Object[]> tupla = super.executeQuery("select faucet.id_faucet, carteira.tx_descricao, carteira.tx_host, usuario.tx_email, usuario.tx_senha, faucet.dt_proximaexecucao, faucet.vl_saldoatual from tb_faucet faucet inner join tb_usuario usuario on faucet.cd_usuario=usuario.id_usuario inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where faucet.fl_ativo=1 and faucet.id_faucet=" + codigoFaucet);

        if (tupla.isEmpty()) {
            return null;
        }

        Object[] conf = tupla.get(0);

        FaucetProjection faucetProjection = new FaucetProjection();
        faucetProjection.setCodigoFaucet((Integer) conf[0]);
        faucetProjection.setCarteira((String) conf[1]);
        faucetProjection.setHost((String) conf[2]);
        faucetProjection.setEmail((String) conf[3]);
        faucetProjection.setSenha((String) conf[4]);
        faucetProjection.setDataExecucao((String) conf[5]);
        faucetProjection.setSaldoAtual(Double.valueOf(conf[6].toString()));

        return faucetProjection;
    }


    public List<Integer> obterTodosFaucets() {

        List<Object[]> tupla = super.executeQuery("select id_faucet from tb_faucet");
        List<Integer> results = new ArrayList<>();

        if (tupla.isEmpty()) {
            return Collections.emptyList();
        }

        for (int i = 0; i < tupla.size(); i++) {
            Object[] conf = tupla.get(i);

            results.add((Integer) conf[0]);
        }
        return results;
    }
}
