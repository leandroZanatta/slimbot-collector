import { buscarCotacaoAtivos } from "../store/thunk/CotacaoAtivoThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";


export default function useCotacaoAtivo() {

    const { db } = useDb();
    const cotacoes = useAppSelector((state: any) => state.CotacaoAtivoSlice.cotacoes);
    const dispatch = useAppDispatch();

    const buscarCotacoes = () => {
        dispatch(buscarCotacaoAtivos(db));
    }

    return {
        cotacoes,
        buscarCotacoes,
    }
}