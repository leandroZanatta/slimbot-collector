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

    public async buscarFaucetsCarteira(): Promise<Array<IFaucetCarteiraProps>> {

        return await this.faucetRepository.buscarFaucetsCarteira();
    }

    public async obterMenorDataExecucao(): Promise<string> {

        return await this.faucetRepository.obterMenorDataExecucao();
    }


}