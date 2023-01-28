import React, { useEffect } from "react";
import { WebViewProvider } from "../context/WebViewContext";
import useConfiguracao from "../hooks/useConfiguracao";
import useMigration from "../hooks/useMigrations";
import LoadingScreen from "./components/Loading";
import MigrationError from "./components/MigrationError";
import ConfiguracaoBasicaScreen from "./configuracao/ConfiguracaoBasica";
import HomeScreen from "./home/HomeScreen";

const HomeContext = () => {
    return (
        <>
            <WebViewProvider>
                <HomeScreen />
            </WebViewProvider>
        </>
    )
}

const HomePage = () => {
    const { status } = useMigration();
    const { configuracao, loading, buscarConfiguracao } = useConfiguracao();

    useEffect(() => {
        if (status === 2) {
            buscarConfiguracao();
        }
    }, [status]);

    return (
        <>
            {loading ? <LoadingScreen /> : configuracao == null ?
                <ConfiguracaoBasicaScreen /> :
                <HomeContext />
            }
        </>
    )
}

const ApplicationScreen = () => {

    const { status, migrate } = useMigration();

    useEffect(() => { migrate() }, []);

    return (
        <>
            {
                status < 2 ?
                    <LoadingScreen /> :
                    status === 2 ?
                        <HomePage /> :
                        <MigrationError />

            }
        </>
    )
}

export default ApplicationScreen;