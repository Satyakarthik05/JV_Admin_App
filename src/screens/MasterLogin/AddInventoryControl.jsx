import React, { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, StatusBar, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetAccessoryCategoryData } from "../../redux/reducers/MasterLogin/AddCategory";
import { GetAccessoriesInAcc, PostAccessoriInventoryData } from "../../redux/reducers/MasterLogin/AddProduct";
import commonstyles from "../../commonstyles/commonstyles";


const AddInventoryControl = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [date, setDate] = useState(new Date());
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };



    useFocusEffect(
        useCallback(() => {
            dispatch(GetAccessoryCategoryData())//night
            dispatch(GetAccessoriesInAcc())
        }, [dispatch])
    )


    //const [type, setType] = useState(null);

    const [invoice, setInvoice] = useState('');
    const [vendorname, setVendorName] = useState('');
    const [category, setCategory] = useState(null);
    const [name, setName] = useState(null);
    const [validerror, setValidError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDate, setShowDate] = useState(false);


    const [materailCount, setMaterialCount] = useState(1);
    const [accessories, setAccessories] = useState([
        {
            id: 1,
            category: null,
            materialno: 1,
            name: null,
            unit: '',
            quantity: '',
        }
    ])
    const addAccessories = () => {
        setAccessories(prev => [
            ...prev,
            {
                id: Date.now(),
                category: null,
                materialno: materailCount + 1,
                name: null,
                unit: '',
                quantity: '',
            }
        ]);
        setMaterialCount(prev => prev + 1);
    };

    const removeAccessory = (id) => {
        setAccessories(prev => prev.filter(item => item.id !== id));
    }

    const { GetAccCategory } = useSelector((state) => state.GetAccessoryCategory);
    console.log("Get Acc Categories---------->", GetAccCategory);

    const { GetAccessoryData } = useSelector((state) => state.GetAccessoriesGetCall);
    console.log("Get Accessories Data------------>", GetAccessoryData);

    const AccessoryTypeData =
        GetAccCategory?.map(item => ({
            label: item.accessoryType,//rawMaterialCode
            //value: item?.accessoryType,//rawMaterialCode
            value: item.id,//its id
            id: item.id,
        })) || [];

    const AccessoryName =
        GetAccessoryData?.map(item => ({
            label: item.accessoryName,
            // value: item?.accessoryName,
            value: item.id,//its id 
            // id: item.id,
        })) || [];

    const handleDateChange = (event, selectedDate) => {
        setShowDate(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };


    //Validation 
    const handleValidation = () => {
        let newerror = {};

        //if (!invoice.trim()) newerror.invoice = "Please Enter InVoice Number";
        // Invoice Validation
        if (!invoice || !invoice.trim()) {
            newerror.invoice = "Please Enter Invoice Number";
        } else if (invoice.trim().length < 3) {
            newerror.invoice = "Invoice must be at least 3 characters";
        }

        // Vendor Name Validation
        if (!vendorname || !vendorname.trim()) {
            newerror.vendorname = "Please Enter Vendor Name";
        } else if (!/^[a-zA-Z\s]+$/.test(vendorname.trim())) {
            newerror.vendorname = "Vendor Name should contain only letters";
        }

        accessories.forEach((item, index) => {
            if (!item.category) newerror[`category_${index}`] = "Please select Accessory Type";
            if (!item.name) newerror[`name_${index}`] = "Please select Accessory Name";
            //if (!item.quantity?.trim()) newerror[`quantity_${index}`] = "Please Enter Quantity";
            // Quantity Validation
            if (!item.quantity || !item.quantity.toString().trim()) {
                newerror[`quantity_${index}`] = "Please Enter Quantity";
            }
            else if (isNaN(item.quantity)) {
                newerror[`quantity_${index}`] = "Quantity must be a number";
            }
            else if (Number(item.quantity) <= 0) {
                newerror[`quantity_${index}`] = "Quantity must be greater than 0";
            }
        })

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    }


    const handleSubmit = async () => {

        if (isSubmitting) return; //  prevent multiple clicks

        const isvalid = handleValidation();
        if (!isvalid) return;
        setIsSubmitting(true); //  start loader

        const payload = {
            purchaseDate: date.toISOString().split("T")[0],
            invoiceNumber: invoice,
            vendorName: vendorname,
            items: accessories.map((item, index) => ({
                accessoryTypeId: item.category,
                accessoryId: item.name,
                quantity: Number(item.quantity),
            }))
        }

        console.log("Payload data that dispatching  to redux code Add Purchase screen  to redux code -------------------->", payload);
        try {

            const response = await dispatch(PostAccessoriInventoryData(payload)).unwrap();
            Alert.alert(
                "Success", response?.data?.message || response?.message || "Added Raw Material Successfully",
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
            setIsSubmitting(false); //  stop loader
        }

    }





    return (
        <View style={styles.container}>

            <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
            <SafeAreaView >
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Add Inventory Control</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>

                <View style={styles.head}>
                    <Text style={styles.first}>Date</Text>
                    <View style={styles.for_border}>
                        <TextInput style={styles.inputfield} editable={false} value={formatDate(date)} placeholder="Date" placeholderTextColor="#888" />
                        <TouchableOpacity onPress={() => setShowDate(true)}>
                            <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.head}>
                    <Text style={styles.first}>In Voice Number</Text>
                    <View style={[styles.for_border, validerror?.invoice ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter In-Voice Number " style={styles.inputfield} placeholderTextColor="#888" value={invoice} onChangeText={setInvoice} />
                    </View>
                    {
                        validerror.invoice ? (
                            <Text style={styles.error_text}>{validerror.invoice}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.head}>
                    <Text style={styles.first}>Vendor Name</Text>
                    <View style={[styles.for_border, validerror?.vendorname ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Vendor Name" style={styles.inputfield} placeholderTextColor="#888" value={vendorname} onChangeText={setVendorName} />
                    </View>
                    {
                        validerror.vendorname ? (
                            <Text style={styles.error_text}>{validerror.vendorname}</Text>
                        ) : null
                    }
                </View>


                {/* <View style={styles.head}>
                    <Text style={styles.first}>Accessory Type</Text>
                    <View style={styles.for_border_dropdown}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            labelField="label"
                            valueField="value"
                            data={Type}
                            value={type}
                            onChange={item => { setType(item.value) }}
                            placeholder="Select Types"
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View> */}

                {/* <View style={styles.head}>
                    <Text style={styles.first}>Accessory Quantity</Text>
                    <View style={styles.for_border}>
                        <TextInput placeholder="Quantity" style={styles.inputfield} placeholderTextColor="#888" />
                    </View>
                </View> */}

                {/* <View style={styles.head}>
                    <Text style={styles.first}>Accessory Purchase</Text>
                    <View style={styles.for_border}>
                        <TextInput placeholder="Accessory Purchase" style={styles.inputfield} placeholderTextColor="#888" />
                    </View>
                </View> */}



                <View style={styles.head}>
                    <Text style={styles.title}>Accessories</Text>


                    {
                        accessories.map((item, index) => (
                            <View style={styles.card} key={item.id} >

                                <View style={styles.left_side}>
                                    <Text style={styles.title}>Accessory {item.materialno}</Text>
                                    <TouchableOpacity onPress={() => removeAccessory(item.id)} >
                                        <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Accessory Type</Text>
                                    <View style={[styles.for_border_dropdown, validerror[`category_${index}`] ? styles.errorBorder : null]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            showsVerticalScrollIndicator={false}
                                            labelField="label"
                                            valueField="value"
                                            data={AccessoryTypeData}
                                            value={item.category}
                                            onChange={val => {
                                                setAccessories(prev => prev.map(acc => acc.id === item.id ? { ...acc, category: val.value } : acc));
                                            }}
                                            placeholder="Select Accessory Type"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                    {
                                        validerror[`category_${index}`] && (
                                            <Text style={styles.error_text}>{validerror[`category_${index}`]}</Text>
                                        )
                                    }
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Accessory Name</Text>
                                    <View style={[styles.for_border_dropdown, validerror[`name_${index}`] ? styles.errorBorder : null]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            showsVerticalScrollIndicator={false}
                                            labelField="label"
                                            valueField="value"
                                            data={AccessoryName}
                                            value={item.name}
                                            onChange={val =>
                                                setAccessories(prev => prev.map(acc => acc.id === item.id ? { ...acc, name: val.value } : acc))
                                            }
                                            placeholder="Select Accessory Name"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                    {
                                        validerror[`name_${index}`] && (
                                            <Text style={styles.error_text}>{validerror[`name_${index}`]}</Text>
                                        )
                                    }
                                </View>

                                {/* <View style={styles.head_new}>
                                    <View style={styles.left}>
                                        <Text style={styles.first}>Unit of measure</Text>
                                        <View style={styles.for_newborder}>
                                            <TextInput placeholder="Accessory Purchase" style={styles.newinputfield} value={item.unit} placeholderTextColor="#888"
                                                onChangeText={text => {
                                                    setAccessories(prev =>
                                                        prev.map(acc =>
                                                            acc.id === item.id ? { ...acc, unit: text } : acc
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.right}>
                                        <Text style={styles.first}>Quantity</Text>
                                        <View style={styles.for_border}>
                                            <TextInput placeholder="Accessory Quantity" style={styles.newinputfield} value={item.quantity} placeholderTextColor="#888"
                                                onChangeText={text => {
                                                    setAccessories(prev =>
                                                        prev.map(acc =>
                                                            acc.id === item.id ? { ...acc, quantity: text } : acc
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View> */}


                                <View style={styles.head}>
                                    <Text style={styles.first}>Quantity</Text>

                                    <View style={[styles.for_border, validerror[`quantity_${index}`] ? styles.errorBorder : null]}>
                                        <TextInput
                                            placeholder="Enter Accessory Quantity"
                                            style={styles.inputfield}
                                            value={item.quantity}
                                            keyboardType="numeric"
                                            placeholderTextColor="#888"
                                            onChangeText={text => {
                                                setAccessories(prev =>
                                                    prev.map(acc =>
                                                        acc.id === item.id ? { ...acc, quantity: text } : acc
                                                    )
                                                )
                                            }}
                                        />
                                    </View>
                                    {validerror[`quantity_${index}`] && (
                                        <Text style={styles.error_text}> {validerror[`quantity_${index}`]}</Text>
                                    )}

                                </View>


                            </View>
                        ))
                    }


                </View>



                <TouchableOpacity style={styles.botted} onPress={addAccessories}>
                    <Entypo name="plus" size={20} color="#4A5565" />
                    <Text style={styles.bottedText}>Add Another Accessory Inventory</Text>
                </TouchableOpacity>


                {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Manage Inventory</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                Submitting...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Manage Inventory</Text>
                    )}
                </TouchableOpacity>


            </ScrollView>
            {
                showDate && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={handleDateChange}
                    />
                )
            }
            
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
    head_new: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13,
    },
    botted: {
        flexDirection: 'row',
        // alignSelf:'center',
        textAlign: 'center',
        marginTop: 13,

        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.commoncolor,

        paddingVertical: 8,
        borderRadius: 6,
        paddingLeft: 50,
    },
    bottedText: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.formtitlegry,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    left_side: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.inputfieldborder,
        paddingBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    bg: {
        backgroundColor: colors.lightredcolor,
        padding: 8,
        borderRadius: 8,
    },
    head: {
        marginTop: 13,
    },
    first: {
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
    for_newborder: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
    },
    newinputfield: {
        color: colors.inputfieldcolor,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 5,
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
        fontFamily: fonts.sfmedium,
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft: 5,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium,
    },
    calender_icon: {
        paddingRight: 10,
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
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20,
    },
    btn_text: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.white,
        textAlign: 'center',
        paddingTop: 16,
        paddingBottom: 16,

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


})
export default AddInventoryControl









