import React, { useCallback, useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts, colors } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AttendanceBasedOnDates } from "../../redux/reducers/HRLogin/ReqExpenses";


const MasterData = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [date, setDate] = useState(new Date());


    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };


    const todayDate = formatDate(date);
    console.log("Today Date ---------------->", todayDate);



    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor)
            StatusBar.setBarStyle("light-content");
            dispatch(requestLogin())

            if (userData?.id) {
                dispatch(
                    AttendanceBasedOnDates({
                        employeeId: userData.id,
                    })
                );
            }

        }, [userData?.id,dispatch])
    )




    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);

                if (parsedUser?.id) {
                    dispatch(AttendanceBasedOnDates({ employeeId: parsedUser.id, })
                    );
                }
            }
        }
        loadUser();
    }, []);




    console.log("Logined User Data async storege in Master  Login Home Screen  --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    const { SingleEmployeeAttendanceData } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("Employee Attendacne prenet or not -------------------->", SingleEmployeeAttendanceData);

    const isAttendanceAddedToday =
        SingleEmployeeAttendanceData?.some((item) => {

            const attendanceDate = formatDate(
                new Date(item?.attendanceDate)
            );

            return attendanceDate === todayDate;
        });

    console.log("Attendance Added Today ---------------->", isAttendanceAddedToday);


    // for admin there is no attenade so they are disabing to override it useing(if admin active all if not then if atteance added then active)
    const canAccessMasterData =isAdmin || isAttendanceAddedToday;

    return (
        <View style={styles.Container}>

            <View style={styles.header}>

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

            <ScrollView style={styles.body_top} showsVerticalScrollIndicator={false}>
                <View>

                    {
                        !isAdmin && (
                            <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomegreen }]} onPress={() => navigation.navigate("AddAttendance")} >
                                <FontAwesome6 name="user-check" size={20} color="#00A63E" style={styles.icon_2} />
                                <Text style={styles.request}>Add Attendance</Text>
                            </TouchableOpacity>
                        )
                    }

                     {/* opacity: isAttendanceAddedToday ? 1 : 0.5, }]} disabled={!isAttendanceAddedToday} */}
                    <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white, opacity: canAccessMasterData ? 1 : 0.5, }]} disabled={!canAccessMasterData} onPress={() => navigation.navigate("productmaster")}>
                        <Feather name="box" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homeblue }]} />
                        <Text style={styles.request}>Product Master</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white, opacity: canAccessMasterData ? 1 : 0.5, }]} disabled={!canAccessMasterData} onPress={() => navigation.navigate("AccessoryMaster")}>
                        <SimpleLineIcons name="wrench" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homegreen }]} />
                        <Text style={styles.request}>Accessories Master</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white, opacity: canAccessMasterData ? 1 : 0.5, }]} disabled={!canAccessMasterData} onPress={() => navigation.navigate("Rawmaterialsmaster")} >
                        <FontAwesome6 name="layer-group" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homedarkyellow }]} />
                        <Text style={styles.request}>Raw Materials Master</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white, opacity: canAccessMasterData ? 1 : 0.5, }]} disabled={!canAccessMasterData} onPress={() => navigation.navigate("rawmaterialstransfer")}>
                        <FontAwesome name="share" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homeviolate }]} />
                        <Text style={styles.request}>Raw Materials Transfer</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white, opacity: canAccessMasterData ? 1 : 0.5, }]} disabled={!canAccessMasterData} onPress={() => navigation.navigate("ApproveStock")} >
                        <FontAwesome5 name="check-circle" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: "#FF6B6B" }]} />
                        <Text style={styles.request}>Approve Management</Text>
                    </TouchableOpacity>



                </View>
            </ScrollView>

        </View>

    )
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingHorizontal: 10
    },
    body_top: {
        marginTop: 25,
        paddingHorizontal: 12

    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,

    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // gap:10,
    },
    card: {
        backgroundColor: colors.white,
        //width: '32%',
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
        fontWeight: '600',
        color: colors.black,
        textAlign: 'center',
    },
    box_1: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#00000024",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        overflow: 'hidden',

    },
    card_1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#FAF5FF",
        paddingTop: 25,
        paddingBottom: 25,
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
        color: colors.simpleblack,
        fontFamily: fonts.sfmedium,

    },
    quick: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginBottom: 15,
    },
    icon_2: {
        // paddingLeft: 15,
        // paddingRight: 15,
        padding: 10,
        borderRadius: 10,

    },
    body_bottom: {
        marginTop: 25,
        //paddingHorizontal: 10,
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

})
export default MasterData;