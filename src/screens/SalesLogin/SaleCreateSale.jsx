import React, { useCallback } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import Entypo from "react-native-vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";


const SaleCreateSale = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )


    const products = [
        {
            id: "1",
            name: "20L Water Can",
            price: 70,
            available: 498,
            image: require("../../assets/watercan.png")
        },
        {
            id: "2",
            name: "20L Water Can",
            price: 70,
            available: 498,
            image: require("../../assets/watercan.png")
        },
        {
            id: "3",
            name: "20L Water Can",
            price: 70,
            available: 498,
            image: require("../../assets/watercan.png")
        },
        {
            id: "4",
            name: "20L Water Can",
            price: 70,
            available: 498,
            image: require("../../assets/watercan.png")
        },
        {
            id: "5",
            name: "20L Water Can",
            price: 70,
            available: 498,
            image: require("../../assets/watercan.png")
        },
        {
            id: "6",
            name: "20L Water Can",
            price: 70,
            available: 498,
            image: require("../../assets/watercan.png")
        }
    ]
    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <View>
                    <Image source={item.image} style={styles.image} />
                </View>

                {/* details */}
                <View style={styles.details}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>{'\u20B9'} {item.price}</Text>
                    <Text style={styles.available}>Available: {item.available}</Text>
                </View>

                {/* Qty + total */}
                <View style={styles.rightsection}>
                    <View style={styles.qtyContainer}>
                        <TouchableOpacity style={styles.qtyBtn}>
                            <Text>-</Text>
                        </TouchableOpacity>
                        <Text>1</Text>
                        <TouchableOpacity style={styles.qtyBtn}>
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.total}>{'\u20B9'} 150</Text>
                </View>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.ListContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.ListText}>Create Sale</Text>
                    <Text>Sai Kiran Store</Text>
                </View>

            </View>

            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />


            {/*  Search Bar */}
            <View style={styles.searchContainer}>
                <EvilIcons name="search" size={22} color="#888" />
                <TextInput placeholder="Search item here...." placeholderTextColor="#888" style={styles.searchInput} />
            </View>


            <View style={{ flex: 1 }}>
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30, marginVertical: 12 }}
                    ListFooterComponent={
                        <View>
                            <TouchableOpacity style={styles.returnContainer}>
                                <Entypo name="circle" size={22} color="#EF3D3B" />
                                <Text>With Can Return</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.returnContainer}>
                                <Entypo name="circle" size={22} color="#bfbfbf" />
                                <Text>Without Can Return</Text>
                            </TouchableOpacity>

                            <View style={styles.Cashback}>
                                <Text style={styles.offerText}>10% Cashback Offer Applied</Text>
                                <Text style={styles.offeravailable}>Offer Available</Text>
                            </View>

                            <View style={styles.OfferContainer}>
                                <TouchableOpacity style={styles.ApplayBtn}>
                                    <Text style={{ fontSize: 12, color: colors.black, fontFamily: fonts.sfmedium, fontWeight: '800' }}>Apply Offer</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.RemoveBtn}>
                                    <Text style={{ fontSize: 12, color: colors.black, fontFamily: fonts.sfmedium, fontWeight: '800' }} >Remove Offer</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.paymentContainer}>
                                <View>
                                    <Text style={styles.QtyText}>
                                        Qty:<Text style={styles.ItemText}> 6 Items</Text>
                                    </Text>
                                    <Text style={styles.totalamount}>Estimated Total: {'\u20B9'} 780</Text>
                                </View>


                                <TouchableOpacity style={styles.paymentBtn} onPress={() => navigation.navigate("SalePayment")}>
                                    <Text style={styles.paymentText}>Payment</Text>
                                </TouchableOpacity>
                            </View>



                        </View>

                    }
                />
            </View>



        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // borderWidth:2,
        backgroundColor: colors.white,
    },
    ListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 16,
        marginVertical: 18,
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
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 14,
        marginHorizontal: 10,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    details: {
        flex: 1,
        marginLeft: 10,
        gap: 8,
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000",
    },
    price: {
        color: "#16A34A",
        fontWeight: "600",
        marginTop: 4,
    },
    available: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 2,
    },
    rightsection: {
        alignItems: "flex-end",
        // justifyContent: "space-between",
    },
    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        marginTop: 10,
        borderRadius: 8,
    },
    qtyBtn: {
        paddingHorizontal: 13,
        paddingVertical: 7,
    },
    qtyText: {
        fontSize: 20,
        fontWeight: "600",
    },
    qtyNumber: {
        paddingHorizontal: 10,
        fontSize: 14,
        fontWeight: "600",
    },
    total: {
        color: "#E11D48",
        fontWeight: "700",
        marginTop: 6,
        alignSelf: 'center',
    },
    returnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        padding: 14,
        gap: 8,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },
    Cashback: {
        borderWidth: 1,
        borderColor: '#00A63E',
        height: responsiveHeight(5),
        width: responsiveWidth(95),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DEFFEB',
        borderRadius: 8,
        marginHorizontal: 8,
        position: 'relative',
        marginVertical: 10,
    },
    offerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#151D2F'
    },
    offeravailable: {
        position: 'absolute',
        top: -8,
        left: 12,
        backgroundColor: '#EF3D3B',
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        overflow: 'hidden'
    },
    OfferContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginVertical: 18,
        //    alignItems:'center'
    },
    ApplayBtn: {
        borderWidth: 1,
        width: responsiveWidth(30),
        height: responsiveHeight(4),
        backgroundColor: '#FFF6F6',
        borderColor: '#EF3D3B',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'

    },
    RemoveBtn: {
        borderWidth: 1,
        width: responsiveWidth(30),
        height: responsiveHeight(4),
        backgroundColor: '#FFF6F6',
        borderColor: '#EF3D3B',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    paymentBtn: {
        backgroundColor: '#EF3D3B',
        height: responsiveHeight(5),
        width: responsiveWidth(33),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    QtyText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#4A5565'
    },
    ItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101828',
    },
    totalamount: {
        color: '#EF3D3B',
        fontSize: 14,
        fontWeight: '400'
    },
    paymentText: {
        color: '#fff'
    },
    searchContainer: {
    borderWidth:1,
    borderColor: colors.inputfieldborder,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 45,
},
searchInput: {
    flex: 1,
    marginLeft: 6,
    color: "#000",
    fontSize: 14,
},


})
export default SaleCreateSale;