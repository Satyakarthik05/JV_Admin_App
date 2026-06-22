import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { AddVehicleDetailsPostCall, EditVehicledetails } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { Dropdown } from "react-native-element-dropdown";
import commonstyles from "../../commonstyles/commonstyles";
import Entypo from 'react-native-vector-icons/Entypo';



const EditVehicleDetails = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { EditData } = route.params;
    console.log("Edit Vehicle Details geting from Params ----------------------->", EditData);



    const insets = useSafeAreaInsets();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState(EditData?.vehicleName);
    const [number, setNumber] = useState(EditData?.vehicleNumber);
    const [type, setType] = useState(EditData?.vehicleType);
    const [capacity, setCapacity] = useState(EditData?.capacity ? String(EditData.capacity) : "");

    const StatusData = [
        { label: "ACTIVE", value: "ACTIVE" },
        { label: "INACTIVE", value: "INACTIVE" },
        
    ];
    const [status, setStatus] = useState(EditData?.status ? EditData.status.toUpperCase() : "ACTIVE");
    

    const [valierror, setValidError] = useState({})
    const validationError = () => {
        let newerror = {};

        // Vehicle Number
        if (!number.trim()) {
            newerror.number = "Please enter vehicle number";
        }
        else if (!/^[A-Z0-9 -]{6,15}$/i.test(number)) {
            newerror.number = "Enter valid vehicle number";
        }

        // Vehicle Name
        if (!name.trim()) {
            newerror.name = "Please enter vehicle name";
        }
        else if (name.trim().length < 3) {
            newerror.name = "Minimum 3 characters required";
        }

        // Vehicle Type
        if (!type.trim()) {
            newerror.type = "Please enter vehicle type";
        }

        // Capacity
        if (!capacity.trim()) {
            newerror.capacity = "Please enter capacity";
        }
        else if (!/^[0-9]+$/.test(capacity)) {
            newerror.capacity = "Only numbers allowed";
        }
        else if (parseInt(capacity) <= 0) {
            newerror.capacity = "Capacity must be greater than 0";
        }

        setValidError(newerror);

        return Object.keys(newerror).length === 0;
    };




    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent multiple clicks

        const isValid = validationError();
        if (!isValid) return false;

        setIsSubmitting(true); //  start loading

        const id = EditData?.id;
        const payload = {
            vehicleNumber: number,
            vehicleName: name,
            vehicleType: type,
            capacity: Number(capacity),
            // status: status  
            status: status.toLowerCase() 
        }
        console.log("Payload Data ----------------------->", payload, id);


        try {
            const response = await dispatch(EditVehicledetails({ id, payload })).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

            //show Api message in alert
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "vehicle details  Added Successfully",

                [
                    {
                        text: "OK",
                        onPress: () => {
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
                        <Text style={styles.title}> Edit Vehicle Details</Text>
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
                            <Text style={styles.name}>Vehicle Number<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, valierror.number ? styles.errorBorder : null]}>
                                <TextInput placeholder="Enter Vehicle Number" style={styles.inputfield} placeholderTextColor="#888" value={number}
                                    onChangeText={(text) => {
                                        setNumber(text);
                                        setValidError(prev => ({ ...prev, number: "" }));
                                    }}
                                />
                            </View>
                            {
                                valierror.number ? (
                                    <Text style={styles.error_text} >{valierror.number}</Text>
                                ) : null
                            }
                        </View>

                        <View>
                            <Text style={styles.name}>Vehicle Name<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, valierror.name ? styles.errorBorder : null]}>
                                <TextInput placeholder="Enter Vehicle name" style={styles.inputfield} placeholderTextColor="#888" value={name}
                                    onChangeText={(text) => { setName(text); setValidError(prev => ({ ...prev, name: "" })); }}
                                />
                            </View>
                            {
                                valierror.name ? (
                                    <Text style={styles.error_text} >{valierror.name}</Text>
                                ) : null
                            }
                        </View>

                        <View>
                            <Text style={styles.name}>Vehicle Type<Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, valierror.type ? styles.errorBorder : null]}>
                                <TextInput placeholder="Enter vehicle Type" style={styles.inputfield} placeholderTextColor="#888" value={type} onChangeText={(text) => { setType(text); setValidError(prev => ({ ...prev, type: "" })); }} />
                            </View>
                            {
                                valierror.type ? (
                                    <Text style={styles.error_text} >{valierror.type}</Text>
                                ) : null
                            }
                        </View>

                        <View>
                            <Text style={styles.name}>Capacity <Text style={styles.red}>*</Text></Text>
                            <View style={[styles.for_border, valierror.capacity ? styles.errorBorder : null]}>
                                <TextInput placeholder="Enter Capacity" style={styles.inputfield} placeholderTextColor="#888" value={capacity} onChangeText={(text) => { setCapacity(text); setValidError(prev => ({ ...prev, capacity: "" })); }} />
                            </View>
                            {
                                valierror.capacity ? (
                                    <Text style={styles.error_text} >{valierror.capacity}</Text>
                                ) : null
                            }
                        </View>


                        <View style={styles.date}>
                            <Text style={[commonstyles.name, { paddingBottom: 3 }]} >Select Status</Text>
                            <View style={[commonstyles.for_border_dropdown, { zIndex: 1000 },]}>
                                <Dropdown
                                    style={commonstyles.dropdown}
                                    placeholderStyle={commonstyles.placeholderStyle}
                                    selectedTextStyle={commonstyles.placeholderStyle}
                                    itemTextStyle={commonstyles.placeholderStyle}
                                    showsVerticalScrollIndicator={false}
                                    data={StatusData}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select status"
                                    value={status}
                                    onChange={item => { setStatus(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={commonstyles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View>




                    </View>
                </ScrollView>

                <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} style={[styles.button, isSubmitting && { opacity: 0.6 }]}>
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btnText, { marginLeft: 10 }]}>Updating...</Text>
                            </View>
                        ) : (
                            <Text style={styles.btnText}>Update Vehicle Details</Text>
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
        //justifyContent: 'space-between',
        gap: responsiveHeight(2),
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
export default EditVehicleDetails