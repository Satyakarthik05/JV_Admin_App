import React, { useCallback } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";

//**********************************Daily Closing Report*******************************************//

const SaleDailyReports = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.ListContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={colors.simpleblack} />
                </TouchableOpacity>
                <View style={{ gap: 4 }}>
                    <Text style={styles.ListText}>Payments</Text>
                    <Text>Nov 27,2024</Text>
                </View>
            </View>

            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.summaryText}>Sales Summary</Text>
                    <View style={styles.TotalSaleContainer}>
                        <Text style={styles.commonText}>Total Sales</Text>
                        <Text style={styles.commonText1}>{'\u20B9'} 250</Text>
                    </View>
                    <View style={styles.paymentContainer}>
                        <Text style={styles.commonText}>Payment Collected</Text>
                        <Text style={styles.commonText2}>{'\u20B9'} 250</Text>
                    </View>
                    <View style={styles.ExpensesContainer}>
                        <Text style={styles.commonText}>Expenses</Text>
                        <Text style={styles.commonText1}>{'\u20B9'} 250</Text>
                    </View>
                    <TouchableOpacity style={styles.MoreContainer} onPress={() => navigation.navigate("SalePaymentDetails")}>
                        <Text>View More</Text>
                        <Ionicons name="chevron-forward-sharp" size={20} color="#6A7282" />
                    </TouchableOpacity>
                </View>

                <View style={styles.card2}>
                    <Text style={styles.paymentbrak}>Payment Breakdown</Text>
                    <View style={styles.CashContainer}>
                        <Text style={styles.cashText}>Cash in Hand</Text>
                        <Text style={styles.cashText1}>{'\u20B9'} 18,000</Text>
                    </View>
                    <View style={styles.OnlineContainer}>
                        <Text style={styles.cashText}>Online Payments</Text>
                        <Text style={styles.cashText1}>{'\u20B9'} 4,500</Text>
                    </View>
                </View>

                <View style={styles.card2}>
                    <Text style={styles.paymentbrak}>Returns Summary</Text>
                    <View style={styles.CashContainer}>
                        <Text style={styles.cashText}>Normal Returns</Text>
                        <Text style={styles.cashText2}>60</Text>
                    </View>
                    <View style={styles.OnlineContainer}>
                        <Text style={styles.cashText}>Damaged Returns</Text>
                        <Text style={styles.cashText3}>5</Text>
                    </View>
                </View>

                <View style={styles.card2}>
                    <Text style={styles.paymentbrak}>Cash Handed to Distributor</Text>
                    <TouchableOpacity style={styles.EnterAmount}>
                        <TextInput  placeholder="₹ Enter Amount" placeholderTextColor="#999"  style={commonstyles.inputfield}/>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    ListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 16,
        marginVertical: 10,
    },
    ListText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F1724',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 12,
        marginVertical: 14,
        marginHorizontal: 10,
        borderRadius: 8,
        elevation: 4,
        gap: 8,
    },
    TotalSaleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#EFF6FF',
        padding: 14,
        borderRadius: 8,
        marginBottom: 10,
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F0FDF4',
        padding: 14,
        borderRadius: 8,
        marginBottom: 10,
    },
    ExpensesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FEF2F2',
        padding: 14,
        borderRadius: 8,
        marginBottom: 10,
    },
    MoreContainer: {
        flexDirection: "row",
        justifyContent: 'flex-end'
    },
    summaryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101828'
    },
    commonText: {
        fontSize: 14,
        fontWeight: "400",
        color: '#364153',
        fontFamily:fonts.sfregular,
    },
    commonText1: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF3D3B'
    },
    commonText2: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00A63E'
    },
    card2: {
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 8,
        marginVertical: 13,
        marginHorizontal: 10,
        elevation: 4,
        gap: 8,

    },
    CashContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    OnlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cashText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#101828'
    },
    paymentbrak: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101828'
    },
    cashText1: {
        fontWeight: '500',
        fontSize: 16,
        color: '#101828'
    },
    cashText2: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00A63E',
    },
    cashText3: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF3D3B'
    },
    EnterAmount: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 10,

    }
})
export default SaleDailyReports;