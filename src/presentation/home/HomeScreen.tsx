import React, { useEffect } from "react";
import { BottomNavigation } from "react-native-paper";
import Toast from "@phamhuuan/react-native-toast-message";
import ConfiguracaoCarteirasScreen from "../configuracao/ConfiguracaoCarteira";
import useCarteira from "../../hooks/useCarteira";
import FaucetsScreen from "../faucets/Faucets";
import DashboardScreen from "../dashboard/DashboardScreen";

const HomeScreen = () => {

    const [index, setIndex] = React.useState(0);
    const { buscarCarteiras } = useCarteira();

    useEffect(() => {
        buscarCarteiras();
    }, []);

    const [routes] = React.useState([
        { key: 'dashboard', title: 'Home', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
        { key: 'faucets', title: 'Faucets', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
        { key: 'configuracao', title: 'Configuração', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        dashboard: DashboardScreen,
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