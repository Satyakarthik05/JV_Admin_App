import React, { useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import Feather from 'react-native-vector-icons/Feather';
const Customers = [
    {
        id: 1,
        storeName: 'Sai Kiran Store',
        city: 'Hyd',
        area: 'Ameerpet (Route b)',
        outstanding: 22300,
        status: 'pending',
        phone: "9515789078",
        dot: "#008236",
    },
    {
        id: 2,
        storeName: 'Sai Kiran Store',
        city: 'Hyd',
        area: 'Ameerpet (Route b)',
        outstanding: 22300,
        status: 'pending',
        phone: "9515789078",
        dot: "#008236"
    },
    {
        id: 3,
        storeName: 'Sri Balaji Stores',
        city: 'Sec',
        area: 'Rtx cross (Route a)',
        outstanding: 43350,
        status: 'Completed',
        phone: "9515789078",
        dot: "#eab308",
    },
    {
        id: 4,
        storeName: 'Sri Balaji Stores',
        city: 'Sec',
        area: 'Rtx cross (Route a)',
        outstanding: 43350,
        status: 'Completed',
        phone: "9515789078",
        dot: "#ef4444",
    },

]
const SaleCustomerList = () => {
    const navigation = useNavigation();


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )


    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.nameContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={[styles.dot, { backgroundColor: item.dot }]} />
                        <Text style={styles.storetext}>{item.storeName}</Text>
                    </View>
                    <Text style={[commonstyles.text5]}>{item.city}</Text>
                </View>

                <View style={styles.StatusContainer}>
                    <Text style={[commonstyles.text5]}>{item.phone}</Text>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>

                <View style={styles.areaContainer}>
                    <EvilIcons name="location" size={22} color="#EF3D3B" />
                    <Text style={[commonstyles.text5]}>{item.area}</Text>
                </View>

                <Text style={styles.outstandingText}>
                    {'\u20B9'} Outstanding:{'\u20B9'}{item.outstanding}
                </Text>

                <View style={styles.visitContainer}>
                    <TouchableOpacity style={styles.visitButton} onPress={() => navigation.navigate("SaleCustomerDetails")}>
                        <Text style={styles.visitText}>visit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: '#DCFCE7', padding: 6, borderRadius: 8 }}>
                        <Ionicons name="call-outline" size={22} color="#00A63E" />
                    </TouchableOpacity>
                </View>


            </View>
        )
    }
    return (
        <SafeAreaView style={styles.MainContainer}>
            <View style={styles.ListContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={colors.black} />
                </TouchableOpacity>
                <Text style={styles.ListText}>Customer List</Text>
            </View>

          
            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

            <TouchableOpacity style={styles.CustomerField}>
                <EvilIcons name="search" size={24} color="#99a1af" />
                <TextInput
                    placeholder="Search customers"
                    placeholderTextColor="#888"

                />
            </TouchableOpacity>

            {/* counters  */}

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

            </View>

            {/* customer list*/}
            <FlatList
                data={Customers}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16 }}
            />


        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor:colors.white,
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

export default SaleCustomerList;