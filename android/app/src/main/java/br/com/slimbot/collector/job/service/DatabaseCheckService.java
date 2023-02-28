package br.com.slimbot.collector.job.service;

import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;

public class DatabaseCheckService {

    public boolean checkDataBase(String dbPath) {

        SQLiteDatabase checkDB = null;

        try {

            checkDB = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY);
            checkDB.close();

        } catch (SQLiteException e) {

        }

        return checkDB != null;
    }
}
