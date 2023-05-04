import { IUsuarioProps } from "../repository/model/usuario/Usuario.meta";
import { buscarCotacaoAtivos } from "../store/thunk/CotacaoAtivoThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";
import useUsuarios from "./useUsuarios";


export default function useCotacaoAtivo() {

    const { db } = useDb();
    const { usuarioSelecionado } = useUsuarios();
    const cotacoes = useAppSelector((state: any) => state.CotacaoAtivoSlice.cotacoes);
    const dispatch = useAppDispatch();

    const buscarCotacoes = () => {
        dispatch(buscarCotacaoAtivos({ db, codigoUsuario: usuarioSelecionado.id }));
    }

    return {
        cotacoes,
        buscarCotacoes,
    }
}