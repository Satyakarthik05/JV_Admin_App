import React, { useCallback, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { GetAccessoryCategoryData } from "../../redux/reducers/MasterLogin/AddCategory";
import { GetAccessoriesInAcc } from "../../redux/reducers/MasterLogin/AddProduct";

const AccessoriesOverView = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { inventoryData } = route.params;
    console.log("Inventory Data ----->", inventoryData);

    const [refreshing, setRefreshing] = useState(false);



    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetAccessoriesInAcc()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    useFocusEffect(
        useCallback(() => {
            dispatch(GetAccessoryCategoryData())//acc type
            dispatch(GetAccessoriesInAcc())//Name of Accessori
        }, [dispatch])
    )


    const { GetAccCategory } = useSelector((state) => state.GetAccessoryCategory);
    console.log("Get Acc Categories---------->", GetAccCategory);

    const { GetAccessoryData } = useSelector((state) => state.GetAccessoriesGetCall);
    console.log("Get Accessories Data------------>", GetAccessoryData);

    //for Accessories type
    const getAccessoryTypeName = (id) => {
        const found = GetAccCategory?.find(item => item.id === id);
        return found ? found.accessoryType : "N/A";
    };

    //for Accessori Name 
    const getAccessoryName = (id) => {
        const found = GetAccessoryData?.find(item => item.id === id);
        return found ? found.accessoryName : "N/A";
    };



    return (

        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={styles.head} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Accessories Items</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                data={inventoryData}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 100 }}
                // to refresh
                 refreshing={refreshing}      //  loader on pull
                 onRefresh={onRefresh}  

                renderItem={({ item }) => {
                    return (
                        <View style={styles.card}>
                            {/* <View style={styles.for_flex}>
                                <Text style={styles.category}>{getAccessoryTypeName(item.accessoryTypeId)}</Text>
                                <Text style={styles.category} >{getAccessoryName(item.accessoryId)}</Text>
                            </View>
                            <View style={styles.for_flex}>
                                <Text style={styles.units}><Text style={styles.units_text}>Units :</Text>{item.units}</Text>
                                <Text style={styles.units} ><Text style={styles.units_text}>Quantity :</Text> {item.quantity}</Text>
                            </View> */}

                            <View>
                                 <Text style={styles.category}><Text style={styles.units_text}>Accessory Type: </Text>{getAccessoryTypeName(item.accessoryTypeId)}</Text>
                                <Text style={styles.category} ><Text style={styles.units_text}>Accessory Name: </Text>{getAccessoryName(item.accessoryId)}</Text>
                                <Text style={styles.units} ><Text style={styles.units_text}>Quantity :</Text> {item.quantity}</Text>
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
    },
    units_text: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },
})
export default AccessoriesOverView