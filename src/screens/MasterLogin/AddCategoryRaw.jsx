import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch } from "react-redux";
import { AddCategoryRawMaster } from "../../redux/reducers/MasterLogin/AddCategory";
import commonstyles from "../../commonstyles/commonstyles";


const AddCategoryRaw = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const inserts = useSafeAreaInsets();
    const [rawcat, setRawCat] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [valierror, setValidError] = useState({})

    const validationError = () => {
        let newerror = {}
        //Category
        const trimmedReason = rawcat.trim();
        const specialCharRegex = /[^a-zA-Z0-9\s]/; // allows only letters, numbers & space
        const onlyNumbersRegex = /^[0-9\s]+$/;  // only numbers

        if (!trimmedReason) {
            newerror.rawcat = "Please Enter Category";
        }
        else if (specialCharRegex.test(trimmedReason)) {
            newerror.rawcat = "category should not contain special characters";
        }
        else if (onlyNumbersRegex.test(trimmedReason)) {
            newerror.rawcat = "category  should not be only numbers";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }


    const handleAddCategory = async () => {

        console.log("************************************");

        if (isSubmitting) return; //  prevent multiple clicks

        const isValid = validationError();
        if (!isValid) return false;

        setIsSubmitting(true); //  start loader

        const categoryName = rawcat;

        try {
            const response = await dispatch(AddCategoryRawMaster(categoryName.trim())).unwrap();
            Alert.alert("Success", response?.data?.message || response?.message || "Category Added Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            setRawCat("");
                            navigation.goBack();
                        }
                    }
                ]
            )
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false); //  always reset
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.sec_1}>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Add Category</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <View style={styles.input}>
                <View>
                    <Text style={styles.name}>Add Category <Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, valierror.rawcat ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Raw material Category" style={styles.inputfield} placeholderTextColor="#888" value={rawcat} onChangeText={setRawCat} />
                    </View>
                    {
                        valierror.rawcat ? (
                            <Text style={styles.error_text} >{valierror.rawcat}</Text>
                        ) : null
                    }
                </View>
                
                {/* <TouchableOpacity onPress={handleAddCategory}>
                    <Text style={styles.text}>Add Category</Text>
                </TouchableOpacity> */}
                <View style={[styles.bottomContainer, { paddingBottom: inserts.bottom + 10 }]}>
                <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleAddCategory} disabled={isSubmitting} >
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>Adding...</Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Add Category</Text>
                    )}
                </TouchableOpacity>
                </View>

            </View>
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
    // text: {
    //     color: colors.white,
    //     fontsize: 16,
    //     fontWeight: 500,
    //     backgroundColor: colors.commoncolor,
    //     textAlign: 'center',
    //     paddingTop: 16,
    //     paddingBottom: 16,
    //     borderRadius: 10,
    // },
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
        alignItems: 'center',
    },
    btn_text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    bottomContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: colors.white,
    },


})
export default AddCategoryRaw