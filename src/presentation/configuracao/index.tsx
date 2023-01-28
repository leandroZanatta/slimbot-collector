import useConfiguracao from "../../hooks/useConfiguracao";
import ConfiguracaoBasicaScreen from "./ConfiguracaoBasica";
import ConfiguracaoCarteirasScreen from "./ConfiguracaoCarteira";

const Configuracao = () => {

    const { configurado } = useConfiguracao();


    return (
        <>
            {configurado === 1 ? <ConfiguracaoCarteirasScreen /> : <ConfiguracaoBasicaScreen />}
        </>
    );

}

export default Configuracao;