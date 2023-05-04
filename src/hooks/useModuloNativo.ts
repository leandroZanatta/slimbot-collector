
import { NativeModules } from "react-native";

export default function useModuloNativo() {

    const { Collector } = NativeModules;

    const iniciarColeta = () => {
        debugger
        Collector.iniciarWorker();
    }


    return {
        iniciarColeta
    }
}