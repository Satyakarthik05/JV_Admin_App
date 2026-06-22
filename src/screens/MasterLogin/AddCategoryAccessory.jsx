import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch } from "react-redux";
import { AddAccessoryCategory } from "../../redux/reducers/MasterLogin/AddCategory";
import { responsiveHeight } from "react-native-responsive-dimensions";
import commonstyles from "../../commonstyles/commonstyles";


const AddCategoryAccessory = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const [cat, setCat] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [valierror, setValidError] = useState({})
    const validationError = () => {

        let newerror = {}
        //Category
        const trimmedReason = cat.trim();
        const specialCharRegex = /[^a-zA-Z0-9\s]/; // allows only letters, numbers & space
        const onlyNumbersRegex = /^[0-9\s]+$/;  // only numbers

        if (!trimmedReason) {
            newerror.cat = "Please Enter Accessory Type";
        }
        else if (specialCharRegex.test(trimmedReason)) {
            newerror.cat = "category should not contain special characters";
        }
        else if (onlyNumbersRegex.test(trimmedReason)) {
            newerror.cat = "category  should not be only numbers";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }


    const handleSubmit = async () => {

        if (isSubmitting) return;

        const isValid = validationError();
        if (!isValid) return false;

        setIsSubmitting(true);

        const accessoryType = cat;

        try {
            const response = await dispatch(
                AddAccessoryCategory(accessoryType.trim())
            ).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

            //show Api message in alert
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "Category Added Successfully",

                [
                    {
                        text: "OK",
                        onPress: () => {
                            setCat("");
                            navigation.goBack();
                        }
                    }
                ]
            );
            // setCategory("");
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.sec_1}>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Add Accessory Type</Text>
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
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.input}>
                        <View>
                            <Text style={styles.name}>Add Accessory Type<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, valierror.cat ? styles.errorBorder : null]}>
                                <TextInput placeholder="Enter Accessory Type " style={styles.inputfield} placeholderTextColor="#888" value={cat} onChangeText={setCat} />
                            </View>
                            {
                                valierror.cat ? (
                                    <Text style={styles.error_text} >{valierror.cat}</Text>
                                ) : null
                            }
                        </View>

                    </View>
                </ScrollView>


                <View style={[styles.bottomContainer,{ paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting} >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btnText, { marginLeft: 10 }]}>
                                    Submitting....
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.btnText}>Add Accessory Type</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>

        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        gap: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    input: {
        flex: 1,
        justifyContent: 'space-between',
    },
    red: {
        color: 'red',
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    name: {
        color: colors.formtitlegry,
        fontsize: 16,
        fontWeight: 500,
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
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
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
        fontWeight: "500",
        fontFamily: fonts.sfmedium,
    },
    bottomContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: colors.white,
    },

})
export default AddCategoryAccessory