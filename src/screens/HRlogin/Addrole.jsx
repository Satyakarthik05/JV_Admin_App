import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { Addroles } from "../../redux/reducers/HRLogin/Roles";
import { responsiveHeight } from "react-native-responsive-dimensions";


const Addrole = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )

    const [rolename, setRoleName] = useState();
    const [noleave, setNoleave] = useState();
    const [validerror, setValiderror] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const Validation = () => {
        let newerror = {};

        if (!rolename || !rolename.trim()) {
            newerror.rolename = "Please Enter Role Name";
        }
        if (!noleave || noleave.trim() === "") {
            newerror.noleave = "Please Enter No Of Leaves";
        }

        setValiderror(newerror);
        return Object.keys(newerror).length === 0;
    }

    // const handleSubmit = () => {

    //     if (isSubmitting) return;
    //     const isValid = Validation();
    //     if (!isValid) return;
    //     dispatch(Addroles({
    //         roleName: rolename,
    //         noOfLeaves: noleave,
    //     }))

    //     Alert.alert("Success", "Successfully submitted",
    //         [
    //             {
    //                 text: "OK",
    //                 onPress: () => navigation.goBack(),
    //             },
    //         ]
    //     )
    // }
    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent double click

        const isValid = Validation();
        if (!isValid) return;

        try {
            setIsSubmitting(true); // start loading

            const response=await dispatch(Addroles({
                roleName: rolename,
                noOfLeaves: noleave,
            })).unwrap();

            Alert.alert("Success", response?.data?.message || response?.message || "Added Successfully", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);

        } catch (error) {
            console.log("Add Role Error:", error);
            Alert.alert("Error", "Something went wrong");
        } finally {
            setIsSubmitting(false); //  stop loading
        }
    };

    const { rolesData } = useSelector((state) => state.AllRoles);
    console.log("Addes Roles Data in AddRoles Screen ", rolesData);


    const inserts = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Add Role</Text>
                </TouchableOpacity>


                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={styles.body}>

                        <View style={styles.date}>
                            <Text style={styles.first}>Role Name<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, validerror.rolename ? styles.errorBorder : null]}>
                                <TextInput style={styles.inputfield} placeholder="Role Name" placeholderTextColor="#888" value={rolename} onChangeText={setRoleName} />
                            </View>
                            {validerror.rolename ?
                                (
                                    <Text style={styles.error_text} >{validerror.rolename}</Text>
                                ) : null}
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>No of leaves<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, validerror.noleave ? styles.errorBorder : null]}>
                                <TextInput style={styles.inputfield} placeholder="Number Of Leaves" placeholderTextColor="#888" value={noleave} onChangeText={setNoleave} keyboardType="numeric" />
                            </View>
                            {validerror.noleave ? (
                                <Text style={styles.error_text} >{validerror.noleave}</Text>
                            ) : null}
                        </View>

                    </View>

                    {/* <View style={[styles.bottom_button, { paddingBottom: inserts.bottom + 10 }]}>
                        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                            <Text style={styles.btn_text}>Add Role</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={[styles.bottom_button, { paddingBottom: inserts.bottom + 10 }]}>
                        <TouchableOpacity
                            style={[styles.btn, { opacity: isSubmitting ? 0.6 : 1 }]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    <ActivityIndicator color="#fff" size="small" />
                                    <Text style={[styles.btn_text, { marginLeft: 8 }]}>Submitting...</Text>
                                </View>
                            ) : (
                                <Text style={styles.btn_text}>Add Role</Text>
                            )}
                        </TouchableOpacity>
                    </View>


                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 13,
        //justifyContent:'space-between',
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
    bottom_button: {
        // marginBottom: 25,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    body: {
        // paddingVertical: 20,
        // paddingVertical: responsiveHeight(1),
        paddingVertical: 15,
        flexDirection: 'column',
        gap: 20,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    red: {
        color: colors.error,
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,

    },
    btn_text: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 16,
        fontWeight: 700,
        paddingTop: 16,
        paddingBottom: 16,
        fontFamily: fonts.sfbold,

    },


})
export default Addrole