import React from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";

interface IHeaderProps {
    titulo: string;
}

const HeaderComponent = ({ titulo }: IHeaderProps) => {

    return (
        <View style={{ height: 45, backgroundColor: '#C2185B', justifyContent: "center", alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{titulo.toUpperCase()}</Text>
        </View>
    )
}

export default HeaderComponent;