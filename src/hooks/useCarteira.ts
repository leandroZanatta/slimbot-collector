import { buscarCarteirasThunk } from "../store/thunk/CarteiraThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";


export default function useCarteira() {

    const { db } = useDb();
    const carteiras = useAppSelector((state: any) => state.CarteiraSlice.carteiras);
    const dispatch = useAppDispatch();

    const buscarCarteiras = () => {
        dispatch(buscarCarteirasThunk(db));
    }

    return {
        carteiras,
        buscarCarteiras,
    }
}