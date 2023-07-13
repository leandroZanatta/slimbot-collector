import { IUsuarioFormProps } from "../presentation/usuarios/Usuarios";
import { IUsuarioProps } from "../repository/model/usuario/Usuario.meta";
import {
  novoUsuarioSlice,
  selecionarUsuarioSlice,
  setExibirUsuarioSlice,
} from "../store/slices/UsuarioSlice";
import {
  alterarSituacaoUsuarioThunk,
  buscarUsuariosThunk,
  salvarUsuarioThunk,
} from "../store/thunk/UsuarioThunk";
import { useAppDispatch, useAppSelector } from "./redux";
import { useDb } from "./useDb";

export default function useUsuarios() {
  const { db } = useDb();
  const loading = useAppSelector((state: any) => state.UsuarioSlice.loading);
  const exibirUsuario = useAppSelector(
    (state: any) => state.UsuarioSlice.exibirUsuario
  );
  const usuarios = useAppSelector((state: any) => state.UsuarioSlice.usuarios);
  const usuarioSelecionado = useAppSelector(
    (state: any) => state.UsuarioSlice.usuarioSelecionado
  );

  const dispatch = useAppDispatch();

  const buscarUsuarios = () => {
    dispatch(buscarUsuariosThunk(db));
  };

  const abrirEdicaoUsuario = (usuario: IUsuarioProps) => {
    dispatch(selecionarUsuarioSlice(usuario));
    dispatch(setExibirUsuarioSlice(true));
  };

  const novoUsuario = () => {
    dispatch(novoUsuarioSlice());
  };

  const selecionarUsuario = (usuario: IUsuarioProps) => {
    dispatch(selecionarUsuarioSlice(usuario));
    dispatch(alterarSituacaoUsuarioThunk({ db, codigoUsuario: usuario.id }));
  };

  const salvarUsuario = async (usuario: IUsuarioFormProps) => {
    await dispatch(salvarUsuarioThunk({ db, usuario }));
  };

  return {
    loading,
    usuarios,
    exibirUsuario,
    usuarioSelecionado,
    selecionarUsuario,
    novoUsuario,
    buscarUsuarios,
    salvarUsuario,
    abrirEdicaoUsuario,
  };
}
