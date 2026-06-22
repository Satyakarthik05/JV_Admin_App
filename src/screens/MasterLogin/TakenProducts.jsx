import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GetProductsInMaster, TakeProductsData } from "../../redux/reducers/MasterLogin/AddProduct";
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';



const TakenProducts = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const route = useRoute();
    const { namePhno } = route.params;
    console.log("name and phno  coming from Summary through params Data----------------------->", namePhno);

    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        return `${year}-${month}-${day}`;
    };

    const [date, setDate] = useState(getTodayDate());
    const [validerror, setValidError] = useState({});
    const [qty, setQty] = useState('');
    const [remarks, setRemarks] = useState('');
    const [product, setProduct] = useState(null);
    const [showDate, setShowDate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useFocusEffect(
        useCallback(() => {
            dispatch(GetProductsInMaster())
        }, [dispatch])
    );

    const handleDateChange = (event, selectedDate) => {
        setShowDate(false);

        if (selectedDate) {
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();

            setDate(`${year}-${month}-${day}`);
        }
    };



    const { GetProductData } = useSelector((state) => state.GetProductsInPM);
    console.log("GetProducts Data Taken Products Data Page ----------------------->", GetProductData);

    const ProductsData =
        GetProductData?.map(item => ({
            label: item.productName,
            value: item.id,
            //id: item.id
        })) || [];


    const handleValidation = () => {
        let newerror = {};

        if (!qty) {
            newerror.qty = "Please enter quantity";
        } else if (isNaN(qty)) {
            newerror.qty = "Quantity must be a number";
        } else if (Number(qty) <= 0) {
            newerror.qty = "Quantity must be greater than 0";
        }

        //   if (!remarks) newerror.remarks = "Please Enter remarks";

        if (!product) {
            newerror.product = "Please select product";
        }


        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }



    const handleSubmit = async () => {

        if (isSubmitting) return; // prevent double click

        const isvalid = handleValidation();
        if (!isvalid) return;

        setIsSubmitting(true);


        const payload = {
            // transferId: 1,
            vendorName: namePhno?.vendorName,
            contactNumber: namePhno?.contactNumber,
            receiveDate: date,
            receivedQty: Number(qty),
            productId: product,
            remarks: remarks
        }

        console.log("Payload Data--------->", payload);
        try {
            const response = await dispatch(TakeProductsData(payload)).unwrap();
            Alert.alert(
                "Success", response?.message || "Added Taken Products Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => { navigation.goBack() }
                    }
                ]
            )
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false); //  reset
        }

    }

    //**********************************Taken Products Form **************************//
    return (
        <View style={styles.container}>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ flex: 1 }}>
                        <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                        <SafeAreaView style={{ paddingTop: insets.top }} >
                            <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                                <Feather name="arrow-left" size={24} color="#000" />
                                <View style={{ flexDirection: 'column', gap: 2 }}>
                                    <Text style={styles.title}>{namePhno?.vendorName}</Text>
                                    <Text style={styles.first}>{namePhno?.contactNumber}</Text>
                                </View>
                            </TouchableOpacity>
                        </SafeAreaView>


                        <Text style={[styles.title, styles.extra]}>Taken Products</Text>


                        <View style={styles.card}>
                            <View style={styles.head}>
                                <Text style={styles.name}>Date</Text>
                                <View style={styles.for_border}>
                                    <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
                                    <TouchableOpacity onPress={() => setShowDate(true)} >
                                        <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.head}>
                                <Text style={styles.name}>Products</Text>
                                <View style={[styles.for_border_dropdown, validerror?.product ? styles.errorBorder : null, { zIndex: 1000 }]}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.placeholderStyle}
                                        itemTextStyle={styles.placeholderStyle}
                                        showsVerticalScrollIndicator={false}
                                        data={ProductsData}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Products"
                                        value={product}
                                        onChange={(item) => {
                                            setProduct(item.value)
                                        }}
                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}
                                    />
                                </View>
                                {
                                    validerror.product ? (
                                        <Text style={styles.error_text}>{validerror.product}</Text>
                                    ) : null
                                }
                            </View>

                            <View style={styles.head}>
                                <Text style={styles.name}>Quantity</Text>
                                <View style={[styles.for_border, validerror.qty ? styles.errorBorder : null]}>
                                    <TextInput placeholder="Enter Quantity" style={styles.inputfield} placeholderTextColor="#888" value={qty} onChangeText={setQty} keyboardType="numeric" />
                                </View>
                                {
                                    validerror.qty ? (
                                        <Text style={styles.error_text}>{validerror.qty}</Text>
                                    ) : null
                                }
                            </View>


                            <View style={styles.head}>
                                <Text style={styles.name}>Remarks</Text>
                                <View style={styles.for_border}>
                                    <TextInput placeholder="Remarks" style={styles.inputfield} placeholderTextColor="#888" value={remarks} onChangeText={setRemarks} />
                                </View>
                                {/* {
                                    validerror.remarks ? (
                                        <Text style={styles.error_text}>{validerror.remarks}</Text>
                                    ) : null
                                } */}
                            </View>

                        </View>
                        {
                            showDate &&
                            <DateTimePicker
                                value={new Date(date)}
                                mode="date"
                                display="default"
                                minimumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        }


                    </View>
                </ScrollView>
            </KeyboardAvoidingView>


            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 15 }]}>
                {/* <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Update Material</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={[styles.btn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting} >
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                Submitting...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Update Material</Text>
                    )}
                </TouchableOpacity>

            </View>

        </View>
    )
}
export default TakenProducts
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        // gap: responsiveHeight(2),
    },
    extra: {
        paddingTop: responsiveHeight(2),
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        gap: 8
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    green: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.homegreen,
        fontFamily: fonts.sfbold,
    },
    first: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.formtitlegry,
        fontFamily: fonts.sfregular,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        marginRight: 1,
        marginLeft: 1,
        marginTop: 13,
        overflow: 'visible',
    },
    head: {
        marginTop: 13,
    },
    name: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.formtitlegry,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        height: 50,
    },
    dropdown: {
        flex: 1,
        height: 48,
        elevation: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft:5,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium,
    },
    calender_icon: {
        paddingRight: 15,
    },
    error_text: {
        color: colors.error,
        fontSize: 13,
        marginTop: 4,
        fontFamily: fonts.sfmedium,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 16,
        borderRadius: 8,
        //marginBottom:2,
    },
    btn_text: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
        fontFamily: fonts.sfbold,
        textAlign: 'center',
    },




})