import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, FlatList, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
//import Splash from "./Splash";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { EditReqExpenseData, GetReqExpense } from "../../redux/reducers/HRLogin/ReqExpenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveHeight } from "react-native-responsive-dimensions";
import commonstyles from "../../commonstyles/commonstyles";

const Data = [
    { id: '1', date: "11/12/25", status: "Aproved", reson: "Need  for petrol", amount: "2500" },
    { id: '2', date: "11/12/25", status: "Rejected", reson: "Need  for petrol", amount: "2500" },
    { id: '3', date: "11/12/25", status: "Aproved", reson: "Need  for petrol", amount: "2500" },
    { id: '4', date: "11/12/25", status: "Rejected", reson: "Need  for petrol", amount: "2500" },
    { id: '5', date: "11/12/25", status: "Aproved", reson: "Need  for petrol", amount: "2500" },

]

const Myexpense = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        };

        loadUser();
    }, []);

    const { roleId, data } = useSelector((state) => state.Login);
    console.log("Logined User Data  MyExpense Screen ", data);
    console.log("Logined User Data  MyExpense Screen ", roleId);

    const { loading, getreqexpdata } = useSelector((state) => state.GetReqExpense);
    console.log("<------------------------------Get Call Data in My Request Expense Screen --------------------------------->", getreqexpdata);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")


            //nit
            if (userData?.id) {
                dispatch(GetReqExpense(userData?.id))
                console.log("Id is going to my redux code ", userData?.id);

            }
        }, [userData?.id])
    )






    const [active, setActive] = useState("Pending");

    const filteredData = React.useMemo(() => {
        if (!getreqexpdata) return [];


        if (active === "Pending") {
            return getreqexpdata.filter(item => item.expenseStatus === 'Pending');
        }
        if (active === "Forwarded") {
            return getreqexpdata.filter(item => item.expenseStatus === 'Forwarded');
        }
        if (active === "Rejected") {
            return getreqexpdata.filter(item => item.expenseStatus === 'Rejected');
        }
        if (active === "Approved") {
            return getreqexpdata.filter(item => item.expenseStatus === 'Approved');
        }

        return getreqexpdata;
    }, [active, getreqexpdata])


    const handleButton = (item, status) => {
        console.log("Items here ---------------------->", item);


        const id = item?.id
        console.log("Id is going to payload Here ________________________________My expense to redux code >", id);

        const payload = {

            expenseStatus: status,
            remarks: item?.remarks,
            approvedBy: userData?.id,
        }
        dispatch(EditReqExpenseData({ id, payload }))
        console.log("Payload data dispatch here ---------------------------->", payload);


        Alert.alert("Success", "Successfully Updated ",
            [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.goBack();

                    }
                },
            ]
        )


    }


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            if (userData?.id) {
                await dispatch(GetReqExpense(userData?.id)).unwrap();
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}
            <SafeAreaView style={styles.top}>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>My Expenses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("reqResponse")}>
                    <Text style={styles.btn_text}>Request Expense</Text>
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

            <View style={styles.data}>
                <FlatList
                    // data={getreqexpdata}
                    data={filteredData}
                    // keyExtractor={item => item.id}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 5 }}

                    // refresh 
                    refreshing={refreshing}
                    onRefresh={onRefresh}

                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Data Not  Found</Text>
                        </View>
                    )}
                    renderItem={({ item, index }) => {

                        return (
                            <View style={styles.card}>
                                <View style={styles.first}>
                                    <Text style={styles.date}>{new Date(item.expenseDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })}</Text>
                                    <Text style={[item.expenseStatus === "Approved" ? styles.status : item.expenseStatus === "Rejected" ? styles.rejected : item.expenseStatus === 'Pending' ? styles.pending : item.expenseStatus === 'Forwarded' ? styles.blue : null]}>{item.expenseStatus}</Text>
                                </View>
                                <Text style={{ color: colors.inputfieldcolor }}> Amount: <Text style={styles.amount}>{item.amount}</Text></Text>
                                <Text style={{ color: colors.inputfieldcolor }} >Reason :<Text style={styles.amount}>{item.reason}</Text></Text>

                                {/* <View style={styles.first}>
                                    <TouchableOpacity onPress={() => handleButton(item, "Rejected")}>
                                        <Text style={[styles.bottomBtn_text, { borderWidth: 1, borderColor: colors.commoncolor, backgroundColor: colors.commomcolorlight, color: colors.black, }]}>Reject</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleButton(item, "Forwarded")}>
                                        <Text style={[styles.bottomBtn_text, { backgroundColor: colors.commoncolor, color: colors.white, }]}>Forward To Admin</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleButton(item, "Approved")}>
                                        <Text style={[styles.bottomBtn_text, { borderWidth: 1, borderColor: colors.btntextgreen, backgroundColor: colors.btnbggreen, color: colors.btntextgreen, }]}>Approve</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </View>

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
    },
    data: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingTop: 10,
    },
    bottomBtn_text: {
        fontSize: 14,
        fontWeight: 700,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        textAlign: 'center',
        fontFamily: fonts.sfbold,
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
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 8,
        width: 150,
    },
    btn_text: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.white,
        fontFamily: fonts.sfbold,
        textAlign: 'center',
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 10,
        shadowRadius: 6,
        elevation: 4,
        // marginleft:10,
        // marginRight:10,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,
    },
    first: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    date: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    status: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        fontSize: 14,
        fontWeight: "500",
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 4,
        fontFamily: fonts.sfmedium,
    },
    rejected: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
        fontSize: 14,
        fontWeight: "500",
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 4,
        fontFamily: fonts.sfmedium,
    },
    amount: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.formtitlegry,
        fontFamily: fonts.sfmedium,
    },
    toggle_btns: {
        // alignItems: 'center',
        // gap: 10,
        // paddingVertical: responsiveHeight(2),

        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        //paddingVertical: responsiveHeight(2),
        paddingVertical: 10,
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
    pending: {
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




})
export default Myexpense