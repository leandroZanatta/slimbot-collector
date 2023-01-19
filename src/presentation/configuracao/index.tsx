import React, { useState } from "react";

import { Box, Flex, AppBar, TextInput, IconButton, Spacer, Button } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const ConfiguracaoScreen = () => {

    const [secuteText, setSecureText] = useState(true);

    return (
        <>
            <AppBar title="Configuração" />
            <Box h={12} style={{ margin: 20 }} >

                <TextInput
                    label="Apelido da Conta"
                    variant="outlined"
                    leading={props => <Icon name="account-arrow-right" {...props} />}
                />
                <TextInput
                    label="Email"
                    variant="outlined"
                    leading={props => <Icon name="at" {...props} />}
                />
                <TextInput
                    secureTextEntry={secuteText}
                    label="Senha"
                    variant="outlined"
                    leading={props => <Icon name="lock-check" {...props} />}
                    trailing={props => (
                        <IconButton onPress={e => setSecureText(!secuteText)} icon={props => <Icon name="eye" {...props} />} {...props} />
                    )}
                />

                <TextInput
                    secureTextEntry={secuteText}
                    label="Repita a senha"
                    variant="outlined"
                    leading={props => <Icon name="lock-reset" {...props} />}
                    trailing={props => (
                        <IconButton onPress={e => setSecureText(!secuteText)} icon={props => <Icon name="eye" {...props} />} {...props} />
                    )}
                />

            </Box>
            <Spacer />
            <Box h={12} style={{ margin: 20 }}>
                <Button title="Salvar" />
            </Box>
        </>
    )
}

export default ConfiguracaoScreen;