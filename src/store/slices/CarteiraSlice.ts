import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFaucetCarteiraProps } from '../../repository/model/carteira/Carteira.meta';
import { buscarCarteirasBuilderAsync } from '../thunk/CarteiraThunk';

export interface IInitialStateCarteira {
  carteiras: Array<IFaucetCarteiraProps>
  carteira: IFaucetCarteiraProps | null
  modalCarteiraAberta: boolean
}

const initialState: IInitialStateCarteira = {
  carteiras: [],
  carteira: null,
  modalCarteiraAberta: false
};

const slice = createSlice({
  name: 'carteira',
  initialState,
  reducers: {
    selecionarCarteira: (state, action: PayloadAction<IFaucetCarteiraProps>) => {
      state.carteira = action.payload;
      state.modalCarteiraAberta = true;
    },

    fecharModal: (state) => {
      state.modalCarteiraAberta = false;
    }
  },
  extraReducers: (builder) => {
    buscarCarteirasBuilderAsync(builder);
  },
});

export const { selecionarCarteira, fecharModal } = slice.actions
export default slice.reducer;
