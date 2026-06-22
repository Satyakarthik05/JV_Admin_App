import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, StatusBar, PermissionsAndroid, Platform, Alert, ActivityIndicator, Image, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, fonts } from '../../config/theme';
import commonstyles from '../../commonstyles/commonstyles';
import { Dropdown } from 'react-native-element-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import Geolocation from 'react-native-geolocation-service';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';  // to read the excel data
import { AddCustomer } from '../../redux/reducers/DriverLogin/Forms';
import { useDispatch } from 'react-redux';
const AddCustomerScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const shopsData = [
        { label: "Kirana Store", value: "Kirana" },
        { label: "Super Market", value: "SuperMarket" },
        { label: "General Store", value: "GeneralStore" },
        { label: "Cool Drinks Shop", value: "CoolDrinksShop" },
        { label: "Juice Center", value: "JuiceCenter" },
        { label: "Tea Stall", value: "TeaStall" },
        { label: "Soda Shop", value: "SodaShop" },
        { label: "Bakery", value: "Bakery" },
        { label: "Hotel / Restaurant", value: "Hotel" },
        { label: "Cafe", value: "Cafe" },
        { label: "Ice Cream Parlour", value: "IceCream" },
        { label: "Wholesale Dealer", value: "Wholesale" },
        { label: "Distributor", value: "Distributor" }
    ];


    //customer Type Data 
    const customerTypeData = [
        { label: "Retail", value: "RETAIL" },
        { label: "Wholesale", value: "WHOLESALE" },
        { label: "Distributor", value: "DISTRIBUTOR" }
    ];


    // for Address
    const [customerAddress, setCustomerAddress] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [shope, setShope] = useState('');
    const [customertype, setCustomerType] = useState('');
    const [shopename, setShopeName] = useState('');
    const [owner, setOwner] = useState('');
    const [phno, setPhno] = useState('');
    const [dno, setDno] = useState('');
    const [street, setStreet] = useState('');
    const [area, setArea] = useState('');
    const [landmark, setLandMark] = useState('');
    const [city, setCity] = useState('');
    const [pin, setPin] = useState('');
    const [note, setNote] = useState('');
    const [password, setPassword] = useState('');
    const [openbalance, setOpenBalance] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [addressHeight, setAddressHeight] = useState(responsiveHeight(5));


    const [errors, setErrors] = useState({});

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )


    // for Address  functionanlity start
    const getAddressFromLatLng = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                {
                    headers: {
                        "User-Agent": "CustomerApp/1.0"
                    }
                }
            );

            const data = await res.json();

            return data.display_name || `${lat}, ${lng}`;

        } catch (error) {
            console.log(error);
            return `${lat}, ${lng}`;
        }
    };

    //taking permissions for Takeing Addrress.....
    // const requestLocationPermission = async () => {
    //     if (Platform.OS === "android") {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //         );
    //         return granted === PermissionsAndroid.RESULTS.GRANTED;
    //     }
    //     return true;
    // };

    const requestLocationPermission = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "We need your location to auto-fill address",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };


    //Main Function for Takeing Address
    const handleGetLocation = async () => {
        const permission = await requestLocationPermission();

        if (!permission) {
            Alert.alert("Permission denied");
            return;
        }

        Geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // const address = await getAddressFromLatLng(lat, lng);

                // setCustomerAddress(address);
                // setLatitude(lat);
                // setLongitude(lng);

                // console.log("Lat:", lat);
                // console.log("Lng:", lng);
                // console.log("Address:", address);


                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                        {
                            headers: {
                                "User-Agent": "CustomerApp/1.0",
                                "Accept": "application/json"
                            }
                        }
                    );

                    

                    const data = await res.json();

                    const addr = data.address || {};

                    //  Full Address (for display)
                    setCustomerAddress(data.display_name || "");

                    //  Auto-fill fields (IMPORTANT)
                    setStreet(addr.suburb || addr.neighbourhood || "");
                    setArea(addr.road || "");
                    setCity(addr.city || addr.town || addr.village || "");
                    setPin(addr.postcode || "");
                    setLandMark(addr.building || addr.shop || "");

                    //  Lat/Lng for backend
                    setLatitude(lat);
                    setLongitude(lng);

                    console.log("Full Address:", data.display_name);
                    console.log("Structured:", addr);

                } catch (error) {
                    console.log("Address Fetch Error:", error);
                    Alert.alert("Address not fetched");
                }
            },
            (error) => {
                console.log(error);
                Alert.alert("Location not fetchedw");
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
            }
        );
    };



   






    //function for upload image 

    const handleUploadImage = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled");
            } else if (response.errorCode) {
                Alert.alert("Error", response.errorMessage);
            } else {
                const asset = response.assets?.[0];

                const imageData = {
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || `photo_${Date.now()}.jpg`
                };

                setSelectedImage(imageData);
            }
        });
    };






    const handleValidation = () => {
        let newErrors = {};

        // Shop Name
        if (!shopename.trim()) {
            newErrors.shopename = "Please enter shop name";
        }

        // Owner
        if (!owner.trim()) {
            newErrors.owner = "Please enter owner name";
        } else if (owner.length < 3) {
            newErrors.owner = "Minimum 3 characters required";
        }

        // Phone
        if (!phno) {
            newErrors.phno = "Please enter mobile number";
        } else if (!/^[0-9]{10}$/.test(phno)) {
            newErrors.phno = "Enter valid 10-digit number";
        }

        // if (!password) {
        //     newErrors.password = "Please Enter Password";
        // }

        // Shop Type
        // if (!shope) {
        //     newErrors.shope = "Please select shop type";
        // }


        // customer Type
        if (!customertype) {
            newErrors.customerType = "Please select Customer type";
        }

        if (customertype === "DISTRIBUTOR" && !password) {
            newErrors.password = "Please Enter Password";
        }

        // Address
        if (!dno.trim()) newErrors.dno = "Enter door number";
        if (!street.trim()) newErrors.street = "Enter street";
        if (!area.trim()) newErrors.area = "Enter area";
        if (!city.trim()) newErrors.city = "Enter city";
        if (!landmark.trim()) newErrors.landmark = "Enter Landmark";
        if (!openbalance.trim()) newErrors.openbalance = "Enter OpenBalance";

        if (!selectedImage) {
            newErrors.image = "Please upload customer photo";
        }

        if (!pin) {
            newErrors.pin = "Enter pincode";
        } else if (!/^[0-9]{6}$/.test(pin)) {
            newErrors.pin = "Invalid pincode";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        if (customertype !== "DISTRIBUTOR") {
            setPassword('');
        }
    }, [customertype])



    const handleSubmit = async () => {

        if (isSubmitting) return; //  prevent multiple clicks
        const isValid = handleValidation();

        if (!isValid) return;
        setIsSubmitting(true); //  start loading


        let imageBase64 = "";

        if (selectedImage) {
            const filePath = selectedImage.uri.replace("file://", "");
            const base64 = await RNFS.readFile(filePath, "base64");
            imageBase64 = `data:${selectedImage.type};base64,${base64}`;
        }

        const payload = {
            shopName: shopename,
            ownerName: owner,
            mobile: phno,
            customerType: customertype,
            //shopType: shope,
            doorNo: dno || '',
            street: street || '',
            area: area || '',
            landmark: landmark || '',
            city: city || '',
            pincode: pin || '',
            latitude: latitude,
            longitude: longitude,
            openingBalance: openbalance,
            photo: imageBase64,
            notes: note,
            password: password || '',
        }
        console.log("Customer Payload dispatch in UI ------------------------------------->", payload);
        try {
            const response = await dispatch(AddCustomer(payload)).unwrap();
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "Customer Added Successfully",

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
            console.log("API Error:", error);

            //Alert.alert("Error", error || "Something went Wrong");

            const errorMessage = error?.message || error?.data?.message || error?.error || "Something went wrong";

            Alert.alert("Error", String(errorMessage));
        }
        finally {
            setIsSubmitting(false); //  stop loading
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="#000" />
                <Text style={styles.headerTitle}>Add Customer</Text>
            </TouchableOpacity>
            <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Shop Name */}
                <Text style={styles.label}>Shop Name</Text>
                <TextInput placeholder="General Store" style={[styles.input, errors.shopename && { borderColor: 'red' }]} value={shopename} onChangeText={setShopeName} placeholderTextColor="#888" />
                {errors.shopename && (
                    <Text style={{ color: 'red', fontSize: 12 }}>{errors.shopename}</Text>
                )}


                {/* Owner Name */}
                <Text style={styles.label}> Owner Name <Text style={styles.required}>*</Text></Text>
                <TextInput placeholder="Enter owner name" style={[styles.input, errors.owner && { borderColor: 'red' }]} value={owner} onChangeText={setOwner} placeholderTextColor="#888" />
                {errors.owner && (
                    <Text style={{ color: 'red', fontSize: 12 }}>{errors.owner}</Text>
                )}


                {/* Mobile Number */}
                <Text style={styles.label}>Mobile Number <Text style={styles.required}>*</Text> </Text>
                <TextInput placeholder="Enter mobile number" keyboardType="number-pad" style={[styles.input, errors.phno && { borderColor: 'red' }]} maxLength={10} value={phno} onChangeText={setPhno} placeholderTextColor="#888" />
                {errors.phno && (
                    <Text style={{ color: 'red', fontSize: 12 }}>{errors.phno}</Text>
                )}


                {/* Shop Type */}
                {/* <View style={styles.date}>
                    <Text style={styles.label}> Shop Type <Text style={commonstyles.required}>*</Text></Text>
                    <View style={[commonstyles.for_border_dropdown, { zIndex: 1000 }, errors.shope && { borderColor: 'red' }]}>
                        <Dropdown
                            style={commonstyles.dropdown}
                            placeholderStyle={commonstyles.placeholderStyle}
                            selectedTextStyle={commonstyles.placeholderStyle}
                            itemTextStyle={commonstyles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={shopsData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Shope name"
                            value={shope}
                            onChange={item => { setShope(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={commonstyles.calender_icon} />
                            )}
                        />
                    </View>
                    {errors.shope && (
                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.shope}</Text>
                    )}

                </View> */}


                {/* password */}
                {/* <Text style={styles.label}>Password <Text style={styles.required}>*</Text> </Text>
                <TextInput placeholder="Enter Password" style={[styles.input, errors.phno && { borderColor: 'red' }]} value={password} onChangeText={setPassword} placeholderTextColor="#888" />
                {errors.password && (
                    <Text style={{ color: 'red', fontSize: 12 }}>{errors.password}</Text>
                )} */}


                {/* Shop Type */}
                <View style={styles.date}>
                    <Text style={styles.label}> Customer Type <Text style={commonstyles.required}>*</Text></Text>
                    <View style={[commonstyles.for_border_dropdown, { zIndex: 1000 }, errors.customerType && { borderColor: 'red' }]}>
                        <Dropdown
                            style={commonstyles.dropdown}
                            placeholderStyle={commonstyles.placeholderStyle}
                            selectedTextStyle={commonstyles.placeholderStyle}
                            itemTextStyle={commonstyles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={customerTypeData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Customer Type"
                            value={customertype}
                            onChange={item => { setCustomerType(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={commonstyles.calender_icon} />
                            )}
                        />
                    </View>
                    {errors.customerType && (
                        <Text style={{ color: 'red', fontSize: 12 }}>{errors.customerType}</Text>
                    )}

                </View>


                {
                    customertype === "DISTRIBUTOR" && (
                        <View>
                            <Text style={styles.label}>Password <Text style={styles.required}>*</Text> </Text>
                            <TextInput placeholder="Enter Password" style={[styles.input, errors.phno && { borderColor: 'red' }]} value={password} onChangeText={setPassword} placeholderTextColor="#888" />
                            {errors.password && (
                                <Text style={{ color: 'red', fontSize: 12 }}>{errors.password}</Text>
                            )}
                        </View>
                    )
                }

                {/* <Text style={styles.label}>Password <Text style={styles.required}>*</Text> </Text>
                <TextInput placeholder="Enter Password" style={[styles.input, errors.phno && { borderColor: 'red' }]} value={password} onChangeText={setPassword} placeholderTextColor="#888" />
                {errors.password && (
                    <Text style={{ color: 'red', fontSize: 12 }}>{errors.password}</Text>
                )} */}

                {/* Address Section */}
                <View style={styles.shopCard}>
                    <Text style={styles.sectionTitle}>Shop Address Details <Text style={styles.required}>*</Text></Text>

                    <TouchableOpacity style={styles.addLocation} onPress={handleGetLocation}>
                        <FontAwesome6 name="location-crosshairs" size={18} color="#E7000B" />
                        {/* <Text style={styles.addLocationText}>Add location</Text> */}
                        <Text style={styles.addLocationText}>{customerAddress ? "Location Added" : "Add Location"}</Text>
                    </TouchableOpacity>

                    <Text style={styles.fillDetails}>Fill details</Text>

                    {/* Address Card */}
                    <View style={styles.addressCard}>
                        {/* <View style={styles.row}>
                            <Text style={styles.routeText}>Route</Text>
                            <TextInput placeholder="Route" style={styles.addressInput} />
                        </View> */}

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Full Address</Text>
                            <TextInput placeholder="Full Address" style={styles.addressInput} value={customerAddress} editable={false} placeholderTextColor="#888" />
                        </View>


                        <View style={styles.row}>
                            <Text style={styles.routeText}>Door No</Text>
                            <TextInput placeholder="Door No" value={dno} onChangeText={setDno} style={[styles.addressInput, errors.dno && { borderColor: 'red' }]} placeholderTextColor="#888" />

                        </View>
                        {errors.dno && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.dno}</Text>
                        )}

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Street</Text>
                            <TextInput placeholder="Street" style={[styles.addressInput, errors.street && { borderColor: 'red' }]} value={street} onChangeText={setStreet} placeholderTextColor="#888" />
                        </View>
                        {errors.street && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.street}</Text>
                        )}


                        <View style={styles.row}>
                            <Text style={styles.routeText}>Area / Locality</Text>
                            <TextInput placeholder="Area / Locality" style={[styles.addressInput, errors.area && { borderColor: 'red' }]} value={area} onChangeText={setArea} placeholderTextColor="#888" />
                        </View>
                        {errors.area && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.area}</Text>
                        )}

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Landmark</Text>
                            <TextInput placeholder="Landmark" style={[styles.addressInput, errors.landmark && { borderColor: 'red' }]} value={landmark} onChangeText={setLandMark} placeholderTextColor="#888" />
                        </View>
                        {errors.landmark && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.landmark}</Text>
                        )}

                        <View style={styles.row}>
                            <Text style={styles.routeText}>City</Text>
                            <TextInput placeholder="City" style={[styles.addressInput, errors.city && { borderColor: 'red' }]} value={city} onChangeText={setCity} placeholderTextColor="#888" />
                        </View>
                        {errors.city && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.city}</Text>
                        )}

                        <View style={styles.row}>
                            <Text style={styles.routeText}>Pin code</Text>
                            <TextInput placeholder="Pin code" keyboardType="number-pad" style={[styles.addressInput, errors.pin && { borderColor: 'red' }]} value={pin} onChangeText={setPin} placeholderTextColor="#888" />
                        </View>
                        {errors.pin && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.pin}</Text>
                        )}


                        <View style={styles.row}>
                            <Text style={styles.routeText}>Opening Balance</Text>
                            <TextInput placeholder="Opening Balance" keyboardType="number-pad" style={[styles.addressInput, errors.openbalance && { borderColor: 'red' }]} value={openbalance} onChangeText={setOpenBalance} placeholderTextColor="#888" />
                        </View>
                        {errors.openbalance && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{errors.openbalance}</Text>
                        )}


                    </View>


                </View>

                {/* Upload Photo */}
                {/* <Text style={styles.sectionTitle}>Upload Photo (Optional)</Text>
                <TouchableOpacity style={styles.uploadBox}>
                    <Ionicons name="camera-outline" size={22} color="#8F8F8F" />
                    <Text style={styles.uploadText}>Upload payment photo</Text>
                </TouchableOpacity> */}

                <Text style={styles.sectionTitle}>Upload Photo <Text style={commonstyles.required}>*</Text></Text>

                {/* <TouchableOpacity style={[styles.uploadBox, errors.image && { borderColor: 'red' }]} onPress={handleUploadImage} >
                    {selectedImage ? (
                        <Text style={{ color: 'green' }}>Image Selected ✓</Text>
                    ) : (
                        <>
                            <Ionicons name="camera-outline" size={22} color="#8F8F8F" />
                            <Text style={styles.uploadText}>Upload customer photo</Text>
                        </>
                    )}
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[styles.uploadBox, errors.image && { borderColor: 'red' }]}
                    onPress={handleUploadImage}
                >
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 8
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <>
                            <Ionicons name="camera-outline" size={22} color="#8F8F8F" />
                            <Text style={styles.uploadText}>Upload customer photo</Text>
                        </>
                    )}
                </TouchableOpacity>

                {errors.image && (
                    <Text style={{ color: 'red', fontSize: 12 }}>
                        {errors.image}
                    </Text>
                )}


                {/* Notes */}
                <Text style={styles.sectionTitle}>Additional Notes</Text>
                <TextInput placeholder="Enter notes" multiline style={styles.notesInput} value={note} onChangeText={setNote} placeholderTextColor="#888" />



                <TouchableOpacity style={[commonstyles.redbutton, { marginHorizontal: 10, marginTop: 40 }, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting} >
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[commonstyles.redbuttonText, { marginLeft: 10 }]}>Adding...</Text>
                        </View>
                    ) : (
                        <Text style={commonstyles.redbuttonText}>Add Customer</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>

            {/* <TouchableOpacity style={[commonstyles.redbutton, { marginHorizontal: 10 }]} onPress={handleSubmit} >
                <Text style={[commonstyles.redbuttonText]}>Add Customer </Text>
            </TouchableOpacity> */}





        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },

    scrollContent: {
        padding: 14,
        paddingBottom: 40,
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#344054',
        marginTop: 14,
        marginBottom: 6,
    },

    required: {
        color: '#E7000B',
    },

    input: {
        height: responsiveHeight(6),
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        fontSize: 14,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },

    dropdown: {
        height: responsiveHeight(6),
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dropdownText: {
        fontSize: 14,
        color: '#101828',
    },

    sectionTitle: {
        marginTop: 20,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#101828',
    },

    addLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 6,
        // backgroundColor: '#FFF5F5',
        gap: 6,
    },

    addLocationText: {
        color: '#101828',
        fontSize: 14,
        fontWeight: '600',
    },

    fillDetails: {
        textAlign: 'center',
        fontSize: 12,
        color: '#667085',
        marginVertical: 10,
    },
    shopCard: {
        backgroundColor: '#fff',
        marginVertical: 10,
        padding: 5,
        borderRadius: 8,
        elevation: 4
    },

    addressCard: {
        // backgroundColor: '#fff',
        padding: 8,
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#EAECF0',
        gap: 10,
    },
    routeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#101828'
    },

    addressInput: {
        // height: responsiveHeight(5),
        // borderWidth: 1,
        // borderColor: '#D0D5DD',
        // borderRadius: 8,
        // paddingHorizontal: 12,
        // fontSize: 14,
        // color: '#101828',
        // width: responsiveWidth(60)

        minHeight: responsiveHeight(5), //  change from height → minHeight
        borderWidth: 1,
        borderColor: '#D0D5DD',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8, //  add this
        fontSize: 14,
        color: colors.black,
        width: responsiveWidth(60)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    // row: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    // },

    uploadBox: {
        height: responsiveHeight(7),
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#D0D5DD',
        borderRadius: 8,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    uploadText: {
        fontSize: 13,
        color: '#667085',
    },

    notesInput: {
        height: responsiveHeight(12),
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingTop: 10,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        textAlignVertical: 'top',
        color: colors.black,
    },
});


export default AddCustomerScreen;
