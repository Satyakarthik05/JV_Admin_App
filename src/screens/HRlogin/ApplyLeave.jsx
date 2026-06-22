import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts } from "../../config/theme";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { AllLeaves, ApplyLeaves } from "../../redux/reducers/HRLogin/ReqExpenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { Roles } from "../../redux/reducers/HRLogin/Roles";


const { height, width } = Dimensions.get('window')
const ApplyLeave = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const submitLock = useRef(false);

    const formateDate = (date) => {

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState();


    const Fromdatefun = (event, selected) => {
        setShowFrom(false);

        if (selected) {
            const formattedDate = formateDate(selected);
            setFromdate(formattedDate);

            if (todate) {
                const days = calculateTotalDays(formattedDate, todate);
                if (days >= 1) {
                    setTotalLeave(days.toString());
                }
            }
        }

    }


    const [showto, setShowto] = useState(false);
    const [todate, setTodate] = useState();
    const Todatefun = (event, toselected) => {
        setShowto(false);
        if (toselected) {
            const formattedDat = formateDate(toselected);
            setTodate(formattedDat);

            if (fromdate) {
                const days = calculateTotalDays(fromdate, formattedDat);
                if (days >= 1) {
                    setTotalLeave(days.toString());
                }
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
            dispatch(AllLeaves())//night
            dispatch(Roles())
        }, [dispatch])
    )

    const calculateTotalDays = (from, to) => {
        const start = new Date(from);
        const end = new Date(to);

        const diffTime = end - start;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays + 1;
    }
    const leavedata = [
        { label: "Sick Leave", value: "Sick Leave" },
        { label: "Marriage Leave", value: "Marriage Leave" },
        { label: "Bereavement Leave", value: "Bereavement Leave" },
        { label: "Casual Leave", value: "Casual Leave" },

    ]


    const [type, setType] = useState(null);
    const [totalleave, setTotalLeave] = useState('');
    const [reason, setReason] = useState('');

    const [valierror, setValidError] = useState({});

    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        };

        loadUser();
    }, []);

    const { roleId, data } = useSelector((state) => state.Login);
    console.log("Logined User Data in Apply Leave Screen", data);

    const Validation = () => {
        let newerror = {}
        if (!type) newerror.type = "Please Select  Leave Type"
        if (!fromdate) newerror.fromdate = "Please Enter From Data"
        if (!todate) newerror.todate = "Please Enter To Data"
        if (!totalleave) newerror.totalleave = "Please Enter Total Leave Days"
        // if (!reason) newerror.reason = "Please Enter Reason"


        const trimmedReason = reason.trim();
        const specialCharRegex = /[^a-zA-Z0-9\s]/; // allows only letters, numbers & space
        const onlyNumbersRegex = /^[0-9\s]+$/;  // only numbers

        if (!trimmedReason) {
            newerror.reason = "Please Enter Reason";
        }
        else if (specialCharRegex.test(trimmedReason)) {
            newerror.reason = "Reason should not contain special characters";
        }
        else if (onlyNumbersRegex.test(trimmedReason)) {
            newerror.reason = "Reason should not be only numbers";
        }

        setValidError(newerror)
        return Object.keys(newerror).length === 0;
    }
    const cleanedReason = reason.replace(/\n/g, " ");


    const { AllEmployeesLeaves } = useSelector((state) => state.GetAllLeaves);
    console.log("&&&&&&--------------------------------------Applied All Employees Leaves Data in My Leaves Screen--------------------------------------", AllEmployeesLeaves);

    const { rolesData } = useSelector((state) => state.AllRoles);
    console.log("Added Roles Data in Apply Leaves Page Screen-------------------------------------------------> ", rolesData);

    // const isDateOverLapping = () => {
    //     if (!fromdate || !todate || !userData?.id) return false;

    //     const newFrom = new Date(fromdate);
    //     const newTo = new Date(todate);

    //     return AllEmployeesLeaves?.some((leave) => {
    //         if (leave.employeeId !== userData?.id) return false;

    //         // const existingFrom = new Date(leave.fromDate);
    //         // const existingTo = new Date(leave.toDate);
    //         const existingFrom = leave.fromDate.split("T")[0];
    //         const existingTo = leave.toDate.split("T")[0];

    //         // Check overlapping condition
    //         return (
    //             newFrom <= existingTo &&
    //             newTo >= existingFrom
    //         );
    //     })
    // }



    const isDateOverLapping = () => {
        if (!fromdate || !todate || !userData?.id) return false;

        const newFrom = new Date(fromdate);
        const newTo = new Date(todate);

        return AllEmployeesLeaves?.some((leave) => {

            if (leave.employeeId !== userData?.id) return false;

            const existingFrom = new Date(leave.fromDate);
            const existingTo = new Date(leave.toDate);

            // normalize to local date
            existingFrom.setHours(0, 0, 0, 0);
            existingTo.setHours(0, 0, 0, 0);
            newFrom.setHours(0, 0, 0, 0);
            newTo.setHours(0, 0, 0, 0);

            return newFrom <= existingTo && newTo >= existingFrom;
        });
    };






    // userData ---->meance here we are store the data when user loginer we will ge the id,name ---- that data here userData
    const GetRolesLeaveLimit = () => {
        if (!rolesData || !userData?.roleName) return 0;

        const role = rolesData.find(
            item => item.roleName.trim().toLowerCase() === userData.roleName.trim().toLowerCase(),// here we are checking  data in rolesData the roles Name===logined User roleName both are  equal then  only it exist
        );
        return role ? Number(role.noOfLeaves) : 0;
    }// taken the logned user no of leaves he want to take

    //calculating the No Leave  the User Used

    const getUsedLeaves = () => {
        if (!AllEmployeesLeaves || !userData?.id || !fromdate) return 0;



        const selectedDate = new Date(fromdate);
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();

        // here we are checking the  logined user status--->if rejected then it will not comes under leave approved thats why.
        const employeeLeaves = AllEmployeesLeaves.filter(leave => {
            //  Same employee
            if (leave.employeeId !== userData?.id) return false;

            //  Ignore rejected leaves
            if (leave.leaveStatus === "Rejected") return false;

            // if(leave.employeeId !== userData?.id ||
            //     leave.leaveStatus !== "Rejected" 
            // ){
            //     return false;
            // }

            const leaveDate = new Date(leave.fromDate);
            //  Same month & same year as selected leave
            return (
                leaveDate.getMonth() === selectedMonth &&
                leaveDate.getFullYear() === selectedYear
            );
        })

        // here we are checking the  logined user status--->if rejected then it will not comes under leave approved thats why.

        // const employeeLeaves=AllEmployeesLeaves.filter(
        //     leave=>
        //         leave.employeeId===userData?.id && 
        //         leave.leaveStatus !== "Rejected" 
        // );


        // here we are adding the  total Leave for logined user (meanse Leave Applying user) //This adds all leave days except rejected.
        const totalUsed = employeeLeaves.reduce(
            (sum, leave) => sum + Number(leave.totalDays), 0
        )

        return totalUsed;
    }


    const [submitting, setSubmitting] = useState(false);

    // for normal leaves excessted leaves patten
    const submitLeave = async () => {
        try {
            const resultAction = await dispatch(ApplyLeaves({
                employeeId: userData?.id,
                empCode: userData?.empCode,
                leaveType: type,
                fromDate: fromdate,
                toDate: todate,
                totalDays: totalleave,
                reason: cleanedReason,
            })).unwrap();

            const payload = resultAction.payload;
            console.log("Leave Applied Response Data", payload);

            Alert.alert(
                "Success",
                "Leave Applied Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );

        } catch (error) {
            Alert.alert("Error", "Failed to apply leave");
        } finally {
            setSubmitting(false);
        }
    };

    // const handleSubmit = async () => {

    //     if (submitLock.current) return; // instant block
    //     submitLock.current = true;

    //     if (submitting) return;// prevents double click

    //     const isValid = Validation();
    //     if (!isValid) return;//stop submiting

    //     setSubmitting(true);// start blocking button 

    //     try {
    //         if (!userData?.id) {
    //             Alert.alert("Error", "User data not loaded yet");
    //             return;
    //         }

    //         const isOverlapping = isDateOverLapping();

    //         if (isOverlapping) {
    //             Alert.alert("Leave Alredy Applied", "You have already Applied leave for selected date range.");
    //             return;
    //         }

    //         //showing Alert for leaves  is leave limit valid or not...
    //         const leaveLimit = GetRolesLeaveLimit();// leaves limit   we are taking the leaves limit for the  logined user 
    //         const usedLeaves = getUsedLeaves();// calculated the leaves 
    //         const newLeaveDays = Number(totalleave);// new  leave dates 

    //         console.log("Limit:", leaveLimit);
    //         console.log("Used:", usedLeaves);
    //         console.log("New:", newLeaveDays);
    //         console.log("Total After Apply:", usedLeaves + newLeaveDays);


    //         if (usedLeaves + newLeaveDays > leaveLimit) {


    //             Alert.alert(
    //                 "Leave Limit Exceeded",
    //                 "This Month Leaves Completed Do you want to continue?",
    //                 [
    //                     {
    //                         text: "No",
    //                         style: "cancel",
    //                         onPress: () => setSubmitting(false)
    //                     },
    //                     {
    //                         text: "Yes",
    //                         onPress: () => submitLeave()
    //                     }
    //                 ]
    //             );

    //             return;
    //         }
    //         submitLeave();
    //     }
    //     catch (error) {
    //         Alert.alert("Error", "Something went wrong");

    //     }
    //     finally {
    //         submitLock.current = false;
    //         setSubmitting(false);
    //     }

    // }

    const handleSubmit = async () => {

        if (submitLock.current) return;
        submitLock.current = true;

        if (submitting) return;

        const isValid = Validation();
        if (!isValid) {
            submitLock.current = false;
            return;
        }

        setSubmitting(true);

        try {
            if (!userData?.id) {
                Alert.alert("Error", "User data not loaded yet");
                return;
            }

            const isOverlapping = isDateOverLapping();

            if (isOverlapping) {
                Alert.alert("Leave Already Applied","You have already Applied leave for selected date range.");
                return;
            }

            const leaveLimit = GetRolesLeaveLimit();
            const usedLeaves = getUsedLeaves();
            const newLeaveDays = Number(totalleave);

            if (usedLeaves + newLeaveDays > leaveLimit) {

                Alert.alert(
                    "Leave Limit Exceeded",
                    "Do you want to continue?",
                    [
                        {
                            text: "No",
                            onPress: () => {
                                submitLock.current = false;
                                setSubmitting(false);
                            }
                        },
                        {
                            text: "Yes",
                            onPress: async () => {
                                await submitLeave();
                                submitLock.current = false;
                            }
                        }
                    ]
                );
                return;
            }

            await submitLeave();

        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        } finally {
            submitLock.current = false;
            setSubmitting(false);
        }
    };


    const inserts = useSafeAreaInsets();



    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.white }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <View style={styles.container}>
                {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

                <SafeAreaView>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={styles.title}>Apply Leave</Text>
                    </TouchableOpacity>
                </SafeAreaView>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.body}>

                        <View style={styles.date}>
                            <Text style={styles.first}>Employee ID</Text>
                            <View style={styles.for_border}>
                                <TextInput style={styles.inputfield} placeholder="ID 141345" placeholderTextColor="#888" value={userData?.empCode} />
                            </View>
                        </View>


                        <View style={styles.date}>
                            <Text style={styles.first}>Leave Type</Text>
                            <View style={[styles.for_border_dropdown, valierror.type ? styles.errorBorder : null]}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.placeholderStyle}
                                    itemTextStyle={styles.placeholderStyle}
                                    data={leavedata}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Leave Type"
                                    value={type}
                                    onChange={item => { setType(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                    )}
                                />
                            </View>
                            {
                                valierror.type ? (
                                    <Text style={styles.error_text} >{valierror.type}</Text>
                                ) : null
                            }
                        </View>


                        <View style={styles.in_out}>
                            <View style={styles.date}>
                                <Text style={styles.first}>From Date</Text>
                                <View style={[styles.for_border_time, valierror.fromdate ? styles.errorBorder : null]}>
                                    <TextInput style={styles.inputfield_time} value={fromdate} editable={false} placeholder="From Date" placeholderTextColor="#888" />
                                    <TouchableOpacity onPress={() => setShowFrom(true)}>
                                        <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    valierror.fromdate ? (
                                        <Text style={styles.error_text} >{valierror.fromdate}</Text>
                                    ) : null
                                }
                            </View>
                            <View style={styles.date}>
                                <Text style={styles.first}>To Date</Text>
                                <View style={[styles.for_border_time, valierror.todate ? styles.errorBorder : null]}>
                                    <TextInput style={styles.inputfield_time} value={todate} editable={false} placeholder="To Date" placeholderTextColor="#888" />
                                    <TouchableOpacity onPress={() => setShowto(true)}>
                                        <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    valierror.todate ? (
                                        <Text style={styles.error_text} >{valierror.todate}</Text>
                                    ) : null
                                }
                            </View>
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Total Leave Days</Text>
                            <View style={[styles.for_border, valierror.totalleave ? styles.errorBorder : null]}>
                                <TextInput style={styles.inputfield} placeholder="Total Leave Days" placeholderTextColor="#888" value={totalleave} editable={false} />
                            </View>
                            {
                                valierror.totalleave ? (
                                    <Text style={styles.error_text} >{valierror.totalleave}</Text>
                                ) : null
                            }
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Reason</Text>
                            <TextInput placeholderTextColor="#575757" color="#B7BCC8" style={[styles.inputfiled_large, valierror.reason ? styles.errorBorder : null]}
                                multiline
                                textAlignVertical="top"
                                placeholder="Reason"
                                value={reason}
                                onChangeText={setReason}
                            />
                            {
                                valierror.reason ? (
                                    <Text style={styles.error_text} >{valierror.reason}</Text>
                                ) : null
                            }

                        </View>

                    </View>



                    {/* <TouchableOpacity style={[styles.btn]} onPress={handleSubmit} >
                        <Text style={styles.btn_text}>Apply Leave</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={[styles.btn, { opacity: submitting ? 0.6 : 1 }]} onPress={handleSubmit} disabled={submitting} >
                        {submitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btn_text, { marginLeft: 8 }]}>Submitting...</Text>
                            </View>
                        ) : (
                            <Text style={styles.btn_text}>Apply Leave</Text>
                        )}
                    </TouchableOpacity>


                </ScrollView>

                {
                    showfrom &&
                    < DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={Fromdatefun}
                        minimumDate={new Date()}
                    />
                }


                {
                    showto &&
                    < DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={Todatefun}
                        // minimumDate={new Date()}
                        minimumDate={fromdate ? new Date(fromdate) : new Date()}
                    />
                }
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
        //paddingVertical: responsiveHeight(2),
        // flexDirection: 'column',
        // gap: 20,

        paddingTop: 10,      // small controlled spacing
        paddingBottom: 20,   // keep bottom spacing
        gap: 20,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    inputfiled_large: {
        height: height * 0.19,
        width: width * 0.923,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        color: colors.black,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    inputfield_time: {
        // flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        width: width * 0.35,
        fontFamily: fonts.sfmedium,

    },
    in_out: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    for_border_time: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        //paddingHorizontal: 10,
        //  height: 48,   

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
        borderColor: colors.inputfieldcolor,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium,
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
        fontFamily: fonts.sfbold,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft: 5,
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 10,
    },
    calender_icon: {
        paddingRight: 10,
    },



})
export default ApplyLeave