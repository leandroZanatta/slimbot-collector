import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import CarteiraRepository from "../repository/CarteiraRepository";
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";


export default class CarteiraService {

    private carteiraRepository: CarteiraRepository;

    constructor(db: WebSQLDatabase) {
        this.carteiraRepository = new CarteiraRepository(db);
    }

    public async buscarCarteiras(): Promise<Array<ICarteiraProps>> {

        return await this.carteiraRepository.buscarCarteiras();
    }

    public async atualizarSituacaoCarteira(codigoCarteira: number, ativo: boolean, registrada: boolean) {

        await this.carteiraRepository.atualizarSituacaoCarteira(codigoCarteira, ativo, registrada);
    }


}