import React, { useEffect } from "react";
import { Card, IconButton, Provider, Text } from "react-native-paper";
import useCarteira from "../../hooks/useCarteira";
import { IFaucetCarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import HeaderComponent from "../components/Header";
import { Image, Linking, ScrollView, View } from 'react-native';
import PTRView from 'react-native-pull-to-refresh';


interface IcarteiraPanelProps {
    carteira: IFaucetCarteiraProps
    editarCarteira: any
    atualizarInfomacaoSite: any
}

const imageMapping: any = {
    'ADA': require('../../assets/ADA.png'),
    'BFG': require('../../assets/BFG.png'),
    'BNB': require('../../assets/BNB.png'),
    'BTC': require('../../assets/BTC.png'),
    'BTT': require('../../assets/BTT.png'),
    'CAKE': require('../../assets/CAKE.png'),
    'DASH': require('../../assets/DASH.png'),
    'DOGE': require('../../assets/DOGE.png'),
    'ETH': require('../../assets/ETH.png'),
    'LTC': require('../../assets/LTC.png'),
    'MATIC': require('../../assets/MATIC.png'),
    'NEO': require('../../assets/NEO.png'),
    'SHIB': require('../../assets/SHIB.png'),
    'USDC': require('../../assets/USDC.png'),
    'USDT': require('../../assets/USDT.png'),
    'XEM': require('../../assets/XEM.png'),
    'XRP': require('../../assets/XRP.png'),
    'TRX': require('../../assets/TRX.png'),
};


const CarteiraPanel = ({ carteira, editarCarteira, atualizarInfomacaoSite }: IcarteiraPanelProps) => {

    const getImageForCarteira = (descricao: string) => {
        const imagem = imageMapping[descricao];
        return imagem || require('../../assets/NO_ICON.png');
    };


    return (
        <Card mode="elevated" style={{ marginTop: 10, marginLeft: 10, marginRight: 10, overflow: 'hidden' }} key={carteira.id} onPress={e => editarCarteira(carteira)} >
            <View style={{ backgroundColor: carteira.ativo == true ? 'green' : carteira.situacao === 2 ? 'orange' : 'red', width: 5, height: '100%', position: 'absolute', left: 0 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', marginRight: 10 }}>
                    <Image source={getImageForCarteira(carteira.descricao)} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={{ flex: 1 }}>{carteira.descricao}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <IconButton icon='cloud-download' onPress={e => atualizarInfomacaoSite(carteira)} />
                    <IconButton icon='open-in-new' onPress={e => Linking.openURL(`https://${carteira.host}`)} />
                </View>
            </View>
        </Card>
    )
}

const ConfiguracaoCarteirasScreen = () => {

    const { buscarCarteiras, editarCarteira, carteiras, atualizarInfomacaoSite } = useCarteira();

    useEffect(() => {
        buscarCarteiras();
    }, []);

    return (
        <>
            <HeaderComponent titulo="Configuração de Carteiras" />
            <Provider>
                <PTRView onRefresh={buscarCarteiras}>
                    <ScrollView >
                        {
                            carteiras.map((carteira: IFaucetCarteiraProps) =>
                                <CarteiraPanel key={carteira.id} carteira={carteira} editarCarteira={editarCarteira} atualizarInfomacaoSite={atualizarInfomacaoSite} />)
                        }
                    </ScrollView>
                </PTRView>
            </Provider >
        </>
    )
}

export default ConfiguracaoCarteirasScreen;