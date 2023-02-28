import { createSlice } from '@reduxjs/toolkit';
import { ICotacaoAtivo } from '../../types/CotacaoAtivo';
import { buscarCotacaoAtivoBuilderAsync } from '../thunk/CotacaoAtivoThunk';

export interface IInitialStateCotacaoAtivo {
  cotacoes: Array<ICotacaoAtivo>
  loading: boolean
}

const initialState: IInitialStateCotacaoAtivo = {
  cotacoes: [],
  loading: true
};

const slice = createSlice({
  name: 'cotacaoAtivo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buscarCotacaoAtivoBuilderAsync(builder);
  },
});

export default slice.reducer;
