import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConfiguracaoProps } from '../../repository/model/configuracao/Configuracao.meta';
import { buscarConfiguracaoBuilderAsync, salvarConfiguracaoBuilderAsync } from '../thunk/ConfiguracaoThunk';

export interface IInitialStateConfiguracao {
  configuracao: IConfiguracaoProps | null
  loading: boolean
}

const initialState: IInitialStateConfiguracao = {
  configuracao: null,
  loading: true
};

const slice = createSlice({
  name: 'configuracao',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buscarConfiguracaoBuilderAsync(builder);
    salvarConfiguracaoBuilderAsync(builder);
  },
});

export default slice.reducer;
