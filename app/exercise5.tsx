import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TextInput, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ExerciseHome() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Sorry, we need camera roll permissions to make this work!");
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result); 

        if (!result.canceled && result.assets?.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const handleRegister = () => {
        if (name && email && password) {
            setSubmitted(true);
        }
    };

    return (
        <View style={styles.container}>
            {!submitted ? (
                <View style={styles.formBox}>
                    <Text style={styles.title}>Register</Text>
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    {image && <Image source={{ uri: image }} style={styles.image} />}
                    <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
                    <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
                    <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>User Details</Text>
                    {image && <Image source={{ uri: image }} style={styles.image} />}
                    <Text style={styles.detailText}>Name: {name}</Text>
                    <Text style={styles.detailText}>Email: {email}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
        padding: 20,
    },
    formBox: {
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        width: 300,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        width: "80%",
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fafafa",
    },
    button: {
        width: "80%",
        padding: 10,
        backgroundColor: "#4CAF50",
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
    detailsContainer: {
        alignItems: "center",
    },
    detailText: {
        fontSize: 18,
        marginTop: 10,
        color: "#333",
    },
});
