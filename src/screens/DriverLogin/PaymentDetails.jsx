import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import commonstyles from "../../commonstyles/commonstyles";

const PaymentDetails = () => {

    const navigation = useNavigation();

    const customerList = [
        {
            id: 1,
            name: 'Rajesh Kumar',
            amount: '2,500',
            shopname: 'kumar Genral Store',
            area: 'T.Nagar (b)',
            status: 'Online',
            time: '2:45 pm'
        },
        {
            id: 2,
            name: 'Rajesh Kumar',
            amount: '2,500',
            shopname: 'kumar Genral Store',
            area: 'T.Nagar (b)',
            status: 'Online',
            time: '2:45 pm'
        },
        {
            id: 3,
            name: 'Rajesh Kumar',
            amount: '2,500',
            shopname: 'kumar Genral Store',
            area: 'T.Nagar (b)',
            status: 'Online',
            time: '2:45 pm'
        },
        {
            id: 4,
            name: 'Rajesh Kumar',
            amount: '2,500',
            shopname: 'kumar Genral Store',
            area: 'T.Nagar (b)',
            status: 'Online',
            time: '2:45 pm'
        },

    ]
    const renderItem = ({ item }) => {
        return (
            <View style={styles.listCard}>
                <View style={styles.nameContainer}>
                    <Text style={styles.Customername}>{item.name}</Text>
                    <Text style={styles.Amount}>{'\u20B9'} {item.amount}</Text>
                </View>
                <View style={styles.shopContainer}>
                    <Text style={styles.shopname}>{item.shopname}</Text>
                    <View style={styles.locationContainer}>
                        <EvilIcons name="location" size={22} color="#EF3D3B" />
                        <Text style={styles.area}>{item.area}</Text>
                    </View>

                </View>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{item.status}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
            </View>
        )

    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <TouchableOpacity style={styles.ListContainer} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="#000" />
                <Text style={styles.ListText}>Payment Details</Text>
            </TouchableOpacity>

            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

            <TouchableOpacity style={styles.CustomerField}>
                <EvilIcons name="search" size={24} color="#99a1af" />
                <TextInput style={commonstyles.inputfield}  placeholder="Search Shop,owner,mobile"  placeholderTextColor='#6A7282' />
            </TouchableOpacity>


            <ScrollView>
                <View style={styles.card}>
                    <View style={styles.TotalAmountContainer}>
                        <View style={styles.collectedContainer}>
                            <FontAwesome name="rupee" size={18} color='#fff' />
                            <Text style={styles.collectedText}>Total Amount Collected</Text>
                        </View>
                        <TouchableOpacity style={styles.customerContainer}>
                            <Text style={commonstyles.text1}>20 customers</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.paymentText}>{'\u20B9'} 45,750</Text>
                    <View style={styles.miniCardContainer}>
                        <View style={styles.miniCard}>
                            <Text style={styles.paymentText}>{'\u20B9'} 28,500</Text>
                            <View style={{ flexDirection: 'row', alignItems: "center", gap: 8 }}>
                                <FontAwesome5 name="mobile" size={22} color="#fff" />
                                <Text style={styles.upiText} >UPI & Cards</Text>
                            </View>
                        </View>
                        <View style={styles.miniCard}>
                            <Text style={styles.paymentText}>{'\u20B9'} 17,250</Text>
                            <View style={{ flexDirection: 'row', alignItems: "center", gap: 8 }}>
                                <FontAwesome5 name="mobile" size={22} color="#fff" />
                                <Text style={styles.upiText} >Cash & payments</Text>
                            </View>
                        </View>

                    </View>
                </View>
                <View style={styles.card2}>
                    <View style={styles.pendingContainer} >
                        <Text style={styles.pendingText}>Total Pending Amount</Text>
                        <TouchableOpacity style={styles.customeropacity}>
                            <Text style={styles.customerText}>3 customers</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.rupeText}>{'\u20B9'}12,000</Text>
                </View>
                <View style={styles.card2}>
                    <View style={styles.pendingContainer} >
                        <Text style={styles.pendingText}>Expenses</Text>
                    </View>
                    <Text style={styles.rupeText}>{'\u20B9'}12,000</Text>
                </View>

                <FlatList
                    data={customerList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            </ScrollView>
            <TouchableOpacity style={styles.download}>
                <Text style={commonstyles.btnTextW}>Download PDF</Text>
            </TouchableOpacity>



        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
        // borderWidth:2,
    },
    ListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 16,
        marginVertical: 18,
    },
    ListText: {
        fontSize: 18,
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
        backgroundColor: "#EF4240",
        padding: 12,
        marginVertical: 12,
        borderRadius: 16,
        marginHorizontal: 10,
    },
    TotalAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    collectedContainer: {
        flexDirection: 'row',
        gap: 8,
        alignItems: "center"
    },
    customerContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#999999',
        paddintop: 4,
        paddingRight: 8,
        paddingBottom: 4,
        paddingLeft: 8,
        borderRadius: 12,
    },
    Rupesymbol: {
        color: '#ffffff',
        fontSize: 16,
        backgroundColor: '#d6cfcfff',
    },
    collectedText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff'
    },
    miniCardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 6,
    },
    miniCard: {
        backgroundColor: '#ba3333ff',
        //  borderWidth:1,
        width: responsiveWidth(40),
        height: responsiveHeight(9),
        marginVertical: 10,
        gap: 6,
        padding: 10,
        marginBottom: 10,
        borderRadius: 12,
    },
    paymentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginTop: 5,
    },
    upiText: {
        fontWeight: '500',
        fontSize: 12,
        color: '#fff',
    },
    card2: {
        backgroundColor: '#FFEDD4',
        padding: 8,
        gap: 5,
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    pendingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    customeropacity: {
        backgroundColor: '#F65E28',
        padding: 6,
        borderRadius: 12,
    },
    pendingText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#CA3500'
    },
    rupeText: {
        fontWeight: '400',
        fontSize: 14,
        color: '#CA3500'
    },
    customerText: {
        fontSize: 13, fontWeight: '500', color: '#ffffff'
    },
    listCard: {
        //  borderWidth:2,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        elevation: 4,
        marginVertical: 10,
        marginHorizontal: 14,
        marginBottom: 10,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    shopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    locationContainer: {
        flexDirection: 'row'
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 7
    },
    Customername: {
        fontSize: 14,
        fontWeight: 600,
        color: '#101828'
    },
    Amount: {
        fontSize: 14,
        fontWeight: 600,
        color: '#101828'
    },
    shopname: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6A7282'
    },
    download: {
        backgroundColor: '#EF3D3B',
        padding: 14,
        borderRadius: 8,
        marginHorizontal: 12,
        alignItems: 'center',
        marginBottom: 4,
    }
})
export default PaymentDetails;