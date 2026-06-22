import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import { AddCoPacker } from "../../redux/reducers/MasterLogin/AddProduct";
import { useDispatch } from "react-redux";

const AddCopackers = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const dispatch=useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [supplierName, setSupplierName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");

    const [errors, setErrors] = useState({});

    //  Validation
    const validate = () => {
        let newErrors = {};

        // Supplier Name (Required)
        if (!supplierName.trim()) {
            newErrors.supplierName = "Enter supplier name";
        } else if (supplierName.trim().length < 3) {
            newErrors.supplierName = "Minimum 3 characters required";
        }

        // Mobile (Required)
        if (!mobile.trim()) {
            newErrors.mobile = "Please enter mobile number";
        } else if (!/^[6-9]\d{9}$/.test(mobile)) {
            newErrors.mobile = "Mobile must start with 6-9 and be 10 digits";
        }


        //  Address (OPTIONAL)
        if (address.trim()) {
            if (address.trim().length < 5) {
                newErrors.address = "Address too short";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    //  Submit
    const handleSubmit = async () => {
        if (isSubmitting) return;

        const isValid = validate();
        if (!isValid) return;

        setIsSubmitting(true);

        try {
            const payload = {
                copackerName: supplierName,
                contact: mobile,
                address: address,
            };

            console.log("copackers Payload data--------------------->", payload);

            const response = await dispatch(AddCoPacker(payload)).unwrap();
            Alert.alert(
                "Success", response?.data?.message || response?.message || "Data Added  Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => { navigation.goBack() }
                    }
                ]
            )
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                    <Text style={commonstyles.title}>Add Co Packer</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Supplier Name */}
                    <Text style={styles.label}> Name <Text style={{ color: "#ef1010" }}>*</Text></Text>
                    <View style={[styles.inputBox, errors.supplierName && styles.errorBorder]}>
                        <TextInput placeholder="Enter  name" value={supplierName} placeholderTextColor={colors.inputfieldcolor}
                            onChangeText={(text) => {
                                setSupplierName(text);
                                if (errors.supplierName) {
                                    setErrors(prev => ({ ...prev, supplierName: null }));
                                }
                            }}
                            style={commonstyles.inputfield} />
                    </View>
                    {errors.supplierName && <Text style={styles.error}>{errors.supplierName}</Text>}

                    {/* Mobile */}
                    <Text style={styles.label}>Mobile Number<Text style={{ color: "#ef1010" }}>*</Text></Text>
                    <View style={[styles.inputBox, errors.mobile && styles.errorBorder]}>
                        <TextInput placeholder="Enter mobile number" keyboardType="number-pad" maxLength={10} value={mobile} placeholderTextColor={colors.inputfieldcolor}
                            onChangeText={(text) => {
                                setMobile(text);
                                if (errors.mobile) {
                                    setErrors(prev => ({ ...prev, mobile: null }));
                                }
                            }}
                            style={commonstyles.inputfield} />
                    </View>
                    {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}



                    {/* Address */}
                    <Text style={styles.label}>Address</Text>
                    <View style={[styles.inputBox, errors.address && styles.errorBorder]}>
                        <TextInput placeholder="Enter address" value={address} placeholderTextColor={colors.inputfieldcolor}
                            onChangeText={(text) => {
                                setAddress(text);
                                if (errors.address) {
                                    setErrors(prev => ({ ...prev, address: null }));
                                }
                            }}
                            style={[commonstyles.inputfield, { height: 80 }]} multiline />
                    </View>
                    {errors.address && <Text style={styles.error}>{errors.address}</Text>}

                </ScrollView>

                {/* Bottom Button */}
                <View style={[styles.bottom, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} style={[styles.button, isSubmitting && { opacity: 0.6 }]}  >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Add Co Packer</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AddCopackers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },

    title: {
        fontSize: 18,
        color: colors.black,
        fontWeight: "700",
        marginLeft: 10,
        fontFamily: fonts.sfbold,
    },

    label: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 14,
        color: "#444",
    },

    inputBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 10,
    },

    input: {
        height: 45,
        fontSize: 14,
    },

    error: {
        color: "red",
        fontSize: 12,
        marginTop: 3,
    },

    errorBorder: {
        borderColor: "red",
    },

    bottom: {
        marginTop: 10,
    },

    button: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});
