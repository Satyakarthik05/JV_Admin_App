import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from "react-redux";
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { AddNewLead } from "../../redux/reducers/TelecallerLogin/AddCallers";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Addlead = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState(null);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content");
            dispatch(GetRegesteredData())
            dispatch(requestLogin())
        }, [])
    )

    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("Get Employees List Data---->All Employee Data", getEmpdata);

    const { UnitsData } = useSelector((state) => state.GetUnitsRawMaster);
    console.log("Get Units  data in Add Raw Material Transfer page===============>", UnitsData);

    const { data } = useSelector((state) => state.Login);
    console.log("Data logined User Data ---------->", data);

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
    const [lead, setLead] = useState("New");
    const [leadsource, setLeadSource] = useState('');
    const [name, setName] = useState('');
    const [phno, setPhno] = useState('');
    const [altphno, setAltPhno] = useState('');
    const [Email, setEmail] = useState('');
    const [Address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [selectTelecaller, setSelectTelecaller] = useState('');
    const [validerror, setValidError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const telecallerList = getEmpdata?.filter(emp => emp.roleName === "TELECALLER")?.map(emp =>
    ({
        label: emp.name,
        value: emp.id
    })) || [];


    const leadData = [
        { label: "New", value: "New" },
        { label: "Contacted", value: "Contacted" },
        { label: "Follow Up", value: "FollowUp" },
        { label: "Interested", value: "Interested" },
        { label: "Not Interested", value: "NotInterested" },
        { label: "Converted", value: "Converted" },
        { label: "Closed", value: "Closed" },
    ]

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);

        if (selectedDate) {
            setDate(formateDate(selectedDate));
        }
    };



    const validationForm = () => {
        let newerror = {};

        //mobilenumber:
        const phoneRegex = /^[6-9][0-9]{9}$/;
        if (!phno.trim()) {
            newerror.phno = "Please enter mobile number";
        } else if (!phoneRegex.test(phno)) {
            newerror.phno = "Enter valid 10-digit number starting with 6-9";
        }

        if (!altphno.trim()) {
            newerror.altphno = "Please enter Alternative mobile number";
        } else if (!phoneRegex.test(altphno)) {
            newerror.altphno = "Enter valid 10-digit number starting with 6-9";
        }



        //email:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!Email.trim()) {
            newerror.Email = "Please enter email";
        } else if (!emailRegex.test(Email)) {
            newerror.Email = "Please enter valid email address";
        }


        if (!name.trim()) newerror.name = "Please Enter Name";
        if (!leadsource) newerror.leadsource = "Please Enter Lead Source";
        if (!Address) newerror.Address = "Please Enter Address";
        if (!area) newerror.area = "Please Enter Area";
        //if (!selectTelecaller) newerror.selectTelecaller = "Please Select Telecaller Name";

        setValidError(newerror);

        return Object.keys(newerror).length === 0;
    }


    const handleSubmit = async () => {
        console.log("***came to handle submit function***");

        if (isSubmitting) return; //  prevent multiple clicks

        const isvalid = validationForm();
        if (!isvalid) return;

        setIsSubmitting(true); //  start loading


        const payload = {
            leadSource: leadsource,
            customerName: name,
            mobileNumber: phno,
            alternateNumber: altphno,
            emailId: Email,
            address: Address,
            areaLocation: area,
            //telecallerId: selectTelecaller,
            telecallerId: userData?.id,
            leadCreatedDate: date,
            leadStatus: lead
        }
        console.log("Payload data that dispatching  to redux code Add New Leads to redux code -------------------->", payload);
        try {

            const response = await dispatch(AddNewLead(payload)).unwrap();
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>

                <SafeAreaView style={styles.header}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Add New Lead</Text>
                </SafeAreaView>


                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Lead Source</Text>
                        <View style={[styles.for_border, validerror.leadsource ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfiled} placeholder="Enter Lead source" placeholderTextColor="#888" value={leadsource} onChangeText={setLeadSource} />
                        </View>
                        {validerror.leadsource ? (
                            <Text style={styles.error_text}>{validerror.leadsource}</Text>
                        ) : null}
                    </View>

                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Customer Name</Text>
                        <View style={[styles.for_border, validerror.name ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfiled} placeholder="Enter Customer Name" placeholderTextColor="#888" value={name} onChangeText={setName} />
                        </View>
                        {validerror.name ? (
                            <Text style={styles.error_text}>{validerror.name}</Text>
                        ) : null}
                    </View>

                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Mobile Number</Text>
                        <View style={[styles.for_border, validerror.phno ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfiled} placeholder="000 000 0000" keyboardType="numeric" placeholderTextColor="#888" maxLength={10} value={phno} onChangeText={setPhno} />
                        </View>
                        {validerror.phno ? (
                            <Text style={styles.error_text}>{validerror.phno}</Text>
                        ) : null}
                    </View>


                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Alternate Contact Number</Text>
                        <View style={[styles.for_border, validerror.altphno ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfiled} placeholder="000 000 0000" keyboardType="numeric" placeholderTextColor="#888" maxLength={10} value={altphno} onChangeText={setAltPhno} />
                        </View>
                        {validerror.altphno ? (
                            <Text style={styles.error_text}>{validerror.altphno}</Text>
                        ) : null}
                    </View>


                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Email ID</Text>
                        <View style={[styles.for_border, validerror.Email ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfiled} placeholder="Enter Email ID" keyboardType="email-address" placeholderTextColor="#888" value={Email} onChangeText={setEmail} />
                        </View>
                        {validerror.Email ? (
                            <Text style={styles.error_text}>{validerror.Email}</Text>
                        ) : null}
                    </View>


                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Address</Text>
                        <View style={[styles.for_border, validerror.Address ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfiled} placeholder="Enter Address" multiline placeholderTextColor="#888" value={Address} onChangeText={setAddress} />
                        </View>
                        {validerror.Address ? (
                            <Text style={styles.error_text}>{validerror.Address}</Text>
                        ) : null}
                    </View>


                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Area/Location</Text>
                        <View style={[styles.for_border, validerror.area ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfiled} placeholder="Enter Area/Location" placeholderTextColor="#888" value={area} onChangeText={setArea} />
                        </View>
                        {validerror.area ? (
                            <Text style={styles.error_text}>{validerror.area}</Text>
                        ) : null}
                    </View>

                    {/* <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Assigned Telecaller ID</Text>
                        <View style={[styles.for_border_dropdown, validerror.selectTelecaller ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                showsVerticalScrollIndicator={false}
                                labelField="label"
                                valueField="value"
                                data={telecallerList}
                                placeholder="select Telecaller Name"
                                value={selectTelecaller}
                                onChange={item => { setSelectTelecaller(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}

                            />
                        </View>
                        {validerror.selectTelecaller ? (
                            <Text style={styles.error_text}>{validerror.selectTelecaller}</Text>
                        ) : null}
                    </View> */}

                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Lead Status</Text>
                        <View style={styles.for_border_dropdown}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                showsVerticalScrollIndicator={false}
                                labelField="label"
                                valueField="value"
                                data={leadData}
                                placeholder="select status"
                                value={lead}
                                onChange={item => { setLead(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}

                            />
                        </View>
                    </View>


                    <View style={styles.head}>
                        <Text style={styles.inputfild_title}>Lead Created Date</Text>
                        <View style={styles.for_border}>
                            <TextInput style={styles.inputfiled} placeholder="select Lead Date" value={date} editable={false} placeholderTextColor="#888" />
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} >
                                <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* onPress={() => setShowDate(true)} */}





                    {/* <View style={styles.head}>
                    <Text style={styles.inputfild_title}>Lead Status</Text>
                    <View style={[styles.for_border_qn,{marginBottom:15}]}>
                        <Text>1. Are you looking for this product/service for personal use or business use?</Text>
                        <TextInput style={styles.inputfiled} placeholder="Answer here"  />
                    </View>

                    <View style={[styles.for_border_qn,{marginBottom:15}]}>
                        <Text>2.How did you come to know about our company?</Text>
                        <TextInput style={styles.inputfiled} placeholder="Answer here" />
                    </View>

                    <View style={[styles.for_border_qn,{marginBottom:15}]} >
                        <Text>3.What is your exact requirement right now?</Text>
                        <TextInput style={styles.inputfiled} placeholder="Answer here" />
                    </View>

                    <View style={[styles.for_border_qn,{marginBottom:15}]} >
                        <Text>4.Have you used a similar product/service earlier?</Text>
                        <TextInput style={styles.inputfiled} placeholder="Answer here" />
                    </View>

                    <View style={[styles.for_border_qn,{marginBottom:15}]} >
                        <Text>4.6. What quantity or plan are you looking for?</Text>
                        <TextInput style={styles.inputfiled} placeholder="Answer here"  />
                    </View>


                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btn_text}>Add Lead</Text>
                    </TouchableOpacity>
                    
                </View> */}


                    {/* <TouchableOpacity style={[styles.btn, { marginBottom: responsiveHeight(3) }]} onPress={handleSubmit}>
                        <Text style={styles.btn_text}>Add Lead</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={[styles.btn, { marginBottom: responsiveHeight(3) }, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btn_text, { marginLeft: 10 }]}>Adding...</Text>
                            </View>
                        ) : (
                            <Text style={styles.btn_text}>Add Lead</Text>
                        )}
                    </TouchableOpacity>







                </ScrollView>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                       // maximumDate={new Date()} // optional: restrict future dates
                    />
                )}



            </View>
        </KeyboardAvoidingView>
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
        gap: 8,
        paddingtop: 10
    },
    btn: {
        backgroundColor: colors.commoncolor,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 8,
        marginTop: 35,
        marginBottom: 15,
    },
    btn_text: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: fonts.sfbold,
        color: colors.white,
        fontWeight: 700,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    head: {
        marginTop: 13,
    },
    inputfild_title: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.black,
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
    for_border_qn: {
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 8,
        padding: 5,
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
    error_text: {
        color: colors.error,
        fontSize: 13,
        marginTop: 4,
        fontFamily: fonts.sfmedium,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    // dropdown:{
    //     flex:1,
    //     height:48,
    // },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft: 10,
        paddingHorizontal: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    inputfiled: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
})
export default Addlead;