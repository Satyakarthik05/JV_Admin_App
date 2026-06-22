
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { TakenData, GetProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
import { useDispatch, useSelector } from "react-redux";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import CardsContainsSkelton from "../../components/CardsContainsSkelton";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");
const ProductsTakenData = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { tab, data } = route.params || {};
    console.log("Summary Data name and phno coming through params------------->", data);

    const [activeTab, setActiveTab] = useState(tab || "given");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState(null);
    const { data: loginData } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", loginData);


    // useFocusEffect(
    //     useCallback(() => {
    //         const vendorName = data?.vendorName
    //         const contactNumber = data?.contactNumber
    //         if (vendorName && contactNumber) {
    //             const payload = { vendorName, contactNumber }
    //             dispatch(TakenData(payload))

    //         }
    //     }, [data])
    // );

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                const vendorName = data?.vendorName;
                const contactNumber = data?.contactNumber;
                if (vendorName && contactNumber) {
                    const payload = { vendorName, contactNumber };
                    await dispatch(TakenData(payload)).unwrap();
                }
                setLoading(false);
            };
            fetchData();
        }, [data])
    );


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const vendorName = data?.vendorName;
            const contactNumber = data?.contactNumber;

            if (vendorName && contactNumber) {
                const payload = { vendorName, contactNumber };
                await dispatch(TakenData(payload)).unwrap();
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            dispatch(GetProductsInMaster())
        }, [dispatch])
    );


    const { GetProductData } = useSelector((state) => state.GetProductsInPM);
    console.log("GetProducts Data Taken Products Data Page ----------------------->", GetProductData);


    const { PostDataGetTakenData } = useSelector((state) => state.GetTakenData);
    console.log("post name and contack no then get Products Taken Get Data------->", PostDataGetTakenData);

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            // hour12: true
        });
    };

    const getProductName = (productId) => {
        const product = GetProductData?.find(
            (item) => item.id === productId
        );
        return product ? product.productName : "Unknown";
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

    console.log("Logined User Data async storege in Raw material Products taken Data--------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    //*********************************** Taken Data ****************************************//

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 30, gap: responsiveHeight(2) }}   >
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" />
                        <View style={{ flexDirection: 'column', gap: 2 }}>
                            <Text style={commonstyles.title}>{data?.vendorName} </Text>
                            <Text style={styles.first}>{data?.contactNumber}</Text>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>

                {/* Tabs */}
                <View style={styles.btns}>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            activeTab === "given" && styles.activeButton
                        ]}
                        //onPress={() => { setActiveTab("given"), navigation.navigate("rawmaterialstransfer" ) }}
                        onPress={() => { setActiveTab("given"), navigation.navigate("rawmaterialGiven", { summaryData: data }) }}

                    >
                        <Text style={[styles.buttonText, activeTab === "given" && styles.activeText]} > Material Given</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { marginRight: 0 }, activeTab === "taken" && styles.activeButton]} onPress={() => setActiveTab("taken")} >
                        <Text style={[styles.buttonText, activeTab === "taken" && styles.activeText]} > Material Taken</Text>
                    </TouchableOpacity>

                </View>

                {/* Row 1 */}
                <View style={styles.for_gap}>

                    <View style={styles.top}>
                        <Text style={styles.buttonText}>
                            Total Given :
                            <Text style={styles.value}> {data?.givenKg}</Text>
                        </Text>
                    </View>

                    <View style={[styles.top, { marginRight: 0 }]}>
                        <Text style={styles.buttonText}>
                            Total Received :
                            <Text style={styles.value}> {data?.received}</Text>
                        </Text>
                    </View>

                </View>

                {/* Row 2 */}
                <View style={styles.for_gap}>

                    <View style={styles.top}>
                        <Text style={styles.buttonText}>Expected Bottles : <Text style={styles.value}> {data?.expected}</Text> </Text>
                    </View>

                    <View style={[styles.top, { marginRight: 0 }]}>
                        <Text style={styles.buttonText}>Remaining :<Text style={styles.value}> {data?.remaining}</Text></Text>
                    </View>

                </View>

                {/* History */}
                <View style={styles.history}>
                    <Text style={styles.historyText}>HISTORY</Text>

                    <View style={styles.flat_list} >
                        {
                            !PostDataGetTakenData || PostDataGetTakenData.length === 0 ?
                                (
                                    //  No Data
                                    <View style={styles.noDataContainer}>
                                        <Text style={styles.noDataText}>No Data Found</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={PostDataGetTakenData}
                                        keyExtractor={item => item.id}
                                        contentContainerStyle={{ paddingHorizontal: 2 }}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                            />
                                        }
                                        showsVerticalScrollIndicator={false}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={styles.card}  >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Text style={styles.buttonText}>{formatDateTime(item.receiveDate)}</Text>
                                                        <Text style={styles.title}>{getProductName(item.productId)}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        {/* <Text style={styles.title_2}>{item.type}</Text> onPress={() => navigation.navigate("RawmaterialTransferItems")}*/}
                                                        <Text style={styles.title}>Recived</Text>
                                                        <Text style={styles.buttonText}>ReceivedQty: <Text style={styles.green}> {item.receivedQty}</Text></Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        {/* <Text style={styles.title_2}>Balance Output :<Text style={styles.title}>{item.balancopt}</Text></Text> */}
                                                        {/* <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                                                <TouchableOpacity onPress={() => navigation.navigate("Editmaterialtransfer")}>
                                                    <Feather name="edit" size={18} color="#00AD41" />
                                                </TouchableOpacity>
                                                <TouchableOpacity >
                                                    <Feather name="trash" size={18} color="red" />
                                                </TouchableOpacity>
                                            </View> */}
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                )
                        }
                    </View>
                </View>



                {/* Addmaterialtransfer */}

            </ScrollView>

            {
                !isAdmin && (
                    <View style={styles.bottomBtnContainer}>
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => navigation.navigate("ProductsTaken", { namePhno: data })}
                        >
                            <Text style={styles.addBtnText}>+ Add Taken Material</Text>
                        </TouchableOpacity>
                    </View>
                )
            }


        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingHorizontal: 12,
        // gap: responsiveHeight(2),
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        gap: 8
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    green: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.homegreen,
        fontFamily: fonts.sfbold,
    },
    title_2: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.black,
        fontFamily: fonts.sfmedium,
    },
    first: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.formtitlegry,
        fontFamily: fonts.sfregular,
    },

    btns: {
        flexDirection: 'row',
    },
    card: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 12,
        padding: 12,
        gap: 8,
        marginBottom: responsiveHeight(2),
    },

    button: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.white,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: colors.white
    },

    buttonText: {
        color: colors.black,
        fontWeight: '500',
        fontSize: 14,
        fontFamily: fonts.sfmedium,
    },

    activeButton: {
        backgroundColor: colors.commomcolorlight,
        borderColor: colors.commoncolor,
    },

    activeText: {
        color: colors.commoncolor,
        fontWeight: '800',
        fontSize: 14,
        fontFamily: fonts.sfbold
    },

    for_gap: {
        flexDirection: 'row',
    },

    top: {
        flex: 1,
        alignItems: 'center',
        //paddingVertical: 10,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: colors.white,
    },

    value: {
        fontSize: 18,
        fontFamily: fonts.sfbold,
        color: colors.black,
        fontWeight: '800'
    },

    history: {
        marginTop: 10,
    },

    historyText: {
        fontSize: 16,
        fontFamily: fonts.sfbold,
        color: colors.black,
        paddingBottom: responsiveHeight(2),
        paddingLeft: responsiveHeight(1),
    },
    btn: {
        backgroundColor: colors.commoncolor,
        width: width * 0.38,
        borderRadius: 8,
        alignSelf: 'flex-end',
        marginTop: 10,
        marginBottom: 10,
    },
    btn_text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        textAlign: 'center',
        paddingTop: 14,
        paddingBottom: 14,

    },


    bottomBtnContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },

    addBtn: {
        backgroundColor: colors.commoncolor, // red like screenshot
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 8,
        elevation: 5,
    },

    addBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: fonts.sfbold,
    },

    noDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },

    noDataText: {
        fontSize: 16,
        color: colors.black,
        fontFamily: fonts.sfmedium,
    },


})

export default ProductsTakenData;
