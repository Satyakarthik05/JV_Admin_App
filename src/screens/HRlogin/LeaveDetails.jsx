import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Alert, RefreshControl } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import { AllLeaves, EditLeavesPatchCall } from "../../redux/reducers/HRLogin/ReqExpenses";
import { useDispatch, useSelector } from "react-redux";
import { responsiveHeight } from "react-native-responsive-dimensions";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get('window')
const LeaveDetails = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(AllLeaves())
    // }, [])
    // const { AllEmployeesLeaves } = useSelector((state) => state.GetAllLeaves);
    // console.log("----------------------------------Applied All Employees Leaves Data inLeaves Details Screen--------------------------------", AllEmployeesLeaves);

    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

    const route = useRoute();
    const { Empsleavedetails } = route.params;
    console.log("EmpLeaves Data From Leaves Screen to this screren using params+++++++++++++++++++++++++++++++++++= ", Empsleavedetails);

    const fromDate = Empsleavedetails?.fromDate
        ? new Date(Empsleavedetails.fromDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        })
        : "";

    const toDate = Empsleavedetails?.toDate
        ? new Date(Empsleavedetails.toDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        })
        : "";

    const [remarks, setRemarks] = useState(Empsleavedetails?.remarks || '');
    const cleanedReason = remarks.replace(/\n/g, " ");
    const [validerror, setValidError] = useState({});
    const handleValid = () => {
        let newerror = {};
        if (!remarks) newerror.remarks = "Please Enter The remarks"

        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }

    const handleforward = (status) => {
        const isValid = handleValid();
        if (!isValid) return '';


        const id = Empsleavedetails?.id
        const payload = {
            // leaveStatus:Empsleavedetails?.leaveStatus,
            leaveStatus: status,
            remarks: cleanedReason,
            approvedBy: Empsleavedetails?.approvedBy,
        }
        dispatch(EditLeavesPatchCall({ id, payload }))
        console.log("Payload data dispatch here ---------------------------->", payload);

        let successMessage = `Successfully ${status}`;
        Alert.alert("Success", successMessage,
            [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]
        )
    }





    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )


    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        }
        loadUser();
    }, []);

    console.log("Logined User Data async storege in Leave Details Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";






    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}

        >
            <View style={styles.container}>
                {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Leave Details </Text>
                    </TouchableOpacity>
                </SafeAreaView>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.body}>

                        <View style={styles.starting}>
                            <View style={styles.sec_1}>
                                <Text style={styles.user_name}>{Empsleavedetails?.name}</Text>
                                <Text style={styles.user_name}>{Empsleavedetails?.empCode}</Text>
                            </View>
                            <Text style={styles.Date}>Date: {new Date(Empsleavedetails?.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })}</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.sec_1}>
                                <Text style={styles.type}>Leave Type</Text>
                                <Text style={styles.status_btn}>{Empsleavedetails?.leaveStatus}</Text>
                            </View>
                            <Text style={styles.leave_type}>{Empsleavedetails?.leaveType}</Text>
                            <Text style={styles.type}>Date Rage</Text>
                            <Text style={styles.leave_type}>{fromDate} to {toDate} </Text>
                            <Text style={styles.type}>Reason</Text>
                            <Text style={styles.leave_type}>{Empsleavedetails?.reason}</Text>

                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Remarks</Text>
                            <TextInput placeholderTextColor="#575757" color="#000" style={[styles.inputfiled_large, validerror.remarks ? styles.errorBorder : null]}
                                multiline
                                textAlignVertical="top"
                                placeholder="Remarks"
                                value={remarks}
                                onChangeText={setRemarks}
                            />
                        </View>
                        {validerror.remarks ? (
                            <Text style={styles.error_text} >{validerror.remarks}</Text>
                        ) : null}

                    </View>





                    <View style={styles.bottom_button}>

                        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.editiconclr }]} onPress={() => handleforward("Approved")}>
                            {/* <Feather name="check-circle" size={16} color="#fff" /> */}
                            <Text style={styles.btn_text}>Approved</Text>
                        </TouchableOpacity>

                        {
                            !isAdmin && (
                                <TouchableOpacity style={[styles.btn, { backgroundColor: colors.buttonOrange }]} onPress={() => handleforward("Forwarded")}>
                                    <Text style={styles.btn_text}>Forward to Admin</Text>
                                </TouchableOpacity>
                            )
                        }

                        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.commoncolor }]} onPress={() => handleforward("Rejected")} >
                            {/* <Entypo name="circle-with-cross" size={16} color="#fff" /> */}
                            <Text style={styles.btn_text}>Reject Leave</Text>
                        </TouchableOpacity>
                    </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
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
    body: {
        paddingVertical: 20,
        flexDirection: 'column',
        gap: 20,
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
        fontFamily: fonts.sfbold,
    },
    Date: {
        color: colors.foundationgray,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium
    },
    inputfield: {
        flex: 1,
        color: colors.inputfieldcolor,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    inputfiled_large: {
        height: height * 0.19,
        width: width * 0.923,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        padding: 10,

        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
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
    calender_icon: {
        paddingRight: 15,
    },
    btn: {
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 15,
        paddingLeft: 10,
    },
    bottom_button: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        //gap:responsiveHeight(2),
        gap: responsiveHeight(1.5),
    },
    btn_text: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 12,
        fontWeight: 700,
        paddingLeft: 5,
        fontFamily: fonts.sfbold,


    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'column',
        gap: 6,
        marginLeft: 5,
        marginRight: 5,
    },
    status_btn: {
        backgroundColor: colors.halfdaybg,
        color: colors.halfdayclr,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
        fontFamily: fonts.sfmedium,

    },
    type: {
        fontSize: 16,
        fontWeight: 800,
        color: colors.foundationgray,
        fontFamily: fonts.sfbold,
    },
    leave_type: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfmedium,
    },


})
export default LeaveDetails