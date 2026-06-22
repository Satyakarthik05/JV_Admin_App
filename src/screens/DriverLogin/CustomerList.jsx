import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import { useDispatch, useSelector } from "react-redux";
import { GetCustomerData } from "../../redux/reducers/DriverLogin/Forms";





const CustomerList = ({ route }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const { customers, routeName } = route.params || {};
    console.log(customers, '>>>>>>>>>>customers in CustomerList');

    const filteredCustomers = (customers || []).filter(item => {
        const text = searchText.toLowerCase();

        return (
            item.shopName?.toLowerCase().includes(text) ||
            item.ownerName?.toLowerCase().includes(text)
        );
    });

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")

        }, [])
    )








    return (
        <SafeAreaView style={styles.MainContainer}>
            <View style={styles.ListContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.ListText}>Customer List</Text>
            </View>

            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

            <TouchableOpacity style={styles.CustomerField}>
                <EvilIcons name="search" size={24} color="#99a1af" />
                <TextInput placeholder="Search customers" placeholderTextColor="#888" style={commonstyles.inputfield} value={searchText} onChangeText={setSearchText} />
            </TouchableOpacity>

            {/* counters  */}
            {/* 
            <View style={styles.CounterContainer}>
                <View style={styles.CounterBox}>
                    <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
                    <Text style={[commonstyles.text8]}>36</Text>
                </View>
                <View style={styles.CounterBox}>
                    <View style={[styles.dot, { backgroundColor: '#eab308' }]} />
                    <Text style={[commonstyles.text8]}>36</Text>
                </View>
                <View style={styles.CounterBox}>
                    <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
                    <Text style={[commonstyles.text8]}>36</Text>
                </View>

            </View> */}

            {/* customer list*/}
            <FlatList
                // data={customers}
                data={filteredCustomers}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={() => (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Data Not Found</Text>
                )}

                renderItem={({ item, index }) => {
                    return (

                        <View style={styles.card}>
                            <View style={styles.nameContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                    <View style={[styles.dot, { backgroundColor: item.dot }]} />
                                    <Text style={styles.storetext}>{item.shopName}</Text>
                                </View>
                                {/* <Text style={[commonstyles.text5]}>{item.city}</Text> */}
                            </View>

                            <View style={styles.StatusContainer}>

                                <Text style={[commonstyles.text5]}>{item.mobile}</Text>
                                <Text style={item.status === 'ACTIVE' ? commonstyles.active : commonstyles.inactive}>{item.status}</Text>
                            </View>

                            <View style={styles.areaContainer}>
                                <EvilIcons name="location" size={22} color="#EF3D3B" />
                                <Text style={[commonstyles.text5]}>{item.area}</Text>
                            </View>

                            <Text style={styles.outstandingText}>
                                {'\u20B9'} Outstanding:{'\u20B9'}{item.outstandingAmount}
                            </Text>

                            <View style={styles.visitContainer}>
                                <TouchableOpacity style={styles.visitButton} onPress={() => navigation.navigate("CustomerDetails", { customers: item, customersList: customers, routeName: routeName })}>
                                    <Text style={styles.visitText}>visit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: '#DCFCE7', padding: 6, borderRadius: 8 }} onPress={() => Linking.openURL(`tel:${item.mobile}`)}>
                                    <Ionicons name="call-outline" size={22} color="#00A63E" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}

            />


        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    ListContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        paddingHorizontal: 16,
        gap: 16,
        marginVertical: 10,
    },
    ListText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F1724',
    },
    CustomerField: {
        borderWidth: 0.5,
        borderColor: "#b2b2b2",
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    card: {
        // borderWidth: 2,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 7,
        marginBottom: 8,
        elevation: 5,
        //fontFamily:fonts.sfbold
    },
    CounterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    CounterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: '#e5e7eb',
        marginRight: 10,
        borderRadius: 8,
    },
    dot: {
        width: 10, height: 10, borderRadius: 6, marginRight: 4,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
    },
    StatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    areaContainer: {
        flexDirection: 'row',
    },
    storetext: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101828',
        fontFamily: 'Poppins-Medium'
    },
    phoneText: {
        fontSize: 14,
        fontWeight: '400',
        marginTop: 3,
        fontFamily: 'Poppins-Medium'

    },
    statusText: {
        backgroundColor: '#FFF7ED',
        color: '#FF4C00',
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 12,
        paddingLeft: 12,
        borderRadius: 6,
        fontFamily: 'Poppins-Medium'
    },
    outstandingText: {
        color: '#E7000B',
        marginTop: 5,
        fontSize: 14,
        marginLeft: 5,
        fontWeight: '400',
        fontFamily: 'Poppins-Regular'
    },
    visitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    visitButton: {
        backgroundColor: '#EF3D3B',
        paddingTop: 6,
        width: responsiveWidth(75),
        paddingBottom: 6,
        borderRadius: 8,
    },
    visitText: {
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Poppins-Medium'
    }





})
export default CustomerList;