import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IInitialStateLoadingMessage {
  loading: boolean;
  mensagem: string
}

const initialState: IInitialStateLoadingMessage = {
  loading: false,
  mensagem: ''
};

const slice = createSlice({
  name: 'loadingMessage',
  initialState,
  reducers: {
    setLoadingMensagem: (state, action: PayloadAction<string>) => {
      state.mensagem = action.payload;
      state.loading = true;
    },

    fecharLoadingMensagem: (state) => {
      state.mensagem = '';
      state.loading = false;
    }
  },
});

export const { setLoadingMensagem, fecharLoadingMensagem } = slice.actions
export default slice.reducer;
