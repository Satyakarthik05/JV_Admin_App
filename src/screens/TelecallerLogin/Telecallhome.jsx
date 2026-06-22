import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, StatusBar, ScrollView, RefreshControl } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Expense } from "../../components/svgs";
import { useDispatch, useSelector } from "react-redux";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AttendanceBasedOnDates } from "../../redux/reducers/HRLogin/ReqExpenses";




const Telecallerhome = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


    // useFocusEffect(
    //     useCallback(() => {
    //         StatusBar.setBackgroundColor(colors.commoncolor);
    //         StatusBar.setBarStyle("light-content")
    //         dispatch(requestLogin())
    //     }, [dispatch])
    // )

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor);
            StatusBar.setBarStyle("light-content");

            dispatch(requestLogin());

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
            console.log("Refresh Error:", error);
        }

        setRefreshing(false);

    }, [dispatch]);

    console.log("Logined User Data async storege in Telecaller  Login Home Screen  --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";

    const { SingleEmployeeAttendanceData } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("single Employee atteance user presnet or not---------->", SingleEmployeeAttendanceData);


    //check attendance 
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    // check attendance added today
    const today = new Date();
    const todayDate =
        today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

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

    console.log("Attendance Active:", isAttendanceAddedToday);

    console.log("Today Date:", todayDate);
    console.log("Attendance Active:", isAttendanceAddedToday);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <StatusBar translucent backgroundColor="#EF3D3B" barStyle="light-content" /> */}
                <View style={styles.start_header}>
                    <Image source={require('../../assets/signin_logo.png')} style={styles.img_header} />
                    {
                        !isAdmin && (
                            <TouchableOpacity onPress={() => navigation.navigate("TelecallerProfile")}>
                                <Feather name="user" size={24} color="#fff" style={styles.icon} />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>

            <ScrollView style={styles.main}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                {
                    !isAdmin && (
                        <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomegreen }]} onPress={() => navigation.navigate("AddAttendance")} >
                            <FontAwesome6 name="user-check" size={20} color="#00A63E" style={styles.icon_2} />
                            <Text style={styles.request}>Add Attendance</Text>
                        </TouchableOpacity>
                    )
                }

                {
                    !isAdmin && (
                        <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomenewviolet, opacity: isAttendanceAddedToday ? 1 : 0.5, }]} disabled={!isAttendanceAddedToday} onPress={() => navigation.navigate("ApplyLeave")}>
                            <FontAwesome name="folder-open-o" size={20} color="#E60076" style={styles.icon_2} />
                            <Text style={styles.request}>Apply Leave</Text>
                        </TouchableOpacity>
                    )
                }

                {
                    !isAdmin && (
                        <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomeviolate, opacity: isAttendanceAddedToday ? 1 : 0.5, }]} disabled={!isAttendanceAddedToday} onPress={() => navigation.navigate("reqResponse")}>
                            <Expense color="#9810FA" size={20} style={[styles.icon_2, { paddingRight: 28 }]} />
                            <Text style={styles.request}>Request Expense</Text>
                        </TouchableOpacity>
                    )
                }


                <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomeyellow, opacity: isAttendanceAddedToday ? 1 : 0.5, }]} disabled={!isAttendanceAddedToday} onPress={() => navigation.navigate("BottomtabTC")}>
                    <FontAwesome6 name="ranking-star" size={20} color="#FF9000" style={styles.icon_2} />
                    <Text style={styles.request}>Leads</Text>
                </TouchableOpacity>



                {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomeyellow }]} onPress={() => navigation.navigate("kissankarthome")}>
                    <FontAwesome6 name="ranking-star" size={20} color="#FF9000" style={styles.icon_2} />
                    <Text style={styles.request}>Products For Kisaankart</Text>
                </TouchableOpacity> */}


            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingHorizontal:12,
    },
    main: {
        paddingHorizontal: 12,
        marginTop: 25,
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
    start_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    }, icon: {
        backgroundColor: colors.hrhomeprofile,
        padding: 9,
        borderRadius: 22,
    },
    img_header: {
        height: 39,
        width: 168,
        resizeMode: 'contain',
    },
    card_1: {
        flexDirection: 'row',
        alignItems: 'center',
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
    request: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 500,
        color: colors.black,
        fontFamily: fonts.sfmedium,
    },
    icon_2: {
        paddingLeft: 15,
        paddingRight: 15,
    },

})
export default Telecallerhome;