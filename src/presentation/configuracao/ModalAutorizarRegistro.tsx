import * as React from 'react';
import { Button, Dialog, Portal, TextInput } from "react-native-paper"
import { View } from "react-native"
import useModuloNativo from '../../hooks/useModuloNativo';

interface IModalAutorizarRegistroProps {
    codigoCarteira: number;
}

const ModalAutorizarRegistro = ({ codigoCarteira }: IModalAutorizarRegistroProps) => {

    const [visible, setVisible] = React.useState(false);
    const [text, setText] = React.useState('');
    const { autorizarCarteira } = useModuloNativo();


    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);

    const autorize = () => {

        if (text.trim().length > 0) {
            autorizarCarteira(codigoCarteira, text);

            setVisible(false);
        }
    }

    return (
        <View>
            <Button onPress={showDialog}>Autorizar</Button>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title style={{ fontSize: 16 }}>Confirmação do Email</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="URL"
                            value={text}
                            onChangeText={text => setText(text)}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={autorize}>Autorizar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

export default ModalAutorizarRegistro;