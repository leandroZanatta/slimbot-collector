package br.com.slimbot.collector.job.vo;

import java.math.BigDecimal;
import java.util.List;

public class ResultadoColetasVO {

    private int timeout;
    private BigDecimal valorBalanco;
    private List<ResultsCollectorVO> resultados;


    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public BigDecimal getValorBalanco() {
        return valorBalanco;
    }

    public void setValorBalanco(BigDecimal valorBalanco) {
        this.valorBalanco = valorBalanco;
    }

    public List<ResultsCollectorVO> getResultados() {
        return resultados;
    }

    public void setResultados(List<ResultsCollectorVO> resultados) {
        this.resultados = resultados;
    }
}
