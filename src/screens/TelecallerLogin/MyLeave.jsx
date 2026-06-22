import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, View,Text,TouchableOpacity,StatusBar, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
//import Splash from "./Splash";
import { colors, fonts } from "../../config/theme";

const Data=[
    {id:'1',date:"11/12/25 to 15/12/25",status:"Accepted",reson:"Need  for petrol",leaveType:"Sick Leave"},
    {id:'2',date:"11/12/25 to 15/12/25 ",status:"Rejected",reson:"Need  for petrol",leaveType:"Sick Leave"},
    {id:'3',date:"11/12/25 to 15/12/25 ",status:"Accepted",reson:"Need  for petrol",leaveType:"Sick Leave"},
    {id:'4',date:"11/12/25 to 15/12/25 ",status:"Rejected",reson:"Need  for petrol",leaveType:"Sick Leave"},
    {id:'5',date:"11/12/25 to 15/12/25 ",status:"Accepted",reson:"Need  for petrol",leaveType:"Sick Leave"},

]

const MyLeave = () => {
    const navigation=useNavigation();

    useFocusEffect(
            useCallback(()=>{
                StatusBar.setBackgroundColor(colors.white)
                StatusBar.setBarStyle("dark-content")
            })
    )

    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}
            <SafeAreaView style={styles.top}>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>My Leaves</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("ApplyLeave")}>
                    <Text style={styles.btn_text}>Apply Leave</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.data}>
                <FlatList
                data={Data}
                keyExtractor={item=>item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20,paddingHorizontal:5 }}
                renderItem={({item,index})=>{
                    return(
                        <View style={styles.card}>
                            <View style={styles.first}>
                                <Text style={styles.date}>{item.date}</Text>
                                <Text style={[item.status ==="Accepted"? styles.status :styles.rejected]}>{item.status}</Text>
                            </View>
                            <Text style={{color:colors.foundationgray}}> LeaveType: <Text  style={styles.amount}>{item.leaveType}</Text></Text>
                            <Text style={{color:colors.foundationgray}} >Duration :<Text style={styles.amount}>{item.reson}</Text></Text>
                        </View>
                        
                    )
                }}
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.white,
        paddingHorizontal:12,
    },
     header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: colors.black,
        marginLeft: 10,
        fontFamily:fonts.sfbold,
    },
    button: {
        backgroundColor: colors.commoncolor,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 25,
        paddingRight: 16,
        borderRadius: 8,
        width:150,
    },
    btn_text:{
        fontSize:16,
        fontWeight:700,
        color:colors.white,
        fontFamily:fonts.sfbold,
        textAlign:'center',
    },
    top:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    card:{
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding:10,
        shadowRadius: 6,
        elevation: 4,
        // marginleft:10,
        // marginRight:10,
        marginBottom: 10,
        marginTop:10,
        flexDirection:'column',
        gap:5,
    },
    first:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    date:{
       fontSize:14,
       fontWeight:700,
       color:colors.simpleblack,
       fontFamily:fonts.sfbold,
    },
    status:{
        backgroundColor:colors.btnbggreen,
        color:colors.btntextgreen,
        fontSize:14,
        fontWeight:"500",
        paddingTop:4,
        paddingBottom:4,
        paddingRight:8,
        paddingLeft:8,
        borderRadius:4,
        fontFamily:fonts.sfmedium,
    },
    rejected:{
        backgroundColor:colors.commomcolorlight,
        color:colors.commoncolor,
        fontSize:14,
        fontWeight:"500",
        paddingTop:4,
        paddingBottom:4,
        paddingRight:8,
        paddingLeft:8,
        borderRadius:4,
        fontFamily:fonts.sfmedium,
    },
    amount:{
        fontSize:14,
        fontWeight:600,
        color:colors.formtitlegry,
        fontFamily:fonts.sfmedium,
    },



})
export default MyLeave