import React from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";
import AvatarPopupList from "./AvatarPopupList";


interface IHeaderProps {
    titulo: string;
}

const HeaderComponent = ({ titulo }: IHeaderProps) => {


    return (
        <View style={{ height: 45, backgroundColor: '#C2185B', flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}>
            <AvatarPopupList />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>{titulo.toUpperCase()}</Text>
        </View>
    )
}

export default HeaderComponent;