import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { DeleteAccInvCall, GetAccessoriInventoryData } from "../../redux/reducers/MasterLogin/AddProduct";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";



const InventoryControlData = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);



    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetAccessoriInventoryData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };






    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await dispatch(GetAccessoriInventoryData()).unwrap();
                setLoading(false);
            }
            fetchData();

        }, [dispatch])
    )





    const { AccInventoryData } = useSelector((state) => state.GetAccessoriesInventory);
    console.log("Accessories Get Call Data-------->", AccInventoryData);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };


    const handleDelete = (id) => {
        console.log("id---->", id);

        Alert.alert(
            "Delete the Accessory Inventory", "Are You Sure To Delete Accessory Inventory",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await dispatch(DeleteAccInvCall(id)).unwrap();
                        dispatch(GetAccessoriInventoryData());
                    }

                }
            ],
            { cancelable: true }
        )

    }


    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        }
        loadUser();
    }, []);

    console.log("Logined User Data async storege in Inventory control Data --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";




    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.top}>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Inventory Control</Text>
                </TouchableOpacity>
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddInventoryControl")}>
                            <Text style={styles.btn_text}>Add Inventory Control</Text>
                        </TouchableOpacity>
                    )
                }

            </SafeAreaView>

            <View>
                {
                    loading ? (
                        <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            <ProductSkeleton />
                        </View>
                    ) : (
                        <FlatList
                            data={AccInventoryData}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 2 }}

                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}

                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AccessoryoverView", { inventoryData: item.items })}>
                                        <Text style={styles.text}><Text style={styles.in}>invoiceNumber:</Text> {item.invoiceNumber}</Text>
                                        <Text style={styles.text} ><Text style={styles.in}>Vendor Name:</Text> {item.vendorName}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.text}><Text style={styles.in}>PurchaseDate </Text>{formatDate(item.purchaseDate)}</Text>

                                            {
                                                !isAdmin && (
                                                    <View style={{ flexDirection: 'row', gap: 15 }}>
                                                        <TouchableOpacity onPress={() => navigation.navigate("EditInventoryControl", { editData: item })}>
                                                            <Feather name="edit" size={18} color="#00AD41" />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                                            <Feather name="trash" size={18} color="#EF3D3B" />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }

                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    )
                }



            </View>


        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    for_row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    down: {
        width: '48%',
        backgroundColor: colors.lightbordercolor,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
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
    main: {
        fontSize: 18,
        fontWeight: 800,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    button: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        //width: 120,
    },
    btn_text: {
        fontSize: 12,
        fontWeight: 700,
        color: colors.white,
        fontFamily: fonts.sfbold,
        textAlign: 'center',
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
    in: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },
    text: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.graynew,
    },
})
export default InventoryControlData;