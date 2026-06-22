import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { DeleteUnitsData, GetUnitsData } from "../../redux/reducers/MasterLogin/AddCategory";
import commonstyles from "../../commonstyles/commonstyles";
import { DeleteSupplierInfo, GetSupplierInformationData } from "../../redux/reducers/MasterLogin/AddProduct";
import AsyncStorage from "@react-native-async-storage/async-storage";


const SupplierData = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);



    // to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetSupplierInformationData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };


    useFocusEffect(
        useCallback(() => {
            dispatch(GetSupplierInformationData())
        }, [dispatch])
    )


    const handleDelete = (id) => {
        Alert.alert(
            "Delete the Supplier", "Are You Sure To Delete  Supplier",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await dispatch(DeleteSupplierInfo(id)).unwrap();
                        dispatch(GetSupplierInformationData());
                    }
                }
            ],
            { cancelable: true }
        )
    }

    const { SupplierInfoData } = useSelector((state) => state.GetSupplierInfo);
    console.log("Get Supplier Information Data In UI Page ===============>", SupplierInfoData);

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
                    <Text style={commonstyles.title}>Supplier Information </Text>
                </TouchableOpacity>
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("addSupplierInfo")}>
                            <Text style={styles.btn_text}>Add Supplier</Text>
                        </TouchableOpacity>
                    )
                }

            </SafeAreaView>


            <View style={styles.body}>
                <FlatList
                    data={SupplierInfoData}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 2 }}

                    // to refresh
                    refreshing={refreshing}      //  loader on pull
                    onRefresh={onRefresh}

                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={styles.card} >
                                <View style={styles.top}>
                                    <Text style={styles.text}><Text style={styles.in}>Supplier Name: </Text>{item.supplierName}</Text>
                                    {/* <Text style={[item.status === "ACTIVE" ? commonstyles.active : commonstyles.inactive]}>{item.status}</Text> */}
                                </View>
                                <Text style={styles.text} ><Text style={styles.in}>Mobile Number: </Text> {item.contact}</Text>

                                {
                                    !isAdmin && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: responsiveHeight(2) }}>
                                            <TouchableOpacity onPress={() => navigation.navigate("editsupplierData", { EditData: item })}>
                                                <Feather name="edit" size={18} color="#00AD41" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                                <Feather name="trash" size={18} color="red" />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }



                            </TouchableOpacity>

                        )
                    }}
                />
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
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingTop: 10,
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
        paddingVertical: 10,
        borderRadius: 8,
        width: 120,
    },
    btn_text: {
        fontSize: 16,
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
    text: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.graynew,
    },
    in: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },





})
export default SupplierData