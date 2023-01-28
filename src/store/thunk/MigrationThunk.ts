import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { IMigrationQueryProps } from "../../repository/types/RepositoryTypes";
import MigrationService from "../../service/MigrationService";
import { IInitialStateMigration } from "../slices/MigrationSlice";

interface IMigrationThunkProps {
  db: WebSQLDatabase;
  migrations: Array<IMigrationQueryProps>;
}

export const migrateThunk = createAsyncThunk(
  'migration/executarMigrations',
  async (props: IMigrationThunkProps): Promise<void> => {
    return await new MigrationService(props.db).migrate(props.migrations);
  }
);

export const migrateBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateMigration>) => {
  builder.addCase(migrateThunk.pending, (state) => {
    state.status = 1;
  });

  builder.addCase(migrateThunk.fulfilled, (state) => {
    state.status = 2;
  });

  builder.addCase(migrateThunk.rejected, (state) => {
    state.status = 3;
  });
};

