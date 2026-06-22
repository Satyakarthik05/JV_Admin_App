import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, FlatList, ScrollView, Linking, Alert, ActivityIndicator } from "react-native";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from "react-redux";
import { DeleteLead, GetLeads } from "../../redux/reducers/TelecallerLogin/AddCallers";
//import TelecallerSkeleton from "../../components/TelecallerSkeleton";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import commonstyles from "../../commonstyles/commonstyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");
const Telecaller = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading, setLoadaing] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);



    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetLeads()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor);
            StatusBar.setBarStyle("light-content");
            const fetchData = async () => {
                setLoadaing(true);
                await dispatch(GetLeads()).unwrap();
                setLoadaing(false);
            }
            fetchData();

        }, [])
    )
    const { GetLeadsData } = useSelector((state) => state.GetTelecallerLeads);
    console.log("All About  Telecaller Leads Data-------->", GetLeadsData);


    const handleDelete = (id) => {
        Alert.alert(
            "Delete the Lead", "Are You Sure To Delete The Lead ",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    //onPress:()=>dispatch(DeleteCategory(id))
                    onPress: async () => {
                        await dispatch(DeleteLead(id)).unwrap();
                        dispatch(GetLeads());
                    }
                }
            ],
            { cancelable: true }
        )

    }


    const totalLeads = GetLeadsData?.length || 0;

    const pendingFollowUps = GetLeadsData?.filter(
        item => item.leadStatus === "New"
    ).length || 0;

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

    console.log("Logined User Data async storege in Telecaller login home  Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <StatusBar translucent backgroundColor="#EF3D3B" barStyle="light-content" /> */}
                <View style={styles.top}>
                    <TouchableOpacity style={styles.starting_names} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={30} color="#fff" style={styles.arrow} />
                        <Image source={require('../../assets/signin_logo.png')} style={styles.img_header} />
                    </TouchableOpacity>
                    {
                        !isAdmin && (
                            <TouchableOpacity onPress={() => navigation.navigate("TelecallerProfile")}>
                                <Feather name="user" size={24} color="#fff" style={styles.icon} />
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>

            <View style={styles.positionabsolute}>
                <View style={[styles.top, { gap: 10, }]}>

                    <View style={[styles.for_Blocks, { backgroundColor: colors.lightskyblue }]}>
                        <Text style={[styles.number, { color: colors.homeblue }]}>{totalLeads}</Text>
                        <Text style={[styles.Text, { color: colors.black }]}>Total Leads</Text>
                    </View>

                    <View style={[styles.for_Blocks, { backgroundColor: colors.commomcolorlight }]}>
                        <Text style={[styles.number, { color: colors.homedarkyellow }]}>{pendingFollowUps}</Text>
                        <Text style={[styles.Text, { color: colors.black }]}>Pending Follow-Ups</Text>
                    </View>

                </View>
            </View>
            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
                <View style={styles.buttons_sec}>

                    {
                        !isAdmin && (
                            <View style={styles.top}>
                                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("addlead")}>
                                    <Text style={styles.btn_text}>Add New</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ImportLeads")}>
                                    <Text style={styles.btn_text}>Import Leads</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }



                    <View style={styles.top}>
                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("QuestionsAns")}>
                            <Text style={styles.btn_text}>Question & Answers</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("followupReport")}>
                            <Text style={styles.btn_text}>Follow-UP</Text>
                        </TouchableOpacity>

                    </View>

                    {/* <View style={styles.top}>
                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("AddedSale")}>
                            <Text style={styles.btn_text}>Add Sale</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("FollowUps")}>
                            <Text style={styles.btn_text}>Add Follow-UP</Text>
                        </TouchableOpacity>
                        
                    </View> */}
                </View>


                <Text style={styles.Title}>Total Leads</Text>

                <View style={styles.cards_begin}>
                    {
                        loading ? (
                            // <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            // <ProductSkeleton/>
                            // </View>
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color={colors.commoncolor} />
                            </View>
                        ) : (
                            <FlatList
                                data={GetLeadsData}
                                keyExtractor={item => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 50 }}
                                // to refresh
                                refreshing={refreshing}      //  loader on pull
                                onRefresh={onRefresh}

                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("LeadDetails", { TotalData: item })}>
                                            <View style={styles.top}>
                                                <Text style={styles.name}>{item.customerName}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                                    <Text style={commonstyles.active}>{item.leadStatus}</Text>
                                                    {
                                                        !isAdmin && (
                                                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                                                <Feather name="trash" size={16} color="red" />
                                                            </TouchableOpacity>
                                                        )
                                                    }

                                                </View>
                                            </View>
                                            <Text style={styles.phno}>{item.mobileNumber}</Text>
                                            <Text style={styles.location}>{item.address}</Text>
                                            {/* <Text style={styles.location}>Last Call: <Text style={styles.phno}>{item.date}</Text></Text> */}

                                            <View style={styles.top}>

                                                {
                                                    !isAdmin && (
                                                        <TouchableOpacity style={[styles.btn, { paddingVertical: 8 }]} onPress={() => navigation.navigate("Calllogdetails", { LeadData: item })}>
                                                            <Text style={styles.btn_text}>Call Logs</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }



                                                <TouchableOpacity style={[styles.btn, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 8 }]} onPress={() => Linking.openURL(`tel:${item.mobileNumber}`)}>
                                                    <Feather name="phone" size={14} color="#fff" />
                                                    <Text style={styles.btn_text}>  Call Now</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.icons} onPress={() => Linking.openURL(`whatsapp://send?phone=${item.mobileNumber}`)}>
                                                    <FontAwesome name="whatsapp" size={16} color="#39AE41" />
                                                </TouchableOpacity>

                                                {
                                                    !isAdmin && (
                                                        <TouchableOpacity style={styles.icons} onPress={() => navigation.navigate("EditLead", { editlead: item })}>
                                                            <Feather name="edit" size={16} color="#39AE41" />
                                                        </TouchableOpacity>
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


            </ScrollView>

        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    icons: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        padding: 8,
        borderRadius: 5,
    },
    main: {
        flex: 1,
        paddingHorizontal: 12,
        marginTop: height * 0.1 + 5,
    },
    card: {
        backgroundColor: colors.white,
        padding: 10,
        flexDirection: 'column',
        gap: 5,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    img_header: {
        height: 39,
        width: 168,
        resizeMode: 'contain',
    },
    positionabsolute: {
        position: 'absolute',
        top: 110,
        left: 15,
        paddingHorizontal: 12,
    },
    starting_names: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrow: {
        marginRight: 10,
    },
    status_converted: {
        color: colors.btntextgreen,
        backgroundColor: colors.btnbggreen,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        padding: 6,
        borderRadius: 4,
    },
    New: {
        color: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        padding: 6,
        borderRadius: 4,
    },
    header: {
        backgroundColor: colors.commoncolor,
        height: 130,
        paddingTop: 35,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 15,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    icon: {
        backgroundColor: colors.hrhomeprofile,
        padding: 9,
        borderRadius: 22,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        flex: 1,
        paddingVertical: 16
    },
    call_btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bt_text: {
        color: colors.white,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        fontSize: 14,
        textAlign: 'center',
        paddingLeft: 5,
    },
    btns_text: {
        color: colors.white,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        fontSize: 14,
        textAlign: 'center',
    },
    btn_text: {
        color: colors.white,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        fontSize: 14,
        textAlign: 'center',
    },
    buttons_sec: {
        flexDirection: 'column',
        gap: 8,
    },

    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
    },
    for_Blocks: {
        height: height * 0.1,
        width: width * 0.4,
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 16,
        paddingleft: 16,
        borderRadius: 8,
        alignItems: 'center',

    },
    number: {
        fontSize: 22,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.homeblue
    },
    Text: {
        fontSize: 14,
        fontFamily: fonts.sfmedium,
        fontWeight: 500,
        color: colors.black,
    },
    Title: {
        fontSize: 20,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        color: colors.black,
        marginTop: 20,
    },
    name: {
        fontSize: 16,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        color: colors.black,
    },
    phno: {
        fontSize: 14,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,
        fontWeight: 500,
    },
    location: {
        fontSize: 12,
        fontFamily: fonts.sfmedium,
        fontWeight: 500,
        color: colors.graynew,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
    },


})
export default Telecaller;