import React, { useEffect } from "react";
import { Card, List, Text } from "react-native-paper";
import { ScrollView, View } from 'react-native';
import HeaderComponent from "../components/Header";
import useFaucet from "../../hooks/useFaucet";
import { IFaucetCarteiraProps } from "../../repository/model/faucet/Faucet.meta";
import moment from "moment";

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

    const { faucets, buscarFaucets } = useFaucet();

    useEffect(() => {
        buscarFaucets();
    }, [])

    return (
        <>
            <HeaderComponent titulo="Carteiras" />
            <ScrollView >
                {faucets.map((faucet: IFaucetCarteiraProps) =>
                    <Card key={faucet.id}>
                        <Card.Title title={faucet.carteira}></Card.Title>
                        <Card.Content style={{ flexDirection: 'row', justifyContent: "space-around" }}>
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