package br.com.slimbot.collector.cadastro;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import java.io.File;

import br.com.slimbot.collector.cadastro.service.AutorizarCadastroService;
import br.com.slimbot.collector.cadastro.service.VerificarCadastroService;

public class CadastroIntentService extends IntentService {

    private static final String TAG = "FaucetCadastroServ.";

    public CadastroIntentService() {
        super("CadastroIntentService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Bundle bundle = intent.getExtras();
        String type = bundle.getString("type");

        Log.d(TAG, "onHandleIntent => Iniciando Intenção de cadastro: " + type);

        File pastaSqlite = new File(this.getApplicationContext().getFilesDir().getAbsolutePath() + File.separator + "SQLite", "collector.db");

        Log.d(TAG, "onHandleIntent => Bundle Param: " + pastaSqlite.getAbsolutePath());

        if ("verify".equals(type)) {
            new VerificarCadastroService(pastaSqlite.getAbsolutePath()).execute();

            return;
        }

        if ("authorize".equals(type)) {

            new AutorizarCadastroService(pastaSqlite.getAbsolutePath(), bundle.getInt("carteira"), bundle.getString("url")).execute();

            return;
        }
    }


}
