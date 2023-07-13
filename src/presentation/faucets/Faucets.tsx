import React, { useEffect } from "react";
import { Button, Card, List, ProgressBar, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";
import HeaderComponent from "../components/Header";
import useFaucet from "../../hooks/useFaucet";
import { IFaucetCarteiraProps } from "../../repository/model/faucet/Faucet.meta";
import moment from "moment";
import { DeviceEventEmitter } from "react-native";
import PTRView from "react-native-pull-to-refresh";
import useModuloNativo from "../../hooks/useModuloNativo";

interface FaucetDisplayProps {
  icon: string;
  text: string;
  style: any;
}

const FaucetDisplay = ({ icon, text, style }: FaucetDisplayProps) => {
  return (
    <View style={style}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <List.Icon color="#0081BD" icon={icon} />
        <Text style={{ marginLeft: 5 }}>{text}</Text>
      </View>
    </View>
  );
};

const FaucetsScreen = () => {
  const { faucets, buscarFaucets, atualizarFaucet } = useFaucet();
  const { forcarSincronizacao } = useModuloNativo();

  const onFaucetAtualizado = (event: any) => {
    atualizarFaucet(event.faucetId);
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "faucetCollected",
      onFaucetAtualizado
    );

    buscarFaucets();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <HeaderComponent titulo="Faucets" />
      <PTRView onRefresh={buscarFaucets}>
        <Button onPress={forcarSincronizacao} compact mode="outlined">
          Forçar sincronização
        </Button>
        <ScrollView>
          {faucets.map((faucet: IFaucetCarteiraProps) => (
            <Card
              mode="elevated"
              style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
              }}
              key={faucet.id}
            >
              <Card.Content
                style={{  margin: 0, padding: 0 }}
              >
                <ProgressBar
                  style={{ height: 12 }}
                  progress={faucet.percentual / 100.0}
                  color={faucet.percentual < 100 ? "#0081bd" : "green"}
                />
                <Text
                  style={{
                    position: "relative",
                    fontSize: 10,
                    top: -13,
                    width: "100%",
                    textAlign: "center",
                  }}
                >{`${faucet.percentual.toFixed(2).replace(".", ",")}%`}</Text>
              </Card.Content>
              <Card.Content
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ flex: 1 }}>{faucet.carteira}</Text>
              </Card.Content>
              <Card.Content
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                 }}
              >
                <FaucetDisplay
                  style={{ flex: 3, justifyContent: "flex-start" }}
                  icon="wallet-outline"
                  text={faucet.saldoAtual.toFixed(8)}
                />
                <FaucetDisplay
                  style={{ flex: 2, alignItems: "flex-end" }}
                  icon="alarm-multiple"
                  text={moment(faucet.proximaExecucao).format("HH:mm:ss")}
                />
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </PTRView>
    </>
  );
};

export default FaucetsScreen;
