import { createSlice } from '@reduxjs/toolkit';
import { ICarteiraProps } from '../../repository/model/carteira/Carteira.meta';
import { buscarCarteirasBuilderAsync } from '../thunk/CarteiraThunk';

export interface IInitialStateCarteira {
  carteiras: Array<ICarteiraProps>
}

const initialState: IInitialStateCarteira = {
  carteiras: [],
};

const slice = createSlice({
  name: 'carteira',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buscarCarteirasBuilderAsync(builder);
  },
});

export default slice.reducer;
