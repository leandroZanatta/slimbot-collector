package br.com.slimbot.collector.repository;

import android.content.ContentValues;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;

import java.util.ArrayList;
import java.util.List;

import br.com.slimbot.collector.repository.model.Carteira;

public class CarteiraRepository extends AbstractRepository {
    public CarteiraRepository(String dbPath) {
        super(dbPath);
    }

    public void atualizarSituacaoCarteira(int codigoCarteira, int situacao, boolean carteiraAtiva) {

        SQLiteDatabase checkDB = null;

        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READWRITE);

            ContentValues contentValues = new ContentValues();
            contentValues.put("fl_ativo", carteiraAtiva);
            contentValues.put("fl_situacao", situacao);

            checkDB.update("tb_carteira", contentValues, "id_carteira=" + codigoCarteira, null);

        } catch (SQLiteException e) {
            e.printStackTrace();
        } finally {
            if (checkDB != null) {
                checkDB.close();
            }
        }
    }

    public int contarCarteirasAtivas() {
        List<Object[]> tupla = super.executeQuery("select count(*) from tb_carteira carteira where carteira.fl_situacao = 3 and carteira.fl_ativo=true");

        if (tupla.isEmpty()) {
            return 0;
        }

        return (int) tupla.get(0)[0];
    }

    public Carteira obterPorId(int codigoCarteira) {
        List<Object[]> tupla = super.executeQuery("select id_carteira, tx_descricao, fl_ativo, fl_situacao, tx_host, tx_refer from tb_carteira where id_carteira=" + codigoCarteira);

        if (tupla.isEmpty() || tupla.size() == 0) {
            return null;
        }

        Object[] conf = tupla.get(0);

        Carteira carteira = new Carteira();
        carteira.setId((Integer) conf[0]);
        carteira.setDescricao(conf[1].toString());
        carteira.setAtivo(((int) conf[2] == 1));
        carteira.setSituacao((int) conf[3]);
        carteira.setHost(conf[4].toString());
        carteira.setRefer(conf[5].toString());

        return carteira;
    }

    public List<Carteira> obterCarteirasInativas() {

        List<Object[]> tupla = super.executeQuery("select carteira.id_carteira, carteira.tx_descricao, carteira.fl_ativo, carteira.fl_situacao, carteira.tx_host, carteira.tx_refer  from tb_carteira carteira where carteira.fl_ativo = false and fl_situacao <> 3 ");
        List<Carteira> carteiras = new ArrayList<>();

        if (tupla.isEmpty()) {
            return null;
        }

        for (int i = 0; i < tupla.size(); i++) {
            Object[] conf = tupla.get(i);

            Carteira carteira = new Carteira();
            carteira.setId((Integer) conf[0]);
            carteira.setDescricao(conf[1].toString());
            carteira.setAtivo(((int) conf[2] == 1));
            carteira.setSituacao((int) conf[3]);
            carteira.setHost(conf[4].toString());
            carteira.setRefer(conf[5].toString());

            carteiras.add(carteira);
        }

        return carteiras;
    }

    public List<Carteira> obterCarteiras() {

        List<Object[]> tupla = super.executeQuery("select carteira.id_carteira, carteira.tx_descricao, carteira.fl_ativo, carteira.fl_situacao, carteira.tx_host, carteira.tx_refer from tb_carteira carteira order by fl_ativo");
        List<Carteira> carteiras = new ArrayList<>();

        if (tupla.isEmpty()) {
            return null;
        }

        for (int i = 0; i < tupla.size(); i++) {
            Object[] conf = tupla.get(i);

            Carteira carteira = new Carteira();
            carteira.setId((Integer) conf[0]);
            carteira.setDescricao(conf[1].toString());
            carteira.setAtivo(((int) conf[2] == 1));
            carteira.setSituacao((int) conf[3]);
            carteira.setHost(conf[4].toString());
            carteira.setRefer(conf[5].toString());

            carteiras.add(carteira);
        }

        return carteiras;
    }


}
