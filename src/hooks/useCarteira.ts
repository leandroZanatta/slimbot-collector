import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";
import CadastroService from "../service/CadastroService";
import { fecharModal, selecionarCarteira } from "../store/slices/CarteiraSlice";
import { buscarCarteirasThunk } from "../store/thunk/CarteiraThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";

export default function useCarteira() {

    const { db } = useDb();
    const carteiras = useAppSelector((state: any) => state.CarteiraSlice.carteiras);
    const carteira = useAppSelector((state: any) => state.CarteiraSlice.carteira);
    const modalCarteiraAberta = useAppSelector((state: any) => state.CarteiraSlice.modalCarteiraAberta);

    const dispatch = useAppDispatch();

    const fecharModalCarteira = () => {
        dispatch(fecharModal());

    }

    const editarCarteira = (carteira: ICarteiraProps) => {
        dispatch(selecionarCarteira(carteira));
    }

    const atualizarInfomacaoSite = async (carteira: ICarteiraProps) => {

        const cadastroService = new CadastroService(carteira);

        cadastroService.efetuarCadastro();

    }

    const buscarCarteiras = () => {
        dispatch(buscarCarteirasThunk(db));
    }

    return {
        carteiras,
        carteira,
        modalCarteiraAberta,
        fecharModalCarteira,
        editarCarteira,
        buscarCarteiras,
        atualizarInfomacaoSite
    }
}