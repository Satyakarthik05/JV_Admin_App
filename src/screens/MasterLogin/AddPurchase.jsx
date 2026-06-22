import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, StatusBar, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddPurchase, GetAllRawMaterialData, GetSupplierInformationData } from "../../redux/reducers/MasterLogin/AddProduct";
import { useDispatch, useSelector } from "react-redux";
import { GetUnitsData } from "../../redux/reducers/MasterLogin/AddCategory";
import commonstyles from "../../commonstyles/commonstyles";


const Addpurchase = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            dispatch(GetAllRawMaterialData())
            dispatch(GetUnitsData())
            dispatch(GetSupplierInformationData())
        }, [])
    )

    const { GetRawMaterialData } = useSelector((state) => state.GetRawMaterialsData);
    console.log("Get Raw Material data in Add Purchase Screen -->", GetRawMaterialData);

    const { GetRawCategory } = useSelector((state) => state.GetAllRawCategy);
    console.log("GetRaw Categories data ------------------>", GetRawCategory);

    const { SupplierInfoData } = useSelector((state) => state.GetSupplierInfo);
    console.log("Get Supplier Information Data In Add Purchase Screen  ===============>", SupplierInfoData);

    const { UnitsData } = useSelector((state) => state.GetUnitsRawMaster);
    console.log("Get Units  data in Add Purchase  page===============>", UnitsData);
    const [unitList, setUnitList] = useState([]);


    const SupplierData =
        SupplierInfoData?.map(item => ({
            label: item.supplierName,
            value: item.supplierName,
            id: item.id
        })) || [];



    const CategoryData =
        GetRawCategory?.map(item => ({
            label: item.categoryName,
            value: item.categoryName,
            id: item.id
        })) || [];




    const MaterialNameData =
        GetRawMaterialData?.map(item => ({
            label: item.rawMaterialName,//rawMaterialCode
            value: item?.rawMaterialName,//rawMaterialCode
            id: item.id,
        })) || [];


    useEffect(() => {
        if (UnitsData && UnitsData.length > 0) {
            setUnitList(
                UnitsData.map(item => ({
                    label: item.unitName,
                    value: item.unitName,
                }))
            );
        }
    }, [UnitsData]);


    const [name, setName] = useState(null);

    const [showDate, setShowDate] = useState(false);  // show calender

    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();

        return `${year}-${month}-${day}`; // IMPORTANT (API friendly)
    };

    const [date, setDate] = useState(getTodayDate());



    const TodayDate = (event, selectedDate) => {
        setShowDate(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setDate(formattedDate);
        }
    };

    const [supplierName, setSupplierName] = useState('');
    const [inVoiceNumber, setInVoiceNumber] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [materailCount, setMaterialCount] = useState(1);
    const [product, setProduct] = useState([
        {
            id: 1,
            // rawMaterialId: null,
            category: null,
            materialno: 1,
            name: null,
            unit: null,
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
                unit: null,
                quantity: '',
                cost: '',
            }
        ])
        setMaterialCount(prev => prev + 1);
    };

    const removeproduct = (id) => {
        setProduct(prev => prev.filter(item => item.id !== id)) // that filtered one will store in seperate []
    }







    // total Amount 
    useEffect(() => {
        const total = product.reduce((sum, item) => {
            const qty = Number(item.quantity || 0);
            const cost = Number(item.cost || 0);

            return sum + (qty * cost);
        }, 0);

        setTotalAmount(String(total));
    }, [product]);




    const [validerror, setValidError] = useState({});
    const validationError = () => {
        let newerror = {};

        //Supplier Info
        if (!supplierName) {
            newerror.supplierName = "Please select Supplier";
        }

        if (!inVoiceNumber.trim()) newerror.inVoiceNumber = "Please Enter InVoice Number";
        //if (!totalAmount.trim()) newerror.totalAmount = "Please Enter Total Amount";

        //Total Amount (only numbers, > 0)
        if (!totalAmount || !totalAmount.trim()) {
            newerror.totalAmount = "Please Enter Total Amount";
        } else if (!/^\d+(\.\d{1,2})?$/.test(totalAmount)) {
            newerror.totalAmount = "Enter valid amount (numbers only)";
        }

        // if (!remarks.trim()) newerror.remarks = "Please Enter Remarks";
        if (!date) newerror.date = "Please Select Date";

        //product validation
        product.forEach((item, index) => {
            if (!item.category) newerror[`category_${index}`] = "Please select Category";
            if (!item.name) newerror[`material_${index}`] = "Please select Material Code";
            if (!item.unit) newerror[`unit_${index}`] = "select Unit Price";


            //  Quantity (only numbers, > 0)
            if (!item.quantity || !item.quantity.trim()) {
                newerror[`quantity_${index}`] = "Please Enter Quantity";
            } else if (!/^\d+(\.\d+)?$/.test(item.quantity)) {
                newerror[`quantity_${index}`] = "Enter valid quantity";
            } else if (Number(item.quantity) <= 0) {
                newerror[`quantity_${index}`] = "Quantity must be greater than 0";
            }


            //  Purchase Cost (only numbers, > 0)
            if (!item.cost || !item.cost.trim()) {
                newerror[`cost_${index}`] = "Please Enter Purchase Cost";
            } else if (!/^\d+(\.\d{1,2})?$/.test(item.cost)) {
                newerror[`cost_${index}`] = "Enter valid cost";
            } else if (Number(item.cost) <= 0) {
                newerror[`cost_${index}`] = "Cost must be greater than 0";
            }

        });

        setValidError(newerror);
        return Object.keys(newerror).length === 0;

    }


    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent multiple clicks

        console.log("***came to handle submit function***");

        const isvalid = validationError();
        if (!isvalid) return;

        setIsSubmitting(true); //  start loader

        const payload = {
            //new supplier id and name 
            // supplierId: selectedSupplierId,   // supplier id
            supplierName:supplierName, // name of supplier
            invoiceNumber: inVoiceNumber,
            purchaseDate: date,
            totalAmount: Number(totalAmount),
            remarks: remarks,
            items: product.map((item, index) => ({
                rawMaterialId: index + 1,
                rawMaterialCode: item.name,
                quantity: Number(item.quantity),
                //  unitPrice: Number(item.unit),
                unit: item.unit,// new for units
                totalPrice: Number(item.cost)
            }))
        }



        console.log("Payload data that dispatching  to redux code Add Purchase screen  to redux code -------------------->", payload);
        try {

            const response = await dispatch(AddPurchase(payload)).unwrap();
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
                    <Text style={commonstyles.title}>Add Purchase</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>

                <Text style={styles.title} >Supplier Information</Text>
                <View style={styles.card}>
                    <View style={styles.head}>
                        <Text style={styles.first}>Supplier Name</Text>
                        {/* <View style={[styles.for_border, validerror?.supplierName ? styles.errorBorder : null]}>
                            <TextInput placeholder="supplier Name" style={styles.inputfield} placeholderTextColor="#888" value={supplierName} onChangeText={setSupplierName} />
                        </View> */}
                        <View style={[styles.for_border_dropdown, validerror?.supplierName ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                data={SupplierData}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Supplier"
                                value={supplierName}
                                onChange={(item) => {
                                    setSupplierName(item.value);
                                }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            validerror.supplierName ? (
                                <Text style={styles.error_text}>{validerror.supplierName}</Text>
                            ) : null
                        }
                    </View>



                    <View style={styles.head}>
                        <Text style={styles.first}>In Voice Number</Text>
                        <View style={[styles.for_border, validerror?.inVoiceNumber ? styles.errorBorder : null]}>
                            <TextInput placeholder="In voice Number " style={styles.inputfield} placeholderTextColor="#888" value={inVoiceNumber} onChangeText={setInVoiceNumber} maxLength={8} />
                        </View>
                        {
                            validerror.inVoiceNumber ? (
                                <Text style={styles.error_text}>{validerror.inVoiceNumber}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.head}>
                        <Text style={styles.first}>Purchase Date</Text>
                        <View style={[styles.for_border, validerror?.date ? styles.errorBorder : null]}>
                            <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
                            <TouchableOpacity onPress={() => setShowDate(true)}>
                                <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                            </TouchableOpacity>
                        </View>
                        {
                            validerror.date ? (
                                <Text style={styles.error_text}>{validerror.date}</Text>
                            ) : null
                        }
                        {/* onPress={() => setShowDate(true)} */}
                    </View>

                    <View style={styles.head}>
                        <Text style={styles.first}>Total Amount</Text>
                        <View style={[styles.for_border, validerror?.totalAmount ? styles.errorBorder : null]}>
                            <TextInput placeholder="Total Amount" style={styles.inputfield} placeholderTextColor="#888" value={totalAmount} editable={false} />
                        </View>
                        {
                            validerror.totalAmount ? (
                                <Text style={styles.error_text}>{validerror.totalAmount}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.head}>
                        <Text style={styles.first}>Remarks</Text>
                        <View style={styles.for_border}>
                            <TextInput placeholder="Remarks" style={styles.inputfield} placeholderTextColor="#888" value={remarks} onChangeText={setRemarks} />
                        </View>

                    </View>


                </View>





                <View style={styles.head}>
                    <Text style={styles.title}>Products / Materials Supplied</Text>

                    {
                        product.map((item, index) => (
                            <View style={styles.card} key={item.id}>
                                <View style={styles.left_side}>
                                    <Text style={styles.title}>Product {item.materialno}</Text>
                                    <TouchableOpacity onPress={() => removeproduct(item.id)}>
                                        <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.head}>
                                    <Text style={styles.first}>Raw Material Category</Text>

                                    <View style={[styles.for_border_dropdown, validerror[`category_${index}`] ? styles.errorBorder : null]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            showsVerticalScrollIndicator={false}
                                            labelField="label"
                                            valueField="value"
                                            data={CategoryData}
                                            value={item.category}
                                            placeholder="Raw Material Category"
                                            onChange={val => {
                                                setProduct(prev =>
                                                    prev.map(prod =>
                                                        prod.id === item.id
                                                            ? { ...prod, category: val.value }
                                                            : prod
                                                    )
                                                )
                                            }}

                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>

                                    {
                                        validerror[`category_${index}`] &&
                                        <Text style={styles.error_text}>
                                            {validerror[`category_${index}`]}
                                        </Text>
                                    }
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Product Name</Text>
                                    <View style={[styles.for_border_dropdown, validerror[`material_${index}`] ? styles.errorBorder : null]}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            labelField="label"
                                            valueField="value"
                                            data={MaterialNameData}
                                            value={item.name}
                                            onChange={val => {
                                                setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, name: val.value } : prod))
                                            }
                                            }
                                            placeholder="Select Product Name"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                    {
                                        validerror[`material_${index}`] &&
                                        <Text style={styles.error_text}>
                                            {validerror[`material_${index}`]}
                                        </Text>
                                    }

                                </View>





                                {/* <View style={styles.head}>
                                    <Text style={styles.first}>Quantity</Text>

                                    <View style={[styles.for_newborder, validerror[`quantity_${index}`] ? styles.errorBorder : null]}>
                                        <TextInput
                                            placeholder="Product Quantity"
                                            style={styles.inputfield}
                                            value={item.quantity}
                                            keyboardType="numeric"
                                            placeholderTextColor="#888"
                                            onChangeText={text => {
                                                setProduct(prev =>
                                                    prev.map(prod =>
                                                        prod.id === item.id
                                                            ? { ...prod, quantity: text }
                                                            : prod
                                                    )
                                                )
                                            }}
                                        />
                                    </View>

                                    {
                                        validerror[`quantity_${index}`] &&
                                        <Text style={styles.error_text}>
                                            {validerror[`quantity_${index}`]}
                                        </Text>
                                    }
                                </View> */}


                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 13 }}>

                                    {/* Quantity */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.first}>Quantity</Text>

                                        <View style={[styles.for_newborder, validerror[`quantity_${index}`] ? styles.errorBorder : null]}>
                                            <TextInput
                                                placeholder="Quantity"
                                                style={styles.inputfield}
                                                value={item.quantity}
                                                keyboardType="numeric"
                                                placeholderTextColor="#888"
                                                onChangeText={text => {
                                                    setProduct(prev =>
                                                        prev.map(prod =>
                                                            prod.id === item.id
                                                                ? { ...prod, quantity: text }
                                                                : prod
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>

                                        {validerror[`quantity_${index}`] &&
                                            <Text style={styles.error_text}>{validerror[`quantity_${index}`]}</Text>
                                        }
                                    </View>


                                    {/* Unit Dropdown */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.first}>Unit</Text>

                                        <View style={[styles.for_border_dropdown, validerror[`unit_${index}`] ? styles.errorBorder : null]}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={commonstyles.placeholderStyle}
                                                selectedTextStyle={commonstyles.placeholderStyle}
                                                itemTextStyle={commonstyles.placeholderStyle}
                                                data={unitList}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Units"
                                                value={item.unit}
                                                showsVerticalScrollIndicator={false}
                                                onChange={val => {
                                                    setProduct(prev =>
                                                        prev.map(prod =>
                                                            prod.id === item.id
                                                                ? { ...prod, unit: val.value }
                                                                : prod
                                                        )
                                                    )
                                                }}
                                                renderRightIcon={() => (
                                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={commonstyles.calender_icon} />
                                                )}
                                            />
                                        </View>

                                        {validerror[`unit_${index}`] &&
                                            <Text style={styles.error_text}>{validerror[`unit_${index}`]}</Text>
                                        }
                                    </View>

                                </View>




                                <View style={styles.head}>
                                    <Text style={styles.first}>Purchase Cost</Text>
                                    <View style={[styles.for_newborder, validerror[`cost_${index}`] ? styles.errorBorder : null]}>
                                        <TextInput placeholder="Purchase Cost" style={styles.inputfield} value={item.cost} placeholderTextColor="#888" editable={true} keyboardType="numeric"
                                            onChangeText={text => {
                                                setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, cost: text } : prod))
                                            }}
                                        />
                                    </View>
                                    {
                                        validerror[`cost_${index}`] &&
                                        <Text style={styles.error_text}>
                                            {validerror[`cost_${index}`]}
                                        </Text>
                                    }
                                </View>

                            </View>
                        ))
                    }


                </View>



                <TouchableOpacity style={styles.botted} onPress={AddProduct}>
                    <Entypo name="plus" size={20} color="#4A5565" />
                    <Text style={styles.bottedText}>Add Another Product</Text>
                </TouchableOpacity>




                <TouchableOpacity
                    style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                Submitting...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Add Purchase</Text>
                    )}
                </TouchableOpacity>


            </ScrollView>
            {
                showDate &&
                <DateTimePicker
                    // value={new Date()}
                    value={new Date(date)}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={TodayDate}
                />
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
    calender_icon: {
        paddingRight: 15,
    },
    main: {
        marginTop: 13,
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
        paddingLeft: 90,
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
        // paddingLeft: 5,
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
export default Addpurchase