import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, FlatList, LogBox, Modal, TextInput } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetAssignStock } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AccountsSkeleton from "../../components/AccountsSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AssignedStock = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState('');
    const [showto, setShowto] = useState(false);
    const [todate, setTodate] = useState('');
    const [modal, setModal] = useState(false);
    const [driver, setDriver] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content");
            setLoading(true);
            dispatch(GetAssignStock());
            setFromdate('');
            setTodate('');
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(GetAssignStock());
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    const { StockData } = useSelector((state) => state.GetDriverStockData);
    console.log("StaockData------------------->", StockData);



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


    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("*********GetEmployess Data All Employess Data in  All sales for All Drivers Stock Screen **********", getEmpdata);

    // dropdown data for drivers data 
    const driverDropdownData = useMemo(() => {
        return getEmpdata
            ?.filter(emp => emp.roleName === "DRIVER")
            ?.map(emp => ({
                label: emp.name,
                value: emp.id,
            })) || [];
    }, [getEmpdata]);


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

    console.log("Logined User Data async storege in Accounts Login  Assign stock Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";



    return (
        <View style={styles.container}>
            <SafeAreaView style={[styles.top, { marginBottom: 10, }]} >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Assigned Stock</Text>
                </TouchableOpacity>
                {/* onPress={()=>navigation.navigate("AddAssignedDriver")}   onPress={()=>navigation.navigate("AssignCustomer")} */}

                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddSalesInSales")}>
                            <Feather name="plus" size={14} color="#fff" style={styles.arrow} />
                            <Text style={styles.btn_text}>  Add New</Text>
                        </TouchableOpacity>
                    )
                }

            </SafeAreaView>

            <View style={[styles.top, { marginTop: 10, marginBottom: 5 }]}>
                <Text style={styles.title} >All Stocks</Text>
                <TouchableOpacity style={[styles.top, styles.for_border]} onPress={() => setModal(true)} activeOpacity={1} >
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
                            data={StockData}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}
                            showsVerticalScrollIndicator={false}

                            // refresh controller 
                            refreshing={refreshing}
                            onRefresh={onRefresh}

                            renderItem={({ item }) => {
                                // "StockData", { ItemsData: item })
                                return (
                                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("SalesOverView", { reportData: item })}>
                                        <View style={styles.top}>
                                            <Text style={styles.code}>{item.name}</Text>
                                            <Text style={styles.code}>{item.vehicleNumber}</Text>
                                        </View>
                                        <View style={styles.top}>
                                            <Text style={styles.phno}>{item.mobileNumber}</Text>
                                            <Text style={styles.phno}>{item.vehicleName}</Text>
                                        </View>
                                        <Text style={styles.phno}>Stock Date: {new Date(item.stockDate).toLocaleDateString('en-GB').replace(/\//g, '-')}</Text>
                                        <View style={{ flexDirection: 'row', gap: 15, alignSelf: 'flex-end' }}>
                                            {/* onPress={() => navigation.navigate("EditDriverStock", { EditData: item })} */}
                                            {/* <TouchableOpacity >
                                                <Feather name="edit" size={18} color="#00AD41" />
                                            </TouchableOpacity>
                                            <TouchableOpacity >
                                                <Feather name="trash" size={18} color="#EF3D3B" />
                                            </TouchableOpacity> */}
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    )
                }
            </View>

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
                                <Text style={styles.phno}>  to:  </Text>
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


                        <View style={{ marginTop: 5, marginBottom: 5 }}>
                            <Text style={styles.phno}>Driver</Text>
                            <View style={styles.for_border_dropdown}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.placeholderStyle}
                                    itemTextStyle={styles.placeholderStyle}
                                    labelField="label"
                                    valueField="value"
                                    data={driverDropdownData}
                                    placeholder="Select Driver"
                                    value={driver}
                                    onChange={item => { setDriver(item.value) }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                    )}
                                />
                            </View>
                        </View>

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
    for_border: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        padding: 5,
    },
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
        fontSize: 14,
        color: colors.black,
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
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
    },

})
export default AssignedStock