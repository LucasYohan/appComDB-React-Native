import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ViewComponent } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QrScanner() {

    const [temPermissao, setTemPermissao] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {

        const obterPermissoesDaCamera = async () => {

            const { status } = await Camera.requestCameraPermissionsAsync();

            setTemPermissao(status === "granted")

        };

        obterPermissoesDaCamera()

    }, [])

    const lidarComCodigoDigitalizado = async ({ data }) => {

        await AsyncStorage.setItem("serverIP", data);

        navigation.navigate("Inserir");

    };

    return (

        <View style={styles.container}>

            <CameraView
                onBarcodeScanned={lidarComCodigoDigitalizado}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                style={StyleSheet.absoluteFillObject} />

            <MaterialCommunityIcons
                name="qrcode-scan"
                size={100}
                color="orange"
                style={styles.icone} />

            <Text style={styles.titulo}>Leia o QR Code do IP</Text>

        </View>

    );

}

const styles = StyleSheet.create({

    container: {

        flex: 1,
        alignItems: "center",

    },

    icone: {

        marginTop: 20

    },

    titulo: {

        fontSize: 24,
        fontWeight: "bold",
        color: "darkorange",
        marginBottom: 20

    }

})



