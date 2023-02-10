import moment from "moment";
import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";
import CollectorService from "../service/CollectorService";
import FaucetService from "../service/FaucetService";
import useConfiguracao from "./useConfiguracao";
import { useDb } from "./useDb";
import { delay } from '../utilitarios/CaptchaUtils';
import useFaucet from "./useFaucet";
import { IFaucetCarteiraProps } from "../repository/model/faucet/Faucet.meta";

export default function useColetor() {

    const { db } = useDb();
    const { configuracao } = useConfiguracao();
    const { atualizarFaucet } = useFaucet();

    const iniciarColeta = async () => {

        const collectorService: CollectorService = new CollectorService();

        while (true) {
            const faucetCarteira: IFaucetCarteiraProps = await new FaucetService(db).buscarFaucetCarteiraMenorTempo();

            if (faucetCarteira != null) {

                const dif: number = moment(faucetCarteira.proximaExecucao).diff(new Date());

                if (dif > 0) {

                    console.log(`aguardando ${dif / 1000} segundos para executar a carteira ${faucetCarteira.carteira}`);

                    await delay(dif);
                }

                await collectorService.collectFaucet(db, configuracao, faucetCarteira);

                atualizarFaucet(faucetCarteira.id);

            }
        }

    }

    return {
        iniciarColeta,
    }
}