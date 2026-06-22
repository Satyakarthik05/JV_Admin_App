import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { AddCategoryInProductMaster } from "../../redux/reducers/MasterLogin/AddCategory";


const AddCategory = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState('');
    const [valierror, setValidError] = useState({})
    const validationError = () => {

        let newerror = {}
        //Category
        const trimmedReason = category.trim();
        const specialCharRegex = /[^a-zA-Z0-9\s]/; // allows only letters, numbers & space
        const onlyNumbersRegex = /^[0-9\s]+$/;  // only numbers

        if (!trimmedReason) {
            newerror.category = "Please Enter Category";
        }
        else if (specialCharRegex.test(trimmedReason)) {
            newerror.category = "category should not contain special characters";
        }
        else if (onlyNumbersRegex.test(trimmedReason)) {
            newerror.category = "category  should not be only numbers";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }


    const { ProductAddCategory } = useSelector((state) => state.PostAddCategoryInProductMaster);
    console.log("ProductAddCategory in UI Screen ---------------------->", ProductAddCategory);

    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent multiple clicks

        const isValid = validationError();
        if (!isValid) return false;

        setIsSubmitting(true); //  start loading

        const categoryName = category;

        try {
            const response = await dispatch(
                AddCategoryInProductMaster(categoryName.trim())
            ).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

            //show Api message in alert
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "Category Added Successfully",

                [
                    {
                        text: "OK",
                        onPress: () => {
                            setCategory("");
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
            setIsSubmitting(false); // stop loading
        }
    }

    const insert = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <View style={styles.sec_1}>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={styles.title}>Add Category</Text>
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
                            <Text style={styles.name}>Add Category <Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, valierror.category ? styles.errorBorder : null]}>
                                <TextInput placeholder="Enter Category" style={styles.inputfield} placeholderTextColor="#888" value={category} onChangeText={setCategory} />
                            </View>
                            {
                                valierror.category ? (
                                    <Text style={styles.error_text} >{valierror.category}</Text>
                                ) : null
                            }
                        </View>



                    </View>
                </ScrollView>

                <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} style={[styles.button, isSubmitting && { opacity: 0.6 }]}>
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btnText, { marginLeft: 10 }]}>Adding...</Text>
                            </View>
                        ) : (
                            <Text style={styles.btnText}>Add Category</Text>
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
        //paddingTop: 10,
    },
    input: {
        flex: 1,
        justifyContent: 'space-between',
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
export default AddCategory