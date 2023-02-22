package br.com.slimbot.collector.repository;

import android.content.ContentValues;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;

import br.com.slimbot.collector.repository.model.ExecucaoFaucet;

public class ExecucaoFaucetRepository extends AbstractRepository {

    public ExecucaoFaucetRepository(String dbPath) {
        super(dbPath);
    }

    public void salvarExecucaoFaucet(ExecucaoFaucet execucaoFaucet) {

        SQLiteDatabase checkDB = null;

        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READWRITE);

            ContentValues contentValues = new ContentValues();
            contentValues.put("cd_faucet",execucaoFaucet.getCodigoFaucet());
            contentValues.put("dt_execucao", execucaoFaucet.getDataExecucaoStr());
            contentValues.put("vl_roll", execucaoFaucet.getValorRoll());


            checkDB.insert("tb_execucaofaucet","id_execucaofaucet",contentValues);
        } catch (SQLiteException e) {
            e.printStackTrace();
        } finally {
            if (checkDB != null) {
                checkDB.close();
            }
        }

    }
}
