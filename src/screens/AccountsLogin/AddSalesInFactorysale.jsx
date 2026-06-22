// import React, { useCallback, useState } from "react";
// import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from "react-native";
// import { colors, fonts } from "../../config/theme";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Feather from 'react-native-vector-icons/Feather';
// import { Dropdown } from "react-native-element-dropdown";
// import Entypo from 'react-native-vector-icons/Entypo';
// import { useDispatch, useSelector } from "react-redux";
// import { GetProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
// import { GetCustomerData } from "../../redux/reducers/DriverLogin/Forms";
// import commonstyles from "../../commonstyles/commonstyles";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { AddFactorySaleData } from "../../redux/reducers/AccounsLogin/VehicleDetails";



// const AddSalesInFactorySales = () => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();

//     useFocusEffect(
//         useCallback(() => {
//             StatusBar.setBackgroundColor(colors.white)
//             StatusBar.setBarStyle("dark-content");
//             dispatch(GetProductsInMaster());
//             dispatch(GetCustomerData())
//         }, [dispatch])
//     )

//     const { GetProductData } = useSelector((state) => state.GetProductsInPM);
//     console.log("GetProducts Data in Add Sales for Factory---------------------->", GetProductData);

//     const { CustomersDataGetCall } = useSelector((state) => state.GetCustomers);
//     console.log("Customers Data  in factory sales ---------------------->", CustomersDataGetCall);


//     const [customer, setCustomer] = useState(null);
//     const [validerror, setValidError] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [payment, setPayment] = useState('');
//     const [phno, setPhno] = useState('');
//     const [showDate, setShowDate] = useState(false);  // show calender
//     const CustomerData = CustomersDataGetCall?.map(item => ({
//         label: item.ownerName,
//         value: item.ownerName,
//         mobile: item.mobile,
//     })) || [];


//     // dropdown for products data
//     const productsData =
//         GetProductData?.map(item => ({
//             label: item.productName,// name
//             value: item.id,//value
//         })) || [];


//     const paymentTypeData = [
//         { label: "CASH", value: "CASH" },
//         { label: "UPI", value: "UPI" },
//     ];

//     const [materailCount, setMaterialCount] = useState(1);
//     const [product, setProduct] = useState([
//         {
//             id: 1,
//             productID: null,
//             materialno: 1,
//             name: null,
//             qty: '',
//             rate: '',
//             cost: '',
//         }
//     ])

//     const AddProduct = () => {
//         setProduct(prev => [
//             ...prev,
//             {
//                 id: Date.now(),
//                 productID: null,
//                 materialno: materailCount + 1,
//                 name: null,
//                 qty: '',
//                 rate: '',
//                 cost: '',
//             }
//         ])
//         setMaterialCount(prev => prev + 1);
//     };

//     const removeproduct = (id) => {
//         setProduct(prev => prev.filter(item => item.id !== id)) // that filtered one will store in seperate []
//     }

//     const totalAmount = product.reduce((sum, item) => {
//         const qty = Number(item.qty || 0);
//         const rate = Number(item.rate || 0);
//         return sum + (qty * rate);
//     }, 0);

//     const [discount, setDiscount] = useState('');
//     const finalAmount = Math.max(totalAmount - Number(discount || 0), 0);


//     const getTodayDate = () => {
//         const today = new Date();
//         const day = String(today.getDate()).padStart(2, '0');
//         const month = String(today.getMonth() + 1).padStart(2, '0');
//         const year = today.getFullYear();
//         return `${year}-${month}-${day}`; // IMPORTANT (API friendly)
//     };

//     const TodayDate = (event, selectedDate) => {
//         setShowDate(false);
//         if (selectedDate) {
//             const formattedDate = selectedDate.toISOString().split('T')[0];
//             setDate(formattedDate);
//         }
//     };
//     const [date, setDate] = useState(getTodayDate());


//     const validation = () => {
//         let newerror = {};

//         // Customer
//         if (!customer) {
//             newerror.customer = "Please select Customer";
//         }

//         if (!payment) {
//             newerror.payment = "Please Select Payment Type";
//         }

//         product.forEach((item, index) => {

//             // Product Name
//             if (!item.productID) {
//                 newerror[`productID_${index}`] = "Select Product";
//             }

//             // Quantity
//             if (!item.qty || !item.qty.trim()) {
//                 newerror[`qty_${index}`] = "Enter Quantity";
//             } else if (!/^\d+(\.\d+)?$/.test(item.qty)) {
//                 newerror[`qty_${index}`] = "Invalid Quantity";
//             }

//             // Rate
//             if (!item.rate || !item.rate.trim()) {
//                 newerror[`rate_${index}`] = "Enter Rate";
//             } else if (!/^\d+(\.\d{1,2})?$/.test(item.rate)) {
//                 newerror[`rate_${index}`] = "Invalid Rate";
//             }


//         });

//         setValidError(newerror);
//         return Object.keys(newerror).length === 0;
//     };


//     const handleSubmit = async () => {
//         if (isSubmitting) return; //  prevent multiple clicks


//         const isValid = validation();
//         if (!isValid) return false;

//         setIsSubmitting(true); //  start loading

//         const payload = {
//             saleType: "DIRECT",
//             customerName: customer,
//             customerMobile: phno,
//             //driverId: driver,
//             //vehicleId: vehicle,
//             totalAmount: totalAmount,
//             discount: Number(discount || 0),
//             finalAmount: finalAmount,
//             paymentType: payment,
//             items: product.map((item) => {
//                 const selectedProduct = productsData.find(
//                     (prod) => prod.value === item.productID
//                 );

//                 const qty = Number(item.qty || 0);
//                 const rate = Number(item.rate || 0);

//                 return {
//                     productId: item.productID,
//                     productName: selectedProduct?.label || "",
//                     quantity: qty,
//                     rate: rate,
//                     amount: qty * rate,
//                 };
//             }),
//         };
//         console.log("Payload Data  that dispatcing  from  UI Screen Add Sales for Factory ---------------------->", payload);

//         try {
//             const response = await dispatch(AddFactorySaleData(payload)).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

//             //show Api message in alert
//             Alert.alert(
//                 "Success", response?.data?.message || response?.message || "vehicle details  Added Successfully",
//                 [
//                     {
//                         text: "OK",
//                         onPress: () => {
//                             navigation.goBack();
//                         }
//                     }
//                 ]
//             );
//         }
//         catch (error) {
//             Alert.alert("Error", error || "Something went Wrong");
//         }
//         finally {
//             setIsSubmitting(false); // stop loading
//         }

//     }





//     return (

//         <KeyboardAvoidingView
//             style={{ flex: 1 }}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//                 <View style={styles.container}>

//                     <SafeAreaView>
//                         <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
//                             <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
//                             <Text style={styles.title}>    Add Sale</Text>
//                         </TouchableOpacity>

//                     </SafeAreaView>


//                     <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} >

//                         <View style={styles.card}>

//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Customer</Text>
//                                 <View style={[styles.for_border_dropdown, validerror.customer ? commonstyles.errorBorder : null]}>
//                                     <View style={{ zIndex: 1000 }}>
//                                     <Dropdown
//                                         style={styles.dropdown}
//                                         placeholderStyle={styles.placeholderStyle}
//                                         selectedTextStyle={styles.placeholderStyle}
//                                         itemTextStyle={styles.placeholderStyle}
//                                         showsVerticalScrollIndicator={false}
//                                         labelField="label"
//                                         valueField="value"
//                                         data={CustomerData}
//                                         placeholder="Select Customer"
//                                         value={customer}
//                                         onChange={item => {
//                                             setCustomer(item.value);
//                                             setPhno(item.mobile)
//                                             setValidError(prev => ({ ...prev, customer: null }))
//                                         }}
//                                         renderRightIcon={() => (
//                                             <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                         )}
//                                     />
//                                     </View>
//                                 </View>
//                                 {validerror.customer && (
//                                     <Text style={commonstyles.error_text}>{validerror.customer}</Text>
//                                 )}
//                             </View>

//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Mobile No</Text>
//                                 <View style={styles.for_border}>
//                                     <TextInput style={styles.inputfield} placeholder="00000 00000" keyboardType="numeric" maxLength={10} value={phno} editable={false} placeholderTextColor="#888" />
//                                 </View>
//                             </View>

//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Dispatch Date</Text>
//                                 <View style={styles.for_border}>
//                                     <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
//                                     <TouchableOpacity onPress={() => setShowDate(true)}>
//                                         <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>



//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Payment Type</Text>
//                                 <View style={[styles.for_border_dropdown, validerror.payment ? commonstyles.errorBorder : null]}>
//                                     <View style={{ zIndex: 1000 }}>
//                                     <Dropdown
//                                         style={styles.dropdown}
//                                         placeholderStyle={styles.placeholderStyle}
//                                         selectedTextStyle={styles.placeholderStyle}
//                                         itemTextStyle={styles.placeholderStyle}
//                                         showsVerticalScrollIndicator={false}
//                                         labelField="label"
//                                         valueField="value"
//                                         data={paymentTypeData}
//                                         placeholder="Select Payment Type"
//                                         value={payment}
//                                         onChange={item => {
//                                             setPayment(item.value)
//                                             setValidError(prev => ({ ...prev, payment: null }))
//                                         }}
//                                         renderRightIcon={() => (
//                                             <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                         )}
//                                     />
//                                     </View>
//                                 </View>
//                                 {validerror.payment && (
//                                     <Text style={commonstyles.error_text}>{validerror.payment}</Text>
//                                 )}
//                             </View>





//                         </View>


//                         <View style={styles.date}>
//                             <Text style={styles.title}>Add Product</Text>

//                             {
//                                 product.map((item, index) => {

//                                     const amount = Number(item.qty || 0) * Number(item.rate || 0); // here we are multiplying  quantity and rate 
//                                     return (
//                                         <View style={styles.card} key={index}>
//                                             <View style={styles.left_side}>
//                                                 <Text style={styles.title}>Product {item.materialno}</Text>
//                                                 <TouchableOpacity onPress={() => removeproduct(item.id)}>
//                                                     <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
//                                                 </TouchableOpacity>
//                                             </View>


//                                             <View style={styles.date}>
//                                                 <Text style={styles.first}>Product Name</Text>
//                                                 <View style={[styles.for_border_dropdown, validerror[`productID_${index}`] ? commonstyles.errorBorder : null]}>
//                                                     <View style={{ zIndex: 1000 }}>
//                                                     <Dropdown
//                                                         style={styles.dropdown}
//                                                         placeholderStyle={styles.placeholderStyle}
//                                                         selectedTextStyle={styles.placeholderStyle}
//                                                         itemTextStyle={styles.placeholderStyle}
//                                                         showsVerticalScrollIndicator={false}
//                                                         labelField="label"
//                                                         valueField="value"
//                                                         data={productsData}
//                                                         value={item.productID}
//                                                         onChange={val => {
//                                                             setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, productID: val.value } : prod))
//                                                             setValidError(prev => ({ ...prev, [`unit_${index}`]: null }));
//                                                         }}
//                                                         placeholder="Select Product name"
//                                                         renderRightIcon={() => (
//                                                             <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                                         )}
//                                                     />
//                                                     </View>
//                                                 </View>
//                                                 {validerror[`productID_${index}`] && (
//                                                     <Text style={commonstyles.error_text}>{validerror[`productID_${index}`]}</Text>
//                                                 )}
//                                             </View>

//                                             <View style={styles.head_new}>

                                               
//                                                 <View style={styles.left}>
//                                                     <Text style={styles.first}>Quantity</Text>

//                                                     <View style={[styles.for_newborder, validerror[`qty_${index}`] ? commonstyles.errorBorder : null]}>
//                                                         <TextInput placeholder="Add Quantity Here" style={styles.newinputfield} value={item.qty} keyboardType="numeric" placeholderTextColor="#888"
//                                                             onChangeText={text => {
//                                                                 setProduct(prev =>
//                                                                     prev.map(prod =>
//                                                                         prod.id === item.id ? { ...prod, qty: text } : prod
//                                                                     )
//                                                                 );

//                                                                 setValidError(prev => ({ ...prev, [`qty_${index}`]: null }));
//                                                             }}
//                                                         />
//                                                     </View>

//                                                     {validerror[`qty_${index}`] && (
//                                                         <Text style={commonstyles.error_text}>  {validerror[`qty_${index}`]} </Text>
//                                                     )}
//                                                 </View>


                                                
//                                                 <View style={styles.right}>
//                                                     <Text style={styles.first}>Rate ({`\u20B9`})</Text>
//                                                     <View style={[styles.for_newborder, validerror[`rate_${index}`] ? commonstyles.errorBorder : null]}>
//                                                         <TextInput placeholder="Add The Price Here" style={styles.newinputfield} value={item.rate} keyboardType="numeric" placeholderTextColor="#888"
//                                                             onChangeText={text => {
//                                                                 setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, rate: text } : prod));
//                                                                 setValidError(prev => ({ ...prev, [`rate_${index}`]: null }));
//                                                             }}
//                                                         />
//                                                     </View>

//                                                     {validerror[`rate_${index}`] && (
//                                                         <Text style={commonstyles.error_text}>{validerror[`rate_${index}`]} </Text>
//                                                     )}
//                                                 </View>

//                                             </View>




//                                             <View style={[styles.for_border, { backgroundColor: colors.gray, padding: 5, marginTop: 13 }]}>
//                                                 <Text style={[styles.first, { color: colors.black }]}>Amount</Text>
//                                                 <Text style={[styles.first, { color: colors.black }]}>{`\u20B9`}{amount}</Text>
//                                             </View>

//                                         </View>
//                                     )
//                                 })
//                             }

//                         </View>

//                         <TouchableOpacity style={styles.botted} onPress={AddProduct}>
//                             <Entypo name="plus" size={20} color="#4A5565" />
//                             <Text style={styles.bottedText}>Add Another Product</Text>
//                         </TouchableOpacity>


//                         <View style={styles.card}>
//                             <Text style={[styles.left_side, styles.title]}>Order Summary</Text>

//                             <View style={styles.head_new}>
//                                 <Text style={[styles.first, { color: colors.black }]}>Amount</Text>
//                                 <Text style={[styles.title, { color: colors.black }]}>{`\u20B9`}{totalAmount}</Text>
//                             </View>

//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Discount</Text>
//                                 <View style={styles.for_border}>
//                                     <TextInput style={styles.inputfield} placeholder="Discount" keyboardType="numeric" value={discount} placeholderTextColor="#888"
//                                         onChangeText={text => {
//                                             setDiscount(text);
//                                             if (Number(text) > 100) {
//                                                 setValidError(prev => ({ ...prev, discount: "Discount should not be above 100" }));
//                                             } else {
//                                                 setValidError(prev => ({ ...prev, discount: null }));
//                                             }
//                                         }}

//                                     />
//                                 </View>
//                                 {
//                                     validerror.discount ? (
//                                         <Text style={commonstyles.error_text}>{validerror.discount}</Text>
//                                     ) : null
//                                 }
//                                 <View style={styles.dashed_border}></View>

//                                 <View style={styles.head_new}>
//                                     <Text style={[styles.title, { color: colors.black }]}>Total</Text>
//                                     <Text style={[styles.title, { color: colors.homeblue }]}>{`\u20B9`}{finalAmount}</Text>
//                                 </View>

//                             </View>

//                         </View>


                        


//                         <TouchableOpacity
//                             style={[styles.button, isSubmitting && { opacity: 0.6 }]}
//                             onPress={handleSubmit}
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting ? (
//                                 <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
//                                     <ActivityIndicator color="#fff" size="small" />
//                                     <Text style={[styles.btn_text, { marginLeft: 10 }]}>
//                                         Adding...
//                                     </Text>
//                                 </View>
//                             ) : (
//                                 <Text style={styles.btn_text}>Add Sale Factory</Text>
//                             )}
//                         </TouchableOpacity>



//                     </ScrollView>

//                     {
//                         showDate &&
//                         <DateTimePicker
//                             // value={new Date()}
//                             value={new Date(date)}
//                             mode="date"
//                             display="default"
//                             minimumDate={new Date()}
//                             onChange={TodayDate}
//                         />
//                     }




//                 </View>
//             </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>

//     )
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.white,
//         paddingHorizontal: 12,
//         overflow: 'hidden',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingTop: 10,
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 700,
//         fontFamily: fonts.sfbold,
//         color: colors.black,
//     },
//     card: {
//         backgroundColor: colors.white,
//         borderRadius: 10,
//         shadowColor: colors.black,
//         shadowOpacity: 0.1,
//         padding: 12,
//         shadowRadius: 6,
//         elevation: 4,
//         marginRight: 1,
//         marginLeft: 1,
//         marginTop: 13,
//     },
//     date: {
//         marginTop: 13,
//     },
//     first: {
//         color: colors.formtitlegry,
//         fontSize: 16,
//         fontWeight: 500,
//         marginBottom: 5,
//         fontFamily: fonts.sfmedium,
//     },
//     for_border_dropdown: {
//         borderWidth: 1,
//         borderColor: colors.inputfieldborder,
//         borderRadius: 5,
//         fontFamily: fonts.sfmedium,
//         // padding:15,
//         paddingTop: 15,
//         paddingBottom: 15,
//         zIndex: 1000
//     },
//     placeholderStyle: {
//         fontSize: 16,
//         color: colors.black,
//         fontWeight: 500,
//         paddingLeft: 10,
//     },
//     calender_icon: {
//         paddingRight: 15,
//     },
//     head_new: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: 13,
//     },
//     for_border: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderWidth: 1,
//         borderColor: colors.inputfieldborder,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//     },
//     newinputfield: {
//         color: colors.black,
//         fontSize: 16,
//         fontWeight: 500,
//         fontFamily: fonts.sfmedium,
//         paddingHorizontal: 5,
//     },
//     inputfield: {
//         flex: 1,
//         color: colors.black,
//         fontSize: 16,
//         fontWeight: 500,
//         fontFamily: fonts.sfmedium,
//     },
//     left_side: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderBottomWidth: 1,
//         borderBottomColor: colors.inputfieldborder,
//         paddingBottom: 10,
//     },
//     bg: {
//         backgroundColor: colors.lightredcolor,
//         padding: 8,
//         borderRadius: 8,
//     },
//     for_newborder: {
//         borderWidth: 1,
//         borderColor: colors.inputfieldborder,
//         borderRadius: 5,
//     },
//     botted: {
//         flexDirection: 'row',
//         // alignSelf:'center',
//         textAlign: 'center',
//         marginTop: 13,

//         borderWidth: 1,
//         borderStyle: 'dashed',
//         borderColor: colors.commoncolor,

//         paddingVertical: 8,
//         borderRadius: 6,
//         paddingLeft: 90,
//     },
//     bottedText: {
//         fontSize: 16,
//         fontWeight: 500,
//         color: colors.formtitlegry,
//         marginBottom: 5,
//         fontFamily: fonts.sfmedium,
//     },
//     dashed_border: {
//         borderBottomWidth: 1,
//         borderBottomColor: colors.inputfieldborder,
//         textDecorationLine: 'line-through',
//         borderStyle: 'dashed',
//         marginTop: 13,
//     },
//     button: {
//         backgroundColor: colors.commoncolor,
//         borderRadius: 8,
//         marginTop: 15,
//         marginBottom: 20,
//     },
//     btn_text: {
//         fontSize: 16,
//         fontWeight: 700,
//         color: colors.white,
//         textAlign: 'center',
//         paddingTop: 16,
//         paddingBottom: 16,

//     },


// })
// export default AddSalesInFactorySales





// new code 
import React, { useCallback, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from "react-redux";
import { GetProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
import { GetCustomerData } from "../../redux/reducers/DriverLogin/Forms";
import commonstyles from "../../commonstyles/commonstyles";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AddFactorySaleData } from "../../redux/reducers/AccounsLogin/VehicleDetails";



const AddSalesInFactorySales = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            dispatch(GetProductsInMaster());
            dispatch(GetCustomerData())
        }, [dispatch])
    )

    const { GetProductData } = useSelector((state) => state.GetProductsInPM);
    console.log("GetProducts Data in Add Sales for Factory---------------------->", GetProductData);

    const { CustomersDataGetCall } = useSelector((state) => state.GetCustomers);
    console.log("Customers Data  in factory sales ---------------------->", CustomersDataGetCall);


    const [customer, setCustomer] = useState(null);
    const [validerror, setValidError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [payment, setPayment] = useState('');
    const [phno, setPhno] = useState('');
    const [showDate, setShowDate] = useState(false);
    const CustomerData = CustomersDataGetCall?.map(item => ({
        label: item.ownerName,
        value: item.ownerName,
        mobile: item.mobile,
    })) || [];


    const productsData =
        GetProductData?.map(item => ({
            label: item.productName,
            value: item.id,
        })) || [];


    const paymentTypeData = [
        { label: "CASH", value: "CASH" },
        { label: "UPI", value: "UPI" },
    ];

    const [materailCount, setMaterialCount] = useState(1);
    const [product, setProduct] = useState([
        {
            id: 1,
            productID: null,
            materialno: 1,
            name: null,
            qty: '',
            rate: '',
            cost: '',
        }
    ])

    const AddProduct = () => {
        setProduct(prev => [
            ...prev,
            {
                id: Date.now(),
                productID: null,
                materialno: materailCount + 1,
                name: null,
                qty: '',
                rate: '',
                cost: '',
            }
        ])
        setMaterialCount(prev => prev + 1);
    };

    const removeproduct = (id) => {
        setProduct(prev => prev.filter(item => item.id !== id))
    }

    const totalAmount = product.reduce((sum, item) => {
        const qty = Number(item.qty || 0);
        const rate = Number(item.rate || 0);
        return sum + (qty * rate);
    }, 0);

    const [discount, setDiscount] = useState('');
    const finalAmount = Math.max(totalAmount - Number(discount || 0), 0);


    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const TodayDate = (event, selectedDate) => {
        setShowDate(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setDate(formattedDate);
        }
    };
    const [date, setDate] = useState(getTodayDate());


    const validation = () => {
        let newerror = {};

        if (!customer) {
            newerror.customer = "Please select Customer";
        }

        if (!payment) {
            newerror.payment = "Please Select Payment Type";
        }

        product.forEach((item, index) => {

            if (!item.productID) {
                newerror[`productID_${index}`] = "Select Product";
            }

            if (!item.qty || !item.qty.trim()) {
                newerror[`qty_${index}`] = "Enter Quantity";
            } else if (!/^\d+(\.\d+)?$/.test(item.qty)) {
                newerror[`qty_${index}`] = "Invalid Quantity";
            }

            if (!item.rate || !item.rate.trim()) {
                newerror[`rate_${index}`] = "Enter Rate";
            } else if (!/^\d+(\.\d{1,2})?$/.test(item.rate)) {
                newerror[`rate_${index}`] = "Invalid Rate";
            }

        });

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };


    const handleSubmit = async () => {
        if (isSubmitting) return;

        const isValid = validation();
        if (!isValid) return false;

        setIsSubmitting(true);

        const payload = {
            saleType: "DIRECT",
            customerName: customer,
            customerMobile: phno,
            totalAmount: totalAmount,
            discount: Number(discount || 0),
            finalAmount: finalAmount,
            paymentType: payment,
            items: product.map((item) => {
                const selectedProduct = productsData.find(
                    (prod) => prod.value === item.productID
                );

                const qty = Number(item.qty || 0);
                const rate = Number(item.rate || 0);

                return {
                    productId: item.productID,
                    productName: selectedProduct?.label || "",
                    quantity: qty,
                    rate: rate,
                    amount: qty * rate,
                };
            }),
        };
        console.log("Payload Data  that dispatcing  from  UI Screen Add Sales for Factory ---------------------->", payload);

        try {
            const response = await dispatch(AddFactorySaleData(payload)).unwrap();

            Alert.alert(
                "Success", response?.data?.message || response?.message || "vehicle details  Added Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.goBack();
                        }
                    }
                ]
            );
        }
        catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        }
        finally {
            setIsSubmitting(false);
        }

    }

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <View style={styles.container}>

                <SafeAreaView>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={styles.title}>Add Factory Sale</Text>
                    </TouchableOpacity>

                </SafeAreaView>


                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    keyboardShouldPersistTaps="handled" 
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                    bounces={true}
                    onScrollBeginDrag={Keyboard.dismiss}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >

                    <View style={styles.card}>

                        <View style={styles.date}>
                            <Text style={styles.first}>Customer</Text>
                            <View style={[styles.for_border_dropdown, validerror.customer ? commonstyles.errorBorder : null]}>
                                <View style={{ zIndex: 3000 }}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.placeholderStyle}
                                        itemTextStyle={styles.placeholderStyle}
                                        showsVerticalScrollIndicator={false}
                                        containerStyle={{ maxHeight: 200 }}
                                        autoScroll={false}
                                        labelField="label"
                                        valueField="value"
                                        data={CustomerData}
                                        placeholder="Select Customer"
                                        value={customer}
                                        onChange={item => {
                                            setCustomer(item.value);
                                            setPhno(item.mobile)
                                            setValidError(prev => ({ ...prev, customer: null }))
                                        }}
                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}
                                    />
                                </View>
                            </View>
                            {validerror.customer && (
                                <Text style={commonstyles.error_text}>{validerror.customer}</Text>
                            )}
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Mobile No</Text>
                            <View style={styles.for_border}>
                                <TextInput style={commonstyles.inputfield} placeholder="00000 00000" keyboardType="numeric" maxLength={10} value={phno} editable={false} placeholderTextColor="#888" />
                            </View>
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Dispatch Date</Text>
                            <View style={styles.for_border}>
                                <TextInput style={commonstyles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
                                <TouchableOpacity onPress={() => setShowDate(true)}>
                                    <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                                </TouchableOpacity>
                            </View>
                        </View>



                        <View style={styles.date}>
                            <Text style={styles.first}>Payment Type</Text>
                            <View style={[styles.for_border_dropdown, validerror.payment ? commonstyles.errorBorder : null]}>
                                <View style={{ zIndex: 2000 }}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.placeholderStyle}
                                        itemTextStyle={styles.placeholderStyle}
                                        showsVerticalScrollIndicator={false}
                                        containerStyle={{ maxHeight: 200 }}
                                        autoScroll={false}
                                        labelField="label"
                                        valueField="value"
                                        data={paymentTypeData}
                                        placeholder="Select Payment Type"
                                        value={payment}
                                        onChange={item => {
                                            setPayment(item.value)
                                            setValidError(prev => ({ ...prev, payment: null }))
                                        }}
                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}
                                    />
                                </View>
                            </View>
                            {validerror.payment && (
                                <Text style={commonstyles.error_text}>{validerror.payment}</Text>
                            )}
                        </View>

                    </View>


                    <View style={styles.date}>
                        <Text style={styles.title}>Add Product</Text>

                        {
                            product.map((item, index) => {

                                const amount = Number(item.qty || 0) * Number(item.rate || 0);
                                return (
                                    <View style={styles.card} key={item.id}>
                                        <View style={styles.left_side}>
                                            <Text style={styles.title}>Product {item.materialno}</Text>
                                            <TouchableOpacity onPress={() => removeproduct(item.id)}>
                                                <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
                                            </TouchableOpacity>
                                        </View>


                                        <View style={styles.date}>
                                            <Text style={styles.first}>Product Name</Text>
                                            <View style={[styles.for_border_dropdown, validerror[`productID_${index}`] ? commonstyles.errorBorder : null]}>
                                                <View style={{ zIndex: 1000 - (index * 10) }}>
                                                    <Dropdown
                                                        style={styles.dropdown}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.placeholderStyle}
                                                        itemTextStyle={styles.placeholderStyle}
                                                        showsVerticalScrollIndicator={false}
                                                        containerStyle={{ maxHeight: 200 }}
                                                        autoScroll={false}
                                                        labelField="label"
                                                        valueField="value"
                                                        data={productsData}
                                                        value={item.productID}
                                                        onChange={val => {
                                                            setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, productID: val.value } : prod))
                                                            setValidError(prev => ({ ...prev, [`productID_${index}`]: null }));
                                                        }}
                                                        placeholder="Select Product name"
                                                        renderRightIcon={() => (
                                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                                        )}
                                                    />
                                                </View>
                                            </View>
                                            {validerror[`productID_${index}`] && (
                                                <Text style={commonstyles.error_text}>{validerror[`productID_${index}`]}</Text>
                                            )}
                                        </View>

                                        <View style={styles.head_new}>

                                            <View style={styles.left}>
                                                <Text style={styles.first}>Quantity</Text>

                                                <View style={[styles.for_newborder, validerror[`qty_${index}`] ? commonstyles.errorBorder : null]}>
                                                    <TextInput placeholder="Add Quantity Here" style={styles.newinputfield} value={item.qty} keyboardType="numeric" placeholderTextColor="#888"
                                                        onChangeText={text => {
                                                            setProduct(prev =>
                                                                prev.map(prod =>
                                                                    prod.id === item.id ? { ...prod, qty: text } : prod
                                                                )
                                                            );

                                                            setValidError(prev => ({ ...prev, [`qty_${index}`]: null }));
                                                        }}
                                                    />
                                                </View>

                                                {validerror[`qty_${index}`] && (
                                                    <Text style={commonstyles.error_text}>  {validerror[`qty_${index}`]} </Text>
                                                )}
                                            </View>


                                            <View style={styles.right}>
                                                <Text style={styles.first}>Rate ({`\u20B9`})</Text>
                                                <View style={[styles.for_newborder, validerror[`rate_${index}`] ? commonstyles.errorBorder : null]}>
                                                    <TextInput placeholder="Add The Price Here" style={styles.newinputfield} value={item.rate} keyboardType="numeric" placeholderTextColor="#888"
                                                        onChangeText={text => {
                                                            setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, rate: text } : prod));
                                                            setValidError(prev => ({ ...prev, [`rate_${index}`]: null }));
                                                        }}
                                                    />
                                                </View>

                                                {validerror[`rate_${index}`] && (
                                                    <Text style={commonstyles.error_text}>{validerror[`rate_${index}`]} </Text>
                                                )}
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
                            <Text style={[styles.title, { color: colors.black }]}>{`\u20B9`}{totalAmount}</Text>
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Discount</Text>
                            <View style={styles.for_border}>
                                <TextInput style={commonstyles.inputfield} placeholder="Discount" keyboardType="numeric" value={discount} placeholderTextColor="#888"
                                    onChangeText={text => {
                                        setDiscount(text);
                                        if (Number(text) > 100) {
                                            setValidError(prev => ({ ...prev, discount: "Discount should not be above 100" }));
                                        } else {
                                            setValidError(prev => ({ ...prev, discount: null }));
                                        }
                                    }}

                                />
                            </View>
                            {
                                validerror.discount ? (
                                    <Text style={commonstyles.error_text}>{validerror.discount}</Text>
                                ) : null
                            }
                            <View style={styles.dashed_border}></View>

                            <View style={styles.head_new}>
                                <Text style={[styles.title, { color: colors.black }]}>Total</Text>
                                <Text style={[styles.title, { color: colors.homeblue }]}>{`\u20B9`}{finalAmount}</Text>
                            </View>

                        </View>

                    </View>


                    <TouchableOpacity
                        style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                    Adding...
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.btn_text}>Add Factory Sale</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>

                {
                    showDate &&
                    <DateTimePicker
                        value={new Date(date)}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={TodayDate}
                    />
                }

            </View>
        </KeyboardAvoidingView>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
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
        fontWeight: '500',
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
        paddingTop: 15,
        paddingBottom: 15,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: '500',
        paddingLeft: 10,
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
    left: {
        flex: 1,
        marginRight: 5,
    },
    right: {
        flex: 1,
        marginLeft: 5,
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
        fontWeight: '500',
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: fonts.sfmedium,
        paddingVertical: 15,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 13,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.commoncolor,
        paddingVertical: 12,
        borderRadius: 6,
    },
    bottedText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.formtitlegry,
        marginLeft: 8,
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
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        paddingVertical: 16,
    },
    dropdown: {
        paddingHorizontal: 10,
    },
})
export default AddSalesInFactorySales




