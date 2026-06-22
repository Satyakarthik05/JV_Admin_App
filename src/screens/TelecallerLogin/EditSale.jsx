import React, { useCallback, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';


const EditSale = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
        })
    )

    const State = [
        { label: "Andhra Predesh ", value: "Andhra Pradesh" },
        { label: "Telengana", value: "Telengana" },
    ]
    const [state, setState] = useState(null);
    const [dispatch, setDispatch] = useState('');
    const [feedback, setFeedBack] = useState('');

    const District = [
        { label: "East Godavari", value: "East Godavari" },
        { label: "West Godavari", value: "West Godavari" },
    ]
    const [district, setDistrict] = useState(null);


    const Retailer = [
        { label: "Retailer1", value: "Retailer1" },
        { label: "Retailer2", value: "Retailer2" },
    ]
    const [retailer, setRetailer] = useState(null);


    const Driver = [
        { label: "Driver1", value: "Driver1" },
        { label: "Driver2", value: "Driver2" },
    ]
    const [driver, setDriver] = useState(null);

    const VehicleNo = [
        { label: "1356", value: "1356" },
        { label: "2211", value: "2211" },
    ]
    const [vehicle, setVehicle] = useState(null);

    const CategoryData = [
        { label: "category1", value: "category1" },
        { label: "category2", value: "category2" },
    ]


    const [materailCount, setMaterialCount] = useState(1);
    const [product, setProduct] = useState([
        {
            id: 1,
            category: null,
            materialno: 1,
            name: null,
            unit: '',
            quantity: '',
            cost: '',
        }
    ])

    const AddProduct = () => {
        setProduct(prev => [
            ...prev,
            {
                id: Date.now(),
                category: null,
                materialno: materailCount + 1,
                name: null,
                unit: '',
                quantity: '',
                cost: '',
            }
        ])
        setMaterialCount(prev => prev + 1);
    };

    const removeproduct = (id) => {
        setProduct(prev => prev.filter(item => item.id !== id)) // that filtered one will store in seperate []
    }

    const totalAmount = product.reduce((sum, item) => {
        const qty = Number(item.unit || 0);
        const rate = Number(item.quantity || 0);
        return sum = sum + (qty * rate);
    }, 0);

    const [discount, setDiscount] = useState('');
    //const finalAmount = Math.max(totalAmount - Number(discount || 0), 0);

    // const discountPercentage=Number(discount) || 0;
    //     const DiscountAmount=(Amount*discountPercentage)/100;
    //     const TotalAmount=Amount-DiscountAmount;

    const discountpercentage = Number(discount) || 0;
    const DiscountAmount = (totalAmount * discountpercentage) / 100;
    const finalAmount = totalAmount - DiscountAmount;


    const [validerror, setValidError] = useState({});
    const handleValidation = () => {
        let newerror = {};

        if (!state) newerror.state = "Please Select State";
        if (!district) newerror.district = "Please Select District";
        if (!retailer) newerror.retailer = "Please Select Retailer";
        if (!driver) newerror.driver = "Please select Driver";
        if (!vehicle) newerror.vehicle = "Please select vehicle Number";
        if (!feedback) newerror.feedback = "Please Enter Feed Back";
        if (!dispatch) newerror.dispatch = "Please Enter Dispatch From ";

        //  PRODUCT VALIDATION
        product.forEach((item, index) => {
            if (!item.category) {
                newerror[`category_${index}`] = "Please select Product Name";
            }

            if (!item.unit || !item.unit.toString().trim()) {
                newerror[`unit_${index}`] = "Please enter Quantity";
            } else if (Number(item.unit) <= 0) {
                newerror[`unit_${index}`] = "Quantity must be greater than 0";
            }

            if (!item.quantity || !item.quantity.toString().trim()) {
                newerror[`quantity_${index}`] = "Please enter Rate";
            } else if (Number(item.quantity) <= 0) {
                newerror[`quantity_${index}`] = "Rate must be greater than 0";
            }
        });

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    }

    const handleSubmit=()=>{
        const isvalid= handleValidation();
        if (!isvalid) return;
    }



    return (
        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>    Edit Sale</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.card}>

                    <View style={styles.date}>
                        <Text style={styles.first}>State</Text>
                        <View style={[styles.for_border_dropdown, validerror.state ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                labelField="label"
                                valueField="value"
                                data={State}
                                placeholder="Select State"
                                value={state}
                                onChange={item => { setState(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            validerror.state ? (
                                <Text style={styles.error_text}>{validerror.state}</Text>
                            ) : null
                        }
                    </View>

                    <View style={styles.date}>
                        <Text style={styles.first}>District</Text>
                        <View style={[styles.for_border_dropdown, validerror.district ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                labelField="label"
                                valueField="value"
                                data={District}
                                placeholder="Select District"
                                value={district}
                                onChange={item => { setDistrict(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            validerror.district ? (
                                <Text style={styles.error_text}>{validerror.district}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.date}>
                        <Text style={styles.first}>Retailer</Text>
                        <View style={[styles.for_border_dropdown, validerror.retailer ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                labelField="label"
                                valueField="value"
                                data={Retailer}
                                placeholder="Select Retailer"
                                value={retailer}
                                onChange={item => { setRetailer(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            validerror.retailer ? (
                                <Text style={styles.error_text}>{validerror.retailer}</Text>
                            ) : null
                        }
                    </View>



                    <View style={styles.date}>
                        <Text style={styles.first}>Driver</Text>
                        <View style={[styles.for_border_dropdown, validerror.driver ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                labelField="label"
                                valueField="value"
                                data={Driver}
                                placeholder="Select Driver"
                                value={driver}
                                onChange={item => { setDriver(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            validerror.driver ? (
                                <Text style={styles.error_text}>{validerror.driver}</Text>
                            ) : null
                        }
                    </View>



                    <View style={styles.date}>
                        <Text style={styles.first}>Vehicle No </Text>
                        <View style={[styles.for_border_dropdown, validerror.vehicle ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                labelField="label"
                                valueField="value"
                                data={VehicleNo}
                                placeholder="Select Vehicle No "
                                value={vehicle}
                                onChange={item => { setVehicle(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            validerror.vehicle ? (
                                <Text style={styles.error_text}>{validerror.vehicle}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.date}>
                        <Text style={styles.first}>Dispatch From</Text>
                        <View style={[styles.for_border, validerror.dispatch ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfield} placeholder="Dispatch From" placeholderTextColor="#888" value={dispatch} onChangeText={setDispatch} />
                        </View>
                        {
                            validerror.dispatch ? (
                                <Text style={styles.error_text}>{validerror.dispatch}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.date}>
                        <Text style={styles.first}>Feedback</Text>
                        <View style={[styles.for_border, validerror.feedback ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfield} placeholder="Feedback" placeholderTextColor="#888" value={feedback} onChangeText={setFeedBack} />
                        </View>
                        {
                            validerror.feedback ? (
                                <Text style={styles.error_text}>{validerror.feedback}</Text>
                            ) : null
                        }
                    </View>

                </View>


                <View style={styles.date}>
                    <Text style={styles.title}>Add Product</Text>

                    {
                        product.map((item, index) => {

                            const amount = Number(item.unit || 0) * Number(item.quantity || 0) // here we are multiplying  quantity and rate 
                            return (
                                <View style={styles.card} key={index}>
                                    <View style={styles.left_side}>
                                        <Text style={styles.title}>Product {item.materialno}</Text>
                                        <TouchableOpacity onPress={() => removeproduct(item.id)}>
                                            <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
                                        </TouchableOpacity>
                                    </View>


                                    <View style={styles.date}>
                                        <Text style={styles.first}>Product Name</Text>
                                        <View style={[styles.for_border_dropdown, validerror[`category_${index}`] ? styles.errorBorder : null]}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.placeholderStyle}
                                                itemTextStyle={styles.placeholderStyle}
                                                labelField="label"
                                                valueField="value"
                                                data={CategoryData}
                                                value={item.category}
                                                onChange={val => {
                                                    setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, category: val.value } : prod))
                                                }}
                                                placeholder="Select Product name"
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

                                    {/* unit */}
                                    <View style={styles.head_new}>
                                        <View style={styles.left}>
                                            <Text style={styles.first}>Quantity</Text>
                                            <View style={[styles.for_newborder, validerror[`unit_${index}`] ? styles.errorBorder : null]}>
                                                <TextInput placeholder="Add Quantity Here" style={styles.newinputfield} value={item.unit} keyboardType="numeric" placeholderTextColor="#888"
                                                    onChangeText={text => {
                                                        setProduct(prev =>
                                                            prev.map(prod => prod.id === item.id ? { ...prod, unit: text } : prod)
                                                        )
                                                    }}
                                                />
                                            </View>
                                            {
                                                validerror[`unit_${index}`] && (
                                                    <Text style={styles.error_text}>{validerror[`unit_${index}`]}</Text>
                                                )
                                            }
                                        </View>

                                        <View style={styles.right}>
                                            <Text style={styles.first}>Rate ({`\u20B9`})</Text>
                                            <View style={[styles.for_newborder, validerror[`quantity_${index}`] ? styles.errorBorder : null]}>
                                                <TextInput placeholder="Add The Price Here" style={styles.newinputfield} value={item.quantity} keyboardType="numeric" placeholderTextColor="#888"
                                                    onChangeText={text => {
                                                        setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, quantity: text } : prod))
                                                    }}
                                                />
                                            </View>
                                            {
                                                validerror[`quantity_${index}`] && (
                                                    <Text style={styles.error_text}>{validerror[`quantity_${index}`]}</Text>
                                                )
                                            }
                                        </View>
                                    </View>


                                    <View style={[styles.for_border, { backgroundColor: colors.gray, padding: 5, marginTop: 13 }]}>
                                        <Text style={[styles.first, { color: colors.black }]}>Amount</Text>
                                        <Text style={[styles.first, { color: colors.black }]}>{`\u20B9`}{amount}</Text>
                                    </View>

                                </View>
                            )
                        })
                    }

                </View>

                <TouchableOpacity style={styles.botted} onPress={AddProduct}>
                    <Entypo name="plus" size={20} color="#4A5565" />
                    <Text style={styles.bottedText}>Add Another Product</Text>
                </TouchableOpacity>


                <View style={styles.card}>
                    <Text style={[styles.left_side, styles.title]}>Order Summary</Text>

                    <View style={styles.head_new}>
                        <Text style={[styles.first, { color: colors.black }]}>Amount</Text>
                        <Text style={[styles.title, { color: colors.black }]}>{`\u20B9`} {totalAmount}</Text>
                    </View>

                    <View style={styles.date}>
                        <Text style={styles.first}>Discount</Text>
                        <View style={styles.for_border}>
                            <TextInput style={styles.inputfield} placeholder="Discount" keyboardType="numeric" value={discount} onChangeText={text => setDiscount(text)} placeholderTextColor="#888" />
                        </View>
                        <View style={styles.dashed_border}></View>

                        <View style={styles.head_new}>
                            <Text style={[styles.title, { color: colors.black }]}>Total</Text>
                            <Text style={[styles.title, { color: colors.homeblue }]}>{`\u20B9`}{finalAmount}</Text>
                        </View>

                    </View>

                </View>


                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Update Sale</Text>
                </TouchableOpacity>


            </ScrollView>




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
        fontFamily: fonts.sfbold,
        color: colors.black,
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
    date: {
        marginTop: 13,
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
        // padding:15,
        paddingTop: 15,
        paddingBottom: 15,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft: 10,
        paddingHorizontal: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    head_new: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    newinputfield: {
        color: colors.black,
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
    left_side: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.inputfieldborder,
        paddingBottom: 10,
    },
    bg: {
        backgroundColor: colors.lightredcolor,
        padding: 8,
        borderRadius: 8,
    },
    for_newborder: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
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
        paddingLeft: 90,
    },
    bottedText: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.formtitlegry,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    dashed_border: {
        borderBottomWidth: 1,
        borderBottomColor: colors.inputfieldborder,
        textDecorationLine: 'line-through',
        borderStyle: 'dashed',
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
export default EditSale