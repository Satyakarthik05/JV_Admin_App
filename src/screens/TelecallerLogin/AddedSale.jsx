import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import commonstyles from "../../commonstyles/commonstyles";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AddedSale = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


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

    console.log("Logined User Data async storege in Telecaller login Added Sales Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    //dumy data 
    const FollowData = [
        { id: '1', Name: "Rajesh Kumar", status: 'Pending', phno: "+91 98765 43210", Call: "Call", Date: "2025-12-25" },
        { id: '2', Name: "Rajesh Kumar", status: 'Pending', phno: "+91 98765 43210", Call: "Call", Date: "2025-12-25" },
        { id: '3', Name: "Rajesh Kumar", status: 'Pending', phno: "+91 98765 43210", Call: "Call", Date: "2025-12-25" },
        { id: '4', Name: "Rajesh Kumar", status: 'Pending', phno: "+91 98765 43210", Call: "Call", Date: "2025-12-25" },
        { id: '5', Name: "Rajesh Kumar", status: 'Pending', phno: "+91 98765 43210", Call: "Call", Date: "2025-12-25" },
        { id: '6', Name: "Rajesh Kumar", status: 'Pending', phno: "+91 98765 43210", Call: "Call", Date: "2025-12-25" },
    ]

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content");
        })
    )

    return (
        <View style={styles.container}>

            <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" />

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>  Added Sales</Text>
                </TouchableOpacity>
            </SafeAreaView>

            {
                !isAdmin && (
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("AddSale")}>
                        <Feather name="plus" size={14} color="#fff" />
                        <Text style={styles.btn_text}>Add Sale</Text>
                    </TouchableOpacity>
                )
            }



            <View style={styles.new_cards}>
                <FlatList
                    data={FollowData}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 2 }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("saleItems")}>
                                <View style={styles.top}>
                                    <View style={styles.left}>
                                        <Text style={styles.name}>{item.Name}</Text>
                                    </View>
                                    <View style={styles.right}>
                                        {
                                            !isAdmin && (
                                                <TouchableOpacity onPress={() => navigation.navigate("EditSale")}>
                                                    <Feather name="edit" size={16} color="#39AE41" />
                                                </TouchableOpacity>
                                            )
                                        }
                                        <TouchableOpacity>
                                            <Text style={styles.status}>{item.status}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={styles.phno}>{item.phno}</Text>
                                <Text style={styles.phno}>{item.Call}</Text>
                                <Text style={{ color: colors.foundationgray, }}>Reminder Set no: <Text style={styles.phno}>{item.Date}</Text></Text>
                            </TouchableOpacity>
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
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 25,
        paddingRight: 25,
        alignSelf: "flex-end",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    btn_text: {
        paddingLeft: 5,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.white
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        // marginRight: 1,
        // marginLeft: 1,
        marginTop: 13,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    status: {
        backgroundColor: colors.halfdaybg,
        color: colors.halfdayclr,
        fontFamily: fonts.sfmedium,
        fontSize: 14,
        fontWeight: 500,
        padding: 5,
        borderRadius: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.simpleblack,
    },
    phno: {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,
    },



})
export default AddedSale;