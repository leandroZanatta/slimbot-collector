package br.com.slimbot.collector.job.service;

import android.database.sqlite.SQLiteDatabase;

public class DatabaseCheckService {

    public boolean checkDataBase(String dbPath) {

        SQLiteDatabase checkDB = null;

        try {

            checkDB = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY);
            checkDB.close();

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }

        return checkDB != null;
    }
}
