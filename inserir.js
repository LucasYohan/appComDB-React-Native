// Imports
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Inserir() {
    const [serverIP, setServerIP] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [maquina, setMaquina] = useState("");

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const obterIP = async () => {
            const storedIP = await AsyncStorage.getItem("serverIP");
            if (storedIP) {
                setServerIP(storedIP);
            }
        };
        obterIP();
    }, []);

    useEffect(() => {
        if (route.params?.maquina) {
            setMaquina(route.params.maquina);
        }
    }, [route.params?.maquina]);

    const abrirScannerMaquina = () => {
        navigation.navigate("QRScannerMaquina");
    };

    const handleCadastro = async () => {
        if (!nome || !email || !maquina) {
            Alert.alert("Erro", "Preencha todos os campos!");
            return;
        }

        try {
            await axios.post(`http://${serverIP}:3006/insert`, { nome, email, maquina }, {
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
            });
            Alert.alert("Sucesso", "Cadastro realizado!");
            setNome("");
            setEmail("");
            setMaquina("");
        } catch (error) {
            Alert.alert("Erro", "Falha ao enviar os dados: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Cadastro de Serviço</Text>
            <Text style={styles.ipTexto}>IP Capturado: {serverIP}</Text>

            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Máquina" value={maquina} onChangeText={setMaquina} />

            <Button title="Ler QR Code da Máquina" onPress={abrirScannerMaquina} />
            <Button title="Cadastrar Serviço" onPress={handleCadastro} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", padding: 20 },
    titulo: { fontSize: 24, fontWeight: "bold", color: "darkorange", marginBottom: 20 },
    ipTexto: { fontSize: 18, fontWeight: "bold", color: "black", marginBottom: 20 },
    input: { width: "80%", padding: 10, borderWidth: 1, marginBottom: 15 },
});