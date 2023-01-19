import { MetaData } from "../MetaData";
import { faucetMetaData, IFaucetProps } from "./Faucet.meta";

class Faucet extends MetaData<IFaucetProps> {

    private constructor() {
        super(faucetMetaData)
    }

    public static Builder(): Faucet {
        return new Faucet();
    }

}

export default Faucet;