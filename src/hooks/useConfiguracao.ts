import { IConfiguracaoFormProps } from "../presentation/configuracao/ConfiguracaoBasica";
import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import { buscarConfiguracaoThunk, salvarConfiguracaoThunk } from "../store/thunk/ConfiguracaoThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";


export default function useConfiguracao() {

    const { db } = useDb();
    const loading = useAppSelector((state: any) => state.ConfiguracaoSlice.loading);
    const configuracao = useAppSelector((state: any) => state.ConfiguracaoSlice.configuracao);
    const dispatch = useAppDispatch();

    const buscarConfiguracao = () => {
        dispatch(buscarConfiguracaoThunk(db));
    }

    const salvarConfiguracao = async (configuracao: IConfiguracaoFormProps) => {

        await dispatch(salvarConfiguracaoThunk({ db, configuracao }));
    }

    return {
        loading,
        configuracao,
        buscarConfiguracao,
        salvarConfiguracao
    }
}