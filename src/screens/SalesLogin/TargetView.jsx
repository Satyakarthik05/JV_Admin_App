import React, { useCallback, useState } from "react";
import { FlatList, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import Fontisto from "react-native-vector-icons/Fontisto";
import Entypo from "react-native-vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { responsiveHeight } from "react-native-responsive-dimensions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from "react-native-element-dropdown";


const TargetView = () => {
    const navigation = useNavigation();
    const [openBottle, setOpenBottle] = useState(false);
    const [selectedBottle, setSelectedBottle] = useState("");

    const bottels = [
        { label: "Water Bottle 2L", value: "Water Bottle 2L" },
        { label: "Water Bottle 1L", value: "Water Bottle 1L" },
        { label: "Water Bottle 500ml", value: "Water Bottle 500ml" },
    ];

    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState();


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


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )

    return (
        <SafeAreaView style={[styles.mainContainer]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={[commonstyles.row1, { gap: 12, marginVertical: 12 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color={colors.black} />
                    </TouchableOpacity>
                    <Text style={[commonstyles.assignText]}>Target View</Text>
                </View>
                <View style={[commonstyles.card, { marginHorizontal: 8, marginVertical: 10 }]}>



                    <View style={[commonstyles.row, { width: '100%' }]}>
                        <Text style={commonstyles.header2}>Water Bottels</Text>
                        <Text style={commonstyles.header2}>500ml</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(3) }}>
                        <View style={[commonstyles.smallcard]}>
                            <Text style={[commonstyles.text2,]}>Assigned Target</Text>
                            <Text style={[commonstyles.text7]}>500 Cases</Text>
                        </View>
                        <View style={[commonstyles.smallcard]}>
                            <Text style={[commonstyles.text2,]}>Completed</Text>
                            <Text style={[commonstyles.text7]}>400 Cases</Text>
                        </View>
                        <View style={[commonstyles.smallcard]}>
                            <Text style={styles.balance}>Balance</Text>
                            <Text style={styles.balance_text}>100 Cases</Text>
                        </View>
                    </View>

                    <View style={[commonstyles.row1, { gap: responsiveHeight(16) }]}>
                        <Text style={[commonstyles.text1]}>From Date</Text>
                        <Text style={[commonstyles.text1]}>To Date</Text>
                    </View>
                    <View style={[commonstyles.row1, { gap: 16 }]}>
                        <View style={[commonstyles.inputcard, commonstyles.row1,]}>
                            <TextInput style={{ flex: 1 }} value={fromdate} editable={false} color="#000" placeholder="From Date" />
                            <TouchableOpacity onPress={() => setShowFrom(true)}>
                                {/* <Fontisto name="date" size={22} color={colors.dateColor} /> */}
                                <Ionicons name="calendar-clear-outline" size={22} color={colors.dateColor} />
                            </TouchableOpacity>
                        </View>
                        <View style={[commonstyles.inputcard, commonstyles.row1,]}>
                            <TextInput style={{ flex: 1 }} value={todate} editable={false} color="#000" placeholder="To Date" />
                            <TouchableOpacity onPress={() => setShowto(true)}>
                                {/* <Fontisto name="date" size={22} color={colors.dateColor} /> */}
                                <Ionicons name="calendar-clear-outline" size={22} color={colors.dateColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={[commonstyles.header1]}>Product Wise Target</Text>
                    </View>

                    {/* <View style={[commonstyles.card]}> */}


                        <View>
                            <Text style={styles.product}>Product Category</Text>
                            <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.placeholderStyle}
                                    itemTextStyle={styles.placeholderStyle}
                                    showsVerticalScrollIndicator={false}
                                    data={bottels}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Product Category"
                                    value={selectedBottle}
                                    onChange={item => { setSelectedBottle(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View>




                        <Text style={[commonstyles.text1]}>Product Size</Text>
                        <View style={styles.for_border}>
                            <TextInput style={styles.inputfield} placeholder="Product Size" placeholderTextColor="#888" />
                        </View>

                        <View style={[commonstyles.row1, { gap: responsiveHeight(10) }]}>
                            <Text style={[commonstyles.text1]}>Target Quantity</Text>
                            <Text style={[commonstyles.text1]}>Target Amount</Text>
                        </View>


                        <View style={[commonstyles.row1, { gap: 10 }]}>
                            <View style={[commonstyles.inputcard,]}>
                                <TextInput placeholder="Target Quantity" color="#000" style={styles.input} />
                            </View>
                            <View style={[commonstyles.inputcard]}>
                                <TextInput placeholder="Target Amount" color="#000" style={styles.input} />
                            </View>
                        </View>


                        {/* <Text style={[commonstyles.text1]} >Assign to</Text>
                        <View style={styles.for_border}>
                            <TextInput style={styles.input} placeholder="Assign To" placeholderTextColor="#888" />
                        </View> */}

                    {/* </View> */}


                </View>
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
    },
    dropdownContainer: {
        marginTop: 6,
        backgroundColor: colors.white,
        borderRadius: 8,
        elevation: 2,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
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
        fontFamily: fonts.sfmedium,
    },
    input: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
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
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium,
    },
    calender_icon: {
        paddingRight: 10,
    },
    product: {
        fontSize: 16,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,
        paddingBottom: 5,
    },


})
export default TargetView;