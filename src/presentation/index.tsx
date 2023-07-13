import React, { useEffect } from "react";
import useUsuarios from "../hooks/useUsuarios";
import useMigration from "../hooks/useMigrations";
import LoadingScreen from "./components/Loading";
import MigrationError from "./components/MigrationError";

import HomeScreen from "./home/HomeScreen";
import UsuarioScreen from "./usuarios/Usuarios";
import { Provider } from "react-native-paper";

const HomePage = () => {
  const { status } = useMigration();
  const { exibirUsuario, usuarioSelecionado, loading, buscarUsuarios } =
    useUsuarios();

  useEffect(() => {
    if (status === 2) {
      buscarUsuarios();
    }
  }, [status]);

  return (
    <Provider>
      {loading ? (
        <LoadingScreen />
      ) : usuarioSelecionado != null &&
        usuarioSelecionado.id !== null &&
        !exibirUsuario ? (
        <HomeScreen />
      ) : (
        <UsuarioScreen />
      )}
    </Provider>
  );
};

const ApplicationScreen = () => {
  const { status, migrate } = useMigration();

  useEffect(() => {
    migrate();
  }, []);

  return (
    <>
      {status < 2 ? (
        <LoadingScreen />
      ) : status === 2 ? (
        <HomePage />
      ) : (
        <MigrationError />
      )}
    </>
  );
};

export default ApplicationScreen;
