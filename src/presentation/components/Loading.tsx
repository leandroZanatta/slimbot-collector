import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const LoadingScreen = () => {

    return (
        <View style={{ justifyContent: 'center', flex: 1, alignContent: 'center', backgroundColor: '#000', opacity: 0.5 }}>
            <ActivityIndicator size={100} />
        </View>
    )
}

export default LoadingScreen;