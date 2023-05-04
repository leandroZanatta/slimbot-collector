import React, { useState } from "react";
import useUsuarios from "../../hooks/useUsuarios";
import { Button, TextInput, Switch, Text } from "react-native-paper";
import { ScrollView, View } from 'react-native';
import HeaderComponent from "../components/Header";
import Toast from "@phamhuuan/react-native-toast-message";

export interface IUsuarioFormProps {
    id: number | null;
    descricao: string;
    email: string;
    senha: string;
    repetirSenha: string;
    usuarioRegistrado: boolean;
    principal: string;
}

const initialData: IUsuarioFormProps = {
    id: null,
    descricao: '',
    email: '',
    senha: '',
    repetirSenha: '',
    usuarioRegistrado: false,
    principal: 'N'
}

const UsuarioScreen = () => {

    const { salvarUsuario } = useUsuarios();
    const [secuteText, setSecureText] = useState(true);
    const [form, setForm] = useState<IUsuarioFormProps>(initialData);
    const changeValue = (property: string, value: any) => setForm({ ...form, [property]: value });

    const salvar = () => {

        if (isValid()) {
            salvarUsuario(form);
        }
    }

    const isValid = () => {

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (form.email === '' || !form.email.match(validRegex)) {

            errorToast('Informações de email inválidas');

            return false;
        }

        if (form.senha === '') {

            errorToast('A senha não pode ser vazia');

            return false;
        }

        if (form.senha.length < 8) {

            errorToast('A senha deve conter 8 dígitos');

            return false;
        }

        if (form.senha !== form.repetirSenha) {

            errorToast('As senhas devem ser iguais');

            return false;
        }

        return true;
    }

    const errorToast = (msg: string) => {

        Toast.show({
            type: 'info',
            text1: 'Atenção!',
            text2: msg,
            visibilityTime: 3000,
            autoHide: true,
        });
    }

    return (
        <>
            <HeaderComponent titulo="Usuários" />
            <ScrollView style={{ marginLeft: 20, marginRight: 20, alignContent: 'space-between', flexGrow: 1 }}>
                <View style={{ marginTop: 20, flex: 1 }}>
                    <Text style={{ fontSize: 10 }}>* Apelido/Nome do usuário.</Text>
                    <TextInput
                        value={form.descricao}
                        onChange={e => changeValue('descricao', e.nativeEvent.text)}
                        label="Apelido da Conta"
                        mode="outlined"
                    />
                    <Text style={{ fontSize: 10, marginTop: 15 }}>* Email de propriedade do usuário. Necessário confirmação.</Text>
                    <TextInput
                        value={form.email}
                        onChange={e => changeValue('email', e.nativeEvent.text)}
                        keyboardType='email-address'
                        label="Email"
                        mode="outlined"
                    />
                    <Text style={{ fontSize: 10, marginTop: 15 }}>* A senha será utilizada para registro nos sites de faucet.</Text>
                    <TextInput
                        value={form.senha}
                        onChange={e => changeValue('senha', e.nativeEvent.text)}
                        secureTextEntry={secuteText}
                        label="Senha"
                        mode="outlined"
                    />
                    <Text style={{ fontSize: 10, marginTop: 15 }}>* Repita a senha anterior.</Text>
                    <TextInput
                        value={form.repetirSenha}
                        onChange={e => changeValue('repetirSenha', e.nativeEvent.text)}
                        secureTextEntry={secuteText}
                        label="Repita a senha"
                        mode="outlined"
                    />

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", alignItems: 'center', marginTop: 10 }}>
                        <Text>Usuário cadastrado</Text>
                        <Switch value={form.usuarioRegistrado} onValueChange={e => changeValue('usuarioRegistrado', !form.usuarioRegistrado)} />
                    </View>
                    <Button style={{ marginTop: 50 }} mode="contained" onPress={salvar}>Salvar</Button>
                </View>



            </ScrollView>
        </>
    )
}

export default UsuarioScreen;