import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";

export default class CookiesService {
  public async setCookiesStorage(
    codigofaucet: number,
    cookies: Array<string> | undefined
  ) {
    return await NativeModules.Collector.salvarCookie(codigofaucet, cookies);
  }

  public async removecookiesStorage(host: string) {
    await AsyncStorage.removeItem(`${host.split(".")[0]}-cookies`);
  }

  public async getCookiesStorage(
    codigofaucet: number
  ): Promise<Array<string> | null> {
    return await NativeModules.Collector.buscarCookie(codigofaucet);
  }
}
