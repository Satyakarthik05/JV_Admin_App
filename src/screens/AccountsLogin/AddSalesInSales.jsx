// import React, { useCallback, useMemo, useState } from "react";
// import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
// import { colors, fonts } from "../../config/theme";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Feather from 'react-native-vector-icons/Feather';
// import { Dropdown } from "react-native-element-dropdown";
// import Entypo from 'react-native-vector-icons/Entypo';
// import { useDispatch, useSelector } from "react-redux";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
// import { AddSaleForDirver, GetVehiclesData } from "../../redux/reducers/AccounsLogin/VehicleDetails";
// import { GetProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import commonstyles from "../../commonstyles/commonstyles";

// //********************************************** AddSalesInSales ***************************************************************//
// const AddSalesInSales = () => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();

//     useFocusEffect(
//         useCallback(() => {
//             StatusBar.setBackgroundColor(colors.white)
//             StatusBar.setBarStyle("dark-content");
//             dispatch(GetRegesteredData());
//             dispatch(GetVehiclesData());
//             dispatch(GetProductsInMaster())
//         }, [dispatch])
//     )

//     const { getEmpdata } = useSelector((state) => state.GetEmp);
//     console.log("****************************GetEmployess Data All Employess Data in  Add Sales to sales Screen *****************************", getEmpdata);

//     const { GetVehiclesDetails } = useSelector((state) => state.GetVehiclesDetailsData);
//     console.log("Vehicles Details Data in add sales for sales ------->", GetVehiclesDetails);

//     const { GetProductData } = useSelector((state) => state.GetProductsInPM);
//     console.log("GetProducts Data in Add Sales for sales----------------------->", GetProductData);


//     const [driver, setDriver] = useState(null);
//     const [validerror, setValidError] = useState({});
//     const [vehicle, setVehicle] = useState(null);
//     const [showDate, setShowDate] = useState(false);  // show calender
//     const [isSubmitting, setIsSubmitting] = useState(false);
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


//     // dropdown data for drivers data 
//     const driverDropdownData = useMemo(() => {
//         return getEmpdata
//             ?.filter(emp => emp.roleName === "DRIVER")
//             ?.map(emp => ({
//                 label: emp.name,
//                 value: emp.id,
//                 mobile: emp.mobileNumber
//             })) || [];
//     }, [getEmpdata]);



//     // dropdown for vehicle number
//     const VehicleNo =
//         GetVehiclesDetails?.map(item => ({
//             label: item.vehicleNumber,//name
//             value: item.id,//id
//         })) || [];


//     // dropdown for products data
//     const productsData =
//         GetProductData?.map(item => ({
//             label: item.productName,// name
//             value: item.id,//value
//         })) || [];


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
//         const Quantity = Number(item.qty || 0);
//         const Rate = Number(item.rate || 0);
//         return sum = sum + (Quantity * Rate);
//     }, 0);

//     const [discount, setDiscount] = useState('');
//     const finalAmount = Math.max(totalAmount - Number(discount || 0), 0);

//     const validation = () => {
//         let newerror = {};

//         if (!driver) {
//             newerror.driver = "Please select Driver";
//         }

//         if (!vehicle) {
//             newerror.vehicle = "Please Select Vehicle number";
//         }

//         product.forEach((item, index) => {

//             // Product
//             if (!item.productID) {
//                 newerror[`productID_${index}`] = "Please Select Product Name";
//             }

//             // Quantity  FIXED
//             if (!item.qty || !item.qty.trim()) {
//                 newerror[`qty_${index}`] = "Enter Quantity";
//             } else if (!/^\d+(\.\d+)?$/.test(item.qty)) {
//                 newerror[`qty_${index}`] = "Invalid Quantity";
//             }

//             // Rate  FIXED
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
//             stockDate: date, // already in YYYY-MM-DD format
//             driverId: driver,
//             vehicleId: vehicle,
//             items: product.map((item) => {
//                 const selectedProduct = productsData.find(
//                     (prod) => prod.value === item.productID
//                 );

//                 return {
//                     productId: item.productID,
//                     productName: selectedProduct?.label || "",
//                     quantity: Number(item.qty)
//                 };
//             })
//         };

//         console.log("Payload Data  that dispatcing  UI Screen Add Sales for driver ----------------------->", payload);

//         try {
//             const response = await dispatch(AddSaleForDirver(payload)).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

//             //show Api message in alert
//             Alert.alert(
//                 "Success",
//                 response?.data?.message || response?.message || "vehicle details  Added Successfully",

//                 [
//                     {
//                         text: "OK",
//                         onPress: () => {
//                             navigation.goBack();
//                         }
//                     }
//                 ]
//             );
//             // setCategory("");
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
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <View style={styles.container}>

//                     <SafeAreaView>
//                         <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
//                             <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
//                             <Text style={commonstyles.title}>Add Stock</Text>
//                         </TouchableOpacity>
//                     </SafeAreaView>


//                     <ScrollView showsVerticalScrollIndicator={false}>

//                         <View style={styles.card}>

//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Driver</Text>
//                                 <View style={[styles.for_border_dropdown, validerror.driver ? commonstyles.errorBorder : null]}>
//                                     <Dropdown
//                                         style={styles.dropdown}
//                                         placeholderStyle={styles.placeholderStyle}
//                                         selectedTextStyle={styles.placeholderStyle}
//                                         itemTextStyle={styles.placeholderStyle}
//                                         showsVerticalScrollIndicator={false}
//                                         labelField="label"
//                                         valueField="value"
//                                         data={driverDropdownData}
//                                         placeholder="Select Driver"
//                                         value={driver}
//                                         onChange={item => {
//                                             setDriver(item.value)
//                                             if (item.value) {
//                                                 setValidError(prev => ({ ...prev, driver: null }));
//                                             }
//                                         }}
//                                         renderRightIcon={() => (
//                                             <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                         )}
//                                     />
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
//                                     <Dropdown
//                                         style={styles.dropdown}
//                                         placeholderStyle={styles.placeholderStyle}
//                                         selectedTextStyle={styles.placeholderStyle}
//                                         itemTextStyle={styles.placeholderStyle}
//                                         showsVerticalScrollIndicator={false}
//                                         labelField="label"
//                                         valueField="value"
//                                         data={VehicleNo}
//                                         placeholder="Select Vehicle No "
//                                         value={vehicle}
//                                         onChange={item => {
//                                             setVehicle(item.value)
//                                             setValidError(prev => ({ ...prev, vehicle: null }));
//                                         }}
//                                         renderRightIcon={() => (
//                                             <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                         )}
//                                     />
//                                 </View>
//                                 {
//                                     validerror.vehicle ? (
//                                         <Text style={commonstyles.error_text}>{validerror.vehicle}</Text>
//                                     ) : null
//                                 }
//                             </View>


//                             {/* <View style={styles.date}>
//                         <Text style={styles.first}>Dispatch From</Text>
//                         <View style={styles.for_border}>
//                             <TextInput style={styles.inputfield} placeholder="Dispatch From" />
//                         </View>
//                     </View> */}

//                             <View style={styles.date}>
//                                 <Text style={styles.first}>Dispatch Date</Text>
//                                 <View style={styles.for_border}>
//                                     <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
//                                     <TouchableOpacity onPress={() => setShowDate(true)}>
//                                         <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
//                                     </TouchableOpacity>
//                                 </View>
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
//                                                             setValidError(prev => ({ ...prev, productID: null }))
//                                                         }}
//                                                         placeholder="Select Product name"
//                                                         renderRightIcon={() => (
//                                                             <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
//                                                         )}
//                                                     />
//                                                 </View>
//                                                 {
//                                                     validerror[`productID_${index}`] &&
//                                                     <Text style={commonstyles.error_text}>{validerror[`productID_${index}`]}</Text>
//                                                 }
//                                             </View>

//                                             {/* unit */}
//                                             <View style={styles.head_new}>
//                                                 <View style={styles.left}>
//                                                     <Text style={styles.first}>Quantity</Text>
//                                                     <View style={[styles.for_newborder, validerror[`qty_${index}`] ? commonstyles.errorBorder : null]}>
//                                                         <TextInput placeholder="Add Quantity Here" style={styles.newinputfield} value={item.qty} keyboardType="numeric" placeholderTextColor="#888"
//                                                             onChangeText={text => {
//                                                                 setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, qty: text } : prod));
//                                                                 setValidError(prev => ({ ...prev, [`qty_${index}`]: null }));
//                                                             }}
//                                                         />
//                                                     </View>
//                                                     {
//                                                         validerror[`qty_${index}`] ? (
//                                                             <Text style={commonstyles.error_text}>{validerror[`qty_${index}`]}</Text>
//                                                         ) : null
//                                                     }
//                                                 </View>

//                                                 <View style={styles.right}>
//                                                     <Text style={styles.first}>Rate ({`\u20B9`})</Text>
//                                                     <View style={[styles.for_newborder, validerror[`rate_${index}`] ? commonstyles.errorBorder : null]}>
//                                                         <TextInput placeholder="Add The Price Here" style={styles.newinputfield} value={item.rate} keyboardType="numeric" placeholderTextColor="#888"
//                                                             onChangeText={text => {
//                                                                 setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, rate: text } : prod))
//                                                                 setValidError(prev => ({ ...prev, [`rate_${index}`]: null }))
//                                                             }}
//                                                         />
//                                                     </View>
//                                                     {
//                                                         validerror[`rate_${index}`] ? (
//                                                             <Text style={commonstyles.error_text}>{validerror[`rate_${index}`]}</Text>
//                                                         ) : null
//                                                     }
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


//                         <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting} >
//                             {isSubmitting ? (
//                                 <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
//                                     <ActivityIndicator color="#fff" size="small" />
//                                     <Text style={[styles.btn_text, { marginLeft: 10 }]}>Adding....</Text>
//                                 </View>
//                             ) : (
//                                 <Text style={styles.btn_text}> Add Stock</Text>
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
// export default AddSalesInSales














// {/* <View style={styles.card}>
//                     <Text style={[styles.left_side, styles.title]}>Order Summary</Text>

//                     <View style={styles.head_new}>
//                         <Text style={[styles.first, { color: colors.black }]}>Amount</Text>
//                         <Text style={[styles.title, { color: colors.black }]}>{`\u20B9`}{totalAmount}</Text>
//                     </View>

//                     <View style={styles.date}>
//                         <Text style={styles.first}>Discount</Text>
//                         <View style={styles.for_border}>
//                             <TextInput style={styles.inputfield} placeholder="Discount" keyboardType="numeric" value={discount} onChangeText={text=>setDiscount(text)} />
//                         </View>
//                         <View style={styles.dashed_border}></View>

//                         <View style={styles.head_new}>
//                             <Text style={[styles.title, { color: colors.black }]}>Total</Text>
//                             <Text style={[styles.title, { color: colors.homeblue }]}>{`\u20B9`}{finalAmount}</Text>
//                         </View>

//                     </View>

//                 </View> */}






















// new code 
import React, { useCallback, useMemo, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, Keyboard } from "react-native";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { AddSaleForDirver, GetAssignStock, GetVehiclesData } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import { GetProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
import Ionicons from 'react-native-vector-icons/Ionicons';
import commonstyles from "../../commonstyles/commonstyles";

const AddSalesInSales = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content");
            dispatch(GetRegesteredData());
            dispatch(GetVehiclesData());
            dispatch(GetProductsInMaster());
            dispatch(GetAssignStock());

        }, [dispatch])
    );



    const { getEmpdata } = useSelector((state) => state.GetEmp);
    const { GetVehiclesDetails } = useSelector((state) => state.GetVehiclesDetailsData);
    const { GetProductData } = useSelector((state) => state.GetProductsInPM);
    const { StockData } = useSelector((state) => state.GetDriverStockData);
    console.log("StaockData------------------->", StockData)



    const today = new Date().toLocaleDateString("en-CA");
    // gives YYYY-MM-DD in local time

    const todayStock = useMemo(() => {
        return StockData?.filter(item => {
            const localDate = new Date(item.stockDate)
                .toLocaleDateString("en-CA");

            return localDate === today;
        }) || [];
    }, [StockData]);

    const assignedVehicleIds = new Set(todayStock.map(item => item.vehicleId));
    const assignedDriverCodes = new Set(todayStock.map(item => item.empCode));


    const [driver, setDriver] = useState(null);
    const [validerror, setValidError] = useState({});
    const [vehicle, setVehicle] = useState(null);
    const [showDate, setShowDate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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


    //main one
    // const driverDropdownData = useMemo(() => {
    //     return getEmpdata
    //         ?.filter(emp => emp.roleName === "DRIVER")
    //         ?.map(emp => ({ label: emp.name, value: emp.id, mobile: emp.mobileNumber })) || [];
    // }, [getEmpdata]);


    //filtered Data 
    const filteredDrivers = useMemo(() => {
        return getEmpdata
            ?.filter(emp =>
                emp.roleName === "DRIVER" &&
                !assignedDriverCodes.has(emp.empCode)
            )
            ?.map(emp => ({
                label: emp.name,
                value: emp.id,
                mobile: emp.mobileNumber
            })) || [];
    }, [getEmpdata, assignedDriverCodes]);


    //main one 
    // const VehicleNo = useMemo(() =>
    //     GetVehiclesDetails?.map(item => ({ label: item.vehicleNumber, value: item.id })) || [],
    //     [GetVehiclesDetails]
    // );


    // filter Date
    const filteredVehicles = useMemo(() => {
        return GetVehiclesDetails
            ?.filter(vehicle =>
                !assignedVehicleIds.has(vehicle.id)
            )
            ?.map(item => ({
                label: item.vehicleNumber,
                value: item.id
            })) || [];
    }, [GetVehiclesDetails, assignedVehicleIds]);

    const productsData = useMemo(() =>
        GetProductData?.map(item => ({ label: item.productName, value: item.id, mrp: item.mrp, })) || [],
        [GetProductData]
    );

    const [materailCount, setMaterialCount] = useState(1);
    const [product, setProduct] = useState([
        { id: 1, productID: null, materialno: 1, name: null, qty: '', rate: '', cost: '' }
    ]);

    const AddProduct = () => {
        setProduct(prev => [
            ...prev,
            { id: Date.now(), productID: null, materialno: materailCount + 1, name: null, qty: '', rate: '', cost: '' }
        ]);
        setMaterialCount(prev => prev + 1);
    };

    const removeproduct = (id) => {
        setProduct(prev => prev.filter(item => item.id !== id));
    };

    const totalAmount = product.reduce((sum, item) => {
        const Quantity = Number(item.qty || 0);
        const Rate = Number(item.rate || 0);
        return sum + (Quantity * Rate);
    }, 0);

    const [discount, setDiscount] = useState('');
    const finalAmount = Math.max(totalAmount - Number(discount || 0), 0);

    const validation = () => {
        let newerror = {};
        if (!driver) newerror.driver = "Please select Driver";
        if (!vehicle) newerror.vehicle = "Please Select Vehicle number";

        product.forEach((item, index) => {
            if (!item.productID) newerror[`productID_${index}`] = "Please Select Product Name";
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
            stockDate: date,
            driverId: driver,
            vehicleId: vehicle,
            items: product.map((item) => {
                const selectedProduct = productsData.find((prod) => prod.value === item.productID);
                return {
                    productId: item.productID,
                    productName: selectedProduct?.label || "",
                    quantity: Number(item.qty)
                };
            })
        };
        console.log("payload data that dispaching to redux code ---------------->", payload);


        try {
            const response = await dispatch(AddSaleForDirver(payload)).unwrap();
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "vehicle details Added Successfully",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert("Error", error || "Something went Wrong");
        } finally {
            setIsSubmitting(false);
        } 
    };




    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.white }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <View style={styles.container}>
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Add Stock</Text>
                    </TouchableOpacity>
                </SafeAreaView>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                    removeClippedSubviews={false}
                >
                    <View style={styles.card}>
                        <View style={styles.date}>
                            <Text style={styles.first}>Driver</Text>
                            <View style={[styles.for_border_dropdown, validerror.driver ? commonstyles.errorBorder : null]}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.placeholderStyle}
                                    itemTextStyle={styles.placeholderStyle}
                                    showsVerticalScrollIndicator={false}
                                    labelField="label"
                                    valueField="value"
                                    // data={driverDropdownData}
                                    data={filteredDrivers}
                                    placeholder="Select Driver"
                                    value={driver}
                                    onChange={item => {
                                        setDriver(item.value);
                                        if (item.value) setValidError(prev => ({ ...prev, driver: null }));
                                    }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                    )}
                                />
                            </View>
                            {validerror.driver ? <Text style={commonstyles.error_text}>{validerror.driver}</Text> : null}
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Vehicle No </Text>
                            <View style={[styles.for_border_dropdown, validerror.vehicle ? commonstyles.errorBorder : null]}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.placeholderStyle}
                                    itemTextStyle={styles.placeholderStyle}
                                    showsVerticalScrollIndicator={false}
                                    labelField="label"
                                    valueField="value"
                                    // data={VehicleNo}
                                    data={filteredVehicles}
                                    placeholder="Select Vehicle No "
                                    value={vehicle}
                                    onChange={item => {
                                        setVehicle(item.value);
                                        setValidError(prev => ({ ...prev, vehicle: null }));
                                    }}
                                    renderRightIcon={() => (
                                        <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                    )}
                                />
                            </View>
                            {validerror.vehicle ? <Text style={commonstyles.error_text}>{validerror.vehicle}</Text> : null}
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Dispatch Date</Text>
                            <View style={styles.for_border}>
                                <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
                                <TouchableOpacity onPress={() => setShowDate(true)}>
                                    <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.date}>
                        <Text style={styles.title}>Add Product</Text>

                        {product.map((item, index) => {
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
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.placeholderStyle}
                                                itemTextStyle={styles.placeholderStyle}
                                                showsVerticalScrollIndicator={false}
                                                labelField="label"
                                                valueField="value"
                                                data={productsData}
                                                value={item.productID}
                                                onChange={val => {
                                                    setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, productID: val.value,  } : prod));
                                                    setValidError(prev => ({ ...prev, [`productID_${index}`]: null }));
                                                }}
                                                // rate: String(val.mrp || ''),
                                                placeholder="Select Product name"
                                                renderRightIcon={() => (
                                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                                )}
                                            />
                                        </View>
                                        {validerror[`productID_${index}`] && <Text style={commonstyles.error_text}>{validerror[`productID_${index}`]}</Text>}
                                    </View>

                                    <View style={styles.head_new}>
                                        <View style={styles.left}>
                                            <Text style={styles.first}>Quantity</Text>
                                            <View style={[styles.for_newborder, validerror[`qty_${index}`] ? commonstyles.errorBorder : null]}>
                                                <TextInput placeholder="Add Quantity Here" style={styles.newinputfield} value={item.qty} keyboardType="numeric" placeholderTextColor="#888"
                                                    onChangeText={text => {
                                                        setProduct(prev => prev.map(prod => prod.id === item.id ? { ...prod, qty: text } : prod));
                                                        setValidError(prev => ({ ...prev, [`qty_${index}`]: null }));
                                                    }}
                                                />
                                            </View>
                                            {validerror[`qty_${index}`] ? <Text style={commonstyles.error_text}>{validerror[`qty_${index}`]}</Text> : null}
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

                                                {/* <TextInput
                                                    placeholder="Add The Price Here"
                                                    style={styles.newinputfield}
                                                    value={item.rate}
                                                    editable={false}
                                                /> */}
                                            </View>
                                            {validerror[`rate_${index}`] ? <Text style={commonstyles.error_text}>{validerror[`rate_${index}`]}</Text> : null}
                                        </View>
                                    </View>

                                    <View style={[styles.for_border, { backgroundColor: colors.gray, padding: 5, marginTop: 13 }]}>
                                        <Text style={[styles.first, { color: colors.black }]}>Amount</Text>
                                        <Text style={[styles.first, { color: colors.black }]}>{`\u20B9`}{amount}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    <TouchableOpacity style={styles.botted} onPress={AddProduct}>
                        <Entypo name="plus" size={20} color="#4A5565" />
                        <Text style={styles.bottedText}>Add Another Product</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btn_text, { marginLeft: 10 }]}>Adding....</Text>
                            </View>
                        ) : (
                            <Text style={styles.btn_text}> Add Stock</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                {showDate && (
                    <DateTimePicker
                        value={new Date(date)}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={TodayDate}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12
    },
    header:
    {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10

    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: fonts.sfbold,
        color: colors.black
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1, padding: 12,
        shadowRadius: 6,
        elevation: 4,
        marginRight: 1,
        marginLeft: 1,
        marginTop: 13
    },
    date: {
        marginTop: 13
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        fontFamily: fonts.sfmedium
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
        paddingTop: 15,
        paddingBottom: 15
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: '500',
        paddingLeft: 10
    },
    calender_icon: {
        paddingRight: 15
    },
    head_new: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    newinputfield: {
        color: colors.black,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 5
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: '500',
        fontFamily: fonts.sfmedium
    },
    left_side: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.inputfieldborder,
        paddingBottom: 10
    },
    bg: {
        backgroundColor: colors.lightredcolor,
        padding: 8,
        borderRadius: 8
    },
    for_newborder: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5
    },
    botted: {
        flexDirection: 'row',
        textAlign: 'center',
        marginTop: 13,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.commoncolor,
        paddingVertical: 8,
        borderRadius: 6,
        paddingLeft: 90
    },
    bottedText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.formtitlegry,
        marginBottom: 5,
        fontFamily: fonts.sfmedium
    },
    dashed_border: {
        borderBottomWidth: 1,
        borderBottomColor: colors.inputfieldborder,
        textDecorationLine: 'line-through',
        borderStyle: 'dashed',
        marginTop: 13
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20
    },
    btn_text: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        paddingTop: 16,
        paddingBottom: 16
    },
});

export default AddSalesInSales;
