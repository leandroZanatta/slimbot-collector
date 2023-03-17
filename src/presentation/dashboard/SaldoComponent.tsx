import { View } from "react-native";
import { Text } from "react-native-paper";
import { ICotacaoAtivo } from "../../types/CotacaoAtivo";

export interface ISaldoComponent {
    cotacoes: Array<ICotacaoAtivo>;
}

const SaldoComponent = ({ cotacoes }: ISaldoComponent) => {
    const saldo = cotacoes.reduce(
        (total: number, cotacao: ICotacaoAtivo) =>
            total + cotacao.preco * cotacao.quantidade,
        0
    );

    if (cotacoes.length === 0) {
        return <Text style={styles.noAtivos}>Sem ativos no portfólio</Text>;
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
            <Text style={styles.title}>Saldo Total</Text>
            <Text style={styles.saldo}>{`R$ ${saldo.toFixed(2).replace('.', ',')}`}</Text>
        </View>
    );
};

const styles = {


    title: {
        flex: 1,
        fontSize: 18,
        fontHeight: 'bold',
        color: "#777",
        fontFamily: "Roboto"
    },
    saldo: {
        fontSize: 18,
        fontHeight: 'bold',
        color: "#777",
        fontFamily: "Roboto"
    },
    noAtivos: {
        fontSize: 20,
        color: "#DC143C",
        fontFamily: "Arial",
    },
};

export default SaldoComponent;