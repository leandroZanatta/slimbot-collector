package br.com.slimbot.collector.repository.model;

import androidx.annotation.NonNull;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ExecucaoFaucet {
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);

    private int id;
    private int codigoFaucet;
    private String dataExecucao;
    private Double valorRoll;


    @NonNull
    @Override
    public String toString() {
        return String.format("{id: %s, codigoFaucet: %s, dataExecucao:%s, valorRoll:%s}", getId(), getCodigoFaucet(), getDataExecucao(), getValorRoll());
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCodigoFaucet() {
        return codigoFaucet;
    }

    public void setCodigoFaucet(int codigoFaucet) {
        this.codigoFaucet = codigoFaucet;
    }

    public String getDataExecucaoStr() {
        return this.dataExecucao;
    }

    public void setDataExecucaoDt(Date dataExecucao) {
        this.dataExecucao = sdf.format(dataExecucao);
    }

    public Date getDataExecucao() {
        try {
            return sdf.parse(dataExecucao);
        } catch (ParseException e) {

            e.printStackTrace();

            return new Date();
        }
    }

    public void setDataExecucao(String dataExecucao) {
        this.dataExecucao = dataExecucao;
    }

    public Double getValorRoll() {
        return valorRoll;
    }

    public void setValorRoll(Double valorRoll) {
        this.valorRoll = valorRoll;
    }
}
