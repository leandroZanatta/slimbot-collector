import { buscarFaucetsCarteiraThunk } from "../store/thunk/FaucetThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";


export default function useFaucet() {

    const { db } = useDb();
    const faucets = useAppSelector((state: any) => state.FaucetSlice.faucets);
    const dispatch = useAppDispatch();

    const buscarFaucets = () => {
        dispatch(buscarFaucetsCarteiraThunk(db));
    }

    return {
        faucets,
        buscarFaucets,
    }
}