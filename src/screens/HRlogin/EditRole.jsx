import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import { useDispatch } from "react-redux";
import { EditRolePatchCall } from "../../redux/reducers/HRLogin/Roles";
import commonstyles from "../../commonstyles/commonstyles";


const Editrole = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validerror, setValiderror] = useState({});

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )

    const route = useRoute();
    const { editdetailsData } = route.params;
    console.log("Edit Role Data comin gfrom added Roles pAge To Edit Role Screen +=============================>", editdetailsData);

    const [roleName, setRoleName] = useState(editdetailsData?.roleName || '');
    const [noOfLeaves, setNoOfLeaves] = useState(String(editdetailsData?.noOfLeaves) || '');

    const Validation = () => {
        let newerror = {};

        if (!roleName || !roleName.trim()) {
            newerror.roleName = "Please Enter Role Name";
        }
        if (!noOfLeaves || noOfLeaves.trim() === "") {
            newerror.noOfLeaves = "Please Enter No Of Leaves";
        }

        setValiderror(newerror);
        return Object.keys(newerror).length === 0;
    }

    const handleEditRole = async () => {

        if (isSubmitting) return;

        const isValid = Validation();
        if (!isValid) return;

        setIsSubmitting(true);


        try {
            const id = editdetailsData?.id
            const payload = {
                roleName: roleName,
                noOfLeaves: noOfLeaves,
            }
            console.log("Dispatching Data----------->", payload);

            const response = await dispatch(EditRolePatchCall({ id, payload })).unwrap();

            Alert.alert("Success", response?.data?.message || response?.message || "Added Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            )
        }
        catch {
            Alert.alert("Error", "Some Thing Went Wrong");
        }
        finally {
            setIsSubmitting(false); //  stop loading
        }

    }

    const inserts = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView style={{ flex: 1 }} >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Edit Role</Text>
                </TouchableOpacity>


                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={styles.body}>

                        <View style={styles.date}>
                            <Text style={styles.first}>Role Name<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, validerror.roleName ? commonstyles.errorBorder : null]}>
                                <TextInput style={styles.inputfield} placeholder="Role Name" placeholderTextColor="#888" value={roleName} onChangeText={setRoleName} />
                            </View>
                            {
                                validerror.roleName ? (
                                    <Text style={commonstyles.errorBorder} >{validerror.roleName}</Text>
                                ) : null
                            }
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>No of leaves<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, validerror.noOfLeaves ? commonstyles.errorBorder : null]}>
                                <TextInput style={styles.inputfield} placeholder="Number Of Leaves" placeholderTextColor="#888" value={noOfLeaves} onChangeText={setNoOfLeaves} />
                            </View>
                            {
                                validerror.noOfLeaves ? (
                                    <Text style={commonstyles.errorBorder} >{validerror.noOfLeaves}</Text>
                                ) : null
                            }

                        </View>

                    </View>

                    {/* <View style={[styles.bottom_button, { paddingBottom: inserts.bottom + 10 }]}>
                        <TouchableOpacity style={styles.btn} onPress={handleEditRole}>
                            <Text style={styles.btn_text}>Edit Role</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={[styles.bottom_button, { paddingBottom: inserts.bottom + 10 }]}>
                        <TouchableOpacity
                            style={[styles.btn, { opacity: isSubmitting ? 0.6 : 1 }]}
                           onPress={handleEditRole}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    <ActivityIndicator color="#fff" size="small" />
                                    <Text style={[styles.btn_text, { marginLeft: 8 }]}>Submitting...</Text>
                                </View>
                            ) : (
                                <Text style={styles.btn_text}>Edit Role</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    body: {
        // paddingVertical: 20,
        // flexDirection: 'column',
        // gap: 20,

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
export default Editrole