import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
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
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { useDispatch, useSelector } from "react-redux";



const AllSales = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { ItemsData } = route.params;
    console.log("items Data Coming from params ----------------->", ItemsData);


    //****************************************Sub Items Data  ******************************//

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            dispatch(GetRegesteredData());

            setFromdate('');
            setTodate('');
            console.log("RUNS Once TIME");
        }, [])
    )

    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState('');
    const [showto, setShowto] = useState(false);
    const [todate, setTodate] = useState('');
    const [modal, setModal] = useState(false);
    const [driver, setDriver] = useState(null);
    const [refreshing, setRefreshing] = useState(false);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, []);





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
    console.log("*********GetEmployess Data All Employess Data in  All sales for sales To driver screen **********", getEmpdata);

    // dropdown data for drivers data 
    const driverDropdownData = useMemo(() => {
        return getEmpdata
            ?.filter(emp => emp.roleName === "DRIVER")
            ?.map(emp => ({
                label: emp.name,
                value: emp.id,
            })) || [];
    }, [getEmpdata]);




    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.top} >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Stock </Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/* <View style={[styles.top, { marginTop: 10 }]}>
                <Text style={styles.title} >All Sales</Text>
                <TouchableOpacity style={[styles.top, styles.for_border]} onPress={() => setModal(true)} activeOpacity={1} >
                    <Text style={styles.phno}>Apply Filter</Text>
                    <Ionicons name="funnel-outline" color="#727989" size={14} />
                </TouchableOpacity>
            </View> */}


            <View style={styles.body}>
                <FlatList
                    data={ItemsData?.items}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}
                    // refrsh COntroller
                    refreshing={refreshing}
                    onRefresh={onRefresh}

                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("SalesOverView", { reportData: ItemsData })}>
                                {/* <View style={styles.top}>
                                    <Text style={styles.code}>{item.name}</Text>
                                    <Text style={styles.status}>{item.status}</Text>
                                </View>
                                <View style={styles.top}>
                                    <Text style={styles.code}>{item.phno}</Text>
                                    <View style={styles.for_flex}>
                                        <EvilIcons name="location" size={14} color="#EF3D3B" />
                                        <Text style={[styles.code, { color: colors.foundationgray }]}>{item.location}</Text>
                                        <Text style={styles.phno}>{item.route}</Text>
                                    </View>
                                </View> */}

                                <View>
                                    <Text style={styles.code} >Product Name: {item.productName}</Text>
                                    <Text style={styles.code} >Quantity: {item.quantity}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

            {/* <Modal
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
            } */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    status: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        padding: 5,
        borderRadius: 4,
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




})
export default AllSales