import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { GetPasswordsData, patchPassword } from "../../redux/reducers/MasterLogin/AddCategory";
import commonstyles from "../../commonstyles/commonstyles";

const Passwords = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            dispatch(GetPasswordsData());
        }, [])
    )

    const { getpasswordata } = useSelector((state) => state.GetPswData);
    console.log("Password data ------------------------->", getpasswordata);


    // const [savedPassword, setSavedPassword] = useState("123456"); // from API
    const savedPassword = getpasswordata?.[0]?.password || "";
    const [showPassword, setShowPassword] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [showModalPassword, setShowModalPassword] = useState(false);






    const validate = () => {
        if (!newPassword.trim()) {
            setError("Please enter password");
            return false;
        }
        setError("");
        return true;
    };

    const handleUpdate = async () => {
        if (!validate()) return;

        const payload = {
            password: newPassword,
        };
        console.log("respons dispatching ---------------------->",payload,selectedId);

        try {
            const response = await dispatch(patchPassword({ id: selectedId, payload })).unwrap();
            
            

            Alert.alert(
                "Success",
                response?.message || "Password updated successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );

            dispatch(GetPasswordsData());

            setNewPassword("");
            setModalVisible(false);
            setError("");
            setSelectedId(null);

        } catch (error) {
            Alert.alert("Error", error || "Something went wrong");
        }
    };




    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                    <Text style={commonstyles.title}>Password Management</Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/*  PASSWORD DISPLAY */}
            <View style={styles.card}>
                <Text style={styles.label}>Password</Text>

                <View style={styles.passwordBox}>

                    <Text style={styles.passwordText}>{showPassword ? savedPassword : savedPassword ? "•".repeat(savedPassword.length) : ""}</Text>

                    <View style={{ flexDirection: "row", gap: 15 }}>
                        {/*  VIEW */}
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? "eye" : "eye-off"} size={20} />
                        </TouchableOpacity>

                        {/*  EDIT (OPEN MODAL) */}
                        <TouchableOpacity
                            onPress={() => {
                                const item = getpasswordata?.[0];
                                setSelectedId(item?.id);
                                setNewPassword(item?.password || "");
                                setShowModalPassword(false);
                                setError("");
                                setModalVisible(true);
                            }}
                        >
                            <Feather name="edit" size={20} color={colors.commoncolor} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/*  MODAL */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>

                        <Text style={styles.modalTitle}>Update Password</Text>                        
                        <View style={[ styles.inputBox,  error && styles.errorBorder,{ flexDirection: "row", alignItems: "center" } ]}>
                            <TextInput  placeholder="Enter new password"  value={newPassword} onChangeText={setNewPassword}  secureTextEntry={!showModalPassword}  style={{ flex: 1, color: colors.black }} placeholderTextColor="#888" />
                            <TouchableOpacity onPress={() => setShowModalPassword(!showModalPassword)}>
                                <Feather name={showModalPassword ? "eye" : "eye-off"} size={20}  color="#000"/>
                            </TouchableOpacity>
                        </View>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                                <Text style={styles.btnText}>Update</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); setNewPassword(""); setError(""); }} >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default Passwords;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 8,
        color: colors.black,
    },
    card: {
        marginTop: 40,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: colors.black,
    },
    passwordBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
    },
    passwordText: {
        fontSize: 16,
        color: colors.black,
    },

    // 🔥 MODAL
    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
        color: colors.black,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        //paddingVertical: 10,
    },
    modalBtns: {
        flexDirection: "row",
        marginTop: 20,
        gap: 10,
    },
    updateBtn: {
        flex: 1,
        backgroundColor: "#EF3D3B",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#eee",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
    },
    cancelText: {
        color: "#000",
        fontSize: 16,
    },
    errorText: {
        color: "red",
        marginTop: 5,
        fontSize: 13,
    },
    errorBorder: {
        borderColor: "red",
    },
});
