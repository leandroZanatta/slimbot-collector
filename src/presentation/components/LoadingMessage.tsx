import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import useLoadingMessage from "../../hooks/useLoadingMessage";

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        color: '#ffffff',
    },
});

const LoadingMessage = () => {

    const { loading, mensagem } = useLoadingMessage();

    return loading ? (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.message}>{mensagem}</Text>
        </View>
    ) : null;
}

export default LoadingMessage;