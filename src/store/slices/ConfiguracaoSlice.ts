import { createSlice } from '@reduxjs/toolkit';
import { IConfiguracaoProps } from '../../repository/model/configuracao/Configuracao.meta';
import { buscarConfiguracaoBuilderAsync } from '../thunk/ConfiguracaoThunk';

export interface IInitialStateConfiguracao {
  configuracao: IConfiguracaoProps | null
}

const initialState: IInitialStateConfiguracao = {
  configuracao: null
};

const slice = createSlice({
  name: 'configuracao',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buscarConfiguracaoBuilderAsync(builder);
  },
});

export default slice.reducer;
