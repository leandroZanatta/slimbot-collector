import { WebSQLDatabase } from 'expo-sqlite';
import { useState } from 'react';
import { IConfiguracaoProps } from '../repository/model/configuracao/Configuracao.meta';
import ConfiguracaoService from '../service/ConfiguracaoService';

export default function useConfiguracao() {

    const [configuracao, setConfiguracao] = useState<IConfiguracaoProps | null>(null);
    const [configurado, setConfigurado] = useState<number>(0);


    const buscarConfiguracao = async (db: WebSQLDatabase) => {

        const dados = await new ConfiguracaoService(db).buscarConfiguracao();

        setConfiguracao(dados);

        setConfigurado(dados == null ? 2 : 1);
    }

    return {
        configuracao,
        configurado,
        buscarConfiguracao
    }
}