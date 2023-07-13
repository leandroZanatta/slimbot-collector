import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUsuarioProps } from "../../repository/model/usuario/Usuario.meta";
import {
  alterarSituacaoUsuarioBuilderAsync,
  salvarUsuarioBuilderAsync,
} from "../thunk/UsuarioThunk";
import { buscarUsuariosBuilderAsync } from "../thunk/UsuarioThunk";

export interface IInitialStateUsuario {
  usuarios: Array<IUsuarioProps>;
  usuarioSelecionado: IUsuarioProps | null;
  exibirUsuario: boolean;
  loading: boolean;
}

const initialState: IInitialStateUsuario = {
  usuarios: [],
  exibirUsuario: false,
  usuarioSelecionado: null,
  loading: true,
};

const slice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    selecionarUsuarioSlice: (state, action: PayloadAction<IUsuarioProps>) => {
      state.usuarioSelecionado = action.payload;
    },

    novoUsuarioSlice: (state) => {
      state.usuarioSelecionado = null;
    },
    setExibirUsuarioSlice: (state, action: PayloadAction<boolean>) => {
      state.exibirUsuario = action.payload;
    },
  },
  extraReducers: (builder) => {
    buscarUsuariosBuilderAsync(builder);
    salvarUsuarioBuilderAsync(builder);
    alterarSituacaoUsuarioBuilderAsync(builder);
  },
});

export const {
  selecionarUsuarioSlice,
  novoUsuarioSlice,
  setExibirUsuarioSlice,
} = slice.actions;
export default slice.reducer;
