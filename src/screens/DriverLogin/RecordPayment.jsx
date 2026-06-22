import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RecordPayment = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [image, setImage] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const customersdata = route.params;
    //const { products, subtotal, paidAmount, paymentMethod,customersdata } = route.params || {};
    //console.log("prodctss subtoyal---------------->", products, subtotal, paidAmount, paymentMethod);
    console.log("cutomer Data getting from params--------->", customersdata);




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



    console.log("Logined User Data async storege in Driver  record payment screen --------------------->", userData);
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
    };




    const handleSubmit = async () => {
        if (isSubmitting) return;

        // validation
        if (!selectedMethod) {
            Alert.alert("Error", "Please select payment method");
            return;
        }

        setIsSubmitting(true);

        try {

            const payload = {
                saleType: "ROUTE",
                driverId: userData?.id,
                // customerName: customersdata?.customersdata?.customerName ,
                // customerMobile: customersdata?.customersdata?.customerMobile ,
                customerName: customersdata?.customersdata?.ownerName,
                customerMobile: customersdata?.customersdata?.mobile,
                paymentType: selectedMethod === "cash" ? "CASH" : "QR",
                saleDate: new Date().toISOString().split("T")[0],
                items: [],
                totalAmount: 0,
                collectedAmount: 300,
                remarks: "Old due collected",
                imageUrl: image?.fileName || "receipt.jpg",
            }; 

            console.log("Record Payment Payload ----------------->", payload);

            // API CALL
            // const response = await dispatch(AddPayment(payload)).unwrap();

            Alert.alert(
                "Success",
                "Payment Recorded Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );

        } catch (error) {
            console.log("Record Payment Error ------------->", error);

            Alert.alert("Error", error?.message || "Something went wrong"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");

        }, [])
    )


    //itms cards
    const renderItem = ({ item, index }) => {
        const qty = Number(item?.orderQty || item?.quantity || 0);
        const rate = Number(item?.price || item?.rate || 0);
        const itemTotal = Number(item?.itemTotal || qty * rate);

        return (
            <View>
                <View style={styles.productRow}>
                    <View style={styles.leftProduct}>
                        <Image  source={{ uri: item?.imageUrl || 'https://via.placeholder.com/100', }} style={styles.productImage}/>

                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item?.productName || 'Product'} </Text>
                            <Text style={styles.qtyText}>{qty} x ₹{rate}</Text>
                        </View>
                    </View>
                    <Text style={styles.priceText}>₹{itemTotal}</Text>
                </View>
                {index !== products.length - 1 && <View style={styles.divider} />}
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.mainContainer}>

            <View style={styles.ListContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <View style={{ gap: 4 }}>
                    <Text style={styles.ListText}>Record Payment</Text>
                    <Text style={[commonstyles.text5]}>{customersdata?.customersdata?.shopName}</Text>
                </View>
            </View>

            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 30,
                    // borderWidth: 3
                }}
                showsVerticalScrollIndicator={false}
            >

                <View style={[commonstyles.card, commonstyles.cardgap, { backgroundColor: colors.lightpink }]}>
                    <View style={[commonstyles.row]}>
                        <Text style={[commonstyles.header1]}>Outstanding</Text>
                        <Text style={[commonstyles.header1]}>{'\u20B9'}{customersdata?.customersdata?.outstandingAmount}</Text>
                    </View>
                </View>


                
                    {/* <FlatList
                        data={products}
                        renderItem={renderItem}
                        keyExtractor={(item, index) =>
                            String(item?.id || item?._id || index)
                        }
                        scrollEnabled={false}
                        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5, }}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No Products Found</Text>
                        }
                    /> */}
                


                <View style={styles.card2}>
                    <Text style={styles.ReciveText}>Amount Recived</Text>
                    <View style={styles.AmountRecive}>
                        <Text style={styles.ReciveText}>{'\u20B9'} 250</Text>
                    </View>
                </View>

                <View style={styles.card3}>

                    <Text style={styles.paymentMethod}>Payment Method</Text>

                    {/* CASH */}
                    <TouchableOpacity
                        style={[styles.cashContainer, selectedMethod === "cash" && styles.activeMethod]}
                        onPress={() => setSelectedMethod("cash")}
                    >
                        <Text style={[commonstyles.text1, selectedMethod === "cash" && styles.activeText]} >Cash</Text>

                        <Entypo name={selectedMethod === "cash" ? "circle" : "circle"} size={22} color={selectedMethod === "cash" ? "#EF3D3B" : "#BFBFBF"}
                        />
                    </TouchableOpacity>

                    {/* QR */}
                    <TouchableOpacity
                        style={[styles.qrContainer, selectedMethod === "qr" && styles.activeMethod]}
                        onPress={() => setSelectedMethod("qr")}
                    >
                        <View style={styles.cashContainer1}>
                            <Text style={[commonstyles.text5, selectedMethod === "qr" && styles.activeText]} > QR</Text>
                            <Entypo name="circle" size={22} color={selectedMethod === "qr" ? "#EF3D3B" : "#BFBFBF"} />
                        </View>

                        {selectedMethod === "qr" && (
                            <View style={styles.scanerContainer}>
                                <Image
                                    source={require('../../assets/qrcode.png')}
                                    resizeMode="contain"
                                    style={{ width: 180, height: 180 }}
                                />

                                <Text style={styles.qrAmount}>{'\u20B9'} 1200</Text>
                            </View>
                        )}
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
                            />
                        ) : (
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
                    <TouchableOpacity style={[commonstyles.redbutton, { width: '78%', marginHorizontal: 12, marginVertical: 10, height: 45 }]} onPress={handleSubmit} disabled={isSubmitting}>
                        <Text style={[commonstyles.redbuttonText]}>Record Payment</Text>
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
        //borderColor: '#EF3D3B',
        borderColor: '#E5E7EB', // gray default
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
    activeMethod: {
        borderColor: '#EF3D3B',
        backgroundColor: '#FFF6F6',
    },

    activeText: {
        color: '#EF3D3B',
        fontWeight: '700',
    },
    productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth:'1',
    borderColor:colors.borderColor,
    },

  leftProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  productInfo: {
    marginLeft: 10,
    flex: 1,
  },

  productImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },

  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  qtyText: {
    color: '#6B7280',
    marginTop: 3,
    fontSize: 13,
  },

  priceText: {
    fontWeight: '700',
    color: '#111827',
  },


})
export default RecordPayment;