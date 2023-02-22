package br.com.slimbot.collector.repository;

import android.content.ContentValues;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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

    public Faucet obterFaucetPorCarteira(int codigoCarteira) {

        List<Object[]> tupla = super.executeQuery(String.format("select id_faucet, cd_carteira, cd_usuario, vl_saldoatual, dt_proximaexecucao from tb_faucet where cd_carteira=%s limit 1", codigoCarteira));

        if (tupla.isEmpty()) {
            return null;
        }

        Object[] tupleItem = tupla.get(0);

        Faucet faucet = new Faucet();
        faucet.setId((Integer) tupleItem[0]);
        faucet.setCodigoCarteira((Integer) tupleItem[1]);
        faucet.setCodigoUsuario((Integer) tupleItem[2]);
        faucet.setSaldoAtual(Double.valueOf(tupleItem[3].toString()));
        faucet.setProximaExecucao((String) tupleItem[4]);

        return faucet;

    }

    public Long salvarFaucet(Faucet faucet) {

        SQLiteDatabase checkDB = null;

        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READWRITE);

            ContentValues contentValues = new ContentValues();
            contentValues.put("cd_carteira", faucet.getCodigoCarteira());
            contentValues.put("cd_usuario", faucet.getCodigoUsuario());
            contentValues.put("dt_proximaexecucao", faucet.getProximaExecucao());
            contentValues.put("vl_saldoatual", faucet.getSaldoAtual());

            return checkDB.insert("tb_faucet", "id_faucet", contentValues);


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

        List<Object[]> tupla = super.executeQuery("select faucet.id_faucet, carteira.tx_descricao, carteira.tx_host, faucet.dt_proximaexecucao, faucet.vl_saldoatual from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where carteira.fl_ativo=true order by faucet.dt_proximaexecucao asc");
        List<FaucetProjection> faucetProjections = new ArrayList<>();
        if (tupla.isEmpty()) {
            return null;
        }

        for (int i = 0; i < tupla.size(); i++) {
            Object[] conf = tupla.get(i);

            FaucetProjection faucetProjection = new FaucetProjection();
            faucetProjection.setCodigoFaucet((Integer) conf[0]);
            faucetProjection.setCarteira((String) conf[1]);
            faucetProjection.setHost((String) conf[2]);
            faucetProjection.setDataExecucao((String) conf[3]);
            faucetProjection.setSaldoAtual(Double.valueOf(conf[4].toString()));

            faucetProjections.add(faucetProjection);
        }
        return faucetProjections;
    }


    public Date obterTempoExecucao() {
        List<Object[]> tupla = super.executeQuery("select faucet.dt_proximaexecucao from tb_faucet faucet inner join tb_carteira carteira on faucet.cd_carteira=carteira.id_carteira where carteira.fl_ativo=true order by faucet.dt_proximaexecucao asc");

        if (!tupla.isEmpty()) {

            try {
                return simpleDateFormat.parse(tupla.get(0)[0].toString());
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        return new Date();
    }


}
