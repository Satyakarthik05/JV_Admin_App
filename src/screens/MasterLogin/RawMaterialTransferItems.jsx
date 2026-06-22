import React, { useCallback, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { GetAllRawMaterialData } from "../../redux/reducers/MasterLogin/AddProduct";
import { GetRawCategories, GetUnitsData } from "../../redux/reducers/MasterLogin/AddCategory";
import commonstyles from "../../commonstyles/commonstyles";

const RawMaterialTrasferItems = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const { items } = route.params;
    console.log("Item----------------------> routes Dtata", items);

    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            dispatch(GetAllRawMaterialData())
            dispatch(GetUnitsData());
            dispatch(GetRawCategories())
        }, [])
    )

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetAllRawMaterialData()).unwrap();
            await dispatch(GetUnitsData()).unwrap();
            await dispatch(GetRawCategories()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    const { GetRawMaterialData } = useSelector((state) => state.GetRawMaterialsData);
    console.log("Get Raw Material data in Raw Material Transfer Given Data itms  Screen -->", GetRawMaterialData);

    const { UnitsData } = useSelector((state) => state.GetUnitsRawMaster);
    console.log("Units Data---->", UnitsData);

    const { GetRawCategory } = useSelector((state) => state.GetAllRawCategy);
    console.log("GetRaw Categories data  raw material items ------------------>", GetRawCategory);



    const getMaterialName = (materialId) => {
        const material = GetRawMaterialData?.find(
            (item) => item.id === materialId
        );
        return material ? material.rawMaterialName : "Unknown";
    };

    const getUnitName = (unitId) => {
        const unit = UnitsData?.find(item => item.id === unitId);
        return unit ? unit.unitName : "Unknown";
    };

    const getCategoryName = (item) => {
        //Case 1: category exists → use it directly
        if (item.category && item.category.trim() !== "") {
            return item.category;
        }

        // Case 2: category empty → use categoryId
        const found = GetRawCategory?.find(cat => cat.id === item.categoryId);
        return found ? found.categoryName : "Unknown";
    };





    return (

        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Raw Materials Transfer Items</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                data={items}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item }) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.for_flex}>
                                <Text style={styles.category}>{getCategoryName(item)}</Text>
                                <Text style={styles.category} >{item.rawMaterialName}</Text>
                            </View>
                            <View style={styles.for_flex}>
                                <Text style={styles.units}><Text style={styles.units_text}>Units :</Text>{item.unitOfMeasure}</Text>
                                <Text style={styles.units} ><Text style={styles.units_text}>Quantity :</Text> {item.qty}</Text>
                            </View>
                            <View style={styles.for_flex}>
                                <Text style={styles.units}><Text style={styles.units_text}>Wastage :</Text>{item.wastagePercent}</Text>
                                <Text style={styles.units} ><Text style={styles.units_text}>Conversion Ratio :</Text> {item.conversionRatio}</Text>
                            </View>
                            <View style={styles.for_flex}>
                                <Text style={styles.units}><Text style={styles.units_text}>Usable Quantity :</Text>{item.usableQty}</Text>
                                <Text style={styles.units} ><Text style={styles.units_text}>Expected Output :</Text> {item.expectedOutput}</Text>
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
export default RawMaterialTrasferItems