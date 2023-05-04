import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import CarteiraRepository from "../repository/CarteiraRepository";
import { IFaucetCarteiraProps } from "../repository/model/carteira/Carteira.meta";


export default class CarteiraService {

    private carteiraRepository: CarteiraRepository;

    constructor(db: WebSQLDatabase) {
        this.carteiraRepository = new CarteiraRepository(db);
    }

    public async buscarCarteiras(codigoUsuario: number): Promise<Array<IFaucetCarteiraProps>> {

        return await this.carteiraRepository.buscarCarteiras(codigoUsuario);
    }

    public async atualizarSituacaoCarteira(codigoCarteira: number, ativo: boolean, registrada: number) {

        await this.carteiraRepository.atualizarSituacaoCarteira(codigoCarteira, ativo, registrada);
    }


}