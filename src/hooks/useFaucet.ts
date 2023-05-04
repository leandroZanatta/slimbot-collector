import { atualizarDadosFaucetCarteiraThunk, buscarFaucetsCarteiraThunk } from "../store/thunk/FaucetThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";
import useUsuarios from "./useUsuarios";


export default function useFaucet() {

    const { db } = useDb();
    const { usuarioSelecionado } = useUsuarios();
    const faucets = useAppSelector((state: any) => state.FaucetSlice.faucets);
    const dispatch = useAppDispatch();

    const buscarFaucets = () => {
        dispatch(buscarFaucetsCarteiraThunk({ db, cdUsuario: usuarioSelecionado.id }));
    }

    const atualizarFaucet = (cdFaucet: number) => {
        dispatch(atualizarDadosFaucetCarteiraThunk({ db, cdFaucet }));
    }

    return {
        faucets,
        atualizarFaucet,
        buscarFaucets,
    }
}