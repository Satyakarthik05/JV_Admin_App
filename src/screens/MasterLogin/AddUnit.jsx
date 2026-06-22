import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { AddUnitsData } from "../../redux/reducers/MasterLogin/AddCategory";


const AddUnit = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [unit, setUnit] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [valierror, setValidError] = useState({})
    const validationError = () => {

        let newerror = {}


        if (!unit.trim()) {
            newerror.unit = "Please Enter Unit";
        }
        else if (!/^\d{0,4}[a-zA-Z]{1,5}$/.test(unit.trim())) {
            newerror.unit = "Enter valid unit (e.g. 500ml, 1L, kg)";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }


    // const { ProductAddCategory } = useSelector((state) => state.PostAddCategoryInProductMaster);
    // console.log("ProductAddCategory in UI Screen ---------------------->", ProductAddCategory);

    const handleSubmit = async () => {

        if (isSubmitting) return; //  prevent multiple clicks

        const isValid = validationError();
        if (!isValid) return false;

        setIsSubmitting(true); //  start loader

        const unitName = unit;

        try {
            const response = await dispatch(
                AddUnitsData(unitName.trim())
            ).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

            //show Api message in alert
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "Category Added Successfully",

                [
                    {
                        text: "OK",
                        onPress: () => {
                            setUnit("");
                            navigation.goBack();
                        }
                    }
                ]
            );
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false); //  always reset
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
                        <Text style={styles.title}>Add Unit</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <View style={styles.input}>
                <View>
                    <Text style={styles.name}>Add Unit <Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, valierror.unit ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Unit " style={styles.inputfield} placeholderTextColor="#888" value={unit} onChangeText={setUnit} />
                    </View>
                    {
                        valierror.unit ? (
                            <Text style={styles.error_text} >{valierror.unit}</Text>
                        ) : null
                    }
                </View>
                {/* <View style={[styles.buttonContainer, { paddingBottom: insert.bottom > 0 ? insert.bottom : 15 }]}>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.text}>Add Unit</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={[styles.buttonContainer, { paddingBottom: insert.bottom > 0 ? insert.bottom : 15 }]}>
                    <TouchableOpacity  style={[styles.button, isSubmitting && { opacity: 0.6 }]}  onPress={handleSubmit}  disabled={isSubmitting} >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                    Adding...
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.btn_text}>Add Unit</Text>
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
    }

})
export default AddUnit