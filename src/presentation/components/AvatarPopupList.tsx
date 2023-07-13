import React, { useState, useRef } from "react";
import { ScrollView } from "react-native";
import { Avatar, IconButton, Menu, Divider } from "react-native-paper";
import useUsuarios from "../../hooks/useUsuarios";
import { IUsuarioProps } from "../../repository/model/usuario/Usuario.meta";
import AlterarConfiguracao from "./AlterarConfiguracao";

const AvatarPopupList = () => {
  const [visible, setVisible] = useState(false);
  const { usuarios, abrirEdicaoUsuario } = useUsuarios();

  const buttonRef = useRef(null);

  const showPopup = () => setVisible(true);
  const hidePopup = () => setVisible(false);

  const UserAvatar = () => (
    <Avatar.Image
      style={{ marginLeft: 10 }}
      size={25}
      source={require("../../assets/user.png")}
    />
  );

  const onSelecionarUsuario = (usuario: IUsuarioProps) => {
    hidePopup();
    abrirEdicaoUsuario(usuario);
  };

  const MenuUSuario = (usuario: IUsuarioProps) => {
    return (
      <Menu.Item
        key={usuario.id}
        onPress={() => onSelecionarUsuario(usuario)}
        title={`${usuario.descricao}${
          usuario.refer ? " - Refer: " + parseInt(usuario.refer) : ""
        }`}
      />
    );
  };

  return (
    <>
      <Menu
        visible={visible}
        onDismiss={hidePopup}
        anchor={
          <IconButton ref={buttonRef} onPress={showPopup} icon={UserAvatar} />
        }
      >
        <ScrollView style={{ maxHeight: 200 }}>
          {usuarios.map(MenuUSuario)}
        </ScrollView>
        <Divider />
        <AlterarConfiguracao />
      </Menu>
    </>
  );
};

export default AvatarPopupList;
