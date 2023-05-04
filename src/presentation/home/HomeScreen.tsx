import React, { useEffect } from "react";
import { BottomNavigation } from "react-native-paper";
import ConfiguracaoCarteirasScreen from "../configuracao/ConfiguracaoCarteira";
import useCarteira from "../../hooks/useCarteira";
import FaucetsScreen from "../faucets/Faucets";
import DashboardScreen from "../dashboard/DashboardScreen";
import useModuloNativo from "../../hooks/useModuloNativo";

const HomeScreen = () => {

    const [index, setIndex] = React.useState(0);
    const { buscarCarteiras } = useCarteira();
    const { iniciarColeta } = useModuloNativo();
    
    useEffect(() => {
        buscarCarteiras();
        iniciarColeta();
    }, []);

    const [routes] = React.useState([
        { key: 'dashboard', title: 'Home', focusedIcon: 'home-account', unfocusedIcon: 'home' },
        { key: 'faucets', title: 'Faucets', focusedIcon: 'wallet-plus', unfocusedIcon: 'wallet-plus-outline' },
        { key: 'configuracao', title: 'Configuração', focusedIcon: 'network', unfocusedIcon: 'network-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        dashboard: DashboardScreen,
        faucets: FaucetsScreen,
        configuracao: ConfiguracaoCarteirasScreen,
    });

    return (
        <>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </>
    )
}

export default HomeScreen;