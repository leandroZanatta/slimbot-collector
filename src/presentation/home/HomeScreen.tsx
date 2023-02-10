import React, { useEffect } from "react";
import { BottomNavigation } from "react-native-paper";
import Toast from "@phamhuuan/react-native-toast-message";
import ConfiguracaoCarteirasScreen from "../configuracao/ConfiguracaoCarteira";
import useCarteira from "../../hooks/useCarteira";
import useColetor from "../../hooks/useColetor";
import FaucetsScreen from "../faucets/Faucets";

const HomeScreen = () => {

    const [index, setIndex] = React.useState(0);
    const { carteiras, buscarCarteiras } = useCarteira();
    const { iniciarColeta } = useColetor();

    useEffect(() => { buscarCarteiras() }, []);

    useEffect(() => {
        if (carteiras.length > 0) {
            iniciarColeta();
        }
    }, [carteiras])

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