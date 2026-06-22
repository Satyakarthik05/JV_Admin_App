import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { responsiveHeight } from "react-native-responsive-dimensions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
const AssigntoRsm = () => {
    const navigation = useNavigation();

    const data = [
        { label: "ASM", value: "ASM" },
        { label: "RSM", value: "RSM" },
        { label: "SO", value: "SO" },
        { label: "RO", value: "RO" },
    ]
    const Distributordata = [
        { label: "ravi", value: "ravi" },
        { label: "raju", value: "raju" },
       
    ]

    const Districtdata = [
        { label: "Anantapur", value: "Anantapur" },
        { label: "Chittoor", value: "Chittoor" },
        { label: "East Godavari", value: "EastGodavari" },
        { label: "Guntur", value: "Guntur" },
        { label: "Kadapa (YSR)", value: "Kadapa" },
        { label: "Krishna", value: "Krishna" },
        { label: "Kurnool", value: "Kurnool" },
        { label: "Nellore", value: "Nellore" },
        { label: "Prakasam", value: "Prakasam" },
        { label: "Srikakulam", value: "Srikakulam" },
        { label: "Visakhapatnam", value: "Visakhapatnam" },
        { label: "Vizianagaram", value: "Vizianagaram" },
        { label: "West Godavari", value: "WestGodavari" }
    ];

    const [name, setName] = useState('');
    const [district, setDistrict] = useState('');
    const [distributor, setDistributor] = useState('');

    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState();


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )


    const Fromdatefun = (event, selected) => {
        setShowFrom(false);
        if (selected) {
            const FromDate = selected.toLocaleDateString('en-GB');
            setFromdate(FromDate);
        }
    }
    const [showto, setShowto] = useState(false);
    const [todate, setTodate] = useState();
    const Todatefun = (event, toselected) => {
        setShowto(false);
        if (toselected) {
            const ToDate = toselected.toLocaleDateString('en-GB');
            setTodate(ToDate);
        }
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={[commonstyles.row1, { gap: 12, marginVertical: 12 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color={colors.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.assignText]}>Assign to RSM</Text>
                </View>
                <View style={[commonstyles.card, { marginHorizontal: 8, marginVertical: 10 }]}>
                    <View>
                        <View style={[commonstyles.row, { width: '100%', paddingBottom: 5 }]}>
                            <Text style={commonstyles.header2}>Water Bottels</Text>
                            <Text style={commonstyles.header2}>500ml</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(3), }}>
                            <View style={[commonstyles.smallcard, { flex: 1 }]}>
                                <Text style={[commonstyles.text2,]}>Assigned Target</Text>
                                <Text style={[commonstyles.text7]}>500 Cases</Text>
                            </View>
                            <View style={[commonstyles.smallcard, styles.green, { flex: 1 }]}>
                                <Text style={[commonstyles.text2,]}>Completed</Text>
                                <Text style={[commonstyles.text7]}>400 Cases</Text>
                            </View>
                            <View style={[commonstyles.smallcard, styles.balancecolor,]}>
                                <Text style={styles.balance}>Balance</Text>
                                <Text style={styles.balance_text}>100 Cases</Text>
                            </View>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {/* FROM DATE */}
                        <View style={{ flex: 1 }}>
                            <Text style={commonstyles.name}>From Date</Text>
                            <View style={[commonstyles.inputcard, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TextInput
                                    style={commonstyles.inputfield}
                                    value={fromdate}
                                    editable={false}
                                    placeholder="From Date"
                                    placeholderTextColor="#999"
                                />
                                <TouchableOpacity onPress={() => setShowFrom(true)}>
                                    <Ionicons name="calendar-clear-outline" size={22} color={colors.dateColor} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* TO DATE */}
                        <View style={{ flex: 1 }}>
                            <Text style={commonstyles.name}>To Date</Text>

                            <View style={[commonstyles.inputcard, { flexDirection: 'row', alignItems: 'center' }]}>
                                <TextInput
                                    style={commonstyles.inputfield}
                                    value={todate}
                                    editable={false}
                                    placeholder="To Date"
                                    placeholderTextColor="#999"
                                />
                                <TouchableOpacity onPress={() => setShowto(true)}>
                                    <Ionicons name="calendar-clear-outline" size={22} color={colors.dateColor} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    <View>
                        <Text style={[commonstyles.header1]}>Product Wise Target</Text>
                    </View>

                    <View style={{ gap: responsiveHeight(2) }}>
                        <View>
                            <View style={[commonstyles.row1, { gap: responsiveHeight(13) }]}>
                                <Text style={commonstyles.name} >Target Quantity</Text>
                                <Text style={commonstyles.name} >Target Amount</Text>
                            </View>
                            <View style={[commonstyles.row1, { gap: 10 }]}>
                                <View style={[commonstyles.inputcard,]}>
                                    <TextInput style={commonstyles.inputfield} placeholder="Target Quantity" color="#000" />
                                </View>
                                <View style={[commonstyles.inputcard]}>
                                    <TextInput style={commonstyles.inputfield} placeholder="Target Amount" color="#000" />
                                </View>
                            </View>
                        </View>




                        <View style={styles.date}>
                            <Text style={[commonstyles.name, { paddingBottom: 3 }]} >Select District</Text>
                            <View style={[commonstyles.for_border_dropdown, { zIndex: 1000 },]}>
                                <Dropdown
                                    style={commonstyles.dropdown}
                                    placeholderStyle={commonstyles.placeholderStyle}
                                    selectedTextStyle={commonstyles.placeholderStyle}
                                    itemTextStyle={commonstyles.placeholderStyle}
                                    showsVerticalScrollIndicator={false}
                                    data={Districtdata}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select District"
                                    value={district}
                                    onChange={item => { setDistrict(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={commonstyles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View>


                        <View style={styles.date}>
                            <Text style={[commonstyles.name, { paddingBottom: 3 }]} >Select Distributor</Text>
                            <View style={[commonstyles.for_border_dropdown, { zIndex: 1000 },]}>
                                <Dropdown
                                    style={commonstyles.dropdown}
                                    placeholderStyle={commonstyles.placeholderStyle}
                                    selectedTextStyle={commonstyles.placeholderStyle}
                                    itemTextStyle={commonstyles.placeholderStyle}
                                    showsVerticalScrollIndicator={false}
                                    data={Distributordata}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Distributor"
                                    value={distributor}
                                    onChange={item => { setDistributor(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={commonstyles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View>

                        <View style={styles.date}>
                            <Text style={[commonstyles.name, { paddingBottom: 3 }]} >Assign To ASM<Text style={commonstyles.required}>*</Text></Text>
                            <View style={[commonstyles.for_border_dropdown, { zIndex: 1000 },]}>
                                <Dropdown
                                    style={commonstyles.dropdown}
                                    placeholderStyle={commonstyles.placeholderStyle}
                                    selectedTextStyle={commonstyles.placeholderStyle}
                                    itemTextStyle={commonstyles.placeholderStyle}
                                    showsVerticalScrollIndicator={false}
                                    data={data}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select shope name"
                                    value={name}
                                    onChange={item => { setName(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={commonstyles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View>

                    </View>


                </View>
            </ScrollView>

            <TouchableOpacity style={[commonstyles.redbutton, { marginHorizontal: 10 }]}>
                <Text style={[commonstyles.redbuttonText]}>Assign</Text>
            </TouchableOpacity>

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
                    minimumDate={new Date()}
                />
            }
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
        // flexDirection: 'column'
    },
    alinement: {
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
    },
    balance: {
        fontsize: 12,
        fontWeight: '400',
        color: '#CA3500',
        fontFamily: fonts.sfregular,
    },
    balance_text: {
        fontsize: 12,
        fontWeight: 'bold',
        color: '#CA3500',
        fontFamily: fonts.sfregular,
    },
    green: {
        backgroundColor: colors.btnbggreen,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
    },
    balancecolor: {
        backgroundColor: colors.commomcolorlight,
        borderWidth: 1,
        borderColor: colors.commoncolor,
    },
})
export default AssigntoRsm;