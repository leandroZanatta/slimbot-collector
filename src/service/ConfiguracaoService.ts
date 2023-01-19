import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import Migration from "../repository/model/migration/Migration";
import ConfiguracaoRepository from "../repository/ConfiguracaoRepository";
import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import Configuracao from "../repository/model/configuracao/Configuracao";


export default class ConfiguracaoService {

    private configuracaoRepository: ConfiguracaoRepository;

    constructor(db: WebSQLDatabase) {
        this.configuracaoRepository = new ConfiguracaoRepository(db);
    }

    public buscarConfiguracao(): Promise<IConfiguracaoProps | null> {

        return this.configuracaoRepository.findFirst(Configuracao.Builder().id(1));
    }
}