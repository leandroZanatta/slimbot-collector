import { Text } from "react-native-paper";
import { ICotacaoAtivo } from "../../types/CotacaoAtivo";

export interface ISaldoComponent {
    cotacoes: Array<ICotacaoAtivo>
}
const SaldoComponent = ({ cotacoes }: ISaldoComponent) => {

    return (
        <>
            <Text>{cotacoes.length === 0 ? 0 : cotacoes.map((cotacao: ICotacaoAtivo) => cotacao.preco * cotacao.quantidade).reduce((total: number, item: number) => total + item).toFixed(2).replace('.', ',')}</Text>
        </>
    );

}

export default SaldoComponent;