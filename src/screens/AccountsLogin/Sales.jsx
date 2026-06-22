import React, { useCallback, useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Feather from 'react-native-vector-icons/Feather';
import { Location } from "../../components/svgs";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";


const Sales = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor);
            StatusBar.setBarStyle("light-content");
            dispatch(requestLogin())
        }, [dispatch])
    )


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

    console.log("Logined User Data async storege in Telecaller  Login Home Screen  --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.start_header}>
                    <TouchableOpacity style={styles.for_flex} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#fff" style={styles.arrow} />
                        <Image source={require('../../assets/signin_logo.png')} style={styles.img_header} />

                    </TouchableOpacity>

                    {
                        !isAdmin && (
                            <TouchableOpacity onPress={() => navigation.navigate("TelecallerProfile")}>
                                <Feather name="user" size={24} color="#fff" style={styles.icon} />
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>

            <View style={styles.body}>

                <View style={styles.start_header}>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AssignRoute")}>
                        <View style={[styles.icons, { backgroundColor: colors.homeblue }]}>
                            <Location />
                        </View>
                        <Text style={styles.title}>Assign Route</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AssignedStock")}>
                        <View style={[styles.icons, { backgroundColor: colors.homedarkyellow }]}>
                            <FontAwesome6 name="cart-plus" size={26} color="#fff" />
                        </View>
                        <Text style={styles.title}>Assign Stock</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.start_header}>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("FactorySales")} >
                        <View style={[styles.icons, { backgroundColor: colors.homegreen }]}>
                            <MaterialIcons name="factory" size={26} color="#fff" />
                        </View>
                        <Text style={styles.title}>Add Factory Sale</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("DistributorSales")}>
                        <View style={[styles.icons, { backgroundColor: colors.homeviolate }]}>
                            <FontAwesome name="dropbox" size={26} color="#fff" />
                        </View>
                        <Text style={styles.title}>Add Distributor Sale</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.start_header}>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("VehicleDetails")}>
                        <View style={[styles.icons, { backgroundColor: "#70d7ee" }]}>
                            <FontAwesome6 name="truck" size={26} color="#fff" />
                        </View>
                        <Text style={styles.title}>Vehicle Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("AccCustomerDetails")}>
                        <View style={[styles.icons, { backgroundColor: "#f98ea7" }]}>
                            <FontAwesome6 name="toolbox" size={26} color="#fff" />
                        </View>
                        <Text style={styles.title}>Distributor Orders</Text>
                    </TouchableOpacity>


                </View>


            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    body: {
        paddingHorizontal: 12,
        flex: 1,
        backgroundColor: colors.white,
        marginTop: 25,
    },
    title: {
        fontSize: 15,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.black,
        textAlign: 'center',

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
    icons: {
        height: 56,
        width: 56,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    vector_icon: {
        padding: 10,
        borderRadius: 8,
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
    img_header: {
        height: 39,
        width: 168,
        resizeMode: 'contain',
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    card: {
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
})
export default Sales