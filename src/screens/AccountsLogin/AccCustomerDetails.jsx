import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { GetData } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import commonstyles from "../../commonstyles/commonstyles";
import AccountsSkeleton from "../../components/AccountsSkeleton";


//-----------------------------Orde Details Screen ----------------------//
const AccCustomerDetails = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState({});

    const handleStatusChange = (id, status) => {
        setOrderStatus(prev => ({
            ...prev,
            [id]: status,
        }));
    };





    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content");
            const fetchData = async () => {
                try {
                    setLoading(true);
                    await dispatch(GetData()).unwrap(); // wait for API
                } catch (error) {
                    console.log("Error:", error);
                } finally {
                    setLoading(false); // stop loader AFTER API
                }
            };
            fetchData();
        }, [])
    );

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await dispatch(GetData()).unwrap();
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    };

    const { GetDistributorOrdersData } = useSelector((state) => state.GetOrdersData);
    console.log("Get Distributor  orders Data--------------------->", GetDistributorOrdersData);


    return (

        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={styles.head} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Order Details</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <View>
                {
                    loading ? (
                        <FlatList
                            data={[1, 2, 3, 4, 5, 6, 7]}
                            keyExtractor={(item) => item.toString()}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}
                            renderItem={() => <AccountsSkeleton />}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <FlatList
                            data={GetDistributorOrdersData}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 100 }}

                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}

                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AccCustomerDetailsItems", { itemData: item.items })}>
                                        <Text style={styles.category}>Order Number: {item.orderNumber}</Text>
                                        <Text style={styles.units_text}>Total Amount: {item.totalAmount}</Text>
                                        <Text style={styles.units_text}>Discount: {item.discount}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.units_text}>Final Amount: {item.finalAmount}</Text>
                                            <Text style={commonstyles.active}>{item.status}</Text>
                                        </View>


                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                            <TouchableOpacity style={commonstyles.approveBtn}>
                                                <Text style={{fontSize: 14,fontWeight: 700,fontFamily: fonts.sfmedium,color: colors.btntextgreen,}}>Approve</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={commonstyles.rejectBtn}>
                                                <Text style={{fontSize: 14,fontWeight: 700,fontFamily: fonts.sfmedium,color: colors.error,}} >Reject</Text>
                                            </TouchableOpacity>
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
export default AccCustomerDetails