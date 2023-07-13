import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Modal, Portal, TextInput, Title } from "react-native-paper";
import useCarteira from "../../hooks/useCarteira";
import Overlay from "../components/Overlay";

const countries = [
  { id: 0, descricao: "Não Cadastrado" },
  { id: 1, descricao: "Validação de Email pendente" },
  { id: 3, descricao: "Cadastrado" },
];

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

const containerStyle = { backgroundColor: "white", padding: 0 };

export default function Carteira() {
  const {
    modalCarteiraAberta,
    fecharModalCarteira,
    carteira,
    atualizarCarteiraTransferencia,
    abrirUrlValidacao,
  } = useCarteira();
  const [carteiratransferencia, setCarteiraTransferencia] = useState("");
  const [url, setUrl] = useState("");
  const [overlay, setOverlay] = useState({ visivel: false, mensagem: "" });

  const alterarCarteira = async () => {
    setOverlay({
      visivel: true,
      mensagem: "Atualizando Carteira de Transferência",
    });

    await atualizarCarteiraTransferencia(carteira.id, carteiratransferencia);

    setOverlay({
      visivel: false,
      mensagem: "",
    });
  };

  const efetuarValidacao = async () => {
    setOverlay({
      visivel: true,
      mensagem: "Inserindo URL de validação",
    });

    await abrirUrlValidacao(carteira.id, url);

    setOverlay({
      visivel: false,
      mensagem: "",
    });
  };
  return (
    <Portal>
      {carteira != null && (
        <Modal
          style={styles.modalContainer}
          visible={modalCarteiraAberta}
          onDismiss={fecharModalCarteira}
          contentContainerStyle={containerStyle}
        >
          <Overlay visible={overlay.visivel} message={overlay.mensagem}>
            <Title style={styles.modalTitle}>
              Carteira - {carteira.descricao}
            </Title>
            <View style={styles.modalContainer}>
              <TextInput
                label="Carteira de Transf."
                value={carteiratransferencia}
                onChangeText={(value) => setCarteiraTransferencia(value)}
                style={{ marginBottom: 10 }}
                right={
                  <TextInput.Icon
                    icon="open-in-new"
                    forceTextInputFocus
                    onPress={alterarCarteira}
                  />
                }
              />
              <TextInput
                label="URL de Validação"
                value={url}
                onChangeText={(value) => setUrl(value)}
                right={
                  <TextInput.Icon
                    icon="open-in-new"
                    forceTextInputFocus
                    onPress={efetuarValidacao}
                  />
                }
              />
            </View>
            <View style={styles.modalButtons}>
              <Button onPress={fecharModalCarteira}>Cancelar</Button>
            </View>
          </Overlay>
        </Modal>
      )}
    </Portal>
  );
}
