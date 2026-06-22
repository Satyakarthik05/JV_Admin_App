import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { DeleteRawMaterial, GetAllRawMaterialData } from "../../redux/reducers/MasterLogin/AddProduct";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { GetRawCategories } from "../../redux/reducers/MasterLogin/AddCategory";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Rawmaterialsmaster = () => {
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
            await dispatch(GetAllRawMaterialData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await dispatch(GetAllRawMaterialData()).unwrap()
                await dispatch(GetRawCategories()).unwrap()
                setLoading(false);
            }
            fetchData();
        }, [dispatch])
    )

    const { GetRawMaterialData } = useSelector((state) => state.GetRawMaterialsData);
    console.log("Get Raw Material data in UI secreen -->", GetRawMaterialData);

    const { GetRawCategory } = useSelector((state) => state.GetAllRawCategy);
    console.log("GetRaw Categories data ------------------>", GetRawCategory);


    const handleDelete = (id) => {
        console.log("id---->", id);

        Alert.alert(
            "Delete the Raw Material", "Are You Sure To Delete  Raw Material",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await dispatch(DeleteRawMaterial(id)).unwrap();
                        dispatch(GetAllRawMaterialData());
                    }

                }
            ],
            { cancelable: true }
        )

    }


    // for some get data category name not coming for that based on category id and get call id i;m show its catName
    const getCategoryName = (item) => {

        // 1. If category already exists → use it
        if (item.category) return item.category;

        // 2. Else map using id (your assumption)
        const found = GetRawCategory?.find(
            cat => cat.id === item.id
        );

        return found?.categoryName || "N/A";
    };


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
            <View style={styles.sec_1}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Raw Materials Master</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <View style={[styles.btns,isAdmin && { flexWrap: 'nowrap', justifyContent: 'space-between' }]}>

                <TouchableOpacity style={[styles.btn,isAdmin && { width: 'auto', flex: 1, marginHorizontal: 4 }]} onPress={() => navigation.navigate("addedrawCategory")}>
                    <Text style={styles.btn_text}>{isAdmin ? "Categories Data " : "Add Category"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn,isAdmin && { width: 'auto', flex: 1, marginHorizontal: 4 }]} onPress={() => navigation.navigate("addedUnit")}>
                    <Text style={styles.btn_text}>{isAdmin ? "Units Data" : "Add Unit"}</Text>
                </TouchableOpacity>

                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("addrawmaterial")}>
                            <Text style={styles.btn_text}>Add New</Text>
                        </TouchableOpacity>
                    )
                }



                <TouchableOpacity style={[styles.btn,isAdmin && { width: 'auto', flex: 1, marginHorizontal: 4 }]} onPress={() => navigation.navigate("purchaseData")}>
                    <Text style={styles.btn_text}>{isAdmin ? "Purchase Data" : "Purchase"}</Text>
                </TouchableOpacity>

            </View>


            <View style={styles.sec_3}>
                {
                    loading ? (
                        <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            <ProductSkeleton />
                        </View>
                    ) : (
                        <FlatList
                            data={GetRawMaterialData}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 2, paddingTop: 5 }}

                            // to refresh
                            refreshing={refreshing} //  loader on pull
                            onRefresh={onRefresh}

                            renderItem={({ item }) => {
                                return (
                                    // onPress={() => navigation.navigate("RawMaterailProducts", { RawData: item.products })}
                                    <TouchableOpacity style={styles.card} >
                                        <View style={styles.for_flex}>
                                            <Text style={styles.name}>Name : {item.rawMaterialName}</Text>
                                            <Text style={styles.name}>{item.rawMaterialCode}</Text>
                                        </View>
                                        <Text style={styles.name}>  Unit Of Measurement: <Text style={styles.common} >{item.unitOfMeasure}</Text> </Text>
                                        {/* <Text style={styles.name}>  Category: <Text style={styles.common} >{item.category}</Text></Text> */}
                                        <Text style={styles.name}>  Category: <Text style={styles.common} >{getCategoryName(item)}</Text></Text>

                                        {/* <View style={styles.for_border}>
                                    <View style={styles.for_flex}>
                                        <Text style={styles.common}>Available</Text>
                                        <Text style={styles.common} >Used Quantity</Text>
                                    </View>
                                    <View style={styles.for_flex}>
                                        <Text style={[styles.common, { color: colors.btntextgreen }]}></Text>
                                        <Text style={[styles.common, { color: colors.simpleblack }]}>{item.kgs}</Text>
                                    </View>
                                </View> */}


                                        {
                                            !isAdmin && (
                                                <View style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2), paddingTop: responsiveHeight(1) }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate("EditRawMaterial", { EditData: item })}>
                                                        <Feather name="edit" size={20} color="#00AD41" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.eye} onPress={() => handleDelete(item.id)}>
                                                        <Feather name="trash" size={20} color="#EF3D3B" />
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
        backgroundColor: "#fff",
        paddingHorizontal: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    sec_1: {
        marginBottom: 10,
    },
    sec_3: {
        paddingTop: 5,
    },
    // btns: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     gap: 10,
    //     marginBottom: 10,
    // },
    // btn: {
    //     backgroundColor: colors.commoncolor,
    //     paddingTop: 16,
    //     paddingBottom: 16,
    //     paddingLeft: 25,
    //     paddingRight: 25,
    //     borderRadius: 8,
    // },


    btns: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    btn: {
        backgroundColor: colors.commoncolor,
        width: '48%',
        paddingVertical: 16,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },


    btn_text: {
        color: colors.white,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        fontSize: 14,
    },
    card: {
        backgroundColor: "#fff",
        // width: '32%',
        borderRadius: 16,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 6,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfmedium,
    },
    common: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.graynew,
    },
    for_border: {
        borderWidth: 1,
        borderColor: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        borderRadius: 8,
        paddingBottom: 5,
        paddingTop: 5,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        padding: 2,
    },

})
export default Rawmaterialsmaster