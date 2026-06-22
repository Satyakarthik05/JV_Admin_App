import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, StatusBar, View, TouchableOpacity, FlatList, ScrollView, Image, Linking, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { DeletetheEmployeeData, GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { AttendanceData } from "../../redux/reducers/HRLogin/EmployyeWiseAtt";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";




const Employeelist = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor)
            StatusBar.setBarStyle("light-content")

            dispatch(GetRegesteredData())
            dispatch(AttendanceData())
            dispatch(requestLogin())
        }, [])
    )

    const [active, setActive] = React.useState("All Employs");

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

    console.log("Logined User Data async storege in HR Login employee list  Screen  --------------------->", userData);

    const isAdmin = userData?.roleName === "ADMIN";

    


    // useEffect(() => {
    //     dispatch(GetRegesteredData())
    // }, [])
    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("****************************GetEmployess Data All Employess Data in employess Screen*****************************", getEmpdata);


    // const filteredData = React.useMemo(() => {
    //     if (!getEmpdata) return [];


    //     if (active === "All Employs") {
    //         return getEmpdata.filter(item => item.d_in === 0);
    //     }
    //     if (active === "Pending Approvals") {
    //         return getEmpdata.filter(item => item.d_in === 1);
    //     }
    //     if (active === "Rejected") {
    //         return getEmpdata.filter(item => item.d_in === 2);
    //     }

    //     return getEmpdata;
    // }, [active, getEmpdata])


    const handleDelete = (id) => {

        Alert.alert(
            "Delete the Role", "Are you sure you want to delete this role?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",

                },
                {
                    text: "Yes",
                    onPress: () => dispatch(DeletetheEmployeeData({ id }))

                },
            ],
            { cancelable: true }
        )
    };


    const { TotalAttData } = useSelector((state) => state.AllEmployeeAttcount);
    console.log("All Employeess Attendace-------------------------->", TotalAttData);


    const filterData = React.useMemo(() => {
        if (!getEmpdata) return [];

        if (search.trim() === "") {
            return getEmpdata;
        }

        return getEmpdata.filter(item => item.name?.toLowerCase().includes(search.toLocaleLowerCase()))
    }, [search, getEmpdata])





    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetRegesteredData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <StatusBar translucent backgroundColor="#EF3D3B" barStyle="light-content" /> */}
                <View style={styles.start_header}>
                    <TouchableOpacity style={styles.starting_names} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={30} color="#fff" style={styles.arrow} />
                        <Image source={require('../../assets/signin_logo.png')} style={styles.img_header} />
                    </TouchableOpacity>

                    {
                        !isAdmin && (
                            <TouchableOpacity onPress={() => navigation.navigate("Profile")} >
                                <Feather name="user" size={24} color="#fff" style={styles.icon} />
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>

            <View style={styles.Blocks}>

                <View style={styles.for_Blocks}>
                    <View style={styles.card}>
                        <Feather name="users" color="#fff" size={20} style={[styles.icon_blocks, { backgroundColor: "#2B7FFF", }]} />
                        <Text style={styles.attendence}>{TotalAttData?.totalEmployees}</Text>
                    </View>
                    <View style={styles.blw_blocks}>
                        <Text style={styles.menu} numberOfLines={2}>Total Employees</Text>
                    </View>
                </View>

                <View style={styles.for_Blocks}>
                    <View style={styles.card}>
                        <Feather name="user-check" color="#fff" size={20} style={[styles.icon_blocks, { backgroundColor: "#00C950" }]} />
                        <Text style={styles.attendence}>{TotalAttData?.presentToday}</Text>
                    </View>
                    <View style={styles.blw_blocks}>
                        <Text style={styles.menu} numberOfLines={2}>Present Today</Text>
                    </View>
                </View>


                <View style={styles.for_Blocks}>
                    <View style={styles.card}>
                        <Feather name="user-x" color="#fff" size={20} style={[styles.icon_blocks, { backgroundColor: "#FB2C36" }]} />
                        <Text style={styles.attendence}>{TotalAttData?.absentToday}</Text>
                    </View>
                    <View style={styles.blw_blocks}>
                        <Text style={styles.menu} numberOfLines={2}>Absent Today</Text>
                    </View>
                </View>

                <View style={styles.for_Blocks}>
                    <View style={styles.card}>
                        <Feather name="clock" color="#fff" size={20} style={[styles.icon_blocks, { backgroundColor: "#FF6900" }]} />
                        <Text style={styles.attendence}>{TotalAttData?.leaveRequests}</Text>
                    </View>
                    <View style={styles.blw_blocks}>
                        <Text style={styles.menu} numberOfLines={2}>Leave Requests</Text>
                    </View>
                </View>
            </View>

            <View style={styles.search_bar}>
                <Ionicons name="search" size={20} color="#000" />
                <TextInput placeholder="Search Here......." style={styles.search_field} placeholderTextColor="#999" value={search} onChangeText={setSearch} />
            </View>

            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>

                <View style={styles.Employeelist}>
                    <Text style={styles.Emplist}>Employee List</Text>
                    <View style={styles.sec_1}>

                        {
                            !isAdmin && (
                                <TouchableOpacity style={styles.Buttons} onPress={() => navigation.navigate("EmployeeReg")}>
                                    <FontAwesome6 name="plus" color="#fff" size={14} />
                                    <Text style={styles.button_text}>Add New</Text>
                                </TouchableOpacity>
                            )
                        }


                        {
                            !isAdmin && (
                                <TouchableOpacity style={styles.Buttons} onPress={() => navigation.navigate("Addedroles")}>
                                    <FontAwesome6 name="plus" color="#fff" size={14} />
                                    <Text style={styles.button_text}>Add Role</Text>
                                </TouchableOpacity>
                            )
                        }


                    </View>
                </View>



                <View style={styles.toggles}>
                    {/* <View style={styles.toggle_btns}>
                        <TouchableOpacity style={[styles.toggle_clicks, active === "All Employs" && styles.togglebtn]} onPress={() => setActive("All Employs")}>
                            <Text style={[styles.toggle_title, active === "All Employs" && styles.toggletext]}>All Employs</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.toggle_clicks, active === "Pending Approvals" && styles.togglebtn]} onPress={() => setActive("Pending Approvals")}>
                            <Text style={[styles.toggle_title, active === "Pending Approvals" && styles.toggletext]}>Pending Approvals</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.toggle_clicks, active === "Rejected" && styles.togglebtn]} onPress={() => setActive("Rejected")}>
                            <Text style={[styles.toggle_title, active === "Rejected" && styles.toggletext]}>Rejected</Text>
                        </TouchableOpacity>
                    </View> */}



                    <View style={styles.flatlist}>
                        <FlatList
                            // data={getEmpdata}
                            //data={filteredData}

                            data={filterData}
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 2 }}

                            //  Refresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}

                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No Employees Found</Text>
                                </View>
                            )}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.flatlist_data} onPress={() => { navigation.navigate("Emplyview", { data: item }) }}>
                                        <View style={styles.name} >
                                            <Text style={styles.code}>{item.empCode}</Text>
                                            <View style={{ flexDirection: "row", gap: 15 }}>

                                                {
                                                    !isAdmin && (
                                                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ flexDirection: 'row', gap: 2 }}>
                                                            <Feather name="trash" color="#FF0000" size={15} />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                {
                                                    !isAdmin && (
                                                        <TouchableOpacity style={{ flexDirection: 'row', gap: 2 }} onPress={() => navigation.navigate("EditEmployeeRegFrom", { EmployeeListData: item })}>
                                                            <Feather name="edit" color="green" size={15} />
                                                        </TouchableOpacity>
                                                    )
                                                }

                                            </View>
                                        </View>
                                        <View style={styles.name}>
                                            <Text style={styles.user_name}>{item.name}</Text>
                                            <Text style={[item.d_in === 0 ? styles.status : styles.rejected]}>{item.d_in === 0 ? "Active" : "InActive"}</Text>
                                        </View>

                                        <View style={styles.last_incard}>
                                            <View style={styles.left}>
                                                <Text style={styles.role}>{item.roleName}</Text>
                                                <Text style={styles.amount}>{'\u20B9'} {item.salary}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.right} onPress={() => Linking.openURL(`tel:${item.mobileNumber}`)}>
                                                <SimpleLineIcons name="phone" size={16} color="#3E4851" />
                                                <Text style={styles.amount}>{item.mobileNumber}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>


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
    img_header: {
        height: 39,
        width: 168,
        resizeMode: 'contain',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    search_bar: {

        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 3,
        paddingHorizontal: 5,
        marginTop: responsiveHeight(2),
        marginHorizontal: responsiveHeight(2),
        //flex:1,
    },
    search_field: {
        flex: 1,
        fontSize: 16,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    starting_names: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrow: {
        marginRight: 10,
    },
    header: {
        backgroundColor: colors.commoncolor,
        height: 130,
        paddingTop: responsiveHeight(3),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 15,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,


    },
    Employeelist: {
        //marginBottom:20,
    },
    main: {
        marginTop: 10,
        paddingHorizontal: 12,
        flexDirection: 'column',
        gap: 30,
        flex: 1,
    },
    toggles: {
        flex: 1,
        marginTop: 10,
    },
    start_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        backgroundColor: colors.hrhomeprofile,
        padding: 9,
        borderRadius: 22,
    },
    Buttons: {
        backgroundColor: colors.commoncolor,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        paddingVertical: 16,
        paddingLeft: 45,
        paddingRight: 45,
        borderRadius: 8,
    },
    sec_1: {
        flexDirection: 'row',
        alignContent: 'center',
        gap: 10,
    },
    button_text: {
        color: colors.white,
        fontFamily: fonts.sfbold,
        fontSize: 14,
        fontWeight: 700,

    },
    wish: {
        fontWeight: 700,
        fontSize: 24,
        color: colors.white,
    },
    card: {
        borderWidth: 1.5,
        borderColor: colors.commoncolor,
        paddingTop: 10,
        paddinhBottom: 15,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: colors.commomcolorlight,
        borderRadius: 8,

        shadowColor: colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 6,
    },
    icon_blocks: {
        height: 40,
        width: 40,
        textAlign: 'center',
        paddingTop: 10,
        //paddingRight:5,
        borderRadius: 5,
    },
    attendence: {
        color: colors.black,
        textAlign: 'center',
        paddingTop: 3,
        paddingBottom: 5,
        fontFamily: fonts.sfbold,
        fontWeight: 700,

    },
    Emplist: {
        fontSize: 20,
        fontWeight: 700,
        color: colors.black,
        paddingVertical: 15,
        fontFamily: fonts.sfbold,
    },
    Blocks: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 12,
        // gap: 18,
        // position: 'absolute',
        // paddingVertical: 115,
        marginTop: -30,
        //  marginTop: -responsiveHeight(3)
    },
    for_Blocks: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
    },
    menu: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.foundationgray,
        maxWidth: 60,
        textAlign: 'center',
        fontFamily: fonts.sfmedium,
    },
    toggle_btns: {
        flexDirection: 'row',
        alignContent: 'center',
        //justifyContent:'space-evenly',
        justifyContent: 'space-between',
    },
    toggle_clicks: {
        backgroundColor: colors.togglegray,
        borderRadius: 8,
    },
    togglebtn: {
        backgroundColor: colors.commoncolor,
    },
    toggletext: {
        color: colors.white,
        fontWeight: 700,
    },
    toggle_title: {
        color: colors.formtitlegry,
        fontWeight: 500,
        fontSize: 14,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 8,
        fontFamily: fonts.sfmedium,
    },
    flatlist_data: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 10,
        shadowRadius: 6,
        elevation: 4,
        // marginleft:5,
        // marginRight:5,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,
    },
    flatlist: {
        flex: 1,
    },
    code: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.formtitlegry,
        fontFamily: fonts.sfmedium,
    },
    name: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between'
    },
    user_name: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    status: {
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
    last_incard: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    role: {
        fontSize: 12,
        fontWeight: 500,
        color: colors.darkviolet,
        backgroundColor: colors.lightviolet,
        fontFamily: fonts.sfmedium,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,
    },
    amount: {
        color: colors.formtitlegry,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: fonts.sfmedium,
    },


})
export default Employeelist