import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useConfiguracao from "../hooks/useConfiguracao";
import HomeScreen from "./home";
import ConfiguracaoScreen from "./configuracao";
import { MigrationContext } from "../context/MigrationContext";
import { Flex, ActivityIndicator } from "@react-native-material/core";

const Stack = createNativeStackNavigator();

const Loading = () => {

  return (
    <Flex fill justify="center" items="center">
      <ActivityIndicator size="large" />
    </Flex>
  )
}


export default function Routes() {

  const { migrated, db }: any = useContext(MigrationContext);
  const { configurado, buscarConfiguracao } = useConfiguracao();

  useEffect(() => {

    if (migrated) {
      buscarConfiguracao(db);
    }
  }, [migrated]);

  return (
    <>
      {
        configurado == 0 ?
          (<Loading />) : configurado == 2 ? <ConfiguracaoScreen /> :
            (<NavigationContainer>
              <Stack.Navigator>
                <>
                  <Stack.Screen
                    name="Home"
                    options={{ headerShown: false }}
                    component={HomeScreen}
                  />
                </>
              </Stack.Navigator>
            </NavigationContainer>)
      }

    </>
  );
}
