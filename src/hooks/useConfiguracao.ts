import { IConfiguracaoProps } from "../repository/model/configuracao/Configuracao.meta";
import { buscarConfiguracaoThunk, salvarConfiguracaoThunk } from "../store/thunk/ConfiguracaoThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";
import useModuloNativo from "./useModuloNativo";


export default function useConfiguracao() {

    const { db } = useDb();
    const loading = useAppSelector((state: any) => state.ConfiguracaoSlice.loading);
    const configuracao = useAppSelector((state: any) => state.ConfiguracaoSlice.configuracao);
    const { verificarUsuarioCadastrado } = useModuloNativo();
    const dispatch = useAppDispatch();

    const buscarConfiguracao = () => {
        dispatch(buscarConfiguracaoThunk(db));
    }

    const salvarConfiguracao = async (configuracao: IConfiguracaoProps) => {

        await dispatch(salvarConfiguracaoThunk({ db, configuracao }));
     
        verificarUsuarioCadastrado();
    }

    return {
        loading,
        configuracao,
        buscarConfiguracao,
        salvarConfiguracao
    }
}