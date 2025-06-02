import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import QRScannerScreen from './QRScanner'
import InserirScreen from './inserir'
import QRScannerMaquina from './QRCodeMaquina';

const Stack = createStackNavigator();

export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator initialRouteName="QRScanner">

        <Stack.Screen  
          name="QRScreen" 
          component={QRScannerScreen} 
          options={{title: 'Leitor QR Code'}}/>

        <Stack.Screen  
          name="QRScreenMaquina" 
          component={QRScannerMaquina} 
          options={{title: 'Escanear QR Code'}}/>

        <Stack.Screen  
          name="Inserir" 
          component={InserirScreen} 
          options={{title: 'Cadastro de Usuário'}}/>

      </Stack.Navigator>

    </NavigationContainer>

  );

}