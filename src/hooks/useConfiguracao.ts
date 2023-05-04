import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import ConfiguracaoService from "../service/ConfiguracaoService";
import { buscarConfiguracaoThunk } from "../store/thunk/ConfiguracaoThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";


export default function useConfiguracao() {

    const { db } = useDb();

    const configuracao: IConfiguracaoProps | null = useAppSelector((state: any) => state.ConfiguracaoSlice.configuracao);
    const dispatch = useAppDispatch();

    const carregarConfiguracao = () => {
        dispatch(buscarConfiguracaoThunk(db))
    }


    const atualizarServidor = async (servidor: string) => {
        await new ConfiguracaoService(db).atualizarServidor(servidor);
    }

    return {
        configuracao,
        carregarConfiguracao,
        atualizarServidor,
    }
}