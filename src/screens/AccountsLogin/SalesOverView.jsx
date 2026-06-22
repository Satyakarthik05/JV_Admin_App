import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, FlatList, TextInput, ScrollView, RefreshControl } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch } from "react-redux";


const SalesOverView = () => {
    const Navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const route = useRoute();
    const { reportData } = route.params;
    console.log("items Data Coming from params ----------------->", reportData);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle('dark-content');
        })
    )

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    }, []);



    const [showProducts, setShowProducts] = useState(true); // initiall we are showing products

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };







    return (
        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={styles.header} onPress={() => Navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>   Assigned Stock Overview</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.sec_1}>
                    <View style={styles.top}>
                        <Text style={styles.title}>{reportData?.name}</Text>
                        {/* <Text style={styles.status}>Delivered</Text> */}
                        <Text style={styles.Address}>{reportData?.mobileNumber}</Text>
                    </View>
                    <View style={styles.top}>
                        <Text style={styles.Address}>{reportData?.vehicleName}</Text>
                        <Text style={styles.Address}>{reportData?.vehicleNumber}</Text>

                    </View>

                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Delivery Details</Text>
                    <View style={styles.top}>
                        <View style={styles.left}>
                            <Text style={styles.Address}>Created Date:</Text>
                            {/* <Text style={styles.Address}>Route Name</Text> */}
                            <Text style={styles.Address}>Assigned Driver</Text>
                        </View>
                        <View style={styles.left}>
                            <Text style={styles.place}>{formatDate(reportData?.stockDate)}</Text>
                            {/* <Text style={styles.place}>Route A</Text> */}
                            <Text style={styles.place}>{reportData?.name}</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.card}>
                    <TouchableOpacity style={styles.top} onPress={() => setShowProducts(!showProducts)}>
                        <Text style={styles.title}>Products</Text>
                        <Entypo name={showProducts ? "chevron-small-up" : "chevron-small-down"} size={18} color="#82889A" />
                    </TouchableOpacity>
                    {showProducts && (
                        <View style={styles.body}>
                            <FlatList
                                data={reportData?.items}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{ paddingHorizontal: 1 }}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                renderItem={({ item }) => {
                                    return (
                                        // <View style={styles.product_card}>
                                        //     <View style={styles.top}>
                                        //         <Text style={styles.title}>{item.type}</Text>
                                        //         <Text style={[styles.title, { color: colors.homeblue }]}>{`\u20B9`} {item.quantity * item.rate}</Text>
                                        //     </View>
                                        //     <View style={styles.top}>
                                        //         <View style={styles.left_side}>
                                        //             <Text style={styles.bottle}>{item.bottle}</Text>
                                        //             <Text style={styles.non}>{item.returnable}</Text>
                                        //         </View>
                                        //         <View style={styles.left_side}>
                                        //             <View>
                                        //                 <Text style={styles.Address}>Quantity</Text>
                                        //                 <Text style={styles.place}>{item.quantity}</Text>
                                        //             </View>
                                        //             <View>
                                        //                 <Text style={styles.Address}>Rate</Text>
                                        //                 <Text style={styles.place}>{`\u20B9`}{item.rate}</Text>
                                        //             </View>
                                        //         </View>
                                        //     </View>
                                            
                                        // </View>

                                        <View style={{ paddingTop: 2 }}>
                                            <Text style={styles.title} > Product Name:  <Text style={styles.Address} >{item.productName}</Text></Text>
                                            <Text style={styles.title} > Quantity: <Text style={styles.Address} >{item.quantity}</Text> </Text>
                                            <View style={styles.separator} />
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    )}

                </View>


                {/* <View style={[styles.card, { gap: 15 }]}>
                    <Text style={[styles.title, styles.for_border, { paddingBottom: 10 }]}>Bill Summary</Text>
                    <View style={styles.top}>
                        <Text style={styles.Address}>Amount</Text>
                        <Text style={styles.title}>{`\u20B9`}{Amount}</Text>
                    </View>
                    <View style={styles.dashed}>
                        <Text style={styles.Address}>DisCount</Text>
                        <TextInput style={styles.inputfield} placeholder="Discount" keyboardType="numeric" value={discount} onChangeText={text=>SetDiscount(text)} placeholderTextColor="#888"/>
                    </View>
                    <View style={styles.top}>
                        <Text style={styles.title}>TOTAL</Text>
                        <Text style={[styles.title, { color: colors.homeblue }]}>{`\u20B9`}{discount ? TotalAmount : Amount}</Text>
                    </View>
                </View> */}


            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        gap: 15,
    },
    body: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    left_side: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    status: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        padding: 5,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 13,
        shadowRadius: 6,
        elevation: 4,
        marginLeft: 2,
        marginRight: 5,
        marginBottom: 5,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,
    },
    product_card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 13,
        shadowRadius: 6,
        elevation: 4,
        //marginLeft:2,
        //  marginRight:5,
        marginBottom: 5,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    code: {
        fontSize: 14,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.formtitlegry,
    },
    sec_1: {
        borderWidth: 1,
        borderColor: colors.commoncolor,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 12,
        backgroundColor: colors.commomcolorlight,
    },
    Address: {
        fontSize: 14,
        fontFamily: fonts.sfregular,
        fontWeight: 400,
        color: colors.graynew,
        marginBottom: 5,

    },
    place: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfmedium,
        marginBottom: 5,

    },
    bottle: {
        color: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
    },
    non: {
        color: colors.foundationgray,
        backgroundColor: colors.lightbordercolor,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 4,
    },
    inputfield: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        color: colors.inputfieldcolor,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 15,
        fontFamily: fonts.sfbold,
        fontWeight: 700,
        marginBottom: 10,
    },
    dashed: {
        borderBottomWidth: 1,
        textDecorationLine: 'line-through',
        borderStyle: 'dashed',
        borderColor: colors.inputfieldborder,
    },
    for_border: {
        borderBottomWidth: 1,
        borderColor: colors.inputfieldborder,
    },
    separator: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ccc',
        marginVertical: 10,
    },


})
export default SalesOverView