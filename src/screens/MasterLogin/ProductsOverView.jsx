import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { GetRawCategories } from "../../redux/reducers/MasterLogin/AddCategory";
import { GetStock } from "../../redux/reducers/MasterLogin/AddProduct";
import { responsiveHeight } from "react-native-responsive-dimensions";
//******************************************Purchhase Items Here Not Product Items*********************************************************//
const ProductsOverView = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { Purchaseitems } = route.params;
    console.log("Items-------->", Purchaseitems);

    const [refreshing, setRefreshing] = useState(false);

    

    // Simple refresh function (doesn't fetch anything)
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500); // just show loader briefly
    };

    useFocusEffect(
        useCallback(() => {
            dispatch(GetRawCategories())
        }, [])
    )



    const { GetRawCategory } = useSelector((state) => state.GetAllRawCategy);
    console.log("All Raw Category Data ----------------------->", GetRawCategory);

    const getCategoryName = (item) => {
        // if category already exists, use it
        if (item.category) return item.category;

        // else find from categoryId
        const found = GetRawCategory?.find(
            cat => cat.id === item.categoryId    
        );

        return found?.categoryName || "N/A";
    };



    return (

        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={styles.head} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Purchase Items</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                data={Purchaseitems}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 100 }}

                // to refresh
                refreshing={refreshing}      //  loader on pull
                onRefresh={onRefresh}

                renderItem={({ item }) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.for_flex}>
                                <Text style={styles.category}>{getCategoryName(item)}</Text>
                                <Text style={styles.category} >{item.rawMaterialCode}</Text>
                            </View>
                            <View style={styles.for_flex} >
                                <Text style={styles.units_text} ><Text style={styles.units_text}>Total Price :</Text>{item.totalPrice}</Text>
                                <View style={[styles.for_flex, { gap: 10 }]}>
                                    {/* <Text style={styles.units}><Text style={styles.units_text}>Units :</Text>{item.units}</Text>
                            <Text style={styles.units} ><Text style={styles.units_text}>Quantity :</Text> {item.qty}</Text> */}
                                    {/* <View>
                                        <Text style={styles.units_text} >Units</Text>
                                        <Text style={styles.units}>{item.unitPrice}</Text>
                                    </View> */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                                        <Text style={styles.units_text} >Quantity:</Text>
                                        <Text style={styles.units}>{item.quantity}</Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                    )
                }}
            />
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: colors.black,
        marginLeft: 10,
        fontFamily: fonts.sfbold,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,

        shadowRadius: 6,
        elevation: 4,
        marginBottom: 5,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,

    },
    category: {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.foundationgray,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    units: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,
        textAlign: 'center',
    },
    units_text: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },
})
export default ProductsOverView