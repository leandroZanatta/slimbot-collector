import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import FaucetRepository from "../repository/FaucetRepository";
import Faucet from "../repository/model/faucet/Faucet";
import { IFaucetCarteiraProps } from "../repository/model/faucet/Faucet.meta";


export default class FaucetService {

    private faucetRepository: FaucetRepository;

    constructor(db: WebSQLDatabase) {
        this.faucetRepository = new FaucetRepository(db);
    }

    public async salvarFaucet(faucet: Faucet): Promise<void> {
        await this.faucetRepository.save(faucet);
    }

    public async buscarFaucetsCarteira(cdUsuario: number): Promise<Array<IFaucetCarteiraProps>> {
        return await this.faucetRepository.buscarFaucetsCarteira(cdUsuario);
    }

    public async buscarFaucetCarteiraPorId(cdFaucet: number): Promise<IFaucetCarteiraProps> {
        return await this.faucetRepository.buscarFaucetCarteiraPorId(cdFaucet);
    }

    public async buscarFaucetCarteiraMenorTempo(): Promise<IFaucetCarteiraProps> {
        return await this.faucetRepository.buscarFaucetCarteiraMenorTempo();
    }

    public async obterMenorDataExecucao(): Promise<string> {
        return await this.faucetRepository.obterMenorDataExecucao();
    }


}