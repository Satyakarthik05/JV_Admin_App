import React, { useCallback } from "react";
import { Image, StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts, colors } from "../../config/theme";
import { Location } from "../../components/svgs";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const AdminHome = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor)
            StatusBar.setBarStyle("light-content");
        })
    )

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

            <ScrollView style={styles.body_top} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomegreen }]} onPress={() => navigation.navigate("AddAttendance")} >
                        <FontAwesome6 name="user-check" size={20} color="#00A63E" style={styles.icon_2} />
                        <Text style={styles.request}>Add Attendance</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white }]} onPress={() => navigation.navigate("hrlogin")}>
                        <Feather name="box" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homeblue }]} />
                        <Text style={styles.request}>HR</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white }]} onPress={() => navigation.navigate("master")}>
                        <SimpleLineIcons name="wrench" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homegreen }]} />
                        <Text style={styles.request}>Master Details</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white }]} onPress={() => navigation.navigate("telecaller")} >
                        <FontAwesome6 name="layer-group" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homedarkyellow }]} />
                        <Text style={styles.request}>Telecaller</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white }]} onPress={() => navigation.navigate("production")}>
                        <FontAwesome name="share" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homeviolate }]} />
                        <Text style={styles.request}>Production</Text>
                    </TouchableOpacity> */}


                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white }]} onPress={() => navigation.navigate("Accounts")}>
                        <FontAwesome5 name="key" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: "#FF6B6B" }]} />
                        <Text style={styles.request}>Accounts</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white }]} onPress={() => navigation.navigate("sales")}>
                        <FontAwesome name="share" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homeviolate }]} />
                        <Text style={styles.request}>Sales</Text>
                    </TouchableOpacity> */}

                    {/* <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.white }]} onPress={() => navigation.navigate("driver")}>
                        <FontAwesome name="share" size={20} color="#fff" style={[styles.icon_2, { backgroundColor: colors.homeviolate }]} />
                        <Text style={styles.request}>Driver</Text>
                    </TouchableOpacity> */}

                    <View style={styles.start_header}>

                        {/* hrlogin */}
                        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("hrloginBT")}>
                            <View style={[styles.icons, { backgroundColor: "#4F46E5" }]}>
                               <Feather name="users" size={26} color="#fff" />
                            </View>
                            <Text style={styles.title}>HR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("master")}>
                            <View style={[styles.icons, { backgroundColor:"#0EA5E9"}]}>
                               <FontAwesome6 name="database" size={24} color="#fff" />
                            </View>
                            <Text style={styles.title}>Master</Text>
                        </TouchableOpacity>

                    </View>

                     <View style={styles.start_header}>

                        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("telecallerBT")}>
                            <View style={[styles.icons, { backgroundColor: "#10B981" }]}>
                                <Feather name="phone-call" size={24} color="#fff" />
                            </View>
                            <Text style={styles.title}>Telecaller</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("production")}>
                            <View style={[styles.icons, { backgroundColor: "#F59E0B" }]}>
                                <MaterialIcons name="factory" size={24} color="#fff" />
                            </View>
                            <Text style={styles.title}>Production</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.start_header}>

                        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("AccountsBT")}>
                            <View style={[styles.icons, { backgroundColor: "#EF4444" }]}>
                                <FontAwesome5 name="file-invoice-dollar" size={24} color="#fff" />
                            </View>
                            <Text style={styles.title}>Accounts</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("sales")}>
                            <View style={[styles.icons, { backgroundColor: "#8B5CF6"}]}>
                                <FontAwesome6 name="chart-line" size={24} color="#fff" />
                            </View>
                            <Text style={styles.title}>Sales</Text>
                        </TouchableOpacity>

                    </View>


                    {/* <View style={styles.start_header}>
                        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("driver")}>
                            <View style={[styles.icons, { backgroundColor: "#14B8A6" }]}>
                               <FontAwesome6 name="truck" size={24} color="#fff" />
                            </View>
                            <Text style={styles.title}>Driver</Text>
                        </TouchableOpacity>
                        <View style={styles.leftbox}></View>
                    </View> */}

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



    body: {
        paddingHorizontal: 12,
        flex: 1,
        backgroundColor: colors.white,
        marginTop: 25,
    },
    icons: {
        height: 56,
        width: 56,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    start_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },

    box: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "center",
        paddingVertical: 24,
        margin: 8,

        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    leftbox:{
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "center",
        paddingVertical: 24,
        margin: 8,
    },

})
export default AdminHome;