import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { AllLeaves, EditLeavesPatchCall, GetAppliedLeaves } from "../../redux/reducers/HRLogin/ReqExpenses";
import Feather from 'react-native-vector-icons/Feather';
import { responsiveHeight } from "react-native-responsive-dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const leavesData = [
    { id: '1', name: "Srinivasu", status: "pending", role: 'RSM', leavetype: "Sick Leave", date: "2024-12-25 to 2024-12-26" },
    { id: '2', name: "Srinivasu", status: "pending", role: 'RSM', leavetype: "Sick Leave", date: "2024-12-25 to 2024-12-26" },
    { id: '3', name: "Srinivasu", status: "pending", role: 'RSM', leavetype: "Sick Leave", date: "2024-12-25 to 2024-12-26" },
    { id: '4', name: "Srinivasu", status: "pending", role: 'RSM', leavetype: "Sick Leave", date: "2024-12-25 to 2024-12-26" },
    { id: '5', name: "Srinivasu", status: "pending", role: 'RSM', leavetype: "Sick Leave", date: "2024-12-25 to 2024-12-26" },
    { id: '6', name: "Srinivasu", status: "pending", role: 'RSM', leavetype: "Sick Leave", date: "2024-12-25 to 2024-12-26" },
    { id: '7', name: "Srinivasu", status: "pending", role: 'RSM', leavetype: "Sick Leave", date: "2024-12-25 to 2024-12-26" },

]

const Leaves = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")

            dispatch(AllLeaves())//night
        }, [])
    )

    const [active, setActive] = useState("Pending");
    // const {data}=useSelector((state)=>state.Login);
    // console.log("Logined User Data in Leaves Pages----------------------->",data);
    // const dispatch = useDispatch();
    // useEffect(()=>{
    //     if(data?.id){
    //         dispatch(GetAppliedLeaves(data.id))
    //         console.log("Here id is going to the GetAppliedLeaves Redux Code",data.id);

    //     }
    // },[data?.id])



    const { AllEmployeesLeaves } = useSelector((state) => state.GetAllLeaves);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Applied All Employees Leaves Data in My Leaves Screen&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", AllEmployeesLeaves);


    const filteredData = React.useMemo(() => {
        if (!AllEmployeesLeaves) return [];


        if (active === "Pending") {
            return AllEmployeesLeaves.filter(item => item.leaveStatus === 'Pending');
        }
        if (active === "Forwarded") {
            return AllEmployeesLeaves.filter(item => item.leaveStatus === 'Forwarded');
        }
        if (active === "Rejected") {
            return AllEmployeesLeaves.filter(item => item.leaveStatus === 'Rejected');
        }
        if (active === "Approved") {
            return AllEmployeesLeaves.filter(item => item.leaveStatus === 'Approved');
        }

        return AllEmployeesLeaves;
    }, [active, AllEmployeesLeaves])


    const handleforward = (item, status) => {

        const id = item?.id
        const payload = {

            leaveStatus: status,
            // remarks: cleanedReason,
            approvedBy: item?.approvedBy,
        }
        // dispatch(EditLeavesPatchCall({ id, payload }))
        // console.log("Payload data dispatch here ---------------------------->", payload);


        // Alert.alert("Success", "Successfully Updated ",
        //     [
        //         {
        //             text: "OK",
        //             onPress: () =>{
        //                 navigation.goBack();

        //             }
        //         },
        //     ]
        // )//evg done

        dispatch(EditLeavesPatchCall({ id, payload }))//evg done
            .unwrap()
            .then(() => {
                let successMessage = `Successfully ${status}`;

                Alert.alert(
                    "Success",       // Title
                    successMessage,  // Message

                    [
                        {
                            text: "OK",
                            onPress: () => {
                                dispatch(AllLeaves()); // refresh after success
                            }
                        }
                    ]
                );
            })
            .catch((err) => {
                Alert.alert(
                    "Error",
                    err || "Something went wrong"
                );
            });//evg done


    }


    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("****************************GetEmployess Data All Employess Data in employess Screen*****************************", getEmpdata);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(AllLeaves()).unwrap();  // API call
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
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

    console.log("Logined User Data async storege in Leave Details Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";




    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView style={styles.header}>
                {/* <Text style={styles.leave}>Leave Requests</Text> */}
                {/* <TouchableOpacity style={styles.leave_btn} onPress={() => navigation.navigate("ApplyLeave")}>
                    <Text style={styles.leave_text}>Apply Leave</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.leave}>  Leave Details</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.topToggleContainer]} style={{ maxHeight: responsiveHeight(9) }} >
                <TouchableOpacity onPress={() => setActive("Pending")} style={isAdmin && styles.adminBtn}>
                    <Text style={[styles.toggle_text, active === "Pending" && styles.rejected_btn]}>Pending</Text>
                </TouchableOpacity>


                {
                    !isAdmin && (
                        <TouchableOpacity onPress={() => setActive("Forwarded")}>
                            <Text style={[styles.toggle_text, active === "Forwarded" && styles.rejected_btn]}>Forwarded</Text>
                        </TouchableOpacity>
                    )
                }

                <TouchableOpacity onPress={() => setActive("Rejected")} style={isAdmin && styles.adminBtn}>
                    <Text style={[styles.toggle_text, active === "Rejected" && styles.rejected_btn,]}>Rejected</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActive("Approved")} style={isAdmin && styles.adminBtn} >
                    <Text style={[styles.toggle_text, active === "Approved" && styles.rejected_btn,]}>Approved</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.flat_list}>
                <FlatList
                    // data={AllEmployeesLeaves}
                    data={filteredData}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 5 }}
                    // refresh 
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.black]}
                            tintColor={colors.commoncolor}
                        />
                    }

                    renderItem={({ item, index }) => {
                        const fromDate = new Date(item?.fromDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })
                        const toDate = new Date(item?.toDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })

                        return (
                            <TouchableOpacity style={styles.card} onPress={() => { if (!isAdmin) { navigation.navigate("LeaveDetails", { Empsleavedetails: item }); } }} >

                                <View style={styles.header}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={[item.leaveStatus === 'Approved' ? styles.green : item.leaveStatus === 'Pending' ? styles.status : item.leaveStatus === 'Rejected' ? styles.red : item.leaveStatus === 'Forwarded' ? styles.blue : null]}>{item.leaveStatus}</Text>
                                </View>
                                <Text style={styles.role}>{item.empCode}</Text>
                                <Text style={styles.leave_type}>Leave Type: <Text style={styles.for_style}>{item.leaveType}</Text></Text>
                                <Text style={styles.leave_type}>Duration: <Text style={styles.for_style} >{fromDate} - {toDate}</Text></Text>
                                <Text style={styles.leave_type} >{item.remarks}</Text>
                                {item.leaveStatus === "Pending" && (
                                    <View style={styles.cardButtonContainer}>
                                        <TouchableOpacity onPress={() => handleforward(item, "Rejected")}>
                                            <Text style={[styles.rejected_btn]}>Reject</Text>
                                        </TouchableOpacity>
                                        {
                                            !isAdmin && (
                                                <TouchableOpacity onPress={() => handleforward(item, "Forwarded")} >
                                                    <Text style={styles.forward_btn}>Forward to Admin</Text>
                                                </TouchableOpacity>
                                            )
                                        }


                                        <TouchableOpacity onPress={() => handleforward(item, "Approved")} >
                                            <Text style={[styles.approved_btn]}>Approved</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        // flexDirection: 'column',
        // gap: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    flat_list: {
        flex: 1,
    },
    topToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,             // spacing between buttons
        paddingVertical: responsiveHeight(0.5), // small vertical padding
        paddingHorizontal: 5,
        marginTop: 0, // optional: small space below header
    },
    red: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 4,
        textAlign: 'center',
        fontFamily: fonts.sfmedium,
    },
    blue: {
        backgroundColor: colors.hrhomeyellow,
        color: colors.homedarkyellow,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 4,
        textAlign: 'center',
        fontFamily: fonts.sfmedium,
    },
    leave: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    leave_text: {
        backgroundColor: colors.commoncolor,
        color: colors.white,
        fontSize: 12,
        fontWeight: 700,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        fontFamily: fonts.sfbold,
    },
    toggle_btns: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        //gap: 10,
        marginTop: responsiveHeight(1),
        //paddingVertical: responsiveHeight(2),
    },
    cardButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // distribute buttons evenly
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        gap: 0,
    },
    toggle_text: {
        textAlign: 'center',
        backgroundColor: colors.togglegray,
        color: colors.formtitlegry,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 18,
        paddingLeft: 18,
        borderRadius: 8,
        fontFamily: fonts.sfbold,

    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        //marginBottom: 10,
        marginTop: responsiveHeight(2),
        flexDirection: 'column',
        gap: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    status: {
        backgroundColor: colors.halfdaybg,
        color: colors.halfdayclr,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 4,
        textAlign: 'center',
        fontFamily: fonts.sfmedium,
    },
    green: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 4,
        textAlign: 'center',
        fontFamily: fonts.sfmedium,
    },
    role: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.foundationgray,
        fontFamily: fonts.sfbold,
    },
    leave_type: {
        fontSize: 14,
        fontWeight: 400,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    for_style: {
        fontSize: 14,
        fontWeight: 500,
        // color:'#727989'
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    forward_btn: {
        // flex: 1,
        // marginHorizontal: 5,
        fontSize: 12,
        fontWeight: 700,
        color: colors.white,
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center',
        fontFamily: fonts.sfbold,
    },
    rejected_btn: {
        // flex: 1,             // takes equal width
        //marginRight: 5,
        fontSize: 12,
        fontWeight: 700,
        color: colors.black,
        backgroundColor: colors.commomcolorlight,
        borderWidth: 1,
        borderColor: colors.commoncolor,
        borderRadius: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        textAlign: 'center',
        fontFamily: fonts.sfbold,
    },
    approved_btn: {
        // flex: 1,
        // marginLeft: 5,
        fontSize: 12,
        fontWeight: 700,
        // color: colors.black,
        backgroundColor: colors.btnbggreen,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
        color: colors.btntextgreen,
        borderRadius: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        textAlign: 'center',
        fontFamily: fonts.sfbold,
    },


    adminBtn: {
        minWidth: 110,   // control width properly
       // alignItems: 'center',
    }



})
export default Leaves