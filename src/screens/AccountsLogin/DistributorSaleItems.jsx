import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";



const DistributorSaleItems = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { ItemsData } = route.params;
    console.log("Items-------->", ItemsData);

    const [refreshing, setRefreshing] = useState(false);



    // Simple refresh function (doesn't fetch anything)
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500); // just show loader briefly
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
        }, [])
    )







    return (

        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={styles.head} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Distributor Sale Items</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                data={ItemsData.items}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 100 }}

                // to refresh
                refreshing={refreshing}      //  loader on pull
                onRefresh={onRefresh}

                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("DistributorSalesOverView",{reportData:ItemsData})}>
                            <Text style={styles.category}>{item.productName}</Text>
                            <Text style={styles.units_text}>Qunatity: {item.quantity}</Text>
                            <Text style={styles.units_text}>Rate: {item.rate}</Text>
                            <Text style={styles.units_text} >Total Amount:{item.amount}</Text>
                        </TouchableOpacity>
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
export default DistributorSaleItems