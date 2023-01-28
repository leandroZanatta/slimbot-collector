import { mapPropertyMetaData } from "../../../utilitarios/RepoPropertyMap";
import { IMetadataProps } from "../../types/RepositoryTypes";
import { MetaData } from "../MetaData";
import { configuracaoMetaData, IConfiguracaoProps } from "./Configuracao.meta";

class Configuracao extends MetaData<IConfiguracaoProps> {

    private constructor(meta: IMetadataProps) {
        super(meta);
    }

    public static Builder(): Configuracao {
        return new Configuracao(configuracaoMetaData);
    }

    public static BuilderWhithProps(props: IConfiguracaoProps): Configuracao {
        return new Configuracao(mapPropertyMetaData(configuracaoMetaData, props));
    }

    public id(id: number | null): Configuracao {
        this.setProperty('id', id);
        return this;
    }

    public descricao(descricao: string | null): Configuracao {
        this.setProperty('descricao', descricao);
        return this;
    }

    public email(email: string | null): Configuracao {
        this.setProperty('email', email);
        return this;
    }

    public senha(senha: string | null): Configuracao {
        this.setProperty('senha', senha);
        return this;
    }
}

export default Configuracao;