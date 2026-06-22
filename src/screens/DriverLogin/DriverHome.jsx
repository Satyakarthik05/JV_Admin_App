import React, { useCallback, useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import Feather from "react-native-vector-icons/Feather"
import { colors, fonts } from "../../config/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Entypo from "react-native-vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Expense } from "../../components/svgs";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { AttendanceBasedOnDates } from "../../redux/reducers/HRLogin/ReqExpenses";

const DriverHome = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


    // useFocusEffect(
    //     useCallback(() => {
    //         StatusBar.setBackgroundColor(colors.commoncolor);
    //         StatusBar.setBarStyle("light-content");
    //         dispatch(requestLogin())
    //     }, [dispatch])
    // )


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor);
            StatusBar.setBarStyle("light-content");

            if (userData?.id) {
                dispatch(
                    AttendanceBasedOnDates({
                        employeeId: userData.id,
                    })
                );
            }
        }, [dispatch, userData?.id])
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

    console.log("Logined User Data async storege in Driver Login Home Screen  --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";

    const { SingleEmployeeAttendanceData } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("single Employee atteance user presnet or not---------->", SingleEmployeeAttendanceData);



    const isAttendanceAddedToday =
        SingleEmployeeAttendanceData?.some((item) => {

            const attendanceDate = new Date(item?.attendanceDate);

            const attendanceDay = attendanceDate.getDate();

            const attendanceMonth = attendanceDate.getMonth();

            const attendanceYear = attendanceDate.getFullYear();

            const today = new Date();

            return (
                attendanceDay === today.getDate() &&
                attendanceMonth === today.getMonth() &&
                attendanceYear === today.getFullYear()
            );
        });



    const onRefresh = async () => {
        setRefreshing(true);

        if (userData?.id) {
            await dispatch(
                AttendanceBasedOnDates({
                    employeeId: userData.id,
                })
            );
        }

        setRefreshing(false);
    };




    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor={colors.commoncolor} />
            <View style={styles.headerContainer}>
                <View>
                    <Image style={styles.image}
                        source={require('../../assets/signin_logo.png')} resizeMode="contain" />
                </View>

                {
                    !isAdmin && (
                        <TouchableOpacity onPress={() => navigation.navigate("TelecallerProfile")}>
                            <Feather name="user" size={22} color={colors.white} />
                        </TouchableOpacity>
                    )
                }

            </View>



            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }

            >


                
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.walletcard1}   onPress={() => navigation.navigate("AddAttendance")}>
                            <FontAwesome6 name="user" size={22} color={colors.simplegreen} />
                            <Text style={styles.requestText}>Add Attendance</Text>
                        </TouchableOpacity>
                    )
                }

                {
                    !isAdmin && (
                        <TouchableOpacity style={[styles.walletcard,{opacity: isAttendanceAddedToday ? 1 : 0.5,}]} disabled={!isAttendanceAddedToday} onPress={() => navigation.navigate("reqResponse")}>
                            <Expense color="#9810FA" size={20} />
                            <Text style={styles.requestText}>Request Expenses</Text>
                        </TouchableOpacity>
                    )
                }


                




                {
                    !isAdmin && (
                        <TouchableOpacity style={[styles.walletcard2,{opacity: isAttendanceAddedToday ? 1 : 0.5,}]} disabled={!isAttendanceAddedToday}  onPress={() => navigation.navigate("ApplyLeave")}>
                            <FontAwesome6 name="door-open" size={22} color={colors.homepink} />
                            <Text style={styles.requestText}>Apply Leave</Text>
                        </TouchableOpacity>
                    )
                }

                <TouchableOpacity style={[styles.walletcard3,{opacity: isAttendanceAddedToday ? 1 : 0.5,}]} disabled={!isAttendanceAddedToday}  onPress={() => navigation.navigate('BottomTabNav')}>
                    <Entypo name="bar-graph" size={22} color={colors.buttonOrange} />
                    <Text style={styles.requestText}>Driver</Text>
                </TouchableOpacity>


            </ScrollView>

            {/* Home */}
        </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white,
        // borderWidth: 3,
    },
    headerContainer: {
        backgroundColor: colors.commoncolor,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    image: {
        height: 120,
        width: 120,
    },
    walletcard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginVertical: 17,
        marginHorizontal: 12,
        // padding: 16,
        backgroundColor: colors.hrhomeviolate,
        borderRadius: 12,
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 15,

        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    walletcard1: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 12,
        //padding: 16,
        backgroundColor: colors.hrhomegreen,
        borderRadius: 12,
        marginBottom: 12,
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 4,
        marginTop:responsiveHeight(3),

        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        //marginTop:responsiveHeight(2),
    },
    walletcard2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 12,
        //padding: 16,
        backgroundColor: colors.hrhomenewviolet,
        borderRadius: 12,
        marginBottom: 15,

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
    walletcard3: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 12,
        //padding: 16,
        backgroundColor: colors.hrhomeyellow,
        borderRadius: 12,
        marginBottom: 12,

        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 5,

        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    requestText: {
        fontSize: 14,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    }
})
export default DriverHome;