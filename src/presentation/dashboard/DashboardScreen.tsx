import { useEffect, useState } from "react";
import useCotacaoAtivo from "../../hooks/useCotacaoAtivo";
import HeaderComponent from "../components/Header";
import SaldoComponent from "./SaldoComponent";
import PTRView from 'react-native-pull-to-refresh';
import { DeviceEventEmitter, ScrollView, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ICotacaoAtivo } from "../../types/CotacaoAtivo";
import useUsuarios from "../../hooks/useUsuarios";



const screenWidth = Dimensions.get("window").width - 20;
const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    barPercentage: 0.5,
};

const DashboardScreen = () => {

    const { cotacoes, buscarCotacoes } = useCotacaoAtivo();

    useEffect(() => {

        const subscription = DeviceEventEmitter.addListener('faucetCollected', buscarCotacoes);

        buscarCotacoes();

        return () => {
            subscription.remove();
        }
    }, []);


    return (
        <>
            <HeaderComponent titulo="Dashboard" />
            <PTRView onRefresh={buscarCotacoes}>
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