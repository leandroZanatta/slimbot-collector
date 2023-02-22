import React, { useEffect } from "react";
import { Button, Card, Provider, Text } from "react-native-paper";
import useCarteira from "../../hooks/useCarteira";
import { ICarteiraProps } from "../../repository/model/carteira/Carteira.meta";
import HeaderComponent from "../components/Header";
import { ScrollView, View } from 'react-native';
import useModuloNativo from "../../hooks/useModuloNativo";
import ModalAutorizarRegistro from "./ModalAutorizarRegistro";
import PTRView from 'react-native-pull-to-refresh';

interface IcarteiraPanelProps {
    carteira: ICarteiraProps
}

const CarteiraPanel = ({ carteira }: IcarteiraPanelProps) => {
    return (
        <Card mode="elevated" style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }} key={carteira.id}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ flex: 1 }}>{carteira.descricao}</Text>
            </Card.Content>
            <Card.Content style={{ flexDirection: 'row', justifyContent: "space-around" }}>
                <Text>{carteira.ativo}</Text>
                <Text>{carteira.situacao}</Text>
                {
                    carteira.situacao === 1 && <ModalAutorizarRegistro codigoCarteira={carteira.id} />
                }
            </Card.Content>
        </Card>
    )
}

const ConfiguracaoCarteirasScreen = () => {

    const { buscarCarteiras, carteiras } = useCarteira();
    const { verificarUsuarioCadastrado } = useModuloNativo();

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
                            carteiras.map((carteira: ICarteiraProps) =>
                                <CarteiraPanel key={carteira.id} carteira={carteira} />)
                        }
                        <View>
                            {
                                carteiras.filter((carteira: ICarteiraProps) => carteira.situacao === -1).length > 0 &&
                                <Button mode="contained" onPress={e => verificarUsuarioCadastrado()}>Verificar</Button>
                            }
                        </View>

                    </ScrollView>
                </PTRView>
            </Provider >
        </>
    )
}

export default ConfiguracaoCarteirasScreen;