import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { GetAccessoriesStockData } from "../../redux/reducers/MasterLogin/AddProduct";
import commonstyles from "../../commonstyles/commonstyles";



const AccessoryInventoryControl = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const { GetAccessoriesData } = route.params;
    console.log("Get Accessories Data in params->", GetAccessoriesData);
    const id = GetAccessoriesData.id;
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            if (id) {
                await dispatch(GetAccessoriesStockData(id)).unwrap();
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };


    useEffect(() => {
        if (id) {
            dispatch(GetAccessoriesStockData(id))
        }
    }, [id])

    const { AccessoriesStock } = useSelector((state) => state.GetAccessoriesStocksDataAll);
    console.log("All About stock Data------->", AccessoriesStock);
    const stock = AccessoriesStock?.[0];

    const balanceQuantity =
        (stock?.openingStock || 0)
        - (stock?.issuedQuantity || 0)
        - (stock?.damagedQuantity || 0)
        + (stock?.returnedQuantity || 0);


    return (
        <View style={styles.container}>
            <View>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Accessory Inventory Control</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>


            <View style={styles.sec_1}>
                <View style={styles.for_flex}>
                    <Text style={styles.name}>{GetAccessoriesData?.accessoryName}</Text>
                    <Text style={[GetAccessoriesData?.status === 1 ? styles.active : styles.inactive]}>{GetAccessoriesData?.status === 1 ? "Active" : "InActive"}</Text>
                </View>
                <Text style={styles.details}>{GetAccessoriesData?.accessoryCode}</Text>
            </View>

            <View style={styles.new_card}>
                <Text style={styles.details}>Asset Type</Text>
                <Text style={styles.name}>{GetAccessoriesData?.assetType}</Text>
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
                        <Text style={styles.details}>Issued Quantity</Text>
                        <Text style={styles.name}>{stock?.issuedQuantity}</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.lightskyblue, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Balance Quantity</Text>
                        <Text style={styles.name}>{balanceQuantity}</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.lightredcolor, borderWidth: 1, borderColor: colors.lightbordercolor }]}>
                        <Text style={styles.details}>Damage Quantity</Text>
                        <Text style={styles.name}>{stock?.damagedQuantity}</Text>
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
        fontFamily: fonts.sfbold,
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
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    active: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
    },
    inactive: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
        borderWidth: 1,
        borderColor: colors.commoncolor,
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
    },
    details: {
        color: colors.formtitlegry,
        fontFamily: fonts.sfmedium,
        fontSize: 16,
        fontWeight: 500,
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
    new_card: {

        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        // marginBottom: 10,
        // marginTop: 10,
    },
})
export default AccessoryInventoryControl