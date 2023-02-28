package br.com.slimbot.collector.job.listener;

import br.com.slimbot.collector.repository.model.Faucet;

public interface CollectorListener {
    public void onFaucetCollected(Faucet faucet);
}
