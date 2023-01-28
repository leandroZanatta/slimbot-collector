import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import ConfiguracaoRepository from "../repository/ConfiguracaoRepository";
import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import Configuracao from "../repository/model/configuracao/Configuracao";
import CarteiraRepository from "../repository/CarteiraRepository";
import FaucetRepository from "../repository/FaucetRepository";
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";
import Faucet from "../repository/model/faucet/Faucet";

export default class ConfiguracaoService {

    private configuracaoRepository: ConfiguracaoRepository;
    private db: WebSQLDatabase;

    constructor(db: WebSQLDatabase) {
        this.configuracaoRepository = new ConfiguracaoRepository(db);
        this.db = db;
    }

    public async buscarConfiguracao(): Promise<IConfiguracaoProps | null> {

        return await this.configuracaoRepository.findFirst(Configuracao.Builder().id(1));
    }

    public async salvarConfiguracao(configuracao: IConfiguracaoProps): Promise<IConfiguracaoProps> {

        const carteiraRepository: CarteiraRepository = new CarteiraRepository(this.db);
        const faucetRepository: FaucetRepository = new FaucetRepository(this.db);

        const carteiras: Array<ICarteiraProps> = await carteiraRepository.buscarCarteiras();

        const modelConfiguracao: IConfiguracaoProps = await this.configuracaoRepository.save(Configuracao.BuilderWhithProps(configuracao));

        for (var i = 0; i < carteiras.length; i++) {

            try {
                const carteira: ICarteiraProps = carteiras[i];

                await carteiraRepository.atualizarSituacaoCarteira(carteira.id, true, true);

                faucetRepository.save(Faucet.Builder().codigoCarteira(carteira.id).saldoAtual(0).codigoUsuario(modelConfiguracao.id).proximaExecucao(new Date()));

            } catch (e) {

            }
        }

        return modelConfiguracao;
    }
}