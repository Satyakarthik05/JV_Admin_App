import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from "@react-navigation/native";

const RawMaterialProducts = () => {
    const navigation=useNavigation();
    const route=useRoute();

    const {RawData}=route.params;
    console.log("RawData-------->",RawData);
    
    
    return (

        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={styles.head} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>RawMaterial Products</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
            data={RawData}
            keyExtractor={item=>item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal:2,paddingBottom:100}}
            renderItem={({item})=>{
                return(
                    <View style={styles.card}>
                        <View style={styles.for_flex}>
                            <Text style={styles.category}>{item.productName}</Text>
                            {/* <Text style={styles.category} >{item.name}</Text> */}
                        </View>
                        {/* <View style={styles.for_flex}>
                            <Text style={styles.units}><Text style={styles.units_text}>Units :</Text>{item.units}</Text>
                            <Text style={styles.units} ><Text style={styles.units_text}>Quantity :</Text> {item.qty}</Text>
                        </View> */}
                    </View>
                )
            }}
            />
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: colors.black,
        marginLeft: 10,
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
        marginBottom: 5,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,

    },
    category:{
        fontSize:16,
        fontWeight:700,
        fontFamily:fonts.sfbold,
        color:colors.foundationgray,
    },
    for_flex:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    units:{
        fontSize:14,
        fontWeight:500,
        fontFamily:fonts.sfmedium,
        color:colors.foundationgray,
    },
    units_text:{
         fontSize:14,
        fontWeight:500,
        fontFamily:fonts.sfmedium,
        color:colors.black,
    },
})
export default RawMaterialProducts