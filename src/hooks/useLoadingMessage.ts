import { fecharLoadingMensagem, setLoadingMensagem } from "../store/slices/LoadingMessageSlice";
import { useAppDispatch, useAppSelector } from "./redux";

export default function useLoadingMessage() {

    const loading = useAppSelector((state: any) => state.LoadingMessageSlice.loading);
    const mensagem = useAppSelector((state: any) => state.LoadingMessageSlice.mensagem);

    const dispatch = useAppDispatch();

    const addLoading = (mensagem: string) => {
        dispatch(setLoadingMensagem(mensagem))
    }

    const fecharLoading = () => {
        dispatch(fecharLoadingMensagem())
    }


    return {
        loading,
        mensagem,
        addLoading,
        fecharLoading
    }
}