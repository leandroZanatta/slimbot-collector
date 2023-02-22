import React, { useEffect } from "react";
import useConfiguracao from "../hooks/useConfiguracao";
import useMigration from "../hooks/useMigrations";
import LoadingScreen from "./components/Loading";
import MigrationError from "./components/MigrationError";
import ConfiguracaoBasicaScreen from "./configuracao/ConfiguracaoBasica";
import HomeScreen from "./home/HomeScreen";


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
            {loading ?
                <LoadingScreen />
                : configuracao == null ?
                    <ConfiguracaoBasicaScreen /> :
                    <HomeScreen />
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