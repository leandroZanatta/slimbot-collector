import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { IMigrationProps } from "../repository/types/RepositoryTypes";

import MigrationService from "../service/MigrationService";

export default function useMigration() {

    const migrate = async (db: WebSQLDatabase, migrations: Array<IMigrationProps>) => {

        await new MigrationService(db).migrate(migrations);
    }

    return {
        migrate
    }
}