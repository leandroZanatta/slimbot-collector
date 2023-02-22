import { createSlice } from '@reduxjs/toolkit';
import * as SQLite from "expo-sqlite";
import { WebSQLDatabase } from 'expo-sqlite';

export interface IInitialStateConfiguracao {
  db: WebSQLDatabase
}

const initialState: IInitialStateConfiguracao = {
  db: SQLite.openDatabase("collector.db", "1")
};

const slice = createSlice({
  name: 'db',
  initialState,
  reducers: {},
});

export default slice.reducer;
