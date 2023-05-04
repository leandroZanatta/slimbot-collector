import MigrationRepository from "../repository/MigrationRepository";
import { WebSQLDatabase } from "expo-sqlite/build/SQLite.types";
import { IMigrationQueryProps } from "../repository/types/RepositoryTypes";
import Migration from "../repository/model/migration/Migration";


export default class MigrationService {

    private migrationRepository: MigrationRepository;

    constructor(db: WebSQLDatabase) {
        this.migrationRepository = new MigrationRepository(db);
    }

    public async migrate(migrations: Array<IMigrationQueryProps>) {

        try {

            await this.migrationRepository.executeUpdate(Migration.Builder().getDDL());

            for (let i = 0; i < migrations.length; i++) {

                const migration = migrations[i];

                const actual: Migration = Migration.Builder().id(migration.name);

                const execucaoActual = await this.migrationRepository.findFirst(actual);
             
                if (execucaoActual == null) {
                    await this.migrationRepository.executeUpdate(migration.query);

                    await this.migrationRepository.save(actual.execucao(new Date()));
                } else {
                    console.log(`Migration: ${migration.name} já foi executada`)
                }

            }
        } catch (error) {
            console.log(error)

            throw new Error("Não foi possivel executar as migrations")
        }
    }
}