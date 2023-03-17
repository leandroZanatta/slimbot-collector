
import { NativeModules } from "react-native";

export default function useModuloNativo() {

    const { Collector } = NativeModules;

    const verificarUsuarioCadastrado = () => {
        Collector.verificarCadastro();
    }

    const autorizarCarteira = (codigoCarteira: number, url: string) => {
        Collector.autorizarCadastro(codigoCarteira, url);
    }


    return {
        verificarUsuarioCadastrado,
        autorizarCarteira
    }
}