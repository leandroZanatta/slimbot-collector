import { createSlice } from '@reduxjs/toolkit';
import { IFaucetCarteiraProps } from '../../repository/model/faucet/Faucet.meta';
import { buscarFaucetsCarteiraBuilderAsync } from '../thunk/FaucetThunk';

export interface IInitialStateFaucet {
  faucets: Array<IFaucetCarteiraProps>
}

const initialState: IInitialStateFaucet = {
  faucets: [],
};

const slice = createSlice({
  name: 'faucet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buscarFaucetsCarteiraBuilderAsync(builder);
  },
});

export default slice.reducer;
