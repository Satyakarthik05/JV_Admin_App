import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch } from "react-redux";
import { PatchCategories } from "../../redux/reducers/MasterLogin/AddCategory";



const EditCategory = () => {
    const navigation = useNavigation();
    const insert = useSafeAreaInsets();
    const dispatch = useDispatch();

    const route = useRoute();
    const { editdata } = route.params;
    console.log("Edit data coming from params-------------->", editdata);

    const [editcat, setEditCat] = useState(editdata?.categoryName);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [valierror, setValidError] = useState({})
    const validationError = () => {
        let newerror = {};

        const trimmedValue = editcat.trim();
        const specialCharRegex = /[^a-zA-Z0-9\s]/;
        const onlyNumbersRegex = /^[0-9\s]+$/;

        if (!trimmedValue) {
            newerror.category = "Please Enter Category";
        }
        else if (specialCharRegex.test(trimmedValue)) {
            newerror.category = "Category should not contain special characters";
        }
        else if (onlyNumbersRegex.test(trimmedValue)) {
            newerror.category = "Category should not be only numbers";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };


    const handleEdit = async () => {

        if (isSubmitting) return; // prevent multiple clicks

        const isValid = validationError();
        if (!isValid) return false;

        setIsSubmitting(true); // start loading

        const id = editdata?.id;
        const payload = {
            categoryName: editcat,
        }
        console.log("Dispatchinfg data here-->", id, payload);
        try {
            const response = await dispatch(PatchCategories({ id, payload })).unwrap();
            Alert.alert(
                "Success",
                response?.message || response?.data?.message || " Edited Category  Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false); // stop loading
        }


    }





    return (
        <View style={styles.container}>
            <View style={styles.sec_1}>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={styles.title}>Edit Category</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <View style={styles.input}>
                <View>
                    <Text style={styles.name}>Add Category <Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, valierror.category ? styles.errorBorder : null]}>
                        <TextInput placeholder="Select Employment Type" style={styles.inputfield} placeholderTextColor="#888" value={editcat} onChangeText={setEditCat} />
                    </View>
                    {
                        valierror.category ? (
                            <Text style={styles.error_text} >{valierror.category}</Text>
                        ) : null
                    }
                </View>



                <View style={[styles.buttonContainer, { paddingBottom: insert.bottom > 0 ? insert.bottom : 15 }]}>
                <TouchableOpacity onPress={handleEdit} disabled={isSubmitting} style={[styles.button, isSubmitting && { opacity: 0.6 }]}>
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btnText, { marginLeft: 10 }]}>Updateing...</Text>
                        </View>
                    ) : (


                        <Text style={styles.btnText}>Edit Category</Text>
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
        // paddingTop: 10,
    },
    input: {
        flex: 1,
        justifyContent: 'space-between',
    },
    red: {
        color: 'red',
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
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "500",
        fontFamily: fonts.sfmedium,
    }

})
export default EditCategory