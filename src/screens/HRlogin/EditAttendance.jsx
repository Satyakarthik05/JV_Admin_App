import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Alert } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { EditAttendancePatchCall } from "../../redux/reducers/HRLogin/ReqExpenses";

const { height, width } = Dimensions.get('window')
const EditAttendance = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { EmployeeAttData } = route.params;
    console.log("All Ebout Employee Data is coming to Edit Attendance Data using Routes id wise ^^^^^^^^^^^^^^^^^^^^^^^^^", EmployeeAttData);

    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data In Edit Attendacne Data888888888888888888888888888888888888888888>", data);
    const [addedRemarks, setAddedReamrks] = useState('');
    const cleanedReason = addedRemarks.replace(/\n/g, " ");
    const [inTime, setIntime] = useState(EmployeeAttData?.inTime || '');
    const [outTime, setOutTime] = useState(EmployeeAttData?.outTime || '');
    const [workinghrs, setWorkingHrs] = useState(EmployeeAttData?.workingHours || '');





    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )
    const Attendance = [
        { label: "Present", value: "Present" },
        { label: "Absent", value: "Absent" },
    ]
    const [attendance, setAttendance] = useState(EmployeeAttData?.attendanceStatus || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const [validerror, setValidError] = useState({});
    const handleValid = () => {
        let newerror = {};
        if (!attendance) newerror.attendance = "Please select The Attedance "
        if (!addedRemarks) newerror.addedRemarks = "Please Enter The remarks"

        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }

    const handleUpdate = async () => {

        if (isUpdating) return;
        const isValid = handleValid();
        if (!isValid) return '';


        try {
            setIsUpdating(true); // ✅ START
            const id = EmployeeAttData?.id
            const payload = {
                employeeId: EmployeeAttData?.employeeId,
                empCode: EmployeeAttData?.empCode,
                attendanceDate: EmployeeAttData?.attendanceDate,
                inTime: inTime,
                inLocation: EmployeeAttData?.inLocation,
                outTime: outTime,
                workingHours: workinghrs,
                outLocation: EmployeeAttData?.outLocation,
                remarks: cleanedReason,
                attendanceStatus:attendance,

            }
            await dispatch(EditAttendancePatchCall({ id, payload })).unwrap();
            console.log("Payload data dispatch here ---------------------------->", payload);


            Alert.alert("Success", "Successfully Updated ",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            )
        }
        catch (error) {
            console.log("Update Error:", error);
            Alert.alert("Error", "Something went wrong");
        }
        finally {
            setIsUpdating(false); // ✅ STOP
        }
    }



    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <View style={styles.container}>
                {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

                <SafeAreaView>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={styles.title}>Edit Attendance</Text>
                    </TouchableOpacity>
                </SafeAreaView>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.body}>

                        <View style={styles.starting}>
                            <View style={styles.sec_1}>
                                <Text style={styles.user_name}>Narayana</Text>
                                <Text style={styles.user_name}>{EmployeeAttData?.empCode}</Text>
                            </View>
                            <Text style={styles.Date}>Date: {new Date(EmployeeAttData?.attendanceDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })}</Text>
                        </View>

                        <View style={styles.in_out}>
                            <View style={styles.date}>
                                <Text style={styles.first}>In Time</Text>
                                <View style={styles.for_border}>
                                    <TextInput placeholder="Punch IN" style={styles.inputfield_time} placeholderTextColor="#888" value={inTime} onChangeText={setIntime} />
                                </View>
                            </View>
                            <View style={styles.date}>
                                <Text style={styles.first}>Out Time</Text>
                                <View style={styles.for_border}>
                                    <TextInput placeholder="Punch Out" style={styles.inputfield_time} placeholderTextColor="#888" value={outTime} onChangeText={setOutTime} />
                                </View>
                            </View>
                        </View>


                        <View style={styles.date}>
                            <Text style={styles.first}>Working Hours</Text>
                            <View style={styles.for_border}>
                                <TextInput placeholder="Working  hours" style={styles.inputfield} placeholderTextColor="#888" value={workinghrs} onChangeText={setWorkingHrs} />
                            </View>
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Attendance Status</Text>
                            <View style={[styles.for_border_dropdown, validerror.attendance ? styles.errorBorder : null]}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.placeholderStyle}
                                    itemTextStyle={styles.placeholderStyle}
                                    data={Attendance}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Attendance"
                                    value={attendance}
                                    onChange={item => { setAttendance(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View>
                        {validerror.attendance ? (
                            <Text style={styles.error_text} >{validerror.attendance}</Text>
                        ) : null}


                        <View style={styles.date}>
                            <Text style={styles.first}>Remarks</Text>
                            <TextInput placeholderTextColor="#888" color="#B7BCC8" style={[styles.inputfiled_large, validerror.addedRemarks ? styles.errorBorder : null]} placeholder="Remarks"
                                multiline
                                textAlignVertical="top"
                                value={addedRemarks}
                                onChangeText={setAddedReamrks}
                            />
                        </View>
                        {validerror.addedRemarks ? (
                            <Text style={styles.error_text} >{validerror.addedRemarks}</Text>
                        ) : null}

                    </View>





                    {/* <View style={styles.bottom_button}>
                        <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
                            <Text style={styles.btn_text}>Update Attendance</Text>
                        </TouchableOpacity>
                    </View> */}

                    <TouchableOpacity  style={[styles.btn, isUpdating && { opacity: 0.6 }]}  onPress={handleUpdate} disabled={isUpdating} >
                        {isUpdating ? (
                            <Text style={styles.btn_text}>Updating...</Text>
                        ) : (
                            <Text style={styles.btn_text}>Update Attendance</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    body: {
        paddingVertical: 20,
        flexDirection: 'column',
        gap: 20,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,

    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        // paddingLeft:10,
        paddingHorizontal: 10,

    },
    calender_icon: {
        paddingRight: 10,
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    starting: {
        borderWidth: 1,
        borderColor: colors.commoncolor,
        borderRadius: 12,
        backgroundColor: colors.commomcolorlight,
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 16,
        paddingLeft: 16,
        flexDirection: 'column',
        gap: 10,
    },
    sec_1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    user_name: {
        color: colors.simpleblack,
        fontWeight: 700,
        fontSize: 16,
        fontFamily: fonts.sfbold
    },
    Date: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.bold,
    },
    inputfield_time: {
        // flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        width: width * 0.38,
    },
    inputfiled_large: {
        height: height * 0.19,
        // width: width * 0.923,
        width: width * 0.9253,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        fontWeight: 500,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },

    in_out: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    for_border_width: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        // height:height*,
        // width:width*2.4, 
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
        fontFamily: fonts.sfbold

    },


})
export default EditAttendance