package br.com.slimbot.collector.job.listener;

import br.com.slimbot.collector.repository.model.Faucet;
import br.com.slimbot.collector.repository.projection.FaucetProjection;

public interface CollectorListener {
    public void onFaucetCollected(Integer codigoFaucet);
}
