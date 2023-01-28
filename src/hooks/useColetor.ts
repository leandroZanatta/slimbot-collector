import moment from "moment";
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";
import CollectorService from "../service/CollectorService";
import FaucetService from "../service/FaucetService";
import useConfiguracao from "./useConfiguracao";
import { useDb } from "./useDb";
import { delay } from '../utilitarios/CaptchaUtils';
import useFaucet from "./useFaucet";

export default function useColetor() {

    const { db } = useDb();
    const { configuracao } = useConfiguracao();
    const { buscarFaucets } = useFaucet();

    const iniciarColeta = async (carteiras: Array<ICarteiraProps>, executarComando: any) => {

        const collectorService: CollectorService = new CollectorService();

        while (true) {

            await collectorService.collectFaucet(db, configuracao, carteiras, executarComando);

            const faucetService: FaucetService = new FaucetService(db);

            buscarFaucets();

            const dataExecucao: string = await faucetService.obterMenorDataExecucao();

            const dif: number = moment(dataExecucao).diff(new Date());

            if (dif > 0) {

                console.log(`aguardando ${dif / 1000} segundos para executar novamente`);

                await delay(dif);
            }
        }

    }

    return {
        iniciarColeta,
    }
}