import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from "react-redux";
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { AddCalllog, GetCallQuestions } from "../../redux/reducers/TelecallerLogin/AddCallers";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonstyles from "../../commonstyles/commonstyles";


const AddCallLog = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { ParamsData, CallLogsData } = route.params;
    console.log("Finaaly the Particlar Lead Data coming to call logscreen ------>", ParamsData);
    console.log("Call Logs Data is Coming to Params--------------------->", CallLogsData);




    const [userData, setUserData] = useState(null);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            dispatch(GetRegesteredData())
            dispatch(requestLogin())
            dispatch(GetCallQuestions())
        }, [])
    )

    const { data } = useSelector((state) => state.Login);
    console.log("Data logined User Data ---------->", data);

    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("Get Employees List Data---->All Employee Data", getEmpdata);

    const { GetQnData } = useSelector((state) => state.GetQuestionsData);
    console.log("Get Qtn Data in Add Call Logs Call----------->", GetQnData);






    const telecallerList = getEmpdata?.filter(emp => emp.roleName === "TELECALLER")?.map(emp =>
    ({
        label: emp.name,
        value: emp.id
    })) || [];

    const formateDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }


    const getTodayFormatted = () => {
        return formateDate(new Date());
    };

    const [date, setDate] = useState(getTodayFormatted()); // to store the selected value
    const [leadcode, setLeadcode] = useState(ParamsData?.leadCode || '');
    const [selectlead, setSelectLead] = useState('');
    const [action, setAction] = useState(null);
    const [type, setType] = useState(null);
    const [calltime, setCallTime] = useState('');
    const [summary, setSummary] = useState('');
    const [feedback, setFeedBack] = useState('');
    const [calloutcome, setCallOutcome] = useState('');
    const [status, setStatus] = useState('');


    const [validerror, setValidError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    //dates
    // const [followup,setFollowUp]=useState('');
    // const [showfrom, setShowFrom] = useState(false);

    // Add this near your useState hooks
    const [answers, setAnswers] = useState([]);
    // Update answers whenever GetQnData or CallLogsData changes
    useEffect(() => {
        if (!GetQnData) return;

        let questionsToShow = [];

        if (CallLogsData?.length === 0) {
            // First Call questions
            questionsToShow = GetQnData?.find(q => q.questionType === "First Call")?.questions || [];
        } else {
            // Second Call questions
            questionsToShow = GetQnData?.find(q => q.questionType === "Second Call")?.questions || [];
        }

        // Initialize answers array with empty strings
        const initialAnswers = questionsToShow.map(q => ({ question: q, answer: '' }));
        setAnswers(initialAnswers);
    }, [GetQnData, CallLogsData]);


    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState();


    const Fromdatefun = (event, selected) => {
        setShowFrom(false);

        if (selected) {
            const formattedDate = formateDate(selected);
            setFromdate(formattedDate);
        }

    }

    const CallType = [
        { label: "Incoming Call", value: "INCOMING" },
        { label: "Outgoing Call", value: "OUTGOING" },
        { label: "Missed Call", value: "MISSED" },
        { label: "Follow Up", value: "FOLLOW_UP" },
        { label: "Callback", value: "CALLBACK" },
        { label: "Support", value: "SUPPORT" },
        { label: "Sales", value: "SALES" },
    ]


    const Action = [
        { label: "Follow-up", value: "Follow-up" },
        { label: "Close", value: "Close" },
        { label: "Reopend", value: "Reopend" },
    ]

    const statusData = [
        { label: "Active", value: "Active" },
        { label: "Close", value: "Close" },
    ]

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("userData");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserData(parsedUser);
                }
            }
            catch (error) {
                console.log("Error loading user:", error);
            }
        };
        loadUser();
    }, []);

    // get Current Time
    const getCurrentTime = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();

        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');

        return `${hours}:${minutes}`; // format: HH:mm
    };


    const firstQuestion = CallLogsData?.length === 0
        ? GetQnData?.[0]?.questions?.[0] // First question of first type
        : GetQnData?.[0]?.questions?.[0]; // Can adjust to next question type if needed






    const validationForm = () => {
        let newerror = {};

        // if (!selectlead) newerror.selectlead = "Please Select Telecaller Name ";
        // if (!calltime) newerror.calltime = "Please Enter Call Time ";
        if (!type) newerror.type = "Please Select Call Type";
        if (!summary) newerror.summary = "Please Enter Description";
        //if (!feedback) newerror.feedback = "Please Enter Feed Back";
        //if (!calloutcome) newerror.calloutcome = "Please Enter Call Out Come";
        if (!action) newerror.action = "Please Select Action ";
        if (!fromdate) newerror.fromdate = "Please Select Next Follow Up Date ";
        if (!status) newerror.status = "Please Select Updated Lead Status";

        // Validate QA fields
        answers.forEach((qa, index) => {
            if (!qa.answer || qa.answer.trim() === "") {
                // Add error with index so you can show specific message
                if (!newerror.qa) newerror.qa = {};
                newerror.qa[index] = "Please answer this question";
            }
        });


        setValidError(newerror);

        return Object.keys(newerror).length === 0;
    }


    const handleSubmit = async () => {
        console.log("***came to handle submit function***");

        if (isSubmitting) return; // prevent multiple clicks

        const isvalid = validationForm();
        console.log("Validation Result:", isvalid);
        if (!isvalid) return;

        setIsSubmitting(true); //  start loading





        const payload = {
            leadId: ParamsData?.id,
            leadCode: leadcode,
            telecallerId: userData?.id,
            callDate: date,
            // callTime: calltime,
            callTime: getCurrentTime(),
            callType: type,
            discussionSummary: summary,
            customerFeedback: '',
            callOutcome: '',
            actionRequired: action,
            nextFollowUpDate: fromdate,
            updateLeadStatus: status,
            qaList: answers.map(a => ({
                question: a.question,
                answer: a.answer
            }))
        }


        console.log("Payload data that dispatching  to redux code Add Call Logs to redux code -------------------->", payload);
        try {

            const response = await dispatch(AddCalllog(payload)).unwrap();
            Alert.alert(
                "Success", response?.data?.message || response?.message || "Added Lead Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => { navigation.goBack() }
                    }
                ]
            )
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false); //  stop loading
        }

    }






    return (
        <View style={styles.container}>

            <SafeAreaView  >
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Add Call Log</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.date}>
                    <Text style={styles.first}>Lead ID</Text>
                    <View style={styles.for_border}>
                        <TextInput style={styles.inputfield} placeholder="Lead Code " placeholderTextColor="#888" value={leadcode} editable={false} />
                    </View>
                </View>


                {/* <View style={styles.date}>
                    <Text style={styles.first}>Select Telecaller Name</Text>
                    <View style={[styles.for_border, validerror.date ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} editable={false} value={userData?.name}  placeholderTextColor="#888" />
                    </View>
                </View> */}

                {/* <View style={styles.date}>
                    <Text style={styles.first}>Call Date</Text>
                    <View style={[styles.for_border, validerror.date ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Call Date" placeholderTextColor="#888" />
                        <TouchableOpacity >
                            <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                        </TouchableOpacity>
                    </View>
                    {validerror.date ? (
                        <Text style={styles.error_text}>{validerror.date}</Text>
                    ) : null}
                </View> */}


                {/* <View style={styles.date}>
                    <Text style={styles.first}>Call Time</Text>
                    <View style={[styles.for_border, validerror.calltime ? styles.errorBorder : null]}> 
                        <TextInput style={styles.inputfield} placeholder="Call Time" placeholderTextColor="#888" value={calltime} onChangeText={setCallTime}  keyboardType="number-pad"/>
                    </View>
                    {validerror.calltime ? (
                        <Text style={styles.error_text}>{validerror.calltime}</Text>
                    ) : null}
                </View> */}



                <View style={styles.date}>
                    <Text style={styles.first}>Call Type</Text>
                    <View style={[styles.for_border_dropdown, validerror.type ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={CallType}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Call Type"
                            value={type}
                            onChange={item => { setType(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {validerror.type ? (
                        <Text style={styles.error_text}>{validerror.type}</Text>
                    ) : null}
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Description </Text>
                    <View style={[styles.for_border, validerror.summary ? styles.errorBorder : null]}>
                        <TextInput placeholder="Description" style={styles.inputfield} multiline placeholderTextColor="#888" value={summary} onChangeText={setSummary} />
                    </View>
                    {validerror.summary ? (
                        <Text style={styles.error_text}>{validerror.summary}</Text>
                    ) : null}
                </View>


                {/* <View style={styles.date}>
                    <Text style={styles.first}>Customer Feedback</Text>
                    <View style={[styles.for_border, validerror.feedback ? styles.errorBorder : null]}>
                        <TextInput placeholder="Customer Feedback" style={styles.inputfield} multiline placeholderTextColor="#888" value={feedback} onChangeText={setFeedBack} />
                    </View>
                    {validerror.feedback ? (
                        <Text style={styles.error_text}>{validerror.feedback}</Text>
                    ) : null}
                </View> */}

                {/* <View style={styles.date}>
                    <Text style={styles.first}>Call Outcome</Text>
                    <View style={[styles.for_border, validerror.calloutcome ? styles.errorBorder : null]}>
                        <TextInput placeholder="Call Outcome" style={styles.inputfield} multiline placeholderTextColor="#888" value={calloutcome} onChangeText={setCallOutcome} />
                    </View>
                    {validerror.calloutcome ? (
                        <Text style={styles.error_text}>{validerror.calloutcome}</Text>
                    ) : null}
                </View> */}



                <View style={styles.date}>
                    <Text style={styles.first}>Next Action Required</Text>
                    <View style={[styles.for_border_dropdown, validerror.action ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={Action}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Action"
                            value={action}
                            onChange={item => { setAction(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {validerror.action ? (
                        <Text style={styles.error_text}>{validerror.action}</Text>
                    ) : null}
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Next Follow-up Date</Text>
                    <View style={[styles.for_border, validerror.fromdate ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} editable={false} value={fromdate} placeholder="next Follow-up Date " placeholderTextColor="#888" />
                        <TouchableOpacity onPress={() => setShowFrom(true)}>
                            <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                        </TouchableOpacity>

                    </View>
                    {validerror.fromdate ? (
                        <Text style={styles.error_text}>{validerror.fromdate}</Text>
                    ) : null}
                </View>



                <View style={styles.date}>
                    <Text style={styles.first}>Update Lead Status</Text>
                    <View style={[styles.for_border_dropdown, validerror.status ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={statusData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Lead Status"
                            value={status}
                            onChange={item => { setStatus(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {validerror.status ? (
                        <Text style={styles.error_text}>{validerror.status}</Text>
                    ) : null}
                </View>

                {/* Question And Answer */}
                {answers.length > 0 && answers.map((item, index) => (
                    <View style={styles.date} key={index}>
                        <Text style={styles.first}>{item.question}</Text>
                        <View style={[styles.for_border, validerror.qa && validerror.qa[index] ? styles.errorBorder : null]}>
                            <TextInput
                                style={styles.inputfield}
                                placeholder="Enter your answer"
                                placeholderTextColor="#888"
                                value={item.answer}
                                onChangeText={(text) => {
                                    const updatedAnswers = [...answers];
                                    updatedAnswers[index].answer = text;
                                    setAnswers(updatedAnswers);
                                }}
                            />
                        </View>
                        {validerror.qa && validerror.qa[index] && (
                            <Text style={styles.error_text}>{validerror.qa[index]}</Text>
                        )}
                    </View>
                ))}





                {/* <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Add Call Log</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={[styles.btn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}  >
                    {isSubmitting ? (
                        <Text style={styles.btn_text}>Submitting...</Text>
                    ) : (
                        <Text style={styles.btn_text}>Add Call Log</Text>
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
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    date: {
        marginTop: 13,
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
        // padding:15,
        paddingTop: 15,
        paddingBottom: 15,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        paddingLeft: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: 35,
        marginBottom: 30,

    },
    btn_text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        textAlign: 'center',

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
})
export default AddCallLog