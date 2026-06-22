import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from "react-redux";
import { GetLeads } from "../../redux/reducers/TelecallerLogin/AddCallers";


const EditFollowups = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
     const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        return `${day}-${month}-${year}`;
    };


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            dispatch(GetLeads())
        }, [])
    )
    
    const [lead, setLead] = useState(null);
    const [remainer, setReminder] = useState(null);
    const [status, setStatus] = useState(null);
    const [showDate, setShowDate] = useState(false);// show date
    const [date, setDate] = useState(getTodayDate());//stores the Date
    const [note, setNote] = useState('');
    const [time,setTime]=useState('');
    const [validerror, setValidError] = useState({});


    const { GetLeadsData } = useSelector((state) => state.GetTelecallerLeads);
    console.log("All About  Telecaller Leads Data-------->", GetLeadsData);

    const LeadData = GetLeadsData?.map(lead => ({
        label: lead.customerName,
        value: lead.id
    })) || [];




    const ReminderData = [
        { label: "Call Reminder", value: "Call Reminder" },
        { label: "Visit Reminder", value: "Visit Reminder" },
        { label: "Follow-Up Call", value: "Follow-Up Call" },
        { label: "Send Product Details", value: "Send Product Details" },
        { label: "Payment Reminder", value: "Payment Reminder" },
    ];


    const StatusData = [
        { label: "Interested", value: "Interested" },
        { label: "Not Interested", value: "Not Interested" },
        { label: "Call Later", value: "Call Later" },
        { label: "Converted to Customer", value: "Converted to Customer" },
    ];


    const validationForm = () => {
        let newerror = {};

        if (!lead) newerror.lead = "Please Select Lead Name ";
        if (!remainer) newerror.remainer = "Please Select Reminder Type";
        if (!status) newerror.status = "Please Select Call Status";
        if (!note) newerror.note = "Please Enter Follow-up Note";
        if(!time) newerror.time="Please Enter Follow-up Time";
        setValidError(newerror);

        return Object.keys(newerror).length === 0;
    }




    // const TodaysDate = (event, selectedDate) => {
    //     setShowDate(false)
    //     if (selectedDate) {
    //         const DATE = selectedDate.toLocaleDateString('en-GB');
    //         setDate(DATE)
    //     }
    // }

    return (
        <View style={styles.container}>

            <SafeAreaView >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Edit Follow-Up</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.date}>
                    <Text style={styles.first}>Lead ID</Text>
                    <View style={[styles.for_border_dropdown, validerror.lead ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={LeadData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Lead"
                            value={lead}
                            onChange={item => { setLead(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {validerror.lead ? (
                        <Text style={styles.error_text}>{validerror.lead}</Text>
                    ) : null}
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Follow-Up Date</Text>
                    <View style={styles.for_border}>
                        <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Follow-Up Date" placeholderTextColor="#888" />
                        {/* onPress={() => setShowDate(true)} */}
                        <TouchableOpacity >
                            <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Follow-Up Time</Text>
                    <View style={[styles.for_border,validerror.time ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} placeholder="Follow-Up Time" placeholderTextColor="#888"  value={time} onChangeText={setTime}/>
                    </View>
                    {validerror.time ? (
                        <Text style={styles.error_text}>{validerror.time}</Text>
                    ) : null}
                </View>



                <View style={styles.date}>
                    <Text style={styles.first}>Reminder Type</Text>
                    <View style={[styles.for_border_dropdown,validerror.remainer ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={ReminderData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Reaminder Type"
                            value={remainer}
                            onChange={item => { setReminder(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {validerror.remainer ? (
                        <Text style={styles.error_text}>{validerror.remainer}</Text>
                    ) : null}
                </View>



                <View style={styles.date}>
                    <Text style={styles.first}>Follow-Up Status</Text>
                    <View style={[styles.for_border_dropdown,validerror.status ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={StatusData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Follow-Up Status"
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


                <View style={styles.date}>
                    <Text style={styles.first}>Follow-Up Notes</Text>
                    <View style={[styles.for_border,validerror.note ? styles.errorBorder: null]}>
                        <TextInput style={styles.inputfield} placeholder="Follow-Up Notes" placeholderTextColor="#888" value={note} onChangeText={setNote} />
                    </View>
                     {validerror.note ? (
                        <Text style={styles.error_text}>{validerror.note}</Text>
                    ) : null}
                </View>


                <TouchableOpacity style={styles.btn} onPress={validationForm}>
                    <Text style={styles.btn_text}>Set Follow - Up</Text>
                </TouchableOpacity>


            </ScrollView>
            {/* {
                showDate &&
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={TodaysDate}
                />
            } */}
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
        paddingLeft: 10,
        fontFamily: fonts.sfmedium
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
export default EditFollowups