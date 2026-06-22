import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch } from "react-redux";
import { EditAccessoryType } from "../../redux/reducers/MasterLogin/AddCategory";
import commonstyles from "../../commonstyles/commonstyles";


const EditAccessoryCategory = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
   const insert = useSafeAreaInsets();

    const route = useRoute();
    const { EditType } = route.params;
    console.log("Data coming to edit  page ------->", EditType);

    const [editcat, setEditCat] = useState(EditType?.accessoryType);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [valierror, setValidError] = useState({});


    //  VALIDATION (same as Add screen)
    const validate = () => {
        let newerror = {};

        const trimmed = editcat.trim();
        const specialCharRegex = /[^a-zA-Z0-9\s]/;
        const onlyNumbersRegex = /^[0-9\s]+$/;

        if (!trimmed) {
            newerror.cat = "Please Enter Accessory Type";
        } else if (specialCharRegex.test(trimmed)) {
            newerror.cat = "Category should not contain special characters";
        } else if (onlyNumbersRegex.test(trimmed)) {
            newerror.cat = "Category should not be only numbers";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };

    const handleEdit = async () => {

        //  prevent multiple clicks
        if (isSubmitting) return;

        const isValid = validate();
        if (!isValid) return;

        setIsSubmitting(true);

        const id = EditType?.id;
        const payload = {
            accessoryType: editcat,
        }
        console.log("Dispatchinfg data here-->", id, payload);
        try {
            const response = await dispatch(EditAccessoryType({ id, payload })).unwrap();
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
            setIsSubmitting(false); //  reset
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.sec_1}>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Edit Accessory Category</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <View style={styles.input}>
                <View>
                    <Text style={styles.name}>Add Category <Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, valierror.cat ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Accessory Category Type" style={styles.inputfield} placeholderTextColor="#888" value={editcat} onChangeText={setEditCat} />
                    </View>
                    {
                        valierror.cat ? (
                            <Text style={styles.error_text} >{valierror.cat}</Text>
                        ) : null
                    }
                </View>


                <View style={[styles.buttonContainer, { paddingBottom: insert.bottom > 0 ? insert.bottom : 15 }]}>
                    <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleEdit} disabled={isSubmitting} >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btnText, { marginLeft: 10 }]}>
                                    Updating...
                                </Text>
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
    }

})
export default EditAccessoryCategory