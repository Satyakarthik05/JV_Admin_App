import { useFocusEffect, useNavigation, useRoute, } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from "react-redux";
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";
import { GetCustomerData } from "../../redux/reducers/DriverLogin/Forms";
import commonstyles from "../../commonstyles/commonstyles";
import { AddRoute, EditAssignRoutecustomer, GetAssignedCustomers, GetAssignedCustomersByID } from "../../redux/reducers/AccounsLogin/VehicleDetails";


const EditAssignDriver = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { ParamsData, EditData } = route.params;
    console.log("EditData Coming from Params..................>", EditData);//main data 









    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content");


        }, [])
    )

    useEffect(() => {
        dispatch(GetRegesteredData());
        dispatch(GetCustomerData());
        dispatch(GetAssignedCustomers())
    }, []);




    const [driver, setDriver] = useState(null);
    const [mobile, setMobile] = useState(EditData?.mobileNumber);
    const [customer, setCustomer] = useState([]);
    const [routename, setRouteName] = useState(EditData?.routeName);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (EditData) {
            setDriver(EditData?.driver?.driverId);
            setMobile(EditData?.driver?.mobileNumber);
            setRouteName(EditData?.routeName);
        }
    }, [EditData]);



    useEffect(() => {
        if (EditData?.customers) {
            const selectedCustomers = EditData.customers.map(
                item => item.customerId
            );
            setCustomer(selectedCustomers);
        }
    }, [EditData]);


    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("****************************GetEmployess Data All Employess Data in  Add Assigned Driver Screen *****************************", getEmpdata);

    const { CustomersDataGetCall } = useSelector((state) => state.GetCustomers);
    console.log("Customers Data in Assign Route  Screen ---------------------->", CustomersDataGetCall);

    const { GetAssignRouteData } = useSelector((state) => state.AllRoutesInAssignRoute);
    console.log("Get All Routes For Assigned Customer Data -------------------------------->", GetAssignRouteData);







    // for driver name 
    const driverDropdownData = useMemo(() => {
        return getEmpdata
            ?.filter(emp => emp.roleName === "DRIVER")
            ?.map(emp => ({
                label: emp.name,
                value: emp.id,
                mobile: emp.mobileNumber
            })) || [];
    }, [getEmpdata]);



    // for Customer name 
    // const customerDropdownData = useMemo(() => {
    //     return CustomersDataGetCall
    //         ?.map(item => ({
    //             label: item.ownerName,
    //             value: item.id,
    //         })) || [];
    // }, [CustomersDataGetCall]);


    // to filter customers
    const assignedCustomerIds = useMemo(() => {
        if (!GetAssignRouteData) return [];
        return GetAssignRouteData
            ?.filter(route => route.routeId !== EditData?.routeId) // exclude current route
            ?.flatMap(route =>
                route.customers.map(c => c.customerId)
            );
    }, [GetAssignRouteData, EditData]);

    const customerDropdownData = useMemo(() => {
        return CustomersDataGetCall
            ?.filter(item =>
                //  remove already assigned
                !assignedCustomerIds.includes(item.id)
                //  allow already selected customers (for edit screen)
                || customer.includes(item.id)
            )
            ?.map(item => ({
                label: item.ownerName,
                value: item.id,
            })) || [];
    }, [CustomersDataGetCall, assignedCustomerIds, customer]);







    // form validation 
    const handleValidation = () => {
        let newErrors = {};

        // driver name
        if (!driver) {
            newErrors.driver = "Please Select Driver Name";
        }

        // Customer Name
        if (!customer || customer.length === 0) {
            newErrors.customer = "Please Select at least one Customer";
        }

        // Route name validation
        if (!routename || routename.trim().length === 0) {
            newErrors.routename = "Please enter route name";
        } else if (routename.trim().length < 3) {
            newErrors.routename = "Route name must be at least 3 characters";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent multiple clicks

        const isValid = handleValidation();
        if (!isValid) return false;

        setIsSubmitting(true); //  start loading

        const id = EditData?.routeId;
        const payload = {
            routeName: routename,
            driverId: driver,
            customers: customer
        }
        console.log("Payload Data  that dispatcing  UI Screen Edit Assigned Route ----------------------->", payload);


        try {
            const response = await dispatch(EditAssignRoutecustomer({ id, payload })).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

            //show Api message in alert
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "vehicle details Updating Successfully",

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
            setIsSubmitting(false); // stop loading
        }
    }





    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>



                    <SafeAreaView style={styles.top} >
                        <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                            <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                            <Text style={styles.title}> Edit Assign Route</Text>
                        </TouchableOpacity>
                    </SafeAreaView>


                    <Text style={styles.title}>Driver Details</Text>


                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                        <View style={styles.card}>
                            <View>
                                <Text style={styles.first}>Select Driver</Text>
                                <View style={[styles.for_border_dropdown, errors?.driver ? commonstyles.errorBorder : null]}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.placeholderStyle}
                                        itemTextStyle={styles.placeholderStyle}
                                        placeholder="Select Driver"
                                        data={driverDropdownData}
                                        labelField="label"
                                        valueField="value"
                                        value={driver}
                                        onChange={item => {
                                            setDriver(item.value)
                                            setMobile(item.mobile); // auto filles the selected user mobile number 
                                            if (item.value) {
                                                setErrors(prev => ({ ...prev, driver: null }));
                                            }

                                        }}

                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}

                                    />
                                </View>
                                {
                                    errors.driver ? (
                                        <Text style={commonstyles.error_text}>{errors.driver}</Text>
                                    ) : null
                                }
                            </View>

                            <View style={styles.head}>
                                <Text style={styles.first}>Mobile Number</Text>
                                <View style={styles.for_border}>
                                    <TextInput style={styles.inputfield} placeholder="00000 00000" placeholderTextColor="#888" maxLength={10} value={mobile} editable={false} />
                                </View>
                            </View>


                        </View>

                        <Text style={styles.title}>Route Details</Text>

                        <View style={styles.card}>

                            <View>
                                <Text style={styles.first}>Route Name</Text>
                                <View style={[styles.for_border, errors?.routename ? commonstyles.errorBorder : null]}>
                                    <TextInput style={styles.inputfield} placeholder="Route Name" placeholderTextColor="#888" value={routename}
                                        onChangeText={(text) => {
                                            setRouteName(text);
                                            setErrors(prev => ({ ...prev, routename: "" }));
                                        }}
                                    />
                                </View>
                                {
                                    errors.routename ? (
                                        <Text style={commonstyles.error_text}>{errors.routename}</Text>
                                    ) : null
                                }
                            </View>

                            <View style={styles.head}>
                                <Text style={styles.first}>Add Customers</Text>
                                <View style={[styles.for_border_dropdown, errors?.customer ? commonstyles.errorBorder : null]}>
                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.placeholderStyle}
                                        itemTextStyle={styles.placeholderStyle}
                                        data={customerDropdownData}
                                        labelField="label"
                                        valueField="value"
                                        value={null} // important for multi-select
                                        placeholder={customer.length > 0 ? ` Customers Selected` : "Select Customers"}
                                        onChange={item => {
                                            let updatedCustomers = [...customer];
                                            const index = updatedCustomers.indexOf(item.value);
                                            if (index > -1) {
                                                updatedCustomers.splice(index, 1);
                                            } else {
                                                updatedCustomers.push(item.value);
                                            }

                                            setCustomer(updatedCustomers);

                                            if (updatedCustomers.length > 0) {
                                                setErrors(prev => ({ ...prev, customer: null }));
                                            }

                                        }}

                                        renderRightIcon={() => (
                                            <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                        )}
                                    />

                                </View>

                                {
                                    errors.customer ? (
                                        <Text style={commonstyles.error_text}>{errors.customer}</Text>
                                    ) : null
                                }

                                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                    {customer.map((id) => {
                                        const selectedItem = customerDropdownData.find(item => item.value === id);
                                        return (
                                            <View key={id} style={styles.selectedItem}>
                                                <Text style={styles.selectedText}>{selectedItem?.label}</Text>

                                                <TouchableOpacity onPress={() => { const updated = customer.filter(item => item !== id); setCustomer(updated); }}>
                                                    <Text style={styles.removeIcon}>✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>

                            </View>

                        </View>



                        <TouchableOpacity style={[styles.btn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting} >
                            {isSubmitting ? (
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    <ActivityIndicator color="#fff" size="small" />
                                    <Text style={[styles.btn_text, { marginLeft: 10 }]}>Updateing...</Text>
                                </View>
                            ) : (
                                <Text style={styles.btn_text}>Update</Text>
                            )}
                        </TouchableOpacity>


                    </ScrollView>






                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
        gap: 10,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: colors.black,
        marginLeft: 10,
        fontFamily: fonts.sfbold,
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
    head: {
        marginTop: 13,
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontFamily: fonts.sfmedium,
        marginBottom: 5,
        fontWeight: 500,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
        paddingTop: 15,
        paddingBottom: 15,
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
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        paddingLeft: 10,
    },
    calender_icon: {
        paddingRight: 15,
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 8,
        marginTop: 15,
    },
    btn_text: {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.white,
        textAlign: 'center',
    },

    selectedItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E6F0FF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },

    selectedText: {
        fontSize: 14,
        color: "#333",
        marginRight: 6,
    },

    removeIcon: {
        fontSize: 14,
        color: "red",
        fontWeight: "bold",
    },

})
export default EditAssignDriver