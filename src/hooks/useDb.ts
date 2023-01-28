import { useAppSelector } from './redux';

export function useDb() {
    const db = useAppSelector((state: any) => state.DbSlice.db);

    return { db };
}
