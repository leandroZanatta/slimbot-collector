import React, { useEffect } from "react";
import { Card, List, ProgressBar, Text } from "react-native-paper";
import { ScrollView, View } from 'react-native';
import HeaderComponent from "../components/Header";
import useFaucet from "../../hooks/useFaucet";
import { IFaucetCarteiraProps } from "../../repository/model/faucet/Faucet.meta";
import moment from "moment";
import useModuloNativo from "../../hooks/useModuloNativo";
import { DeviceEventEmitter } from 'react-native';

interface FaucetDisplayProps {
    icon: string;
    text: string;
    style: any
}

const FaucetDisplay = ({ icon, text, style }: FaucetDisplayProps) => {

    return (
        <View style={style}>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <List.Icon color="#0081BD" icon={icon} />
                <Text style={{ marginLeft: 5 }}>{text}</Text>
            </View>
        </View>
    );
}

const FaucetsScreen = () => {

    const { faucets, buscarFaucets, atualizarFaucet } = useFaucet();
    const { iniciarServico } = useModuloNativo();


    useEffect(() => {
        iniciarServico();
    }, [faucets])

    const onFaucetAtualizado = (event: Array<number>) => {
        atualizarFaucet(event[0]);
    };

    useEffect(() => {

        const subscription = DeviceEventEmitter.addListener('onFaucetAtualizado', onFaucetAtualizado);

        buscarFaucets();

        return () => {
            subscription.remove();
        }

    }, [])

    return (
        <>
            <HeaderComponent titulo="Faucets" />
            <ScrollView >

                {faucets.map((faucet: IFaucetCarteiraProps) =>
                    <Card mode="elevated" style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }} key={faucet.id}>
                        <Card.Content style={{ margin: 0, padding: 0 }} >
                            <ProgressBar style={{ height: 12 }} progress={faucet.percentual / 100.0} color={faucet.percentual < 100 ? '#0081bd' : 'green'} />
                            <Text style={{ position: 'relative', fontSize: 10, top: -13, width: '100%', textAlign: 'center' }}>{`${faucet.percentual.toFixed(2).replace('.', ',')}%`}</Text>
                        </Card.Content>
                        <Card.Content style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                            <Text style={{ flex: 1 }}>{faucet.carteira}</Text>
                        </Card.Content>
                        <Card.Content style={{ flexDirection: 'row', justifyContent: "space-around", marginBottom: 15 }}>
                            <FaucetDisplay style={{ flex: 1, justifyContent: "flex-start" }} icon="wallet-outline" text={faucet.saldoAtual.toFixed(8)} />
                            <FaucetDisplay style={{ flex: 1, alignItems: "flex-end" }} icon="alarm-multiple" text={moment(faucet.proximaExecucao).format('HH:mm:ss')} />
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </>
    );
}

export default FaucetsScreen;