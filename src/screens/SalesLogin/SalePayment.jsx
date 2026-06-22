import React, { useCallback, useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import commonstyles from "../../commonstyles/commonstyles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
const SalePayment = () => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const openImagePicker = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            }
            else if (response.errorCode) {
                console.log("Error ", response.errorMessage);
            }
            else {
                setImage(response.assets[0]);
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )
    
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.ListContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <View style={{ gap: 4 }}>
                    <Text style={[commonstyles.assignText]}>Payment</Text>
                    <Text>Sai Kiran Store</Text>
                </View>
            </View>

            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, }} showsVerticalScrollIndicator={false}>

                <View style={styles.card}>
                    <Text style={[commonstyles.header1]}>Bill Summary</Text>
                    <View style={styles.WaterContainer}>
                        <Text style={styles.waterCan}>20L Water Can</Text>
                        <View style={styles.Qtycontent}>
                            <Text>Qty:1 x {'\u20B9'}70</Text>
                            <Text style={styles.amountText}>{'\u20B9'}70</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.waterCan}>1L Bottle (Pack 12)</Text>
                        <View style={styles.Qtycontent}>
                            <Text>Qty:1 x {'\u20B9'}180</Text>
                            <Text style={styles.amountText}>{'\u20B9'}180</Text>
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

                    <View style={styles.Billtotal}>
                        <Text style={styles.billAmount}>Bill Total</Text>
                        <Text style={styles.billAmount1}>{'\u20B9'} 250</Text>
                    </View>
                </View>

                <View style={styles.Cashback}>
                    <Text style={styles.offerText}>10% Cashback Offer Applied</Text>
                    <Text style={styles.offeravailable}>Offer Available</Text>
                </View>

                <View style={styles.card2}>
                    <Text style={[commonstyles.header1]}>Amount Recived</Text>
                    <View style={styles.AmountRecive}>
                        <Text style={styles.ReciveText}>{'\u20B9'} 250</Text>
                    </View>
                </View>

                <View style={styles.card3}>
                    <Text style={[commonstyles.header1]}>Payment Method</Text>

                    <TouchableOpacity style={styles.cashContainer}>
                        <Text style={styles.cashText}>Cash</Text>
                        <Entypo name="circle" size={22} color="#BFBFBF" />
                    </TouchableOpacity>

                    <View style={styles.qrContainer}>
                        <TouchableOpacity style={styles.cashContainer1}>
                            <Text style={styles.cashText}>QR</Text>
                            <Entypo name="circle" size={22} color="#BFBFBF" />
                        </TouchableOpacity>

                        <View style={styles.scanerContainer}>
                            <Image source={require('../../assets/qrcode.png')} resizeMode="contain" />
                            <Text style={styles.qrAmount}>{'\u20B9'} 1200</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.cashContainer}>
                        <Text style={styles.cashText}>Cash</Text>
                        <Entypo name="circle" size={22} color="#BFBFBF" />
                    </TouchableOpacity>
                </View >

                <View style={[commonstyles.card, { marginHorizontal: 10 }]}>
                    <Text style={[commonstyles.header1]}>Upload Receipt(Optional)</Text>
                    <TouchableOpacity onPress={openImagePicker} style={styles.uploadContainer}>
                        {image ? (
                            <Image
                                source={{ uri: image.uri }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />) : (
                            <View style={[commonstyles.row1, { justifyContent: "center", gap: 10 }, commonstyles.cameracard]}>
                                <Ionicons name="camera-outline" size={22} color={colors.lightcolor} />
                                <Text style={[commonstyles.text5, { fontFamily: fonts.sfregular, color: colors.lightcolor }]}>Upload payment photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                </View>
                <View style={[commonstyles.smallcard, { backgroundColor: colors.togleGreen, marginVertical: 15, marginHorizontal: 20, justifyContent: 'center' }, commonstyles.row1,]}>
                    <FontAwesome name="check-circle" size={22} color={colors.simplegreen} />
                    <Text style={[commonstyles.text6,]}>Payment done successfully</Text>
                </View>
                <View style={[commonstyles.row1]}>
                    <TouchableOpacity style={[commonstyles.redbutton, { width: '78%', marginHorizontal: 12, marginVertical: 10, height: 45 }]} onPress={() => navigation.navigate("NewSaleCompleted")}>
                        <Text style={[commonstyles.redbuttonText]}>Confirm & Generate Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sharebtn}>
                        <FontAwesome name="share" size={22} color={colors.white} />
                    </TouchableOpacity>

                </View>

            </ScrollView>

        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    ListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 16,
        marginVertical: 10,
    },
    ListText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F1724',
    },
    card: {
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 14,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        elevation: 4,

    },
    Qtycontent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    WaterContainer: {
        marginVertical: 10,
        gap: 4,
    },
    Billtotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF8F8',
        padding: 14,
        marginVertical: 8,
        borderRadius: 8,

    },
    billAmount: {
        color: '#EF3D3B',
        fontSize: 14,
        fontWeight: '400',
    },
    billAmount1: {
        color: '#EF3D3B',
        fontSize: 16,
        fontWeight: '600',
    },
    billText: {
        fontSize: 16, fontWeight: '600',
        color: "#101828",
    },
    waterCan: {
        fontSize: 16,
        fontWeight: '400',
        color: '#101828'
    },
    amountText: {
        fontSize: 16,
        fontWeight: '600',
        color: "#101828"
    },
    Cashback: {
        borderWidth: 1,
        borderColor: '#00A63E',
        height: responsiveHeight(5),
        width: responsiveWidth(95),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DEFFEB',
        borderRadius: 8,
        marginHorizontal: 8,
        position: 'relative',
        marginVertical: 10,
    },
    offerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#151D2F'
    },
    offeravailable: {
        position: 'absolute',
        top: -8,
        left: 12,
        backgroundColor: '#EF3D3B',
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        overflow: 'hidden'
    },
    card2: {
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        // shadowRadius:16,
        elevation: 4,
    },
    AmountRecive: {
        borderWidth: 1,
        padding: 12,
        borderColor: '#E5E7EB',
        marginVertical: 10,
        borderRadius: 8,
    },
    ReciveText: {
        fontSize: 16, fontWeight: '600',
        color: '#101828'
    },
    card3: {
        padding: 14,
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        elevation: 4,
    },
    cashContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        // marginHorizontal: 5,
        borderWidth: 1,
        padding: 12,
        borderColor: '#E5E7EB',
        marginVertical: 10,
        borderRadius: 8,
    },
    paymentMethod: {
        fontSize: 16,
        fontWeight: '600',
        color: "#101828"
    },
    cashContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginHorizontal: 10,
        borderWidth: 1,
        padding: 12,
        borderColor: '#EF3D3B',
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: '#FFF6F6'
    },
    qrContainer: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        padding: 12,
        elevation: 3,
        marginBottom: 10,
    },
    scanerContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    qrAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginTop: 5,
    },
    sharebtn: {
        backgroundColor: colors.commoncolor,
        padding: 12,
        borderRadius: 50
    },
    uploadContainer: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center",
        // alignItems: "center",
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 13,
    },

})
export default SalePayment;