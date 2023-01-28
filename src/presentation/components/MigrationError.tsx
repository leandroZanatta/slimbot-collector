import { View } from "react-native";
import { Text } from "react-native-paper";

const MigrationError = () => {

    return (
        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
            <Text>Ocorreu um erro ao executar a atualização da base de dados.</Text>
            <Text>A aplicação não será executada.</Text>
        </View>
    )
}

export default MigrationError;