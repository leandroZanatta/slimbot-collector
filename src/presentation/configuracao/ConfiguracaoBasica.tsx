import React, { useState } from "react";
import useConfiguracao from "../../hooks/useConfiguracao";
import { IConfiguracaoProps } from "../../repository/model/configuracao/Configuracao.meta";
import { Button, TextInput, Switch, Text } from "react-native-paper";
import { ScrollView, View } from 'react-native';
import HeaderComponent from "../components/Header";
import Toast from "@phamhuuan/react-native-toast-message";

export interface IConfiguracaoFormProps {
    id: number | null;
    descricao: string;
    email: string;
    senha: string;
    repetirSenha: string;
    usuarioRegistrado: boolean;
}

const initialData: IConfiguracaoFormProps = {
    id: null,
    descricao: '',
    email: '',
    senha: '',
    repetirSenha: '',
    usuarioRegistrado: false
}

const ConfiguracaoBasicaScreen = () => {

    const { salvarConfiguracao } = useConfiguracao();
    const [secuteText, setSecureText] = useState(true);
    const [form, setForm] = useState<IConfiguracaoFormProps>(initialData);
    const changeValue = (property: string, value: any) => setForm({ ...form, [property]: value });

    const salvar = () => {

        if (isValid()) {
            salvarConfiguracao(form);
        }
    }

    const isValid = () => {

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (form.email === '' || !form.email.match(validRegex)) {

            errorToast('Informações de email inválidas');

            return false;
        }
        return true;
    }

    const errorToast = (msg: string) => {

        Toast.show({
            type: 'info',
            position: 'top',
            text1: msg,
        });
    }

    return (
        <>
            <HeaderComponent titulo="Configuração" />
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

export default ConfiguracaoBasicaScreen;