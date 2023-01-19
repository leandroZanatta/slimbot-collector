import { MetaData } from "../MetaData";
import { carteiraMetaData, ICarteiraProps } from "./Carteira.meta";

class Carteira extends MetaData<ICarteiraProps> {

    private constructor() {
        super(carteiraMetaData)
    }

    public static Builder(): Carteira {
        return new Carteira();
    }

}

export default Carteira;