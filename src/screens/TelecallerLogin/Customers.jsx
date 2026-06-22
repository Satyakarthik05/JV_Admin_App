import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors, fonts } from "../../config/theme";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import commonstyles from "../../commonstyles/commonstyles";
import { useDispatch, useSelector } from "react-redux";
import { GetCustomerData } from "../../redux/reducers/DriverLogin/Forms";



const Customers = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const dispatch = useDispatch();


    const [selectState, setSelectState] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [active, setActive] = useState("All");
    const [distributor, setDistributor] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const StatesData = [
        { label: "Andhra Pradesh", value: "AP" },
        { label: "Telangana", value: "TS" },
        { label: "Tamil Nadu", value: "TN" },
        { label: "Karnataka", value: "KA" },
    ]

    const districtData = [
        { label: "East Godavari", value: "East Godavari" },
        { label: "West Godavari", value: "West Godavari" },
        { label: "Krishna", value: "krishna" },
        { label: "Guntur", value: "guntur" },
    ];

    const cityData = [
        { label: "Rajahmundry", value: "rajahmundry" },
        { label: "Kakinada", value: "kakinada" },
        { label: "Eluru", value: "eluru" },
        { label: "Vijayawada", value: "vijayawada" },
    ];

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await dispatch(GetCustomerData()).unwrap();
        } catch (e) {
            console.log("Refresh error:", e);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
            dispatch(GetCustomerData())
        }, [dispatch])
    )


    const { CustomersDataGetCall } = useSelector((state) => state.GetCustomers);
    console.log("Get Customers Data in telecaller login --------------->", CustomersDataGetCall);

    const Distributor = CustomersDataGetCall?.filter(item => item.customerType === "DISTRIBUTOR").map(item => ({
        label: item.ownerName,
        value: item.id,
        //mobile: item.mobile,
    })) || [];


    return (
        <View style={[styles.container]}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Customers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("AddedSale")}>
                    <Text style={styles.btn_text}>Add Sale</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <View style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: responsiveHeight(5) }}>

                {/* <View style={styles.date}>
                    <Text style={styles.first}>Select State<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={StatesData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select State"
                            value={selectState}
                            onChange={item => { setSelectState(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Select District<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={districtData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select District"
                            value={district}
                            onChange={item => { setDistrict(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Select City<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={cityData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select City"
                            value={city}
                            onChange={item => { setCity(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Select Distributor<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            //data={cityData}
                            data={Distributor}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Distributor"
                            value={distributor}
                            onChange={item => { setDistributor(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toggle_btns}>
                    <TouchableOpacity onPress={() => setActive("All")}>
                        <Text style={[styles.toggle_text, active === "All" && styles.rejected_btn]}>All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActive("36")} style={[styles.toggle_btn, active === "36" && styles.active_btn]}>
                        <FontAwesome name="circle" size={16} color="#39AE41" />
                        <Text style={styles.toggle_label}>36</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActive("37")} style={[styles.toggle_btn, active === "37" && styles.active_btn]} >
                        <FontAwesome name="circle" size={16} color="#f6e70f" />
                        <Text style={styles.toggle_label}>37</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActive("38")} style={[styles.toggle_btn, active === "38" && styles.active_btn]} >
                        <FontAwesome name="circle" size={16} color="#e81111" />
                        <Text style={styles.toggle_label}>38</Text>
                    </TouchableOpacity>

                </ScrollView> */}

                <View style={styles.new_cards}>
                    <FlatList
                        data={CustomersDataGetCall}
                        // keyExtractor={item => item.id}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 70, paddingHorizontal: 2, flexGrow: 1 }}

                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        alwaysBounceVertical={true}

                        ListHeaderComponent={() => (
                            <View>
                                <View style={styles.date}>
                                    <Text style={styles.first}>Select State<Text style={styles.red}>*</Text></Text>
                                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            showsVerticalScrollIndicator={false}
                                            data={StatesData}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select State"
                                            value={selectState}
                                            onChange={item => { setSelectState(item.value) }}
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>

                                <View style={styles.date}>
                                    <Text style={styles.first}>Select District<Text style={styles.red}>*</Text></Text>
                                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            showsVerticalScrollIndicator={false}
                                            data={districtData}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select District"
                                            value={district}
                                            onChange={item => { setDistrict(item.value) }}
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>


                                <View style={styles.date}>
                                    <Text style={styles.first}>Select City<Text style={styles.red}>*</Text></Text>
                                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            showsVerticalScrollIndicator={false}
                                            data={cityData}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select City"
                                            value={city}
                                            onChange={item => { setCity(item.value) }}
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>


                                <View style={styles.date}>
                                    <Text style={styles.first}>Select Distributor<Text style={styles.red}>*</Text></Text>
                                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            showsVerticalScrollIndicator={false}
                                            //data={cityData}
                                            data={Distributor}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Distributor"
                                            value={distributor}
                                            onChange={item => { setDistributor(item.value) }}
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>


                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toggle_btns}>
                                    <TouchableOpacity onPress={() => setActive("All")}>
                                        <Text style={[styles.toggle_text, active === "All" && styles.rejected_btn]}>All</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setActive("36")} style={[styles.toggle_btn, active === "36" && styles.active_btn]}>
                                        <FontAwesome name="circle" size={16} color="#39AE41" />
                                        <Text style={styles.toggle_label}>36</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setActive("37")} style={[styles.toggle_btn, active === "37" && styles.active_btn]} >
                                        <FontAwesome name="circle" size={16} color="#f6e70f" />
                                        <Text style={styles.toggle_label}>37</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setActive("38")} style={[styles.toggle_btn, active === "38" && styles.active_btn]} >
                                        <FontAwesome name="circle" size={16} color="#e81111" />
                                        <Text style={styles.toggle_label}>38</Text>
                                    </TouchableOpacity>

                                </ScrollView>
                            </View>
                        )}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.card}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.toggle_label}>{item.ownerName}</Text>
                                            <Text style={commonstyles.active}>{item.status}</Text>
                                        </View>
                                        <Text style={styles.toggle_label}>Shop name: {item.shopName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                                        <FontAwesome name="phone" color={colors.btntextgreen} size={14} />
                                        <Text style={styles.first}>{item.mobile}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                                        <FontAwesome6 name="location-dot" color={colors.error} size={14} />
                                        <Text style={styles.first}>{item.city}</Text>
                                    </View>

                                </View>
                            )
                        }}
                    />
                </View>

            </View>
        </View>
    )
}
export default Customers;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    body: {
        flexDirection: 'column',
        alignContent: 'center',
        flex: 1,
        //gap:responsiveHeight(1),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },

    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft:10,
        paddingHorizontal: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        // marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    date: {
        marginTop: 13,
    },
    red: {
        color: colors.error,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
    },
    toggle_btns: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingVertical: responsiveHeight(2),
    },
    // toggle_text: {
    //     textAlign: 'center',
    //     backgroundColor: colors.togglegray,
    //     color: colors.formtitlegry,
    //     fontSize: 16,
    //     fontWeight: 500,
    //     paddingTop: 8,
    //     paddingBottom: 8,
    //     paddingRight: 18,
    //     paddingLeft: 18,
    //     borderRadius: 8,
    //     fontFamily: fonts.sfbold,
    // },

    toggle_text: {
        textAlign: 'center',
        backgroundColor: colors.togglegray,
        color: colors.formtitlegry,
        fontSize: 16,          // increase text size
        fontWeight: '500',
        paddingVertical: 12,   // increase height
        paddingHorizontal: 15, // increase width
        borderRadius: 10,
        minWidth: 70,          // optional fixed width
        fontFamily: fonts.sfbold,
    },

    // rejected_btn: {
    //     fontSize: 14,
    //     fontWeight: 700,
    //     color: colors.black,
    //     backgroundColor: colors.commomcolorlight,
    //     borderWidth: 1,
    //     borderColor: colors.commoncolor,
    //     borderRadius: 8,
    //     paddingTop: 8,
    //     paddingBottom: 8,
    //     paddingLeft: 15,
    //     paddingRight: 15,
    //     textAlign: 'center',
    //     fontFamily: fonts.sfbold,
    // },

    rejected_btn: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        backgroundColor: colors.commomcolorlight,
        borderWidth: 1,
        borderColor: colors.commoncolor,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 18,
        minWidth: 70,
        textAlign: 'center',
        fontFamily: fonts.sfbold,
    },
    toggle_row: {
        flexDirection: "row",
        alignItems: "center",
    },
    toggle_btn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.togglegray,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
        gap: 6,
    },

    toggle_label: {
        fontSize: 16,
        color: colors.formtitlegry,
        fontFamily: fonts.sfbold,
    },

    active_btn: {
        backgroundColor: colors.commomcolorlight,
        borderWidth: 1,
        borderColor: colors.commoncolor,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        // marginRight: 1,
        // marginLeft: 1,
        marginTop: 13,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        // flex: 1,

    },
    btn_text: {
        color: colors.white,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        fontSize: 14,
        textAlign: 'center',

    },



})