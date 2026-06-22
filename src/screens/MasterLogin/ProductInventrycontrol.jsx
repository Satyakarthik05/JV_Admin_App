import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { GetStock } from "../../redux/reducers/MasterLogin/AddProduct";
import commonstyles from "../../commonstyles/commonstyles";



const ProductInventrycontrol = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { GetProductsdata } = route.params;
    console.log("Get Products Data in params-------->", GetProductsdata);
    const id = GetProductsdata.id;
    const [refreshing, setRefreshing] = useState(false);



    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            if (id) {
                await dispatch(GetStock(id)).unwrap();
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };


    useEffect(() => {
        if (id) {
            dispatch(GetStock(id))
        }
    }, [id])

    const { stockData } = useSelector((state) => state.GetProductStockData);
    console.log("All About stock Data------->", stockData);
    const stock = stockData?.[0];

    const balanceQuantity =
        (stock?.openingStock || 0)
        - (stock?.saleQuantity || 0)
        - (stock?.damageQuantity || 0)
        + (stock?.returnedQuantity || 0);


    return (
        <View style={styles.container}>
            <View >
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Product Inventory Control</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>


            <View style={styles.sec_1}>
                <View style={styles.for_flex}>
                    <Text style={styles.name}>{GetProductsdata?.productName}</Text>
                    <Text style={styles.btn}>{GetProductsdata?.status === 1 ? "Active" : "InActive"}</Text>
                </View>
                <Text style={styles.details}>{GetProductsdata?.productCode}</Text>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.commoncolor]}   // Android
                        tintColor={colors.commoncolor}  // iOS
                    />
                }
                contentContainerStyle={{ paddingBottom: 20 }} // optional spacing
            >

                <View style={styles.sec_2}>
                    <View style={[styles.card, { backgroundColor: colors.lightskyblue, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Opening Stock</Text>
                        <Text style={styles.name}>{stock?.openingStock}</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.lightskyblue, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Current Stock</Text>
                        <Text style={styles.name}>{stock?.currentStock}</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.lightredcolor, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Sale Quantity</Text>
                        <Text style={styles.name}>{stock?.saleQuantity}</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.lightskyblue, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Balance Quantity</Text>
                        <Text style={styles.name}>{balanceQuantity}</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.lightredcolor, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Damage Quantity</Text>
                        <Text style={styles.name}>{stock?.damageQuantity}</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.lightredcolor, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Returned Quantity</Text>
                        <Text style={styles.name}>{stock?.returnedQuantity}</Text>
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        flexDirection: 'column',
        alignContent: 'center',
        gap: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    sec_2: {
        flexDirection: 'column',
        alignContent: 'center',
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfmedium,
    },
    sec_1: {
        borderWidth: 1,
        borderColor: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        paddingTop: 12,
        paddingBottom: 12,
        paddingleft: 16,
        paddingRight: 16,
        borderRadius: 12,
        paddingHorizontal: 5,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    btn: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
    },
    details: {
        color: colors.graynewversion,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
        paddingleft: 16,
        paddingRight: 16,
        borderRadius: 12,
        paddingHorizontal: 5,

    },
})
export default ProductInventrycontrol