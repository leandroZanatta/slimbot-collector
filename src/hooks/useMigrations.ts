import { migrateThunk } from "../store/thunk/MigrationThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";

export default function useMigration() {

    const migrations = useAppSelector((state: any) => state.MigrationSlice.migrations);
    const status = useAppSelector((state: any) => state.MigrationSlice.status);
    const dispatch = useAppDispatch();

    const { db } = useDb();

    const migrate = () => {
        dispatch(migrateThunk({ db, migrations }));
    }

    return {
        status,
        migrate
    }
}