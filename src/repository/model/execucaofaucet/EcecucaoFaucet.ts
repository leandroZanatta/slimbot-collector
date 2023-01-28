import moment from 'moment';
import { MetaData } from "../MetaData";
import { execucaoFaucetMetaData, IExecucaoFaucetProps } from './ExecucaoFaucet.meta';


class ExecucaoFaucet extends MetaData<IExecucaoFaucetProps> {

    private constructor() {
        super(execucaoFaucetMetaData)
    }

    public static Builder(): ExecucaoFaucet {
        return new ExecucaoFaucet();
    }

    public codigoFaucet(codigoFaucet: number): ExecucaoFaucet {
        this.setProperty('codigoFaucet', codigoFaucet);
        return this;
    }

    public dataExecucao(dataExecucao: Date): ExecucaoFaucet {
        this.setProperty('dataExecucao', moment(dataExecucao).format('YYYY-MM-DD HH:mm:ss'));
        return this;
    }

    public valorRoll(valorRoll: number): ExecucaoFaucet {
        this.setProperty('valorRoll', valorRoll);
        return this;
    }

}

export default ExecucaoFaucet;