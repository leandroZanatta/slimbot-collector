import { ICarteiraProps } from "../repository/model/carteira/Carteira.meta";

export interface ICotacaoAtivo {
    carteira: ICarteiraProps;
    quantidade: number;
    preco: number
}