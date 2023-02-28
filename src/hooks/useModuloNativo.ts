
import { NativeModules } from "react-native";

export default function useModuloNativo() {

    const { Collector } = NativeModules;

    const verificarUsuarioCadastrado = () => {
        Collector.verificarCadastro();
    }

    const autorizarCarteira = (codigoCarteira: number, url: string) => {
        Collector.autorizarCadastro(codigoCarteira, url);
    }

    const iniciarServico = () => {
        Collector.startService();
    }

    const pararServico = () => {
        Collector.stopService();
    }

    const isStarted = async () => {
        return await Collector.isStarted();
    }

    return {
        verificarUsuarioCadastrado,
        autorizarCarteira,
        iniciarServico,
        pararServico,
        isStarted
    }
}