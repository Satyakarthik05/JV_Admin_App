import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, Text, View, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { AttendanceBasedOnDates, PunchOutAtt } from "../../redux/reducers/HRLogin/ReqExpenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveHeight } from "react-native-responsive-dimensions";




const MyAttendance = () => {
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
        }
        loadUser();
    }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         StatusBar.setBackgroundColor(colors.white)
    //         StatusBar.setBarStyle("dark-content")
    //         if (userData?.id) {
    //             const employeeId = { employeeId: userData?.id, }
    //             dispatch(AttendanceBasedOnDates(employeeId))
    //         }

    //     },[userData?.id])
    // )

    useEffect(() => {
        StatusBar.setBackgroundColor(colors.white);
        StatusBar.setBarStyle("dark-content");

        if (userData?.id) {
            dispatch(
                AttendanceBasedOnDates({ employeeId: userData.id })
            );
        }
    }, [userData?.id]);


    const { data } = useSelector((state) => state.Login);


    // useEffect(()=>{
    //     if(data?.id){
    //         const payload={employeeId: data?.id,}
    //         dispatch(AttendanceBasedOnDates(payload))
    //     }
    // },[data?.id])

    const { SingleEmployeeAttendanceData } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("attendance Data  emp ID wise-------------------------single Employee Attendance Data -------------------------------------------->", SingleEmployeeAttendanceData);

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            if (userData?.id) {
                await dispatch(
                    AttendanceBasedOnDates({ employeeId: userData.id })
                ).unwrap();
            }
        } catch (error) {
            console.log("Refresh error:", error);
        }

        setRefreshing(false);
    };







    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" /> */}

            <View style={styles.first}>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>My Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddAttendance")}>
                    <Text style={styles.btn_text}>Add Attendance</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <FlatList
                    data={SingleEmployeeAttendanceData}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 70, paddingHorizontal: 5 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.black]}
                            tintColor={colors.commoncolor}
                        />
                    }
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AddAttendance", { id: item.id, attendanceDate: item.attendanceDate, InTime: item.inTime })}>
                                <View style={styles.first}>
                                    <Text style={styles.time}>Working Hours: {item.workingHours}</Text>
                                    <Text style={styles.date}>{new Date(item.attendanceDate).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", })}</Text>
                                </View>
                                <Text style={styles.date}>In :{item.inTime}   <Text style={styles.date}>Out: {item.outTime}</Text></Text>
                                <Text style={styles.date}> Status :{item.attendanceStatus}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </SafeAreaView>
    )
}//dispatch(installationData({ lift_id: item.id}))
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop: 10,
    },
    button: {
        backgroundColor: colors.commoncolor,
        paddingTop: 16,
        paddingBottom: 16,
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
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
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
        // marginRight:5,
        // marginLeft:5,
        marginBottom: responsiveHeight(1),
        marginTop: responsiveHeight(1),
        flexDirection: 'column',
        gap: 5,

    },
    first: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    time: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    date: {
        fontSize: 12,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },

})
export default MyAttendance