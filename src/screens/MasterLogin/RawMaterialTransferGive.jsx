
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { GivenData } from "../../redux/reducers/MasterLogin/AddProduct";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AccountsSkeleton from "../../components/AccountsSkeleton";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { height, width } = Dimensions.get("window");
const RawMaterialTransferGive = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { tab } = route.params || {};
    const [activeTab, setActiveTab] = useState(tab || "given");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

    const { summaryData } = route.params;
    console.log("Summary Data goning throgh params -------------------->", summaryData);


    // useFocusEffect(
    //     useCallback(() => {
    //         setActiveTab("given"); // reset to default when coming back
    //         const vendorName = summaryData?.vendorName
    //         const contactNumber = summaryData?.contactNumber
    //         if (vendorName && contactNumber) {
    //             const payload = { vendorName, contactNumber }
    //             dispatch(GivenData(payload))

    //         }
    //     }, [summaryData])
    // );// when we come back then it was in taken active to prevent it  to show default given add this

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);

                const vendorName = summaryData?.vendorName;
                const contactNumber = summaryData?.contactNumber;

                if (vendorName && contactNumber) {
                    const payload = { vendorName, contactNumber };
                    await dispatch(GivenData(payload)).unwrap();
                }

                setLoading(false);
            };

            fetchData();
            setActiveTab("given");

        }, [summaryData])
    );


    //refrsh controller function
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);

        try {
            const vendorName = summaryData?.vendorName;
            const contactNumber = summaryData?.contactNumber;

            if (vendorName && contactNumber) {
                const payload = { vendorName, contactNumber };
                await dispatch(GivenData(payload)).unwrap();
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
        setLoading(false);
    };





    const { PostDataGetData } = useSelector((state) => state.GetGivenData);
    console.log("Raw Material Transfer Given Data-------------->", PostDataGetData);

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

    console.log("Logined User Data async storege in Raw material given--------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    //******************************************Given Data ************************************************/

    return (
        <View style={styles.container} >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 30, gap: responsiveHeight(2) }}   >
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.navigate("rawmaterialstransfer")}>
                        <Feather name="arrow-left" size={24} color="#000" />
                        <View style={{ flexDirection: 'column', gap: 2 }}>
                            <Text style={commonstyles.title}>{summaryData?.vendorName} Given Data </Text>
                            <Text style={styles.first}>{summaryData?.contactNumber}  </Text>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>


                <View style={styles.btns}>
                    <TouchableOpacity style={[styles.button, activeTab === "given" && styles.activeButton]} onPress={() => setActiveTab("given")} >
                        <Text style={[styles.buttonText, activeTab === "given" && styles.activeText]} >  Material Given </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { marginRight: 0 },
                            activeTab === "taken" && styles.activeButton
                        ]}
                        onPress={() => { setActiveTab("taken"), navigation.navigate("TakenData", { tab: "taken", data: summaryData }) }}
                    >
                        <Text style={[styles.buttonText, activeTab === "taken" && styles.activeText]} >Material Taken</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.for_gap}>
                    <View style={styles.top}>
                        <Text style={styles.buttonText}>
                            Total Given :
                            <Text style={styles.value}> {summaryData?.givenKg}</Text>
                        </Text>
                    </View>

                    <View style={[styles.top, { marginRight: 0 }]}>
                        <Text style={styles.buttonText}>
                            Total Received :
                            <Text style={styles.value}> {summaryData?.received}</Text>
                        </Text>
                    </View>
                </View>


                <View style={styles.for_gap}>
                    <View style={styles.top}>
                        <Text style={styles.buttonText}>
                            Expected Bottles :
                            <Text style={styles.value}>{summaryData?.expected}</Text>
                        </Text>
                    </View>
                    <View style={[styles.top, { marginRight: 0 }]}>
                        <Text style={styles.buttonText}>
                            Remaining :
                            <Text style={styles.value}> {summaryData?.remaining}</Text>
                        </Text>
                    </View>
                </View>


                <View style={styles.history}>
                    <Text style={styles.historyText}>HISTORY</Text>
                    <View style={styles.flat_list} >
                        {
                            loading ? (
                                // <View style={{flex:1,backgroundColor:"#fff"}}>
                                //     <SkeletonPlaceholder/>
                                // </View>
                                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                                    <FlatList
                                        data={[1, 2, 3, 4, 5, 6, 7]}
                                        // keyExtractor={(item) => item.toString()}
                                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                                        contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}
                                        renderItem={() => <AccountsSkeleton />}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )
                                : PostDataGetData?.length === 0 ? (
                                    <View style={styles.noDataContainer}>
                                        <Text style={styles.noDataText}>No Data Found</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={PostDataGetData}
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
                                                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("RawmaterialTransferItems", { items: item.items })} >
                                                    <Text style={styles.buttonText}>Date:{formatDateTime(item.transferDate)}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Text style={styles.title_2}>VendorName: {item.vendorName}</Text>
                                                        <Text style={styles.green}>{item.qty}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Text style={styles.title_2}>Contact Number: {item.contactNumber}</Text>
                                                        {
                                                            !isAdmin && (
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                                    <TouchableOpacity onPress={() => navigation.navigate("Editmaterialtransfer", { EditGivenData: item })}>
                                                                        <Feather name="edit" size={18} color="#00AD41" />
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


            </ScrollView>


            {
                !isAdmin && (
                    <View style={styles.bottomBtnContainer}>
                        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("Addmaterialtransfer")} >
                            <Text style={styles.addBtnText}>+ Add Raw Material</Text>
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
    // btn: {
    //     backgroundColor: colors.commoncolor,
    //     width: width * 0.38,
    //     borderRadius: 8,
    //     alignSelf: 'flex-end',
    //     marginTop: 10,
    //     marginBottom: 10,
    // },
    // btn_text: {
    //     color: colors.white,
    //     fontSize: 14,
    //     fontWeight: 700,
    //     fontFamily: fonts.sfbold,
    //     textAlign: 'center',
    //     paddingTop: 14,
    //     paddingBottom: 14,

    // },


    bottomBtnContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },

    addBtn: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 8,
        elevation: 5,
    },

    addBtnText: {
        color: colors.white,
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
        color: colors.graynew,
        fontFamily: fonts.sfmedium,
    },

})

export default RawMaterialTransferGive;
