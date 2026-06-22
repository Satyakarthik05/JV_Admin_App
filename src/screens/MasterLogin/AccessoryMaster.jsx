import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, Text, View, FlatList, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { DeleteAccessoriesCall, GetAccessoriesInAcc } from "../../redux/reducers/MasterLogin/AddProduct";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import { responsiveHeight } from "react-native-responsive-dimensions";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";








const AccessoryMaster = () => {
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
            await dispatch(GetAccessoriesInAcc()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };




    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await dispatch(GetAccessoriesInAcc()).unwrap();
                setLoading(false);
            };
            fetchData()

        }, [dispatch])
    )
    const { GetAccessoryData } = useSelector((state) => state.GetAccessoriesGetCall);
    console.log("Get Accessories Data------------>", GetAccessoryData);



    const handleDelete = (id) => {
        console.log("id---->", id);

        Alert.alert(
            "Delete the Accessories", "Are You Sure To Delete The Accessories",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await dispatch(DeleteAccessoriesCall(id)).unwrap();
                        dispatch(GetAccessoriesInAcc());
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

    console.log("Logined User Data async storege in Accessory master Screen  --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";

    return (
        <View style={styles.container}>

            <View sec_1>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Accessory Master</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <View style={styles.Button}>
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.btns} onPress={() => navigation.navigate("AddAccessory")} >
                            <Text style={styles.text}>Add New</Text>
                        </TouchableOpacity>
                    )
                }


                <TouchableOpacity style={styles.btns} onPress={() => navigation.navigate("InventoryControlData")}>
                    <Text style={styles.text}>{ isAdmin ? "Inventory Data" : "Add Inventory" }</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btns} onPress={() => navigation.navigate("AddedAccCategory")}>
                    <Text style={styles.text}>{isAdmin ? "Accessory Type Data" : "Add accessory type" }</Text>
                </TouchableOpacity>
            </View>



            <View style={styles.flatlist_data}>
                {
                    loading ? (
                        <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            <ProductSkeleton />
                        </View>
                    ) : (
                        <FlatList
                            data={GetAccessoryData}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}

                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}

                            contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 2 }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AccessoryInventoryControl", { GetAccessoriesData: item })}>
                                        <View style={styles.for_flex}>
                                            <View style={styles.sec_2}>
                                                {/* <Image source={{ uri:item.imageUrl}} style={styles.img} /> */}
                                                <Image source={{ uri: item.imageUrl || item.image }} style={styles.img} />
                                            </View>
                                            <View style={styles.sec_3}>
                                                <View style={styles.status}>
                                                    <Text style={styles.name}>{item.accessoryName}</Text>
                                                    <Text style={[item.status === 1 ? styles.active : styles.rejected]}>{item.status === 1 ? "Active" : "InActive"}</Text>
                                                </View>
                                                <Text style={styles.poo2}>{item.accessoryCode}</Text>
                                                <View style={styles.icons}>
                                                    <Text style={styles.poo2}>{item.accessoryType}</Text>
                                                    {
                                                        !isAdmin && (
                                                            <View style={styles.right_icons}>
                                                                <TouchableOpacity onPress={() => navigation.navigate("EditAccessory", { editAccessory: item })}>
                                                                    <Feather name="edit" size={18} color="#00AD41" />
                                                                </TouchableOpacity>

                                                                <TouchableOpacity style={styles.eye} onPress={() => handleDelete(item.id)}>
                                                                    <Feather name="trash" size={18} color="#EF3D3B" />
                                                                </TouchableOpacity>

                                                            </View>
                                                        )
                                                    }

                                                </View>
                                            </View>
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
        paddingHorizontal: 10,
        flexDirection: 'column',
        gap: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    Button: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        //flexWrap: 'wrap',   
        //gap:responsiveHeight(3),
    },
    sec_3: {
        flex: 1,
        marginLeft: 10,
    },
    btns: {
        // backgroundColor: colors.commoncolor,
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingTop: 16,
        // paddingBottom: 16,
        // paddingLeft: 8,
        // paddingRight: 8,
        // alignContent: 'center',
        // borderRadius: 8,

        backgroundColor: colors.commoncolor,
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
    },
    status_btn: {
        color: colors.btntextgreen,
        backgroundColor: colors.btnbggreen,
        padding: 5,
        borderRadius: 4,
    },
    text: {
        // fontSize: 14,
        // fontWeight: 700,
        // color: colors.white,
        // paddingLeft: 5,

        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',


    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    eye: {
        marginRight: 8,
    },
    img: {
        height: 80,
        width: 74,
        resizeMode: 'contain',
    },
    name: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.simpleblack,
    },
    poo2: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.graynew,
        fontFamily: fonts.sfmedium,
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    right_icons: {
        flexDirection: 'row',
        marginLeft: 'auto',
        gap: 5,
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
    active: {
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
})
export default AccessoryMaster
