import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

interface OverlayProps {
  children: any;
  visible: boolean;
  message: string;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  message: {
    fontSize: 16,
    color: "#ffffff",
  },
});

const Overlay = ({ children, visible, message }: OverlayProps) => {
  return (
    <>
      {!visible ? (
        children
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="small" color="#ffffff" />
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
    </>
  );
};

export default Overlay;
