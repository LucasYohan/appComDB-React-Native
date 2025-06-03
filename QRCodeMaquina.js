import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

export default function QRScanerMaquina() {

    const navigation = useNavigation();

    useEffect(() => {

        const obterPermissoes = async () => {

            const { status } = await Camera.requestCameraPermissionsAsync();

            if (status !== 'granted') {

                alert("Permissão para usar a câmera negada!");

            }

        }

        obterPermissoes();

    }, [])

    const lidarComCodigoDigitalizado = ({ data }) => {

        console.log("Código escaneado: ", data);

        navigation.navigate("Inserir", { maquina: data });

    }

    return (

        <View style={style.container}>

            <CameraView
                onBarcodeScanned={lidarComCodigoDigitalizado}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                style={StyleSheet.absoluteFillObject} />

            <Text style={style.titulo}>Escaneie um QR Code da Máquina</Text>

        </View>


    )

}

const style = StyleSheet.create({

    container: {

        flex: 1,
        alignItems: 'center'

    },

    titulo: {

        fontSize: 24,
        fontWeight: "bold",
        color: "darkorange",
        marginBottom: 20

    }

})