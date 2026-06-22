import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, FlatList, Alert, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
//import Splash from "./Splash";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { EditReqExpenseData, GetAllEmpReqExpenses, GetReqExpense } from "../../redux/reducers/HRLogin/ReqExpenses";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";



const AllEmployeesReqExpense = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState(null);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");

            dispatch(GetAllEmpReqExpenses());
            dispatch(requestLogin())
        }, [dispatch])
    )
    const [refreshing, setRefreshing] = useState(false);




    const { data } = useSelector((state) => state.Login)
    console.log("logined USer Data In All Employeess request Expense Screen ------------------------->", data);

    const { AllEmployeesReqExpenses } = useSelector((state) => state.GetAllEmpReqExpense)
    console.log("All Employees req expense Data--------------------->", AllEmployeesReqExpenses);

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

    console.log("Logined User Data async storege in All Employeess req expenses-------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";



    const [active, setActive] = useState("Pending");

    const filteredData = React.useMemo(() => {
        if (!AllEmployeesReqExpenses) return [];

        if (active === "Pending") {
            return AllEmployeesReqExpenses.filter(item => item.expenseStatus === 'Pending');
        }
        if (active === "Forwarded") {
            return AllEmployeesReqExpenses.filter(item => item.expenseStatus === 'Forwarded');
        }
        if (active === "Rejected") {
            return AllEmployeesReqExpenses.filter(item => item.expenseStatus === 'Rejected');
        }
        if (active === "Approved") {
            return AllEmployeesReqExpenses.filter(item => item.expenseStatus === 'Approved');
        }

        return AllEmployeesReqExpenses;
    }, [active, AllEmployeesReqExpenses])



    const handleButton = (item, status) => {
        console.log("Items here ---------------------->", item);


        const id = item?.id
        console.log("Id is going to payload Here ________________________________My expense to redux code >", id);

        const payload = {

            expenseStatus: status,
            remarks: item?.remarks ?? null,
            approvedBy: data?.id,
        }


        // dispatch(EditReqExpenseData({ id, payload }))
        console.log("Payload data dispatch here ---------------------------->", payload);

        dispatch(EditReqExpenseData({ id, payload }))
            .unwrap()
            .then(() => {
                let successMessage = `Successfully ${status}`;
                Alert.alert(
                    "Success",//title
                    successMessage, //message
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                dispatch(GetAllEmpReqExpenses()); // refresh after success
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
            });



    }

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetAllEmpReqExpenses()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };






    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}
            <SafeAreaView style={styles.top}>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>All Expenses</Text>
                </TouchableOpacity>
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("reqResponse")}>
                            <Text style={styles.btn_text}>Request Expense</Text>
                        </TouchableOpacity>
                    )
                }

            </SafeAreaView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toggle_btns} style={{ maxHeight: responsiveHeight(9) }} >
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
                    <Text style={[styles.toggle_text, active === "Rejected" && styles.rejected_btn]}>Rejected</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActive("Approved")} style={isAdmin && styles.adminBtn} >
                    <Text style={[styles.toggle_text, active === "Approved" && styles.rejected_btn]}>Approved</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.data}>
                <FlatList
                    //data={AllEmployeesReqExpenses}
                    data={filteredData}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 5 }}

                    //refresh Data
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
                            <Text style={styles.emptyText}>Data Not  Found</Text>
                        </View>
                    )}
                    renderItem={({ item, index }) => {

                        return (
                            <View style={styles.card}>
                                <View style={styles.first}>
                                    <Text style={styles.date}>{new Date(item.expenseDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })}</Text>
                                    <Text style={[item.expenseStatus === 'Approved' ? styles.green : item.expenseStatus === 'Pending' ? styles.pending : item.expenseStatus === 'Rejected' ? styles.red : item.expenseStatus === 'Forwarded' ? styles.blue : null]}>{item.expenseStatus}</Text>
                                </View>
                                <Text style={{ color: colors.inputfieldcolor }}> Name: <Text style={styles.amount}>{item.name}</Text></Text>
                                <Text style={{ color: colors.inputfieldcolor }}> Amount: <Text style={styles.amount}>{item.amount}</Text></Text>
                                <Text style={{ color: colors.inputfieldcolor }} >Employee Code :<Text style={styles.amount}>{item.empCode}</Text></Text>

                                {item.expenseStatus === "Pending" && (
                                    <View style={styles.first}>
                                        <TouchableOpacity onPress={() => handleButton(item, "Rejected")}>
                                            <Text style={[styles.bottomBtn_text, { borderWidth: 1, borderColor: colors.commoncolor, backgroundColor: colors.commomcolorlight, color: colors.black, }]}>Reject</Text>
                                        </TouchableOpacity>

                                        {
                                            !isAdmin && (
                                                <TouchableOpacity onPress={() => handleButton(item, "Forwarded")}>
                                                    <Text style={[styles.bottomBtn_text, { backgroundColor: colors.commoncolor, color: colors.white, }]}>Forward To Admin</Text>
                                                </TouchableOpacity>
                                            )
                                        }

                                        <TouchableOpacity onPress={() => handleButton(item, "Approved")}>
                                            <Text style={[styles.bottomBtn_text, { borderWidth: 1, borderColor: colors.btntextgreen, backgroundColor: colors.btnbggreen, color: colors.btntextgreen, }]}>Approve</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop: 10,
    },
    data: {
        flex: 1,
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
        // marginBottom: 10,
        // marginTop: 10,
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(1),
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
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        // marginTop: 10,
        // marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        // paddingVertical: responsiveHeight(2),
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
    bottomBtn_text: {
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        textAlign: 'center',
        fontFamily: fonts.sfbold,
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




    adminBtn: {
        minWidth: 110,   // control width properly
       // alignItems: 'center',
    }



})
export default AllEmployeesReqExpense