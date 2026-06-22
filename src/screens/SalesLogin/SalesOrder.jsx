import React, { useCallback } from "react";
import { Image, StatusBar, StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { colors, fonts } from "../../config/theme";
import Feather from "react-native-vector-icons/Feather";
import commonstyles from "../../commonstyles/commonstyles";
import { Eye } from "../../components/svgs";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    responsiveWidth as rw,
    responsiveHeight as rh,
    responsiveFontSize as rf,
    responsiveHeight,
} from 'react-native-responsive-dimensions';
import { resetCache } from "../../../metro.config";


const SalesOrder = () => {
    const navigation = useNavigation();
    const FlatListData = [
        { id: '1', type: 'Water Bottle', ml: '500ml', assigned: '500 case', completed: '400 cases', balance: '100 cases' },
        { id: '2', type: 'Water Bottle', ml: '500ml', assigned: '500 case', completed: '400 cases', balance: '100 cases' },
        { id: '3', type: 'Water Bottle', ml: '500ml', assigned: '500 case', completed: '400 cases', balance: '100 cases' },
    ];
    const targetSections = [
        {
            id: '1',
            product: 'Water Bottels',
            size: '500ml',
            targets: [
                { id: '1', title: 'Assigned', value: '400 Cases' },
                { id: '2', title: 'Achieved', value: '250 Cases' },
                { id: '3', title: 'Pending', value: '150 Cases' },
                { id: '4', title: 'Returned', value: '50 Cases' },
            ],
        },
        {
            id: '2',
            product: 'Soft Drinks',
            size: '250ml',
            targets: [
                { id: '1', title: 'Assigned', value: '800 Cases' },
                { id: '2', title: 'Achieved', value: '500 Cases' },
                { id: '3', title: 'Pending', value: '300 Cases' },
                { id: '4', title: 'Returned', value: '100 Cases' },
                { id: '5', title: 'Bonus', value: '50 Cases' },
                { id: '6', title: 'Extra', value: '25 Cases' },
                { id: '7', title: 'Damaged', value: '10 Cases' },
                { id: '8', title: 'Expired', value: '5 Cases' },
            ],
        },
    ];

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <View style={styles.maincontainer}>
                {/* <StatusBar barStyle="light-content" backgroundColor={colors.commoncolor} /> */}
                <View style={styles.firstcontainer}>
                    <View style={styles.banerContainer}>
                        <View style={styles.ImageContainer}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Feather name="arrow-left" size={22} color={colors.white} />
                            </TouchableOpacity>
                            <Image
                                style={styles.image}
                                source={require("../../assets/signin_logo.png")}
                                resizeMode="contain"
                            />
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("TelecallerProfile")}>
                            <Feather name="user" size={22} color={colors.white} style={{ backgroundColor: 'rgba(241, 235, 235, 0.24)', padding: 4, borderRadius: 16 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.twocards}>
                        <View style={styles.salecard}>
                            <Text style={styles.saleText}>Sales Today</Text>
                            <Text style={styles.rupeText}>{'\u20B9'}0</Text>
                        </View>
                        <View style={styles.salecard}>
                            <Text style={styles.saleText}>Payments</Text>
                            <Text style={styles.rupeText}>{'\u20B9'}0</Text>
                        </View>
                    </View>

                </View>
                <View style={[{ paddingHorizontal: 8, gap: 10 }]}>

                    <View style={styles.orderContainer}>
                        <TouchableOpacity style={styles.AddCard} onPress={() => navigation.navigate("AddOrder")}>
                            <Text style={[commonstyles.redbuttonText]}>Add Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.AddCard} onPress={() => navigation.navigate("SaleAddCustomer")}>
                            <Text style={[commonstyles.redbuttonText]}>Add Customer</Text>
                        </TouchableOpacity>

                    </View>

                    <View>
                        <Text style={styles.title}>Target Information</Text>
                        <View>
                            <FlatList
                                data={FlatListData}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 5 }}
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>Data Not  Found</Text>
                                    </View>
                                )}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={[commonstyles.card, styles.alinement]}>
                                            <View style={[commonstyles.row, { width: '100%' }]}>
                                                <Text style={commonstyles.header2}>{item.type}</Text>
                                                <Text style={commonstyles.header2}>{item.ml}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(3) }}>
                                                <View style={[commonstyles.smallcard]}>
                                                    <Text style={[commonstyles.text2,]}>Assigned Target</Text>
                                                    <Text style={[commonstyles.text7]}>{item.assigned}</Text>
                                                </View>
                                                <View style={[commonstyles.smallcard, styles.green]}>
                                                    <Text style={[commonstyles.text2]}>Completed</Text>
                                                    <Text style={[commonstyles.text7]}>{item.completed}</Text>
                                                </View>
                                                <View style={[commonstyles.smallcard, styles.balancecolor]}>
                                                    <Text style={styles.balance}>Balance</Text>
                                                    <Text style={styles.balance_text}>{item.balance}</Text>
                                                </View>
                                            </View>

                                            <View style={[commonstyles.row, { gap: 10 }]}>
                                                <TouchableOpacity style={[commonstyles.redbutton, { flex: 1 }]} onPress={() => navigation.navigate("AssigntoRsm")}>
                                                    <Text style={[commonstyles.redbuttonText]}>Assign to RSM</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[commonstyles.eyeBox]} onPress={() => navigation.navigate("TargetView")}>
                                                    <Eye />
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    )
                                }}
                            />
                        </View>
                    </View>



                    <View style={[commonstyles.card]}>
                        <View>
                            <Text style={[commonstyles.header1]}>Today's Work</Text>
                        </View>
                        <View style={[commonstyles.row, { flex: 1, justifyContent: 'space-between', width: '100%' }]}>
                            <View style={[commonstyles.smallcard, { borderWidth: 0 }]}>
                                <Text style={[commonstyles.header1, { color: '#155DFC', alignSelf: 'center' }]}>20</Text>
                                <Text style={[commonstyles.text5]}>Customers</Text>
                            </View>
                            <View style={[commonstyles.smallcard, { borderWidth: 0 }]}>
                                <Text style={[commonstyles.header1, { color: colors.simplegreen, alignSelf: 'center' }]}>0</Text>
                                <Text style={[commonstyles.text5]}>Completed</Text>
                            </View>
                            <View style={[commonstyles.smallcard, { borderWidth: 0 }]}>
                                <Text style={[commonstyles.header2, { alignSelf: 'center' }]}>20</Text>
                                <Text style={[commonstyles.text5]}>Pending</Text>
                            </View>
                        </View>
                        < TouchableOpacity style={[commonstyles.redbutton, { width: '100%' }]} onPress={() => navigation.navigate("DeliveryRoutes")}>
                            <Text style={[commonstyles.redbuttonText]}>View Route</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[commonstyles.card, { marginHorizontal: 10 }]}>
                    <View>
                        <Text style={[commonstyles.header1]}>Assigned Stock</Text>
                    </View>
                    <View style={[commonstyles.row, { width: '100%' }, { paddingBottom: responsiveHeight(1) }]}>
                        <Text style={[commonstyles.waterText]}>20L Can</Text>
                        <Text style={[commonstyles.amountText]}>150</Text>
                    </View>
                    <View style={[commonstyles.row, { width: '100%' }, { paddingBottom: responsiveHeight(1) }]}>
                        <Text style={[commonstyles.waterText]}>Bottles</Text>
                        <Text style={[commonstyles.amountText]}>300</Text>
                    </View>
                    <View style={[commonstyles.row, { width: '100%' }, { paddingBottom: responsiveHeight(1) }]}>
                        <Text style={[commonstyles.waterText]}>Others</Text>
                        <Text style={[commonstyles.amountText]}>50</Text>
                    </View>
                </View>


                {/* QUICK ACTIONS - All 4 in one row */}

                <View style={[styles.card, { marginHorizontal: 10 }]}>
                    <Text style={styles.cardTitle}>Quick Actions</Text>
                    <View style={styles.actionsRow}>
                        {/* onPress={() => navigation.navigate('SaleAddExpense')}  */}
                        <Action icon="cash-plus" label="Add Expense" color="rgba(243, 232, 255, 1)" onPress={() => navigation.navigate('AddExpenseScreen')} />
                        <Action icon="backup-restore" label="Returns" color="rgba(220, 252, 231, 1)" onPress={() => navigation.navigate("ReturnSumary")} />
                        <Action icon="file-document-outline" label="Daily Closing" color="rgba(255, 237, 212, 1)" onPress={() => navigation.navigate("SaleDailyReports")} />
                    </View>
                </View>

            </View>
        </ScrollView>
    )
};
const Action = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <View style={[styles.actionIcon, { backgroundColor: color }]}>
            <Icon name={icon} size={rf(3)} color="#000" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: colors.white,
        gap: 24,

    },
    firstcontainer: {
        backgroundColor: colors.commoncolor,
        // height: 230,
        flex: 3.5 / 12,
        paddingBottom: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,

    },
    actionBox: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: "500",
        textAlign: "center",
    },
    actionItem: {
        alignItems: 'center',
        width: rw(20), // Reduced slightly to fit 4 comfortably (4 x 20% = 80%, leaves margins)
        // No marginBottom needed since it's single row
    },

    actionIcon: {
        width: rw(14),
        height: rw(14),
        borderRadius: rw(2),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: rh(1),
    },

    actionLabel: {
        fontSize: rf(1.5),
        textAlign: 'center',
        color: '#333',
    },
    banerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginHorizontal: 12,

    },
    image: {
        height: 120,
        width: 120,
    },
    ImageContainer: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 12,
    },
    twocards: {
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 8,
        gap: 12,
    },
    salecard: {
        backgroundColor: colors.smallgray,
        flex: 0.5,
        borderRadius: 8,
        alignItems: 'flex-start',
        gap: 4,
        padding: 16,
        paddingHorizontal: 8
    },
    saleText: {
        fontFamily: fonts.sfregular,
        color: colors.white,
        fontWeight: '400',
        fontSize: 16,
    },
    rupeText: {
        fontFamily: fonts.sfbold,
        fontWeight: '700',
        color: colors.white,
        fontSize: 20,
    },
    orderContainer: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 10
    },
    AddCard: {
        backgroundColor: colors.commoncolor,
        flex: 0.5,
        padding: 16,
        borderRadius: 8,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: rw(6),
        marginBottom: rh(2),
        elevation: 3,
    },

    cardTitle: {
        fontSize: rf(2.2),
        fontWeight: '600',
        marginBottom: rh(2),
        color: '#222',
        // paddingleft
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Evenly spaces all 4 items
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
    title: {
        color: colors.simpleblack,
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        paddingHorizontal: 12,
    },
})
export default SalesOrder;