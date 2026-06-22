import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { EditLeavesPatchCall, GetAppliedLeaves } from "../../redux/reducers/HRLogin/ReqExpenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveHeight } from "react-native-responsive-dimensions";


const HrLeaves = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data in Leaves Pages----------------------->", data);

    const { getAppliedLeaves } = useSelector((state) => state.GetAppliedLeaves);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7Applied Leaves Data in My Leaves Screen&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", getAppliedLeaves);

    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);


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


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")

            if (userData?.id) {
                dispatch(GetAppliedLeaves(userData.id))
                console.log("Here id is going to the GetAppliedLeaves Redux Code", userData.id);
            }

        }, [userData?.id])
    )

    const [active, setActive] = useState("Pending");




    const filteredData = React.useMemo(() => {
        if (!getAppliedLeaves) return [];


        if (active === "Pending") {
            return getAppliedLeaves.filter(item => item.leaveStatus === 'Pending');
        }
        if (active === "Forwarded") {
            return getAppliedLeaves.filter(item => item.leaveStatus === 'Forwarded');
        }
        if (active === "Rejected") {
            return getAppliedLeaves.filter(item => item.leaveStatus === 'Rejected');
        }
        if (active === "Approved") {
            return getAppliedLeaves.filter(item => item.leaveStatus === 'Approved');
        }

        return getAppliedLeaves;
    }, [active, getAppliedLeaves])

    const handleforward = (item, status) => {

        const id = item?.id
        const payload = {

            leaveStatus: status,
            // remarks: cleanedReason,
            approvedBy: item?.approvedBy,
        }
        dispatch(EditLeavesPatchCall({ id, payload }))
        console.log("Payload data dispatch here ---------------------------->", payload);


        Alert.alert("Success", "Successfully Updated ",
            [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]
        )


    }

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            if (userData?.id) {
                await dispatch(GetAppliedLeaves(userData.id)).unwrap();
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }

        setRefreshing(false);
    };







    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView style={styles.header}>
                <Text style={styles.leave}>Leave Requests</Text>
                <TouchableOpacity style={styles.leave_btn} onPress={() => navigation.navigate("ApplyLeave")}>
                    <Text style={styles.leave_text}>Apply Leave</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toggle_btns} style={{ maxHeight: responsiveHeight(9) }}>
                <TouchableOpacity onPress={() => setActive("Pending")}>
                    <Text style={[styles.toggle_text, active === "Pending" && styles.rejected_btn]}>Pending</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActive("Forwarded")}>
                    <Text style={[styles.toggle_text, active === "Forwarded" && styles.rejected_btn]}>Forwarded</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActive("Rejected")}>
                    <Text style={[styles.toggle_text, active === "Rejected" && styles.rejected_btn]}>Rejected</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActive("Approved")}>
                    <Text style={[styles.toggle_text, active === "Approved" && styles.rejected_btn]}>Approved</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.flat_list}>
                <FlatList
                    // data={getAppliedLeaves}
                    data={filteredData}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 5 }}
                    // Refresh
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.black]}
                            tintColor={colors.commoncolor}
                        />
                    }
                    
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No Employees Found</Text>
                        </View>
                    )}
                    renderItem={({ item, index }) => {
                        const fromDate = new Date(item?.fromDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })
                        const toDate = new Date(item?.toDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })

                        //onPress={() => navigation.navigate("LeaveDetails")}
                        return (
                            <TouchableOpacity style={styles.card} >
                                <View style={styles.for_flex}>
                                    <Text style={styles.name}>{userData?.name}</Text>
                                    <Text style={[item.leaveStatus === 'Approved' ? styles.green : item.leaveStatus === 'Pending' ? styles.status : item.leaveStatus === 'Rejected' ? styles.red : item.leaveStatus === 'Forwarded' ? styles.blue : null]} >{item.leaveStatus}</Text>
                                </View>
                                <Text style={styles.role}>{userData?.roleName}</Text>
                                <Text style={styles.leave_type}>Leave Type: <Text style={styles.for_style}>{item.leaveType}</Text></Text>
                                <Text style={styles.leave_type}>Duration: <Text style={styles.for_style} >{fromDate} - {toDate}</Text></Text>
                                {/* <View style={styles.toggle_btns}>
                                    <TouchableOpacity onPress={() => handleforward(item, "Rejected")} >
                                        <Text style={styles.rejected_btn}>Reject</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleforward(item, "Forwarded")} >
                                        <Text style={styles.forward_btn}>Forward to Admin</Text>
                                    </TouchableOpacity>

                                     <TouchableOpacity onPress={() => handleforward(item, "Approved")} >
                                        <Text style={styles.approved_btn}>Approve</Text>
                                    </TouchableOpacity>

                                </View> */}
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    flat_list: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //marginBottom: 10,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leave: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        fontFamily: fonts.sfbold,
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
        gap: 10,
        paddingVertical: responsiveHeight(2),
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
        // marginBottom: 10,
        // marginTop: 10,
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
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
        fontSize: 14,
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
        fontSize: 14,
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
        fontSize: 14,
        fontWeight: 700,
        color: colors.black,
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



})
export default HrLeaves;