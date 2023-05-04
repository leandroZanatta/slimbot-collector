import moment from 'moment';
import { MetaData } from "../MetaData";
import { faucetMetaData, IFaucetProps } from "./Faucet.meta";

class Faucet extends MetaData<IFaucetProps> {

    private constructor() {
        super(faucetMetaData)
    }

    public static Builder(): Faucet {
        return new Faucet();
    }

    public codigoCarteira(codigoCarteira: number): Faucet {
        this.setProperty('codigoCarteira', codigoCarteira);
        return this;
    }

    public codigoUsuario(codigoUsuario: number): Faucet {
        this.setProperty('codigoUsuario', codigoUsuario);
        return this;
    }

    public ativo(ativo: boolean): Faucet {
        this.setProperty('ativo', ativo);
        return this;
    }

    public situacao(situacao: number): Faucet {
        this.setProperty('situacao', situacao);
        return this;
    }

    public proximaExecucao(proximaExecucao: Date): Faucet {
        this.setProperty('proximaExecucao', moment(proximaExecucao).format('YYYY-MM-DD HH:mm:ss'));
        return this;
    }

    public saldoAtual(saldoAtual: number): Faucet {
        this.setProperty('saldoAtual', saldoAtual);
        return this;
    }

}

export default Faucet;