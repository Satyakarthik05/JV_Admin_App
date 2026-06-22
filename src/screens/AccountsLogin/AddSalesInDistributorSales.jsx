// import React, { useCallback, useMemo, useState } from "react";
// import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
// import { colors, fonts } from "../../config/theme";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Feather from 'react-native-vector-icons/Feather';
// import { Dropdown } from "react-native-element-dropdown";
// import Entypo from 'react-native-vector-icons/Entypo';
// import { useDispatch, useSelector } from "react-redux";
// import { GetCustomerData } from "../../redux/reducers/DriverLogin/Forms";
// import { GetProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
// import commonstyles from "../../commonstyles/commonstyles";
// import { AddDistributorSale, GetVehiclesData } from "../../redux/reducers/AccounsLogin/VehicleDetails";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";


// const AddSalesInDistributorsales = () => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();

//     useFocusEffect(
//         useCallback(() => {
//             StatusBar.setBackgroundColor(colors.white)
//             StatusBar.setBarStyle("dark-content");
//             dispatch(GetCustomerData())
//             dispatch(GetProductsInMaster());
//             dispatch(GetVehiclesData());
//             dispatch(GetRegesteredData());
//         }, [dispatch])
//     )


//     const { CustomersDataGetCall } = useSelector((state) => state.GetCustomers);
//     console.log("Customers Data  in Distributor  sales ---------------------->", CustomersDataGetCall);

//     const { GetProductData } = useSelector((state) => state.GetProductsInPM);
//     console.log("GetProducts Data in Distributor sales--------------------->", GetProductData);

//     const { GetVehiclesDetails } = useSelector((state) => state.GetVehiclesDetailsData);
//     console.log("Vehicles Details Data in  add factory sales  ------->", GetVehiclesDetails);


//     const { getEmpdata } = useSelector((state) => state.GetEmp);
//     console.log("*********GetEmployess Data All Employess Data in  Add Sales to Distributor **********", getEmpdata);



//     const [distributor, setDistributor] = useState('');
//     const [driver, setDriver] = useState(null);
//     const [validerror, setValidError] = useState({});
//     const [vehicle, setVehicle] = useState(null);
//     const [phno, setPhno] = useState('');
//     const [discount, setDiscount] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [payment, setPayment] = useState('');
//     const [showDate, setShowDate] = useState(false);  // show calender

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

//     const Distributor = CustomersDataGetCall?.filter(item => item.customerType === "DISTRIBUTOR").map(item => ({
//         label: item.ownerName,
//         value: item.id,
//         mobile: item.mobile,
//     })) || [];

//     const productsData = GetProductData?.map(item => ({
//         label: item.productName,
//         value: item.id,
//     })) || [];

//     // dropdown for vehicle number
//     const VehicleNo =
//         GetVehiclesDetails?.map(item => ({
//             label: item.vehicleNumber,//name
//             value: item.id,//id
//         })) || [];


//     const paymentTypeData = [
//         { label: "CASH", value: "CASH" },
//         { label: "UPI", value: "UPI" },
//         // { label: "CARD", value: "CARD" },
//     ];


//     // dropdown data for drivers data 
//     const driverDropdownData = useMemo(() => {
//         return getEmpdata
//             ?.filter(emp => emp.roleName === "DRIVER")
//             ?.map(emp => ({
//                 label: emp.name,
//                 value: emp.id,
//                 //mobile: emp.mobileNumber
//             })) || [];
//     }, [getEmpdata]);


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







//     const validation = () => {
//         let newerror = {};

//         // Distributor
//         if (!distributor) {
//             newerror.distributor = "Please select Distributor";
//         }
//         if (!vehicle) {
//             newerror.vehicle = "Please Select Vehice Number";
//         }

//         if (!payment) {
//             newerror.payment = "Please Select Payment Type";
//         }

//         if (!driver) {
//             newerror.driver = "Please Select Driver ";
//         }




//         product.forEach((item, index) => {

//             if (!item.productID) {
//                 newerror[`productID_${index}`] = "Select Product";
//             }

//             if (!item.qty || !item.qty.trim()) {
//                 newerror[`qty_${index}`] = "Enter Quantity";
//             } else if (!/^\d+(\.\d+)?$/.test(item.qty)) {
//                 newerror[`qty_${index}`] = "Invalid Quantity";
//             }

//             if (!item.rate || !item.rate.trim()) {
//                 newerror[`rate_${index}`] = "Enter Rate";
//             } else if (!/^\d+(\.\d{1,2})?$/.test(item.rate)) {
//                 newerror[`rate_${index}`] = "Invalid Rate";
//             }

//         });

//         setValidError(newerror);
//         return Object.keys(newerror).length === 0;
//     };


//     const totalAmount = product.reduce((sum, item) => {
//         const qty = Number(item.qty || 0);
//         const rate = Number(item.rate || 0);
//         return sum + (qty * rate);
//     }, 0);

//     const finalAmount = Math.max(totalAmount - (parseFloat(discount) || 0), 0);




//     const handleSubmit = async () => {
//         if (isSubmitting) return; //  prevent multiple clicks

//         const isValid = validation();
//         if (!isValid) return false;

//         setIsSubmitting(true); //  start loading

//         const payload = {
//             saleType: "DISTRIBUTOR",
//             customerName: distributor,
//             customerMobile: phno,
//             driverId: driver,
//             vehicleId: vehicle,
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

//         console.log("Payload Data  that dispatcing  UI Screen Add Sales for Distributor ---------------------->", payload);

//         try {
//             const response = await dispatch(AddDistributorSale(payload)).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

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
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
//                 <View style={styles.container}>

//                     <SafeAreaView>
//                         <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
//                             <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
//                             <Text style={styles.title}>    Add Sale</Text>
//                         </TouchableOpacity>
//                     </SafeAreaView>


//                     <ScrollView
//                         showsVerticalScrollIndicator={false}
//                         keyboardShouldPersistTaps="handled"
//                         nestedScrollEnabled={true}
//                         scrollEventThrottle={16}
//                         bounces={true}
//                         contentContainerStyle={{ paddingBottom: 120 }}
//                     >

//                         <View style={styles.card}>

//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Distributor</Text>
//                                 <View style={[styles.for_border_dropdown, validerror.distributor ? commonstyles.errorBorder : null]}>
//                                     <View style={{ zIndex: 1000 }}>
//                                         <Dropdown
//                                             style={styles.dropdown}
//                                             placeholderStyle={styles.placeholderStyle}
//                                             selectedTextStyle={styles.placeholderStyle}
//                                             itemTextStyle={styles.placeholderStyle}
//                                             showsVerticalScrollIndicator={false}
//                                             labelField="label"
//                                             valueField="label"
//                                             data={Distributor}
//                                             placeholder="Select Distributor"
//                                             value={distributor}
//                                             onChange={item => {
//                                                 setDistributor(item.label);
//                                                 setPhno(item.mobile)
//                                                 setValidError(prev => ({ ...prev, distributor: null }));
//                                             }}
//                                             renderRightIcon={() => (
//                                                 <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                             )}
//                                         />
//                                     </View>
//                                 </View>
//                                 {validerror.distributor && (
//                                     <Text style={commonstyles.error_text}>{validerror.distributor}</Text>
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
//                                 <Text style={styles.first}>Driver</Text>
//                                 <View style={[styles.for_border_dropdown, validerror.driver ? commonstyles.errorBorder : null]}>
//                                     <View style={{ zIndex: 1000 }}>
//                                         <Dropdown
//                                             style={styles.dropdown}
//                                             placeholderStyle={styles.placeholderStyle}
//                                             selectedTextStyle={styles.placeholderStyle}
//                                             itemTextStyle={styles.placeholderStyle}
//                                             showsVerticalScrollIndicator={false}
//                                             labelField="label"
//                                             valueField="value"
//                                             data={driverDropdownData}
//                                             placeholder="Select Driver"
//                                             value={driver}
//                                             onChange={item => {
//                                                 setDriver(item.value)
//                                                 if (item.value) {
//                                                     setValidError(prev => ({ ...prev, driver: null }));
//                                                 }
//                                             }}
//                                             renderRightIcon={() => (
//                                                 <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                             )}
//                                         />
//                                     </View>
//                                 </View>
//                                 {
//                                     validerror.driver ? (
//                                         <Text style={commonstyles.error_text}>{validerror.driver}</Text>
//                                     ) : null
//                                 }
//                             </View>


//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Vehicle No </Text>
//                                 <View style={[styles.for_border_dropdown, validerror.vehicle ? commonstyles.errorBorder : null]}>
//                                     <View style={{ zIndex: 1000 }}>
//                                         <Dropdown
//                                             style={styles.dropdown}
//                                             placeholderStyle={styles.placeholderStyle}
//                                             selectedTextStyle={styles.placeholderStyle}
//                                             itemTextStyle={styles.placeholderStyle}
//                                             showsVerticalScrollIndicator={false}
//                                             labelField="label"
//                                             valueField="value"
//                                             data={VehicleNo}
//                                             placeholder="Select Vehicle No "
//                                             value={vehicle}
//                                             onChange={item => {
//                                                 setVehicle(item.value)
//                                                 setValidError(prev => ({ ...prev, vehicle: null }));
//                                             }}
//                                             renderRightIcon={() => (
//                                                 <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                             )}
//                                         />
//                                     </View>
//                                 </View>
//                                 {
//                                     validerror.vehicle ? (
//                                         <Text style={commonstyles.error_text}>{validerror.vehicle}</Text>
//                                     ) : null
//                                 }
//                             </View>




//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Payment Type</Text>
//                                 <View style={[styles.for_border_dropdown, validerror.payment ? commonstyles.errorBorder : null]}>
//                                     <View style={{ zIndex: 1000 }}>
//                                         <Dropdown
//                                             style={styles.dropdown}
//                                             placeholderStyle={styles.placeholderStyle}
//                                             selectedTextStyle={styles.placeholderStyle}
//                                             itemTextStyle={styles.placeholderStyle}
//                                             showsVerticalScrollIndicator={false}
//                                             labelField="label"
//                                             valueField="value"
//                                             data={paymentTypeData}
//                                             placeholder="Select Payment Type"
//                                             value={payment}
//                                             onChange={item => {
//                                                 setPayment(item.value)
//                                                 setValidError(prev => ({ ...prev, payment: null }))
//                                             }}
//                                             renderRightIcon={() => (
//                                                 <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                             )}
//                                         />
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
//                                                         <Dropdown
//                                                             style={styles.dropdown}
//                                                             placeholderStyle={styles.placeholderStyle}
//                                                             selectedTextStyle={styles.placeholderStyle}
//                                                             itemTextStyle={styles.placeholderStyle}
//                                                             showsVerticalScrollIndicator={false}
//                                                             labelField="label"
//                                                             valueField="value"
//                                                             data={productsData}
//                                                             value={item.productID}
//                                                             onChange={val => {
//                                                                 setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, productID: val.value } : prod))
//                                                                 setValidError(prev => ({ ...prev, [`productID_${index}`]: null }));
//                                                             }}
//                                                             placeholder="Select Product name"
//                                                             renderRightIcon={() => (
//                                                                 <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                                             )}
//                                                         />
//                                                     </View>
//                                                 </View>
//                                                 {validerror[`productID_${index}`] && (
//                                                     <Text style={{ color: 'red' }}>{validerror[`productID_${index}`]}</Text>
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
//                                                         <Text style={{ color: 'red' }}> {validerror[`qty_${index}`]}</Text>
//                                                     )}
//                                                 </View>



//                                                 <View style={styles.right}>
//                                                     <Text style={styles.first}>Rate ({`\u20B9`})</Text>

//                                                     <View style={[styles.for_newborder, validerror[`rate_${index}`] ? { borderColor: 'red' } : null]}>
//                                                         <TextInput placeholder="Add The Price Here" style={styles.newinputfield} value={item.rate} keyboardType="numeric" placeholderTextColor="#888"
//                                                             onChangeText={text => {
//                                                                 setProduct(prev =>
//                                                                     prev.map(prod =>
//                                                                         prod.id === item.id ? { ...prod, rate: text } : prod
//                                                                     )
//                                                                 );
//                                                                 setValidError(prev => ({ ...prev, [`rate_${index}`]: null }));
//                                                             }}
//                                                         />
//                                                     </View>

//                                                     {validerror[`rate_${index}`] && (
//                                                         <Text style={{ color: 'red' }}>  {validerror[`rate_${index}`]}  </Text>
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
//                                 <Text style={styles.btn_text}>Add Sale Distributor</Text>
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
//     },
//     placeholderStyle: {
//         fontSize: 14,
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
// export default AddSalesInDistributorsales






//Here's the complete corrected component with all scrolling issues fixed. Just copy and paste this:

import React, { useCallback, useMemo, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from "react-redux";
import { GetCustomerData } from "../../redux/reducers/DriverLogin/Forms";
import { GetProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
import commonstyles from "../../commonstyles/commonstyles";
import { AddDistributorSale, GetVehiclesData } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";


const AddSalesInDistributorsales = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");
            dispatch(GetCustomerData())
            dispatch(GetProductsInMaster());
            dispatch(GetVehiclesData());
            dispatch(GetRegesteredData());
        }, [dispatch])
    )


    const { CustomersDataGetCall } = useSelector((state) => state.GetCustomers);
    console.log("Customers Data  in Distributor  sales ---------------------->", CustomersDataGetCall);

    const { GetProductData } = useSelector((state) => state.GetProductsInPM);
    console.log("GetProducts Data in Distributor sales--------------------->", GetProductData);

    const { GetVehiclesDetails } = useSelector((state) => state.GetVehiclesDetailsData);
    console.log("Vehicles Details Data in  add factory sales  ------->", GetVehiclesDetails);


    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("*********GetEmployess Data All Employess Data in  Add Sales to Distributor **********", getEmpdata);



    const [distributor, setDistributor] = useState('');
    const [driver, setDriver] = useState(null);
    const [validerror, setValidError] = useState({});
    const [vehicle, setVehicle] = useState(null);
    const [phno, setPhno] = useState('');
    const [discount, setDiscount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [payment, setPayment] = useState('');
    const [showDate, setShowDate] = useState(false);

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

    const Distributor = CustomersDataGetCall?.filter(item => item.customerType === "DISTRIBUTOR").map(item => ({
        label: item.ownerName,
        value: item.id,
        mobile: item.mobile,
    })) || [];

    const productsData = GetProductData?.map(item => ({
        label: item.productName,
        value: item.id,
    })) || [];

    const VehicleNo =
        GetVehiclesDetails?.map(item => ({
            label: item.vehicleNumber,
            value: item.id,
        })) || [];


    const paymentTypeData = [
        { label: "CASH", value: "CASH" },
        { label: "UPI", value: "UPI" },
    ];


    const driverDropdownData = useMemo(() => {
        return getEmpdata
            ?.filter(emp => emp.roleName === "DRIVER")
            ?.map(emp => ({
                label: emp.name,
                value: emp.id,
            })) || [];
    }, [getEmpdata]);


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

    const validation = () => {
        let newerror = {};

        if (!distributor) {
            newerror.distributor = "Please select Distributor";
        }
        if (!vehicle) {
            newerror.vehicle = "Please Select Vehice Number";
        }

        if (!payment) {
            newerror.payment = "Please Select Payment Type";
        }

        if (!driver) {
            newerror.driver = "Please Select Driver ";
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


    const totalAmount = product.reduce((sum, item) => {
        const qty = Number(item.qty || 0);
        const rate = Number(item.rate || 0);
        return sum + (qty * rate);
    }, 0);

    const finalAmount = Math.max(totalAmount - (parseFloat(discount) || 0), 0);




    const handleSubmit = async () => {
        if (isSubmitting) return;

        const isValid = validation();
        if (!isValid) return false;

        setIsSubmitting(true);

        const payload = {
            saleType: "DISTRIBUTOR",
            customerName: distributor,
            customerMobile: phno,
            driverId: driver,
            vehicleId: vehicle,
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

        console.log("Payload Data  that dispatcing  UI Screen Add Sales for Distributor ---------------------->", payload);

        try {
            const response = await dispatch(AddDistributorSale(payload)).unwrap();

            Alert.alert(
                "Success", response?.data?.message || response?.message || " Added Successfully",
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
                        <Text style={styles.title}>    Add Distributor Sale</Text>
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
                            <Text style={styles.first}>Distributor</Text>
                            <View style={[styles.for_border_dropdown, validerror.distributor ? commonstyles.errorBorder : null]}>
                                <View style={{ zIndex: 5000 }}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.placeholderStyle}
                                        itemTextStyle={styles.placeholderStyle}
                                        showsVerticalScrollIndicator={false}
                                        containerStyle={{ maxHeight: 200 }}
                                        autoScroll={false}
                                        labelField="label"
                                        valueField="label"
                                        data={Distributor}
                                        placeholder="Select Distributor"
                                        value={distributor}
                                        onChange={item => {
                                            setDistributor(item.label);
                                            setPhno(item.mobile)
                                            setValidError(prev => ({ ...prev, distributor: null }));
                                        }}
                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}
                                    />
                                </View>
                            </View>
                            {validerror.distributor && (
                                <Text style={commonstyles.error_text}>{validerror.distributor}</Text>
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
                            <Text style={styles.first}>Driver</Text>
                            <View style={[styles.for_border_dropdown, validerror.driver ? commonstyles.errorBorder : null]}>
                                <View style={{ zIndex: 4000 }}>
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
                                        data={driverDropdownData}
                                        placeholder="Select Driver"
                                        value={driver}
                                        onChange={item => {
                                            setDriver(item.value)
                                            if (item.value) {
                                                setValidError(prev => ({ ...prev, driver: null }));
                                            }
                                        }}
                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}
                                    />
                                </View>
                            </View>
                            {
                                validerror.driver ? (
                                    <Text style={commonstyles.error_text}>{validerror.driver}</Text>
                                ) : null
                            }
                        </View>


                        <View style={styles.date}>
                            <Text style={styles.first}>Vehicle No </Text>
                            <View style={[styles.for_border_dropdown, validerror.vehicle ? commonstyles.errorBorder : null]}>
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
                                        data={VehicleNo}
                                        placeholder="Select Vehicle No "
                                        value={vehicle}
                                        onChange={item => {
                                            setVehicle(item.value)
                                            setValidError(prev => ({ ...prev, vehicle: null }));
                                        }}
                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}
                                    />
                                </View>
                            </View>
                            {
                                validerror.vehicle ? (
                                    <Text style={commonstyles.error_text}>{validerror.vehicle}</Text>
                                ) : null
                            }
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
                                                    <Text style={commonstyles.error_text}> {validerror[`qty_${index}`]}</Text>
                                                )}
                                            </View>



                                            <View style={styles.right}>
                                                <Text style={styles.first}>Rate ({`\u20B9`})</Text>

                                                <View style={[styles.for_newborder, validerror[`rate_${index}`] ? commonstyles.errorBorder : null]}>
                                                    <TextInput placeholder="Add The Price Here" style={styles.newinputfield} value={item.rate} keyboardType="numeric" placeholderTextColor="#888"
                                                        onChangeText={text => {
                                                            setProduct(prev =>
                                                                prev.map(prod =>
                                                                    prod.id === item.id ? { ...prod, rate: text } : prod
                                                                )
                                                            );
                                                            setValidError(prev => ({ ...prev, [`rate_${index}`]: null }));
                                                        }}
                                                    />
                                                </View>

                                                {validerror[`rate_${index}`] && (
                                                    <Text style={commonstyles.error_text}>  {validerror[`rate_${index}`]}  </Text>
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
                            <Text style={styles.btn_text}>Add Distributor Sale</Text>
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
        fontSize: 14,
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
export default AddSalesInDistributorsales

















