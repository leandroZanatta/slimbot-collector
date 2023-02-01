package br.com.slimbot.collector.repository;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Log;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public abstract class AbstractRepository {
    private static final int FIELD_TYPE_BLOB = 4;
    private static final int FIELD_TYPE_FLOAT = 2;
    private static final int FIELD_TYPE_INTEGER = 1;
    private static final int FIELD_TYPE_NULL = 0;
    private static final int FIELD_TYPE_STRING = 3;

    private final String dbPath;

    public AbstractRepository(String dbPath) {
        this.dbPath = dbPath;
    }

    protected synchronized List<Object[]> executeQuery(String query) {

        SQLiteDatabase checkDB = null;
        List<Object[]> rows = new ArrayList<>();

        try {
            checkDB = SQLiteDatabase.openDatabase(this.dbPath, null,
                    SQLiteDatabase.OPEN_READWRITE);

            Cursor cursor = checkDB.rawQuery(query, null);

            if (cursor.getCount() == 0) {

                Log.i("AbstractRepository", "Query não possui dados");

                return Collections.emptyList();
            }

            while (cursor.moveToNext()) {

                Object[] tupla = new Object[cursor.getColumnCount()];

                for (int i = 0; i < cursor.getColumnCount(); i++) {

                    tupla[i] = getFieldFromCursor(cursor, i);
                }
                rows.add(tupla);
            }

        } catch (SQLiteException e) {
            e.printStackTrace();
        } finally {
            if (checkDB != null) {
                checkDB.close();
            }
        }

        return rows;
    }

    private Object getFieldFromCursor(Cursor cursor, int column) {

        switch (cursor.getType(column)) {
            case FIELD_TYPE_NULL: {
                return null;
            }
            case FIELD_TYPE_FLOAT: {
                return cursor.getDouble(column);
            }

            case FIELD_TYPE_INTEGER: {
                return cursor.getInt(column);
            }

            case FIELD_TYPE_STRING: {
                return cursor.getString(column);
            }
            case FIELD_TYPE_BLOB: {
                return new String(cursor.getBlob(column));
            }
        }
        return null;
    }
}
