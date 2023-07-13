import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Modal,
  TextInput,
  Button,
  Menu,
  Portal,
  Title,
} from "react-native-paper";
import useConfiguracao from "../../hooks/useConfiguracao";

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    padding: 0,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#FFF",
    backgroundColor: "#C2185B",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#EEE",
    marginTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const AlterarConfiguracao = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { configuracao, carregarConfiguracao, atualizarServidor } =
    useConfiguracao();
  const [servidor, setServidor] = useState("");

  useEffect(() => carregarConfiguracao(), []);
  useEffect(() => {
    if (configuracao?.captchaHost) {
      setServidor(configuracao.captchaHost);
    }
  }, [configuracao]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const salvarServidor = () => {
    atualizarServidor(servidor);

    closeModal();
  };

  const containerStyle = { backgroundColor: "white", padding: 0 };

  return (
    <>
      <Menu.Item onPress={openModal} title="Servidor Hcaptcha" />
      <Portal>
        <Modal
          style={styles.modalContainer}
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={containerStyle}
        >
          <Title style={styles.modalTitle}>Configurações</Title>
          <View style={styles.modalContent}>
            <TextInput
              label="IP do servidor captcha"
              dense
              value={servidor}
              placeholder="http://192.168.0.1"
              onChangeText={setServidor}
            />
          </View>
          <View style={styles.modalButtons}>
            <Button onPress={salvarServidor}>Salvar</Button>
            <Button onPress={closeModal}>Cancelar</Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default AlterarConfiguracao;
