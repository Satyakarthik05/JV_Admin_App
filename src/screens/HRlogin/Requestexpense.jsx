import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { ReqExpense } from "../../redux/reducers/HRLogin/ReqExpenses";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Requestexpense = () => {
    const navigation = useNavigation();

    const [showDate, setShowDate] = useState(false); // show calender
    const [date, setDate] = useState(''); // stores the Date
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formateDate = (date) => {

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const TodaysDate = (event, seletedDate) => {
        setShowDate(false);
        if (seletedDate) {
            const DATE = formateDate(seletedDate);
            setDate(DATE)
        }
    }

    useEffect(() => {
        const today = new Date();
        const formatted = formateDate(today);
        setDate(formatted);
    }, []);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )

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
    const { roleId, data } = useSelector((state) => state.Login); // when we login here it will dispaly all the details abount that phone number and it id
    console.log("<------------------------------------------------Logined User Data in RequestExpense Screen-------------------------------------->", data);//userData total logesData

    const dispatch = useDispatch();
    const [valierror, setValiderror] = useState({});
    const validations = () => {
        let newerror = {}
        if (!date) {
            newerror.date = "Please Select Date"
        }
        //amount

        if (!amount) {
            newerror.amount = "Please Enter  Amount";
        }
        else if (isNaN(amount)) {
            newerror.amount = "Amount Must Be A Valid Number";
        }
        else if (Number(amount) <= 0) {
            newerror.amount = "Amount Must be Grater than 0";
        }

        //Reason
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


        setValiderror(newerror);
        return Object.keys(newerror).length === 0;
    }

    // const handleSendRequest = async () => {
    //     if (isSubmitting) return;

    //     const isValid = validations();
    //     if (!isValid) return // here it will Stop submiting the data when validations not satisfied.

    //     setIsSubmitting(true); // start loading

    //     await dispatch(ReqExpense({
    //         employeeId: userData?.id,
    //         empCode: userData?.empCode,
    //         expenseType: "Salary request",
    //         expenseDate: date,
    //         amount: amount,
    //         reason: reason,
    //         expenseSource: 'EMPLOYEE',
    //         requestType: 'ADVANCE',
    //     })).unwrap();

    //     const payload = {
    //         employeeId: userData?.id,
    //         empCode: userData?.empCode,
    //         expenseType: "Salary request",
    //         expenseDate: date,
    //         amount: amount,
    //         reason: reason,
    //         expenseSource: 'EMPLOYEE',
    //         requestType: 'ADVANCE',
    //     }
    //     console.log("paylod in req exp post call------------------------------->", payload);

    //     Alert.alert("Success", "Successfully Send the Expense Request",
    //         [
    //             {
    //                 text: "OK",
    //                 onPress: () => navigation.goBack(),
    //             }
    //         ]
    //     );

    //     console.log("Dispatched Data in Request Expense Screen ------------------->", employeeId = userData?.id, empCode = userData?.empCode, expenseType = "Salary Request", expenseDate = date, amount, reason, expenseSource = 'EMPLOYEE', requestType = 'ADVANCE',);

    // }

    const handleSendRequest = async () => {

        if (isSubmitting) return;

        const isValid = validations();
        if (!isValid) return;

        setIsSubmitting(true);

        try {
            const payload = {
                employeeId: userData?.id,
                empCode: userData?.empCode,
                expenseType: "Salary request",
                expenseDate: date,
                amount: amount,
                reason: reason,
                expenseSource: 'EMPLOYEE',
                requestType: 'ADVANCE',
            };

            console.log("Payload:-------------->", payload);

            await dispatch(ReqExpense(payload)).unwrap();

            Alert.alert(
                "Success",
                "Successfully Send the Expense Request",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    }
                ]
            );

        } catch (error) {
            console.log("Request Error:", error);

            Alert.alert(
                "Error",
                error?.message || "Something went wrong. Please try again."
            );

        } finally {
            setIsSubmitting(false); //  ALWAYS reset
        }
    };


    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Request Expense</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={styles.body}>

                    <View style={styles.date}>
                        <Text style={styles.first}>Date<Text style={styles.red}>*</Text></Text>
                        <View style={[styles.for_border, valierror.date ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Select Date" placeholderTextColor="#888" />
                            <TouchableOpacity onPress={() => setShowDate(true)}>
                                <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                            </TouchableOpacity>
                        </View>
                        {
                            valierror.date ? (
                                <Text style={styles.error_text} >{valierror.date}</Text>
                            ) : null
                        }
                    </View>

                    <View style={styles.date}>
                        <Text style={styles.first}>Amount<Text style={styles.red}>*</Text></Text>
                        <View style={[styles.for_border, valierror.amount ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfield} placeholder="Enter Amount" placeholderTextColor="#888" value={amount} onChangeText={setAmount} keyboardType="numeric" />
                        </View>
                        {
                            valierror.amount ? (
                                <Text style={styles.error_text} >{valierror.amount}</Text>
                            ) : null
                        }
                    </View>

                    <View style={styles.date}>
                        <Text style={styles.first}>Reason<Text style={styles.red}>*</Text></Text>
                        <View style={[styles.for_border, valierror.reason ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfield} placeholder=" Enter Reason" placeholderTextColor="#888" value={reason} onChangeText={setReason} />
                        </View>
                        {
                            valierror.reason ? (
                                <Text style={styles.error_text}>{valierror.reason}</Text>
                            ) : null
                        }
                    </View>

                </View>

                {/* <View style={[styles.bottom_button, { paddingBottom: insets.bottom + 10, }]}>
                    <TouchableOpacity style={styles.btn} onPress={handleSendRequest}>
                        <Text style={styles.btn_text}>Send Expense Request</Text>
                    </TouchableOpacity>
                </View> */}

                <View style={[styles.bottom_button, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity
                        style={[styles.btn, { opacity: isSubmitting ? 0.6 : 1 }]}
                        onPress={handleSendRequest}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btn_text, { marginLeft: 8 }]}>Submitting...</Text>
                            </View>
                        ) : (
                            <Text style={styles.btn_text}>Send Expense Request</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {
                showDate &&
                <DateTimePicker
                    //value={new Date()}
                    value={date ? new Date(date) : new Date()}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={TodaysDate}
                />
            }
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
        //paddingTop: 10,
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
    body: {
        // paddingVertical: 20,
        // flexDirection: 'column',
        // gap: 20,

        paddingTop: 10,
        paddingBottom: 10,
        gap: 20,
    },
    red: {
        color: "red",
    },
    first: {
        color: colors.black,
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
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
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
export default Requestexpense