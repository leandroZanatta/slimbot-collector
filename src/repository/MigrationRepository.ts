import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { AbstractRepository } from "./AbstractRepository";
import { IMigrationProps } from "./types/RepositoryTypes";

export default class MigrationRepository extends AbstractRepository<IMigrationProps> {

    constructor(db: WebSQLDatabase) {
        super(db);
    }
}