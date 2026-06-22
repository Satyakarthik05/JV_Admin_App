import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, FlatList, Alert } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import { DeleteAssignRouteData, GetAssignedCustomers } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import AccountsSkeleton from "../../components/AccountsSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AssignRoute = () => {
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
            await dispatch(GetAssignedCustomers()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };




    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            // dispatch(GetAssignedCustomers())

            const fetchData = async () => {
                setLoading(true);
                await dispatch(GetAssignedCustomers()).unwrap();
                setLoading(false);
            }
            fetchData();
        }, [dispatch])
    )



    const { GetAssignRouteData } = useSelector((state) => state.AllRoutesInAssignRoute);
    console.log("Get All Routes For Assigned Customer Data -------------------------------->", GetAssignRouteData);




    const handleDelete = (routeId) => {
        console.log("id---->", routeId);

        Alert.alert(
            "Delete the Route", "Are You Sure To Delete Route",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await dispatch(DeleteAssignRouteData(routeId)).unwrap();
                        dispatch(GetAssignedCustomers());
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

    console.log("Logined User Data async storege in Accounts Login  Assign Route Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";



    return (
        <View style={styles.container}>
            <SafeAreaView style={[styles.top, { marginBottom: 10, }]} >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Assign Route</Text>
                </TouchableOpacity>
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddAssignedDriver")}>
                            <Feather name="plus" size={14} color="#fff" style={styles.arrow} />
                            <Text style={styles.btn_text}>  Add New</Text>
                        </TouchableOpacity>
                    )
                }

            </SafeAreaView>


            <View style={styles.body}>
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
                            data={GetAssignRouteData}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}
                            showsVerticalScrollIndicator={false}

                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}

                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AssignCustomer", { ParamsData: item?.routeId, CustomerData: item.customers })}>
                                        <View style={styles.top}>
                                            <Text style={styles.code}>{item?.driver?.name}</Text>
                                            <Text style={styles.code}>{item.driver.empCode}</Text>
                                        </View>
                                        <View style={styles.top}>
                                            <Text style={styles.phno}>{item.driver.mobileNumber}</Text>
                                            <Text style={styles.phno}>{item.routeName}</Text>
                                        </View>
                                        
                                        {
                                            !isAdmin && (
                                                <View style={{ flexDirection: 'row', gap: 15, alignSelf: 'flex-end' }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate("EditAssignDriver", { EditData: item, ParamsData: item?.routeId })}>
                                                        <Feather name="edit" size={18} color="#00AD41" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => handleDelete(item.routeId)}>
                                                        <Feather name="trash" size={18} color="#EF3D3B" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }

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
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 13,
        shadowRadius: 6,
        elevation: 4,
        // marginleft:10,
        // marginRight:10,
        marginBottom: 5,
        marginTop: 5,
        flexDirection: 'column',
        gap: 5,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: {
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
    button: {
        backgroundColor: colors.commoncolor,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 8,
        width: 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_text: {
        fontSize: 12,
        fontWeight: 700,
        color: colors.white,
        fontFamily: fonts.sfbold,
    },
    code: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    phno: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.formtitlegry,
        fontFamily: fonts.sfmedium,
    },
})
export default AssignRoute