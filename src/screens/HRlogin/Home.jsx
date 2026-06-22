import React, { useCallback, useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, RefreshControl } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import { Expense } from "../../components/svgs";
import { useDispatch, useSelector } from "react-redux";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AttendanceBasedOnDates } from "../../redux/reducers/HRLogin/ReqExpenses";


const Home = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


    const [userData, setUserData] = useState(null);
    const [date, setDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const todayDate = formatDate(date);

    const { SingleEmployeeAttendanceData } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("Employee Attendacne prenet or not -------------------->", SingleEmployeeAttendanceData);

    // useFocusEffect(
    //     useCallback(() => {
    //         StatusBar.setBackgroundColor(colors.commoncolor)
    //         StatusBar.setBarStyle("light-content")
    //         dispatch(requestLogin())
    //         if (userData?.id) {
    //         dispatch(
    //             AttendanceBasedOnDates({
    //                 employeeId: userData.id,
    //             })
    //         );
    //     }
    //     }, [userData?.id,dispatch])
    // )


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor);
            StatusBar.setBarStyle("light-content");

            dispatch(requestLogin());

            const fetchAttendance = async () => {
                const storedUser = await AsyncStorage.getItem("userData");

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserData(parsedUser);

                    if (parsedUser?.id) {
                        dispatch(
                            AttendanceBasedOnDates({
                                employeeId: parsedUser.id,
                            })
                        );
                    }
                }
            };

            fetchAttendance();
        }, [dispatch])
    );

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




    console.log("Logined User Data async storege in HR Login Home Screen  --------------------->", userData);

    const isAdmin = userData?.roleName === "ADMIN";


    //check attenace added or not for making active
    const isAttendanceAddedToday = SingleEmployeeAttendanceData?.some((item) => {
        if (!item?.attendanceDate) return false;

        const apiDate = new Date(item.attendanceDate);

        const day = String(apiDate.getDate()).padStart(2, "0");
        const month = String(apiDate.getMonth() + 1).padStart(2, "0");
        const year = apiDate.getFullYear();

        const formatted = `${day}-${month}-${year}`;

        return formatted === todayDate;
    });

    const isDisabled = !isAttendanceAddedToday;
    //refrsh controller
    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            const storedUser = await AsyncStorage.getItem("userData");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);

                if (parsedUser?.id) {
                    await dispatch(
                        AttendanceBasedOnDates({
                            employeeId: parsedUser.id,
                        })
                    );
                }
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }

        setRefreshing(false);
    }, [dispatch]);










    return (
        <View style={styles.Container}>
            <View style={styles.header}>
                {/* <StatusBar translucent backgroundColor="#EF3D3B" barStyle="light-content" /> */}
                <View style={styles.start_header}>
                    <Image source={require('../../assets/signin_logo.png')} style={styles.img_header} />
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Feather name="user" size={24} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.body_top} contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View>


                    {
                        !isAdmin && (
                            <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomegreen }]} onPress={() => navigation.navigate("AddAttendance")}>
                                <FontAwesome6 name="user-check" size={20} color="#00A63E" style={styles.icon_2} />
                                <Text style={styles.request}>Add Attendance</Text>
                            </TouchableOpacity>
                        )
                    }


                    {
                        !isAdmin && (
                            <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomeviolate,  opacity: isDisabled ? 0.4 : 1 }]} disabled={isDisabled} onPress={() => navigation.navigate("Myexpenses")}>
                                <Expense color="#9810FA" size={20} style={[styles.icon_2, { paddingRight: 26 }]} />
                                <Text style={styles.request}>Request Expense</Text>
                            </TouchableOpacity>
                        )
                    }



                    {
                        !isAdmin && (
                            <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomenewviolet,  opacity: isDisabled ? 0.4 : 1 }]} disabled={isDisabled} onPress={() => navigation.navigate("ApplyLeave")}>
                                <FontAwesome name="folder-open-o" size={20} color="#E60076" style={styles.icon_2} />
                                <Text style={styles.request}>Apply Leave</Text>
                            </TouchableOpacity>
                        )
                    }


                    <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomeyellow,  opacity: isDisabled ? 0.4 : 1 }]} disabled={isDisabled} onPress={() => navigation.navigate("BottomNavigation")}>
                        <FontAwesome5 name="user-tie" size={20} color="#FF9000" style={styles.icon_2} />
                        <Text style={styles.request}>Employees</Text>
                    </TouchableOpacity>

                    {
                        !isAdmin && (
                            <TouchableOpacity style={[styles.card_1, { backgroundColor: "#e2e5fb",  opacity: isDisabled ? 0.4 : 1 }]} disabled={isDisabled} onPress={() => navigation.navigate("monthlyreport")}>
                                <Feather name="bar-chart-2" size={20} color="#155DFC" style={styles.icon_2} />
                                <Text style={styles.request}>Monthly Report </Text>
                            </TouchableOpacity>
                        )
                    }


                </View>

                {
                    !isAdmin && (
                        <View style={styles.body_bottom}>
                            <Text style={styles.quick}>Quick Actions</Text>
                            <View style={styles.box}>

                                <TouchableOpacity style={styles.card} disabled={isDisabled} onPress={() => navigation.navigate("MyAttendance")}>
                                    <View style={[styles.iconWrap, { backgroundColor: colors.homeblue,  opacity: isDisabled ? 0.4 : 1 }]}>
                                        <FontAwesome6 name="calendar-check" size={20} color="#fff" style={styles.icon_cal} />
                                    </View>
                                    <Text style={styles.cardText} numberOfLines={2}>My{"\n"} Attendance</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={styles.card} disabled={isDisabled} onPress={() => navigation.navigate("HrLeaves")}>
                                    <View style={[styles.iconWrap, { backgroundColor: colors.homedarkyellow,  opacity: isDisabled ? 0.4 : 1 }]} >
                                        <FontAwesome name="folder-open-o" size={20} color="#fff" style={styles.icon_cal} />
                                    </View>
                                    <Text style={styles.cardText} numberOfLines={2}>My {"\n"}Leaves</Text>
                                </TouchableOpacity>


                                <TouchableOpacity style={styles.card} disabled={isDisabled} onPress={() => navigation.navigate("AllEmpReqExpenses")}>
                                    <View style={[styles.iconWrap, { backgroundColor: colors.homegreen,  opacity: isDisabled ? 0.4 : 1 }]}>
                                        <FontAwesome6 name="indian-rupee-sign" size={20} color="#fff" style={styles.icon_cal} />
                                    </View>
                                    <Text style={styles.cardText} numberOfLines={2}>All {"\n"} Expenses</Text>
                                </TouchableOpacity>



                            </View>
                        </View>
                    )
                }
            </ScrollView>






        </View>

    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        backgroundColor: colors.commoncolor,
        height: 130,
        paddingTop: 60,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 15,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    body_top: {
        marginTop: 25,
        paddingHorizontal: 10
    },
    img_header: {
        height: 39,
        width: 168,
        resizeMode: 'contain',
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // gap:10,
    },
    card: {
        backgroundColor: colors.white,
        width: '32%',
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: 'center',

        shadowColor: colors.black,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 6,
    },
    iconWrap: {
        height: 48,
        width: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 14,
        fontWeight: 600,
        color: colors.black,
        textAlign: 'center',
        fontFamily: fonts.sfbold,

    },
    box_1: {
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        overflow: 'hidden',

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
    card_1: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: "#FAF5FF",
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 10,

        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    request: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 500,
        color: colors.black,
        fontFamily: fonts.sfmedium,


    },
    quick: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginBottom: 15,
        fontFamily: fonts.sfbold,
    },
    icon_2: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    body_bottom: {
        marginTop: 25,
        //paddingHorizontal: 10,
    },


})
export default Home