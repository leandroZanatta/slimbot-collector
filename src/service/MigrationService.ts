import MigrationRepository from "../repository/MigrationRepository";
import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { IMigrationProps } from "../repository/types/RepositoryTypes";
import Migration from "../repository/model/migration/Migration";


export default class MigrationService {

    private migrationRepository: MigrationRepository;

    constructor(db: WebSQLDatabase) {
        this.migrationRepository = new MigrationRepository(db);
    }

    public async migrate(migrations: Array<IMigrationProps>) {
        await this.migrationRepository.executeUpdate(Migration.Builder().getDDL());

        for (let i = 0; i < migrations.length; i++) {

            const migration = migrations[i];

            const actual: Migration = Migration.Builder();

            actual.id(migration.name);

            const execucaoActual = await this.migrationRepository.findFirst(actual);

            if (execucaoActual == null) {
                await this.migrationRepository.executeUpdate(migration.query);

                actual.execucao(new Date());
                await this.migrationRepository.save(actual);
            } else {
                console.log(`Migration: ${migration.name} já foi executada`)
            }

        }

    }
}