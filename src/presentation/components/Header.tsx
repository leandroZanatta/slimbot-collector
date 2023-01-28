import React from "react";
import { Text } from "react-native-paper";

interface IHeaderProps {
    titulo: string;
}

const HeaderComponent = ({ titulo }: IHeaderProps) => {

    return (
        <Text>{titulo}</Text>
    )
}

export default HeaderComponent;