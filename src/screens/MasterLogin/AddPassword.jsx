import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";

const AddPassword = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [password, setPassword] = useState('');
    const [savedPassword, setSavedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const validate = () => {
        if (!password.trim()) {
            setError("Please enter password");
            return false;
        }
        setError('');
        return true;
    };

    const handleAddPassword = () => {
        if (!validate()) return;

        setSavedPassword(password); // save password
        setPassword(''); // clear input
    };

    return (
        <View style={styles.container}>
            <View>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" />
                        <Text style={styles.title}>Add Password</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.input}>
                        <View>
                            <Text style={styles.name}>
                                Add Password <Text style={styles.red}>*</Text>
                            </Text>

                            <View style={[commonstyles.for_border, error ? styles.errorBorder : null]}>
                                <TextInput placeholder="Enter Password" style={commonstyles.inputfield} placeholderTextColor="#888" value={password} onChangeText={setPassword}  />
                            </View>
                            {error ? <Text style={styles.error_text}>{error}</Text> : null}
                        </View>

                        {/*  SHOW SAVED PASSWORD */}
                        {savedPassword ? (
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ color: "green", marginBottom: 5 }}>Password Added Successfully</Text>

                                <View style={[styles.for_border, { justifyContent: "space-between" }]}>
                                    <Text style={{ fontSize: 16 }}> {showPassword ? savedPassword  : "•".repeat(savedPassword.length)} </Text>
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Feather  name={showPassword ? "eye" : "eye-off"} size={20} />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={() => setSavedPassword('')}>
                                    <Text style={{ color: "blue", marginTop: 8 }}> Change Password </Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                    </View>
                </ScrollView>

                <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity
                        onPress={handleAddPassword}
                        disabled={isSubmitting}
                        style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                    >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btnText, { marginLeft: 10 }]}>
                                    Adding...
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.btnText}>Add Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 20,
    },
    error_text: {
        color: colors.error,
        fontSize: 13,
        marginTop: 4,
        fontFamily: fonts.sfmedium,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    red: {
        color: 'red',
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    name: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 10,
        paddingVertical: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fonts.sfmedium,
    },
    bottomContainer: {
        paddingTop: 10,
        backgroundColor: colors.white,
    },
});

export default AddPassword;
