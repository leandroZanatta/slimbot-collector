import React, { useEffect } from "react";
import { BottomNavigation } from "react-native-paper";
import Toast from "@phamhuuan/react-native-toast-message";
import ConfiguracaoCarteirasScreen from "../configuracao/ConfiguracaoCarteira";
import useCarteira from "../../hooks/useCarteira";

import FaucetsScreen from "../faucets/Faucets";
import { NativeModules } from "react-native";
import useModuloNativo from "../../hooks/useModuloNativo";



const HomeScreen = () => {

    const [index, setIndex] = React.useState(0);
    const { buscarCarteiras } = useCarteira();

    useEffect(() => { buscarCarteiras() }, []);

    const [routes] = React.useState([
        { key: 'faucets', title: 'Faucets', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
        { key: 'configuracao', title: 'Configuração', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        faucets: FaucetsScreen,
        configuracao: ConfiguracaoCarteirasScreen,
    });

    return (
        <>
            <Toast ref={(ref: Toast) => Toast.setRef(ref)} />
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </>
    )
}

export default HomeScreen;