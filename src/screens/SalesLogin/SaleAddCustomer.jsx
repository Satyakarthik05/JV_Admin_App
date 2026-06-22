import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import commonstyles from "../../commonstyles/commonstyles";
import { colors, fonts } from "../../config/theme";
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';

const SaleAddCustomer = () => {
    const navigation = useNavigation();

    const shopsData = [
        { label: "Kirana Store", value: "Kirana" },
        { label: "Super Market", value: "SuperMarket" },
        { label: "General Store", value: "GeneralStore" },
        { label: "Cool Drinks Shop", value: "CoolDrinksShop" },
        { label: "Juice Center", value: "JuiceCenter" },
        { label: "Tea Stall", value: "TeaStall" },
        { label: "Soda Shop", value: "SodaShop" },
        { label: "Bakery", value: "Bakery" },
        { label: "Hotel / Restaurant", value: "Hotel" },
        { label: "Cafe", value: "Cafe" },
        { label: "Ice Cream Parlour", value: "IceCream" },
        { label: "Wholesale Dealer", value: "Wholesale" },
        { label: "Distributor", value: "Distributor" }
    ];
    const [shope,setShope]=useState('');

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Customer</Text>
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Shop Name */}
                <Text style={styles.label}>Shop Name</Text>
                <TextInput placeholder="General Store" style={styles.input} />

                {/* Owner Name */}
                <Text style={styles.label}> Owner Name <Text style={styles.required}>*</Text> </Text>
                <TextInput placeholder="Owner Name" style={styles.input} />

                {/* Mobile Number */}
                <Text style={styles.label}>Mobile Number <Text style={styles.required}>*</Text> </Text>
                <TextInput placeholder="Enter mobile number" keyboardType="number-pad" style={styles.input} maxLength={10} />

                {/* Shop Type */}
                {/* <Text style={styles.label}> Shop Type <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>Kirana</Text>
                    <Ionicons name="chevron-down" size={18} />
                </TouchableOpacity> */}

                <View style={styles.date}>
                    <Text style={styles.label}> Shop Type <Text style={styles.required}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={shopsData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select shope name"
                            value={shope}
                            onChange={item => { setShope(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>

                {/* Address Section */}
                <View style={styles.shopCard}>
                    <Text style={styles.sectionTitle}>Shop Address Details <Text style={styles.required}>*</Text></Text>

                    <TouchableOpacity style={styles.addLocation}>
                        <FontAwesome6 name="location-crosshairs" size={18} color="#E7000B" />
                        <Text style={styles.addLocationText}>Add location</Text>
                    </TouchableOpacity>

                    <Text style={styles.fillDetails}>Fill details</Text>

                    {/* Address Card */}
                    <View style={styles.addressCard}>
                        <View style={styles.row}>
                            <Text style={styles.routeText}>Route</Text>
                            <TextInput placeholder="Route" style={styles.addressInput} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Full Address</Text>
                            <TextInput placeholder="Full Address" style={styles.addressInput} />
                        </View>


                        <View style={styles.row}>
                            <Text style={styles.routeText}>Door No</Text>
                            <TextInput placeholder="Door No" style={[styles.addressInput,]} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Street</Text>
                            <TextInput placeholder="Street" style={[styles.addressInput,]} />
                        </View>


                        <View style={styles.row}>
                            <Text style={styles.routeText}>Area / Locality</Text>
                            <TextInput placeholder="Area / Locality" style={styles.addressInput} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Landmark</Text>
                            <TextInput placeholder="Landmark" style={styles.addressInput} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.routeText}>City</Text>
                            <TextInput placeholder="City" style={[styles.addressInput]} />
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Pin code</Text>
                            <TextInput placeholder="Pin code" keyboardType="number-pad" style={[styles.addressInput]} />
                        </View>
                    </View>

                </View>

                {/* Upload Photo */}
                <Text style={styles.sectionTitle}>Upload Photo (Optional)</Text>
                <TouchableOpacity style={styles.uploadBox}>
                    <Ionicons name="camera-outline" size={22} color="#8F8F8F" />
                    <Text style={styles.uploadText}>Upload payment photo</Text>
                </TouchableOpacity>

                {/* Notes */}
                <Text style={styles.sectionTitle}>Additional Notes</Text>
                <TextInput placeholder="Enter notes" multiline style={styles.notesInput} />
            </ScrollView>

            <TouchableOpacity style={[commonstyles.redbutton, { marginHorizontal: 10 }]}>
                <Text style={[commonstyles.redbuttonText]}>Add Customer </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },

    scrollContent: {
        padding: 14,
        paddingBottom: 40,
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#344054',
        marginTop: 14,
        marginBottom: 6,
    },

    required: {
        color: '#E7000B',
    },

    input: {
        height: responsiveHeight(6),
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#D0D5DD',
    },

    dropdown: {
        height: responsiveHeight(6),
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dropdownText: {
        fontSize: 14,
        color: '#101828',
    },

    sectionTitle: {
        marginTop: 20,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#101828',
    },

    addLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 6,
        // backgroundColor: '#FFF5F5',
        gap: 6,
    },

    addLocationText: {
        color: '#101828',
        fontSize: 14,
        fontWeight: '600',
    },

    fillDetails: {
        textAlign: 'center',
        fontSize: 12,
        color: '#667085',
        marginVertical: 10,
    },
    shopCard: {
        backgroundColor: '#fff',
        marginVertical: 10,
        padding: 5,
        borderRadius: 8,
        elevation: 4
    },

    addressCard: {
        // backgroundColor: '#fff',
        padding: 8,
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#EAECF0',
        gap: 10,
    },
    routeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#101828'
    },

    addressInput: {
        height: responsiveHeight(5),
        borderWidth: 1,
        borderColor: '#D0D5DD',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#101828',
        width: responsiveWidth(60)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    // row: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    // },

    uploadBox: {
        height: responsiveHeight(7),
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#D0D5DD',
        borderRadius: 8,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    uploadText: {
        fontSize: 13,
        color: '#667085',
    },

    notesInput: {
        height: responsiveHeight(12),
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingTop: 10,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        textAlignVertical: 'top',
    },


    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
    },
    calender_icon: {
        paddingRight: 15,
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        //paddingLeft:10,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium
    },
});
export default SaleAddCustomer;