
import { NativeModules } from "react-native";

export default function useModuloNativo() {

    const { Collector } = NativeModules;

    const verificarUsuarioCadastrado = () => {
        debugger
        Collector.verificarCadastro();
    }

    const autorizarCarteira = (codigoCarteira: number, url: string) => {
        debugger
        Collector.autorizarCadastro(codigoCarteira, url);
    }

    const iniciarServico = () => {
        debugger
        Collector.startService();
    }

    const pararServico = () => {
        debugger
        Collector.stopService();
    }

    return {
        verificarUsuarioCadastrado,
        autorizarCarteira,
        iniciarServico,
        pararServico,

    }
}