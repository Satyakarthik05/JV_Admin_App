import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { DeletePurchase, GetAllPurchaseData } from "../../redux/reducers/MasterLogin/AddProduct";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";



const PurchaseData = () => {
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
            await dispatch(GetAllPurchaseData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await dispatch(GetAllPurchaseData()).unwrap();
                setLoading(false);
            }
            fetchData();

        }, [dispatch])
    )

    const { GetPurchase } = useSelector((state) => state.GetPuchaseData);
    console.log("All About Purchase Data in UI Page----------->", GetPurchase);

    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDelete = (id) => {
        console.log("id---->", id);

        Alert.alert(
            "Delete the Category", "Are You Sure To Delete The Purchase Data",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await dispatch(DeletePurchase(id)).unwrap();
                        dispatch(GetAllPurchaseData());
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

    console.log("Logined User Data async storege in Raw material Master-------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";



    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.top}>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Purchase Data</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("addpurchase")}>
                    <Text style={styles.btn_text}>Purchase</Text>
                </TouchableOpacity> */}
            </SafeAreaView>

            <View style={[styles.buttonRow,isAdmin && { justifyContent: 'flex-end' }]}>
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("addpurchase")} >
                            <Text style={styles.btn_text}> Add Purchase</Text>
                        </TouchableOpacity>
                    )
                }


                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SupplierData")}>
                    <Text style={styles.btn_text}>Supplier Information</Text>
                </TouchableOpacity>
            </View>


            <View>
                {
                    loading ? (
                        <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            <ProductSkeleton />
                        </View>
                    ) : (
                        <FlatList
                            data={GetPurchase}
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 2 }}

                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}

                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("productsoverview", { Purchaseitems: item?.items })}>
                                        <View style={styles.top}>
                                            <Text style={styles.text}><Text style={styles.in}>SupplierName:</Text>{item.supplierName}</Text>
                                            <Text style={[item.status === 1 ? styles.status : styles.rejected]}>{item.status === 1 ? "Active" : "InActive"}</Text>
                                        </View>
                                        <Text style={styles.text} ><Text style={styles.in}>PurchaseCode:</Text> {item.purchaseCode}</Text>
                                        <Text style={styles.text}><Text style={styles.in}>InvoiceNumber:</Text>{item.invoiceNumber}</Text>
                                        <Text style={styles.text} ><Text style={styles.in}>Purchase Date:</Text> {formatDate(item.purchaseDate)}</Text>
                                        <View style={styles.top}>
                                            <Text style={styles.text}><Text style={styles.in}>TotalAmount</Text> {item.totalAmount}</Text>
                                            {
                                                !isAdmin && (
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                        <TouchableOpacity onPress={() => navigation.navigate("EditpurchaseScreen", { purchaseData: item })}>
                                                            <Feather name="edit" size={18} color="#00AD41" />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                                            <Feather name="trash" size={18} color="red" />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }

                                        </View>
                                        {/* <View style={styles.for_row}>
                                    {item.accessories.map((acc, i) => (

                                        <View style={styles.down}>
                                            <Text style={styles.main}>Product {i+1}</Text>
                                            <Text style={styles.text}><Text style={styles.in}>Material: </Text>{acc.materialname}</Text>
                                            <Text style={styles.text}><Text style={styles.in}>Purchase Cost: </Text>{acc.cost}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Text style={styles.text}><Text style={styles.in}>Units: </Text>{acc.units}</Text>
                                                <Text style={styles.text}><Text style={styles.in}>Quantity: </Text>{acc.Accqty}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View> */}
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
        justifyContent: 'space-between'
    },
    for_row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    down: {
        width: '48%',        // 👈 two items per row
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
        paddingVertical: 12,
        borderRadius: 8,
        width: 120,
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
    status: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
    },
    rejected: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },


})
export default PurchaseData;