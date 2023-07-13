import React, { useEffect, useState } from "react";
import { Card, IconButton, Provider, Text } from "react-native-paper";
import useCarteira from "../../hooks/useCarteira";
import { IFaucetCarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import HeaderComponent from "../components/Header";
import { Image, Linking, ScrollView, View } from "react-native";
import PTRView from "react-native-pull-to-refresh";
import Overlay from "../components/Overlay";
import Carteira from "./Carteira";

interface IcarteiraPanelProps {
  carteira: IFaucetCarteiraProps;
  editarCarteira: any;
  atualizarInfomacaoSite: any;
}

const imageMapping: any = {
  ADA: require("../../assets/ADA.png"),
  BFG: require("../../assets/BFG.png"),
  BNB: require("../../assets/BNB.png"),
  BTC: require("../../assets/BTC.png"),
  BTT: require("../../assets/BTT.png"),
  CAKE: require("../../assets/CAKE.png"),
  DASH: require("../../assets/DASH.png"),
  DOGE: require("../../assets/DOGE.png"),
  ETH: require("../../assets/ETH.png"),
  LTC: require("../../assets/LTC.png"),
  MATIC: require("../../assets/MATIC.png"),
  NEO: require("../../assets/NEO.png"),
  SHIB: require("../../assets/SHIB.png"),
  USDC: require("../../assets/USDC.png"),
  USDT: require("../../assets/USDT.png"),
  XEM: require("../../assets/XEM.png"),
  XRP: require("../../assets/XRP.png"),
  TRX: require("../../assets/TRX.png"),
};

const CarteiraPanel = ({
  carteira,
  editarCarteira,
  atualizarInfomacaoSite,
}: IcarteiraPanelProps) => {
  const getImageForCarteira = (descricao: string) => {
    const imagem = imageMapping[descricao];
    return imagem || require("../../assets/NO_ICON.png");
  };

  const onAtualizaInformacaoSite = async () => {
    setVisible(true);

    try {
      await atualizarInfomacaoSite(carteira, (message: string) =>
        setMessage(message)
      );
    } finally {
      setVisible(false);
    }
  };

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <Card
      mode="elevated"
      onPress={() => editarCarteira(carteira)}
      style={{
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        overflow: "hidden",
      }}
      key={carteira.id}
    >
      <Overlay message={message} visible={visible}>
        <View
          style={{
            backgroundColor:
              carteira.ativo == true && carteira.referenciado == true
                ? "blue"
                : carteira.ativo == true
                ? "green"
                : carteira.situacao === 2
                ? "orange"
                : "red",
            width: 5,
            height: "100%",
            position: "absolute",
            left: 0,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              overflow: "hidden",
              marginRight: 10,
            }}
          >
            <Image
              source={getImageForCarteira(carteira.descricao)}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View
            style={{
              flex: 1,
              paddingTop: 10,
              paddingLeft: 10,
              height: 50,
              flexDirection: "column",
              borderRadius: 20,
              overflow: "hidden",
              marginRight: 10,
            }}
          >
            <Text style={{ flex: 1 }}>{carteira.descricao}</Text>
            <Text style={{ flex: 1, fontSize: 5 }}>
              {carteira.carteiratransferencia == null
                ? "Sem Carteira de transferencia"
                : carteira.carteiratransferencia}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="cloud-download"
              onPress={onAtualizaInformacaoSite}
            />
            <IconButton
              icon="open-in-new"
              onPress={(e) => Linking.openURL(`https://${carteira.host}`)}
            />
          </View>
        </View>
      </Overlay>
    </Card>
  );
};

const ConfiguracaoCarteirasScreen = () => {
  const { buscarCarteiras, editarCarteira, carteiras, atualizarInfomacaoSite } =
    useCarteira();

  useEffect(() => {
    buscarCarteiras();
  }, []);

  return (
    <>
      <HeaderComponent titulo="Configuração de Carteiras" />
      <Provider>
        <Carteira />
        <PTRView onRefresh={buscarCarteiras}>
          <ScrollView>
            {carteiras.map((carteira: IFaucetCarteiraProps) => (
              <CarteiraPanel
                key={carteira.id}
                carteira={carteira}
                editarCarteira={editarCarteira}
                atualizarInfomacaoSite={atualizarInfomacaoSite}
              />
            ))}
          </ScrollView>
        </PTRView>
      </Provider>
    </>
  );
};

export default ConfiguracaoCarteirasScreen;
