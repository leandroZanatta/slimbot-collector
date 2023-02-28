import { useEffect, useState } from "react";
import useCotacaoAtivo from "../../hooks/useCotacaoAtivo";
import HeaderComponent from "../components/Header";
import SaldoComponent from "./SaldoComponent";
import PTRView from 'react-native-pull-to-refresh';
import { DeviceEventEmitter, ScrollView, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ICotacaoAtivo } from "../../types/CotacaoAtivo";
import { Button } from "react-native-paper";
import useModuloNativo from "../../hooks/useModuloNativo";

const screenWidth = Dimensions.get("window").width - 20;
const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    barPercentage: 0.5,
};

const DashboardScreen = () => {

    const { cotacoes, buscarCotacoes } = useCotacaoAtivo();
    const { isStarted, iniciarServico, pararServico } = useModuloNativo()
    const [situacao, setSituacao] = useState('Aguarde')

    useEffect(() => {

        onStartService();

        const subscription = DeviceEventEmitter.addListener('onFaucetAtualizado', buscarCotacoes);

        buscarCotacoes();

        return () => {
            subscription.remove();
        }
    }, []);


    const onStartService = async () => {

        const situacaoAtual = await isStarted();

        if (!situacaoAtual) {

            iniciarServico();
        }

        verificarStatusServico();
    }

    const alterarBotaoServico = async () => {

        const situacaoAtual = await isStarted();

        !situacaoAtual ? iniciarServico() : pararServico();

        setSituacao('Aguarde');

        verificarStatusServico();
    }

    const verificarStatusServico = async () => {

        const situacaoAtual = await isStarted();

        setSituacao(situacaoAtual ? 'Parar' : 'Iniciar');
    }

    return (
        <>
            <HeaderComponent titulo="Dashboard" />
            <PTRView onRefresh={buscarCotacoes}>
                <Button style={{ backgroundColor: '#0081bd', marginTop: 20 }} onPress={alterarBotaoServico}>{situacao}</Button>

                <ScrollView>
                    <View style={{ paddingLeft: 10 }}>
                        <SaldoComponent cotacoes={cotacoes} />
                        {cotacoes.length > 0 &&

                            <BarChart
                                data={{
                                    labels: cotacoes.map((cotacao: ICotacaoAtivo) => cotacao.carteira.descricao),
                                    datasets: [
                                        {
                                            data: cotacoes.map((cotacao: ICotacaoAtivo) => cotacao.preco * cotacao.quantidade)
                                        }
                                    ]
                                }}
                                width={screenWidth}
                                height={300}
                                yAxisLabel="R$"
                                yAxisSuffix=''
                                chartConfig={chartConfig}
                                verticalLabelRotation={75}
                            />
                        }
                    </View>
                </ScrollView>
            </PTRView>
        </>
    );

}

export default DashboardScreen;