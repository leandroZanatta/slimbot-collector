import useConfiguracao from "../../hooks/useConfiguracao";
import ConfiguracaoBasicaScreen from "./ConfiguracaoBasica";
import ConfiguracaoCarteirasScreen from "./ConfiguracaoCarteira";

const Configuracao = () => {

    const { configuracao } = useConfiguracao();


    return (
        <>
            {configuracao === 1 ? <ConfiguracaoCarteirasScreen /> : <ConfiguracaoBasicaScreen />}
        </>
    );

}

export default Configuracao;