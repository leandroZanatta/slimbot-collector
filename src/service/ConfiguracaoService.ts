import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import ConfiguracaoRepository from "../repository/ConfiguracaoRepository";
import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import Configuracao from "../repository/model/configuracao/Configuracao";

export default class ConfiguracaoService {

    private configuracaoRepository: ConfiguracaoRepository;


    constructor(db: WebSQLDatabase) {
        this.configuracaoRepository = new ConfiguracaoRepository(db);
    }

    public async buscarConfiguracao(): Promise<IConfiguracaoProps | null> {

        return await this.configuracaoRepository.findFirst(Configuracao.Builder().id(1));
    }

    public async salvarConfiguracao(configuracao: IConfiguracaoProps): Promise<IConfiguracaoProps> {

        return await this.configuracaoRepository.save(Configuracao.BuilderWhithProps(configuracao))
    }

    public async atualizarServidor(servidor: string): Promise<any> {

        return await this.configuracaoRepository.atualizarServidor(servidor)
    }
}