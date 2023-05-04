import { mapPropertyMetaData } from "../../../utilitarios/RepoPropertyMap";
import { IMetadataProps } from "../../types/RepositoryTypes";
import { MetaData } from "../MetaData";
import { usuarioMetaData, IUsuarioProps } from "./Usuario.meta";

class Usuario extends MetaData<IUsuarioProps> {

    private constructor(meta: IMetadataProps) {
        super(meta);
    }

    public static Builder(): Usuario {
        return new Usuario(usuarioMetaData);
    }

    public static BuilderWhithProps(props: IUsuarioProps): Usuario {
        return new Usuario(mapPropertyMetaData(usuarioMetaData, props));
    }

    public id(id: number | null): Usuario {
        this.setProperty('id', id);
        return this;
    }

    public descricao(descricao: string | null): Usuario {
        this.setProperty('descricao', descricao);
        return this;
    }

    public email(email: string | null): Usuario {
        this.setProperty('email', email);
        return this;
    }

    public senha(senha: string | null): Usuario {
        this.setProperty('senha', senha);
        return this;
    }

    public principal(principal: string): Usuario {
        this.setProperty('principal', principal);
        return this;
    }
}

export default Usuario;