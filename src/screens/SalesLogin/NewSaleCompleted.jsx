import React, { useCallback } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

//**************************************** Success Screen ***************************************************//
const NewSaleCompleted = () => {

    useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('#00A63E')
      StatusBar.setBarStyle("dark-content")
    }, [])
  )
 return (
        <View style={styles.mainContainer}>
            <ScrollView 
             contentContainerStyle={{flexGrow:1,paddingBottom:40}}
             showsVerticalScrollIndicator={false}
            >
            <View style={styles.statusContainer}>
                {/* <StatusBar backgroundColor="#00A63E" barStyle="light-content" /> */}
                <View style={{ alignItems: "center" }}>
                    <Image source={require('../../assets/tickmark.png')} resizeMode="contain" style={styles.image} />
                </View>
                <View style={styles.SaleContaier}>
                    <Text style={styles.saleText}>Sale Completed!</Text>
                    <Text style={styles.invoiceText}>Invoice generated successfully</Text>
                </View>
            </View>
            <View style={styles.javajWater}>
                <Text style={styles.waterText}>JAVAJ Water</Text>
                <Text style={styles.invoicenumber}>#INV-5271</Text>
            </View>

            <View style={styles.javajWater1}>
                <Text style={styles.driverText}>Driver System</Text>
                <Text style={styles.dateText}>27 Nov 2025</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.BillContainer}>
                    <Text style={styles.billTo}>Bill To:</Text>
                    <Text style={styles.shopText}>Sai Kiran Store</Text>
                    <Text style={styles.cityText}>Dowleswaram</Text>
                    <Text style={styles.cityText}>9848012345</Text>
                </View>
            </View>

            <View style={styles.card1}>
                <View style={{padding:14}}>
                <View style={styles.WaterContainer}>
                    <View style={styles.waterContainer} >
                        <Text style={styles.literText}>20L Water Can</Text>
                        <Text style={styles.literText}>{'\u20B9'}70</Text>
                    </View>
                    <Text>1 x {'\u20B9'}70</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

                <View style={styles.LiterContainer}>
                    <View style={styles.literContainer}>
                        <Text style={styles.bottelText}>1L Bottel (Pack 12)</Text>
                        <Text style={styles.bottelText}>{'\u20B9'}180</Text>
                    </View>
                    <Text>1 x {'\u20B9'}180</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

                <View style={styles.subContainer}>
                    <Text style={styles.bottelText}>Subtotal</Text>
                    <Text style={styles.bottelText}>{'\u20B9'}250</Text>
                </View>
                <View style={styles.paidContainer}>
                    <Text style={styles.paidText}>Paid (CASH)</Text>
                    <Text style={styles.paidText}>Paid in Full</Text>
                </View>
                </View>
                <View style={styles.businessContainer}>
                  <Text style={styles.businessText}>Thank you for your business!</Text>
            </View>
            </View>
            <View style={styles.sharemodelContainer}>
                <TouchableOpacity style={styles.shareContiner}>
                  <EvilIcons name="share-google" size={18} color="#fff"/> 
                  <Text style={styles.invoiceText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadContainer}>
                    <AntDesign name="download" size={18} color="#292D32" />  
                    <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.markContainer}>
              <Text style={styles.markText}>Mark Visit Complete</Text>
            </TouchableOpacity>
            
</ScrollView>
        </View>
    )
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        //borderWidth:3
    },
    statusContainer: {
        backgroundColor: "#00A63E",
        paddingTop: 100,
        paddingBottom: 40
    },
    SaleContaier: {
        alignItems: "center",
        marginVertical: 20,
        gap: 8
    },
    saleText: {
        fontSize: 20,
        color: "#fff",
        fontWeight: '700'
    },
    invoiceText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '400'
    },
    image: {
        height: 80,
        width: 80
    },
    javajWater: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 10,
        paddingHorizontal: 7,
    },
    waterText: {
        fontSize: 20,
        color: '#000000',
        fontWeight: '700'
    },
    invoicenumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00A63E'
    },
    javajWater1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginHorizontal: 8,
    },
    driverText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#4A5565'
    },
    dateText: {
        color: '#4A5565',
        fontSize: 16,
        fontWeight: '400'
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 10,
        marginVertical: 14,
        marginHorizontal: 18,
        borderRadius: 8,
        elevation: 4,
    },
    BillContainer: {
        padding: 8,
        gap: 4,
        marginLeft: 5,
    },
    billTo: {
        fontSize: 16,
        fontWeight: '400',
        color: '#4A5565',
    },
    shopText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101828'
    },
    cityText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#4A5565'
    },
    WaterContainer:{
    marginBottom:10
    },
    waterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    
    },
    LiterContainer:{
      marginBottom:10,marginVertical:10,
    },
    literContainer:{
        flexDirection:'row',
         justifyContent:'space-between',
    },
    subContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:14
    },
    card1:{
        borderWidth:1,
        backgroundColor:'#ffffff',
        marginVertical:10,
        marginHorizontal:10,
        borderColor:'#D2D2D2',
        borderRadius:8,
        elevation:4,
    },
    paidContainer:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    businessContainer:{
        backgroundColor:'#E8E8E8',
        padding:14,
        borderRadius:8,
        alignItems:'center',
    },
    businessText:{
        fontSize:14,
        fontWeight:'600',
        color:'#262626'
    },
    literText:{
        fontSize:16,
        fontWeight:'600',
        color:"#101828",
    },
    bottelText:{
        fontSize:16,
        fontWeight:'600',
        color:'#101828'
    },
    paidText:{
       fontSize:16,
       fontWeight:'400' ,
       color:'#00A63E'
    },
    shareContiner:{
        flexDirection:'row',
         backgroundColor:"#00A63E",
         width:responsiveWidth(45),
         height:responsiveHeight(5),
         justifyContent:'center',
         alignItems:"center",
        //  marginHorizontal:12,
         marginVertical:16,
         borderRadius:8,
         gap:4
    },
    downloadContainer:{
         flexDirection:'row',
         backgroundColor:"#F3F4F6",
         width:responsiveWidth(45),
         height:responsiveHeight(5),
         justifyContent:'center',
         alignItems:"center",
        //  marginHorizontal:12,
         marginVertical:16,
         borderRadius:8,
         gap:4
    },
    sharemodelContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginHorizontal:8,
        gap:8   
    },
    markContainer:{
       backgroundColor:'#EF3D3B',
       height:responsiveHeight(6.5),
       width:responsiveWidth(93),
       justifyContent:'center',
       alignItems:'center',
       marginLeft:10,borderRadius:8
    },
    markText:{
        fontWeight:'600',
        fontSize:16,
        color:'#fff'
    }
})
export default NewSaleCompleted;