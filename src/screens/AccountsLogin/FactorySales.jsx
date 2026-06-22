import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, TextInput } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Entypo from 'react-native-vector-icons/Entypo';
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from "react-redux";
import { GetFactorySaleData } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import AccountsSkeleton from "../../components/AccountsSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonstyles from "../../commonstyles/commonstyles";

const FactorySales = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState('');
    const [modal, setModal] = useState(false);
    const [showto, setShowto] = useState(false);
    const [todate, setTodate] = useState('');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(GetFactorySaleData("DIRECT"));
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         StatusBar.setBackgroundColor(colors.white)
    //         StatusBar.setBarStyle("dark-content");

    //         dispatch(GetFactorySaleData("DIRECT"))
    //         setFromdate('');
    //         setTodate('');
    //         console.log("RUNS Once TIME");
    //     }, [])
    // )

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            setLoading(true);
            dispatch(GetFactorySaleData("DIRECT"));
            setFromdate('');
            setTodate('');
            setTimeout(() => {
                setLoading(false);
            }, 1000);

        }, [])
    )


    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    };


    const Fromdatefun = (event, selected) => {
        setShowFrom(false);
        if (selected) {
            const formattedDate = formatDate(selected);
            setFromdate(formattedDate);
            console.log(formattedDate);
        }
    }

    const Todatefun = (event, toselected) => {
        setShowto(false);
        if (toselected) {
            const formattedDate = formatDate(toselected);
            setTodate(formattedDate);
            console.log(formattedDate);
        }
    }


    const { factorysalesData } = useSelector((state) => state.Factorysaledata);
    console.log("Factory sale data ------------------->", factorysalesData);

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

    console.log("Logined User Data async storege in Accounts Login  Factory Sales Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";



    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.top} >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Factory Sales</Text>
                </TouchableOpacity>

                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddSalesInFactorySales")}>
                            <Feather name="plus" size={14} color="#fff" style={styles.arrow} />
                            <Text style={styles.btn_text}>  Add New</Text>
                        </TouchableOpacity>
                    )
                }



            </SafeAreaView>

            <View style={[styles.top, { marginTop: 20 }]}>
                <Text style={styles.title} >All Sales</Text>
                <TouchableOpacity style={[styles.top, styles.for_border]} onPress={() => setModal(true)} activeOpacity={1}>
                    <Text style={styles.phno}>Apply Filter</Text>
                    <Ionicons name="funnel-outline" color="#727989" size={14} />
                </TouchableOpacity>
            </View>


            <View style={styles.body}>
                {
                    loading ? (
                        <FlatList
                            data={[1, 2, 3, 4, 5, 6, 7]}
                            // keyExtractor={(item) => item.toString()}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}
                            renderItem={() => <AccountsSkeleton />}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <FlatList
                            data={factorysalesData}
                            // keyExtractor={item => item.id}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}
                            showsVerticalScrollIndicator={false}

                            refreshing={refreshing}      //  pull loader
                            onRefresh={onRefresh}   //  refresh function

                            renderItem={({ item }) => {
                                return (
                                    // Factoryitemsdata { ItemsData: item }
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("FactorySalesOverView", { reportData: item })}>
                                        <View style={styles.top}>

                                            <Text style={styles.code}>{item.customerName}</Text>
                                            <Text style={styles.phno}>{item.customerMobile}</Text>
                                        </View>
                                        <View style={styles.top}>
                                            <Text style={styles.code}>{item.orderNo}</Text>
                                            {/* <View style={styles.for_flex}>
                                                <EvilIcons name="location" size={14} color="#EF3D3B" />
                                                <Text style={[styles.code, { color: colors.foundationgray }]}>{item.location}</Text>
                                                <Text style={styles.phno}>{item.route}</Text>
                                            </View> */}
                                        </View>
                                        <Text style={styles.phno}>Created Date: {new Date(item.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</Text>

                                        {isAdmin && (
                                            <View style={commonstyles.actionRow}>
                                                <TouchableOpacity style={commonstyles.approveBtn} >
                                                    <Text style={{ color:colors.black,fontWeight:'bold'}}>Approve</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={commonstyles.rejectBtn} >
                                                    <Text style={{ color:colors.black,fontWeight:'bold'}}>Reject</Text>
                                                </TouchableOpacity>
                                            </View>

                                        )}


                                    </TouchableOpacity>
                                )
                            }}
                        />
                    )
                }
            </View>

            {/* modal */}

            <Modal
                visible={modal}
                transparent
                animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <View style={styles.top}>
                            <Text style={[styles.title, { marginLeft: 0 }]}>Filters</Text>
                            <TouchableOpacity onPress={() => setModal(false)} >
                                <FontAwesome name="close" size={15} color="black" />
                            </TouchableOpacity>
                        </View>


                        <Text style={[styles.phno, { marginTop: 5, marginBottom: 5 }]}>Date Range</Text>
                        <View style={styles.searchBar_view}>
                            <View style={[styles.for_flex]}>
                                <TextInput value={fromdate} placeholder="From Date" editable={false} style={styles.name} placeholderTextColor="#888" />
                                {/* <Text style={styles.phno}>  to:  </Text> */}
                                <TextInput value={todate} placeholder="To Date" editable={false} style={styles.name} placeholderTextColor="#888" />
                            </View>
                            <View style={[styles.for_flex]}>
                                <TouchableOpacity onPress={() => setShowFrom(true)}>
                                    <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowto(true)}>
                                    <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                                </TouchableOpacity>
                            </View>
                        </View>


                        {/* dropdown optional for  factory  */}
                        {/* <View style={{ marginTop: 5, marginBottom: 5 }}>
                            <Text style={styles.phno}>Driver</Text>
                            <View style={styles.for_border_dropdown}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.placeholderStyle}
                                    itemTextStyle={styles.placeholderStyle}
                                    labelField="label"
                                    valueField="value"
                                    data={Driver}
                                    placeholder="Select Driver"
                                    value={driver}
                                    onChange={item => { setDriver(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View> */}



                    </View>
                </View>
            </Modal>

            {
                showfrom &&
                < DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={Fromdatefun}
                    maximumDate={new Date()}
                />
            }


            {
                showto &&
                < DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={Todatefun}
                    minimumDate={new Date()}
                />
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
        marginTop: 10,
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
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    for_border: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        padding: 5,
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



    //modal
    searchBar_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //marginTop: 20,

        borderWidth: 1.5,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        //paddingVertical: 10,
        //width: width * 0.89,
        marginRight: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        //flex:4/12,
        fontSize: 12,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    logoutBtn: {
        width: "100%",
        padding: 12,
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
    },
    logoutText: {
        color: colors.white,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfbold,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
        // padding:15,
        paddingTop: 15,
        // zIndex: 1000,
        paddingBottom: 15,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.inputfieldcolor,
        fontWeight: 500,
        paddingLeft: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    modalBox: {
        width: "80%",
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        //alignItems:"center",
        elevation: 10,
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
    

})
export default FactorySales