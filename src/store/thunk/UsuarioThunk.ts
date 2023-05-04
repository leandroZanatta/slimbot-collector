import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { WebSQLDatabase } from "expo-sqlite";
import { IUsuarioFormProps } from "../../presentation/usuarios/Usuarios";
import { IUsuarioProps } from "../../repository/model/usuario/Usuario.meta";
import Usuario from "../../repository/model/usuario/Usuario";
import UsuarioService from "../../service/UsuarioService";
import { IInitialStateUsuario } from "../slices/UsuarioSlice";

interface SalvarUsuarioProps {
  db: WebSQLDatabase;
  usuario: IUsuarioFormProps;
}

interface CodigoUsuarioProps {
  db: WebSQLDatabase;
  codigoUsuario: number;
}


export const buscarUsuariosThunk = createAsyncThunk(
  'usuario/buscarUsuarios',
  async (db: WebSQLDatabase): Promise<Array<IUsuarioProps>> => {
    return await new UsuarioService(db).buscar();
  }
);

export const salvarUsuarioThunk = createAsyncThunk(
  'usuario/salvarUsuario',
  async (props: SalvarUsuarioProps): Promise<IUsuarioProps> => {

    return await new UsuarioService(props.db).salvar(Usuario.BuilderWhithProps(props.usuario as IUsuarioProps), props.usuario.usuarioRegistrado);
  }
);

export const alterarSituacaoUsuarioThunk = createAsyncThunk(
  'usuario/alterarSituacaoUsuario',
  async (props: CodigoUsuarioProps): Promise<void> => {

    return await new UsuarioService(props.db).alterarSituacaoUsuario(props.codigoUsuario);
  }
);

export const buscarUsuariosBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateUsuario>) => {
  builder.addCase(buscarUsuariosThunk.pending, (state) => {
    state.loading = true
  });

  builder.addCase(buscarUsuariosThunk.fulfilled, (state, action) => {
    const usuarios = action.payload;

    state.usuarios = usuarios;

    if (state.usuarioSelecionado == null && usuarios.length > 0) {

      const principais = usuarios.filter((usuario: IUsuarioProps) => usuario.principal === 'S');

      if (principais.length > 0) {
        state.usuarioSelecionado = principais[0];
      } else {
        state.usuarioSelecionado = usuarios[0];
      }
    }

    state.loading = false
  });

  builder.addCase(buscarUsuariosThunk.rejected, (state) => {
    state.loading = false
  });
};

export const salvarUsuarioBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateUsuario>) => {
  builder.addCase(salvarUsuarioThunk.pending, (state) => {
    state.loading = true
  });

  builder.addCase(salvarUsuarioThunk.fulfilled, (state, action) => {
    state.usuarioSelecionado = action.payload;
    state.usuarios = [...state.usuarios, action.payload]
    state.loading = false
  });

  builder.addCase(salvarUsuarioThunk.rejected, (state) => {
    state.loading = false
  });
};

export const alterarSituacaoUsuarioBuilderAsync = (builder: ActionReducerMapBuilder<IInitialStateUsuario>) => {
  builder.addCase(alterarSituacaoUsuarioThunk.pending, (state) => {
    state.loading = true
  });

  builder.addCase(alterarSituacaoUsuarioThunk.fulfilled, (state, action) => {
    state.loading = false
  });

  builder.addCase(alterarSituacaoUsuarioThunk.rejected, (state) => {
    state.loading = false
  });
};

