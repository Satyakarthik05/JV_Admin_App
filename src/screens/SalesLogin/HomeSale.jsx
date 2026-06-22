import React, { useCallback } from "react";
import { Image, StatusBar, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather"
import { colors, fonts } from "../../config/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Entypo from "react-native-vector-icons/Entypo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Expense } from "../../components/svgs";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const HomeSale = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(()=>{
            StatusBar.setBackgroundColor(colors.commoncolor);
            StatusBar.setBarStyle("light-content");
        })
    )
    
    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" backgroundColor={colors.commoncolor} />
            <View style={styles.headerContainer}>
                <View>
                    <Image style={styles.image}
                        source={require('../../assets/signin_logo.png')} resizeMode="contain" />
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate("TelecallerProfile")}>
                    <Feather name="user" size={22} color={colors.white} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.walletcard} onPress={()=>navigation.navigate("reqResponse")} >
                {/* <Ionicons name="wallet-sharp" size={22} color={colors.simpleviolet} /> */}
                <Expense color="#9810FA" size={20}  /> 
                <Text style={styles.requestText}>Request Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.walletcard1} onPress={()=>navigation.navigate("AddAttendance")}>
                <FontAwesome6 name="user" size={22} color={colors.simplegreen} onPress={()=>navigation.navigate("AddAttendance")} />
                <Text style={styles.requestText}>Add Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.walletcard2} onPress={()=>navigation.navigate("ApplyLeave")}>
                {/* <FontAwesome6 name="door-open" size={22} color={colors.homepink} /> */}
                 <FontAwesome name="folder-open-o" size={22} color={colors.homepink}  />
                <Text style={styles.requestText}>Apply Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.walletcard3} onPress={() => navigation.navigate('BottomNav')}>
                <Entypo name="bar-graph" size={22} color={colors.buttonOrange} />
                <Text style={styles.requestText}>Sales</Text>
            </TouchableOpacity>
            {/* SalesOrder */}
        </View>
    )
};
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
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 10,

        shadowColor:colors.black,
        shadowOpacity:0.1,
        shadowRadius:8,
        elevation:8,
       
        backgroundColor: colors.hrhomeviolate,
        borderRadius: 12,
    },
    walletcard1: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 12,
        //padding: 16,
        backgroundColor: colors.hrhomegreen,
        borderRadius: 12,
        marginBottom:12,

         paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 10,

        shadowColor:colors.black,
        shadowOpacity:0.1,
        shadowRadius:8,
        elevation:8,
    },
    walletcard2: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 12,
        //padding: 16,
        backgroundColor: colors.hrhomenewviolet,
        borderRadius: 12,
        marginBottom:12,

        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 10,

        shadowColor:colors.black,
        shadowOpacity:0.1,
        shadowRadius:8,
        elevation:8,

    },
    walletcard3: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 12,
        //padding: 16,
        backgroundColor: colors.hrhomeyellow,
        borderRadius: 12,
        marginBottom:12,

         paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 10,

        shadowColor:colors.black,
        shadowOpacity:0.1,
        shadowRadius:8,
        elevation:8,
    },
    requestText:{
        fontFamily:fonts.sfmedium,
        fontWeight:'500',
        color:colors.black,
        fontSize:16,
    }
})
export default HomeSale;