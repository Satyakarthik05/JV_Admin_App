import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { GetRawMaterialTransferData } from "../../redux/reducers/MasterLogin/AddProduct";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import AccountsSkeleton from "../../components/AccountsSkeleton";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");
const Rawmaterialtransfer = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("given");//"given"
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

    // useFocusEffect(
    //     useCallback(() => {
    //         setActiveTab("given"); // reset to default when coming back
    //         dispatch(GetRawMaterialTransferData())
    //     }, [])
    // );// when we come back then it was in taken active to prevent it  to show default given add this 


    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    await dispatch(GetRawMaterialTransferData()).unwrap();
                } catch (e) {
                    console.log(e);
                }
                setLoading(false);
            };
            setActiveTab("given");
            fetchData();
        }, [dispatch])
    );



    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetRawMaterialTransferData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    const { GetTransferData } = useSelector((state) => state.GetSummary);
    console.log("GetSummary Data --------------------->", GetTransferData);

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

    console.log("Logined User Data async storege in Raw materila transer home screen ------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    //******************************************Home Page Of Raw Matewrial Transfer *******************************//

    return (
        <View style={styles.container}>
            <View style={styles.sec_1}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView style={styles.headerContainer}>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.navigate("master")}>
                        <Feather name="arrow-left" size={20} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Raw Materials Transfer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("CopackersData")}>
                        <Text style={styles.addBtnText}>{isAdmin ? "Copackers Data " : "Add Copackers"}</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>


            {/* <View style={styles.btns}>

                <TouchableOpacity
                    style={[
                        styles.button,
                        activeTab === "given" && styles.activeButton
                    ]}
                    onPress={() => setActiveTab("given")}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            activeTab === "given" && styles.activeText
                        ]}
                    >
                        Material Given
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        { marginRight: 0 },
                        activeTab === "taken" && styles.activeButton
                    ]}
                    onPress={() => {
                        setActiveTab("taken")
                        navigation.navigate("TakenData", { tab: "taken" });
                    }}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            activeTab === "taken" && styles.activeText
                        ]}
                    >
                        Material Taken
                    </Text>
                </TouchableOpacity>

            </View> */}



            <View style={styles.sec_2}>
                {
                    loading ? (

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
                    ) : (
                        <FlatList
                            data={GetTransferData}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 100 }}
                            //refresh Controllers
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("rawmaterialGiven", { summaryData: item })}>
                                        {/* onPress={() => navigation.navigate("rawmaterialGiven")} */}
                                        <View style={styles.top}>
                                            <Text style={styles.boat}>{item.vendorName}</Text>
                                            <Text style={styles.phno}>Given</Text>
                                        </View>
                                        <View style={[styles.top,]}>
                                            <Text style={styles.phno}>Expected:<Text style={styles.boat}>{item.expected}</Text></Text>
                                            <Text style={styles.title}>{item.givenKg}</Text>
                                        </View>
                                        <View style={styles.top_border}>
                                            <Text style={styles.phno}>Received:</Text>
                                            <Text style={styles.phno}>Remaining:</Text>
                                        </View>
                                        <View style={styles.top}>
                                            <Text style={[styles.title, { color: colors.homegreen }]}>{item.received}</Text>
                                            <Text style={[styles.title, { color: colors.commoncolor }]}>{item.remaining}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    )
                }
            </View>

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
        paddingHorizontal: 12,
    },
    top_border: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.inputfieldborder,
        marginTop: 10,   // space above border only
        paddingTop: 6,   // small space between border and text
    },
    title: {
        fontSize: 15,
        fontWeight: 700,
        color: colors.black,
        //marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop: 10,
        flex: 1,
    },
    sec_2: {
        flex: 1,
        //paddingTop: responsiveHeight(3),
    },
    view: {
        fontSize: 12,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.commoncolor,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    sec_1: {
        marginBottom: 10,
    },

    boat: {
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },
    phno: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.graynew,
    },
    card: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',

        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: responsiveHeight(2),
        marginTop: responsiveHeight(1),
    },




    //for top btns
    btns: {
        flexDirection: 'row',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },


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
        marginLeft: 10, // instead of gap
    },

    addBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        fontFamily: fonts.sfbold,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },


})
export default Rawmaterialtransfer;