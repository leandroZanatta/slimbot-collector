import { MetaData } from "../MetaData";
import { IMigrationProps, migrationMetaData } from "./Migration.meta";
import moment from 'moment';

class Migration extends MetaData<IMigrationProps> {

    private constructor() {
        super(migrationMetaData)
    }

    public static Builder(): Migration {
        return new Migration();
    }

    public id(id: string): Migration {
        this.setProperty('id', id);

        return this;
    }

    public execucao(execucao: Date): Migration {
        this.setProperty('execucao', moment(execucao).format("YYYY-MM-DD hh:mm:ss"));

        return this;
    }

}

export default Migration;