import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { FilterExpenses, GetExpensesData } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import AccountsSkeleton from "../../components/AccountsSkeleton";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Expenses = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();




    const [showfrom, setShowFrom] = useState(false);
    const [fromdate, setFromdate] = useState('');
    const [showto, setShowto] = useState(false);
    const [todate, setTodate] = useState('');
    const [fromDateObj, setFromDateObj] = useState(null);
    const [toDateObj, setToDateObj] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content");

            const today = new Date();
            const formatted = formatDate(today);
            setFromDateObj(today);
            setToDateObj(today);

            setFromdate(formatted);
            setTodate(formatted);

            setLoading(true);
            dispatch(GetExpensesData())
                .finally(() => {
                    setLoading(false); //  stop loading
                });

        }, [])
    );



    const Fromdatefun = (event, selected) => {
        setShowFrom(false);
        if (selected) {
            setFromDateObj(selected);
            setFromdate(formatDate(selected)); //  use function
        }
    }



    const Todatefun = (event, toselected) => {
        setShowto(false);
        if (toselected) {
            setToDateObj(toselected);
            setTodate(formatDate(toselected)); //  use function
        }
    }


    const handleFilter = () => {
        if (!fromDateObj || !toDateObj) return;

        const payload = {
            requestType: "EXPENSE",
            fromDate: formatDate(fromDateObj),
            toDate: formatDate(toDateObj),
        };
        console.log("FILTER PAYLOAD ---------------->", payload);

        setLoading(true);
        dispatch(FilterExpenses(payload)).finally(() => {
            setLoading(false); //  stop loading
        });
    };

    useEffect(() => {
        if (fromDateObj && toDateObj) {
            handleFilter();
        }
    }, [fromDateObj, toDateObj]);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // call both APIs again (important)
        dispatch(GetExpensesData());
        if (fromDateObj && toDateObj) {
            dispatch(FilterExpenses({
                requestType: "EXPENSE",
                fromDate: formatDate(fromDateObj),
                toDate: formatDate(toDateObj),

            }));
        }
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);

    }, [dispatch, fromDateObj, toDateObj]);





    const { ExpensesData } = useSelector((state) => state.GetAccountsExpesnes);
    console.log("Acccounts Expesnes Data -------------------------", ExpensesData);

    const { filterexpensesData } = useSelector((state) => state.FilterexpensesDataAcc);
    console.log("Filter expenses Data --------------------->", filterexpensesData);

    // const totalExpenses = filterexpensesData?.reduce((sum, item) => {
    //     return sum + Number(item.amount || 0);
    // }, 0);

    const totalExpenses = Array.isArray(filterexpensesData) ? filterexpensesData.reduce((sum, item) => {
        return sum + Number(item?.amount || 0);
    }, 0)
        : 0;


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

    console.log("Logined User Data async storege in Accounts Login Expenses Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    return (
        <View style={styles.container}>

            <SafeAreaView style={styles.first}>

                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>   Expenses</Text>
                </TouchableOpacity>

                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddAccExpenses")}>
                            <Feather name="plus" size={14} color="#fff" style={styles.arrow} />
                            <Text style={styles.btn_text}>  Add Expenses</Text>
                        </TouchableOpacity>
                    )
                }



            </SafeAreaView>


            <View style={styles.searchBar_view}>
                <View style={styles.left}>
                    <TextInput value={fromdate} placeholder="From Date" editable={false} style={styles.name} placeholderTextColor="#888" />
                    <Text style={styles.in_time}>  to:  </Text>
                    <TextInput value={todate} placeholder="To Date" editable={false} style={styles.name} placeholderTextColor="#888" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(3) }}>
                    <TouchableOpacity onPress={() => setShowFrom(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                        {/* <Text style={{ color: colors.foundationgray }}>From   </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowto(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                        {/* <Text style={{ color: colors.foundationgray }} >To</Text> */}
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <View style={styles.bottom}>
                    <View style={[styles.left, { marginBottom: 8 }]}>
                        <Text style={styles.title}>{fromdate ? fromdate : "FromDate"} - </Text>
                        <Text style={styles.title}>{todate ? todate : "ToDate"}</Text>
                    </View>
                    <View style={[styles.first]}>
                        <View>
                            {/* <Text style={[styles.amount, { marginBottom: 5 }]} >Total Income</Text> */}
                            <Text style={[styles.amount, { marginBottom: 5 }]}>Total Expenses</Text>
                            {/* <Text style={[styles.amount, { marginBottom: 5 }]}>Profit / Loss</Text> */}
                        </View>
                        <View>
                            {/* <Text style={styles.price} >{`\u20B9`}20342</Text> */}
                            <Text style={styles.pricered}>{`\u20B9`} {totalExpenses || 0}</Text>
                            {/* <Text style={styles.price} >+{`\u20B9`}6342</Text> */}
                        </View>
                    </View>
                </View>

                <Text style={[styles.title, { marginTop: 10 }]}>Overall Expenses</Text>

            </View>


            <View style={styles.data}>
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
                    ) : filterexpensesData?.length === 0 ? (
                        <View>
                            <Text style={{ textAlign: "center", fontSize: 14, color: colors.black }}>No Data Found</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filterexpensesData}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 5 }}

                            refreshing={refreshing}
                            onRefresh={onRefresh}

                            renderItem={({ item, index }) => {
                                return (
                                    <View style={styles.card}>
                                        <View style={styles.first}>
                                            <Text style={styles.date}>{formatDate(new Date(item.expenseDate))}</Text>
                                            <Text style={styles.date}>{item.empCode}</Text>
                                        </View>
                                        <View style={styles.first}>
                                            <Text style={styles.date}>{item.name}</Text>
                                            <Text style={[styles.status, item.expenseStatus === "Approved" ? styles.approved : item.expenseStatus === "Rejected" ? styles.rejected : item.expenseStatus === "Pending" ? styles.pending : item.expenseStatus === "Forwarded" ? styles.forwarded : null]}>{item.expenseStatus}</Text>
                                        </View>
                                        <Text style={{ color: colors.foundationgray }}> Amount: <Text style={styles.amount}>{item.amount}</Text></Text>
                                        <View style={styles.first}>
                                            <Text style={{ color: colors.foundationgray }} >ExpenseType :<Text style={styles.amount}>{item.expenseType}</Text></Text>
                                            {/* <Text style={{ color: colors.foundationgray }} >{item.permission}{'\n'}<Text style={styles.amount} >        {item.admin}</Text></Text> */}
                                        </View>
                                        <Text style={{ color: colors.foundationgray }}>ExpenseSource: <Text style={styles.amount}>{item.expenseSource}</Text></Text>
                                        <Text style={{ color: colors.foundationgray }}>Reason: <Text style={styles.amount}>{item.reason}</Text></Text>
                                    </View>
                                )
                            }}
                        />
                    )
                }
            </View>








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
    data: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    searchBar_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,

        borderWidth: 1.5,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        //paddingVertical: 10,
        //width: width * 0.89,
        marginRight: 5,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    in_time: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
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
    amount: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.formtitlegry,
        fontFamily: fonts.sfmedium,
    },
    date: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    status: {
        fontSize: 14,
        fontWeight: "500",
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 4,
        fontFamily: fonts.sfmedium,
    },
    approved: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
    },
    rejected: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
    },
    pending: {
        backgroundColor: colors.halfdaybg,
        color: colors.halfdayclr,
    },
    bottom: {
        borderWidth: 1,
        borderColor: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        padding: 12,
        borderRadius: 12,
        marginTop: 15,
    },
    pricered: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.error,
        fontFamily: fonts.sfmedium,
        marginBottom: 5
    },
    price: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.homegreen,
        fontFamily: fonts.sfmedium,
        marginBottom: 5
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
        fontSize: 14,
        fontWeight: 700,
        color: colors.white,
        fontFamily: fonts.sfbold,
    },
    forwarded: {
        backgroundColor: "#d9f394",
        color: "#000",
    },
})
export default Expenses