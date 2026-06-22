import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, TextInput, ScrollView, Dimensions, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";
//import DatePicker from "react-native-date-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import RNFS from 'react-native-fs';  // to read the excel data
import { fonts, colors } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { GetCategories } from "../../redux/reducers/MasterLogin/AddCategory";
import { AddProductsInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
import commonstyles from "../../commonstyles/commonstyles";


const { width, height } = Dimensions.get('window');

const AddProduct = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);

    const handleUploadImage = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            }
            else if (response.errorCode) {
                console.log("Image picker Error:", response.errorMessage);
                Alert.alert("Error", response.errorMessage);

            }
            else {
                //const uri = response.assets?.[0]?.uri;
                //setSelectedImage(uri);
                const asset = response.assets?.[0];
                const data = {
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || `photo_${Date.now()}.jpg`
                }
                // setSelectedImage({
                //     uri: asset.uri,
                //     type: asset.type,
                //     name: asset.fileName || `photo_${Date.now()}.jpg`
                // });
                console.log("Selected image", data);
                setSelectedImage(data);

            }

        })
    }

    const unitmeasurement = [
        { label: "mL", value: "mL" },
        { label: "L", value: "L" },
        { label: "bottle", value: "bottle" },
        { label: "can", value: "can" },
        { label: "pack", value: "pack" },
        { label: "pcs", value: "pcs" }
    ]
    const [measurement, setMeasurement] = useState(null);

    const capacities = [
        { label: "100", value: "100" },
        { label: "150", value: "150" },
        { label: "180", value: "180" },
        { label: "200", value: "200" },
        { label: "250", value: "250" },
        { label: "300", value: "300" },
        { label: "330", value: "330" },
        { label: "350", value: "350" },
        { label: "500", value: "500" },
        { label: "600", value: "600" },
        { label: "750", value: "750" },
        { label: "1000", value: "1000" },
        { label: "1500", value: "1500" },
        { label: "2000", value: "2000" },
        { label: "5000", value: "5000" }
    ]
    const [capacity, setCapacity] = useState(null);


    useEffect(() => {
        dispatch(GetCategories())
    }, [])
    const { getProductCategory } = useSelector((state) => state.GetCategoriesPM);
    console.log("GetCategory Data in Add Product Screen -------------->", getProductCategory);

    const [category, setCategory] = useState([]); // for data
    const [selectedCategory, setSelectedCategory] = useState(null);// for value
    const [openstock,setOpenStock]=useState('');


    useEffect(() => {
        if (getProductCategory && getProductCategory.length > 0) {
            setCategory(
                getProductCategory.map(item => ({
                    label: String(item.categoryName),
                    value: item.id,           // store ID
                    name: item.categoryName   // store name
                    // value: item.categoryName,
                }))
            )
        }
    }, [getProductCategory])

    const insets = useSafeAreaInsets();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hsncode, setHsncode] = useState('');
    const [name, setName] = useState('');
    const [sprice, setSPrice] = useState('');
    const [dPrice, setDPrice] = useState('');
    const [mrp, setMrp] = useState('');
    const [taxprc, setTaxprc] = useState('');
    const [qty, setQty] = useState('');
    const [duration, setDuration] = useState('');
    const [nocase, setNoCase] = useState('');
    const [bottles, setBottles] = useState('');

    const [validerror, setValidError] = useState({});
    const isNumber = (val) => /^[0-9]+(\.[0-9]+)?$/.test(val);
    // const handleValidation = () => {
    //     let newerror = {};

    //     if (!name.trim()) newerror.name = "Please Enter Name";
    //     if (!hsncode.trim()) {
    //         newerror.hsncode = "Please HSN Code Here";
    //     }
    //     else if (hsncode.length < 3) {
    //         newerror.hsncode = "HSN Code must be at least 3 characters";
    //     }
    //     if (!selectedCategory) newerror.selectedCategory = "Please Select  Category";
    //     if (!capacity) newerror.capacity = "Please select Capacity";
    //     if (!measurement) newerror.measurement = "Please select measurement";

    //     if (!sprice) newerror.sprice = "Please Enter selling Price";
    //     if (!dPrice) newerror.dPrice = "Please Enter Distributor Price";
    //     if (!mrp) newerror.mrp = "Please Enter MRP Price";
    //     if (Number(sprice) > Number(mrp)) {
    //         newerror.sprice = "Selling price cannot exceed MRP";
    //     }

    //     if (Number(dPrice) > Number(mrp)) {
    //         newerror.dPrice = "Distributor price cannot exceed MRP";
    //     }
    //     if (!taxprc) {
    //         newerror.taxprc = "Enter Tax %";
    //     } else if (!isNumber(taxprc) || Number(taxprc) > 100) {
    //         newerror.taxprc = "Tax must be between 0–100";
    //     }
    //     if (!qty) newerror.qty = "Please Enter Quantity";
    //     if (!duration) newerror.duration = "Please Enter Duration";
    //     if (!selectedImage) newerror.selectedImage = "Please Select Image";
    //     if (!nocase) newerror.nocase = "Please Enter Number Of Cases";
    //     if (!bottles) newerror.bottles = "Please Enter Bottles in a Case";

    //     setValidError(newerror);
    //     return Object.keys(newerror).length === 0;
    // }

    const handleValidation = () => {
        let newerror = {};

        // ✅ Product Name
        if (!name.trim()) {
            newerror.name = "Please enter product name";
        } else if (name.length < 3) {
            newerror.name = "Name must be at least 3 characters";
        }

        // ✅ HSN Code
        if (!hsncode.trim()) {
            newerror.hsncode = "Please HSN Code Here";
        }
        else if (hsncode.length < 3) {
            newerror.hsncode = "HSN Code must be at least 3 characters";
        }

        // ✅ Dropdowns
        if (!selectedCategory) newerror.selectedCategory = "Select category";
        //if (!capacity) newerror.capacity = "Select capacity";
        if (!measurement) newerror.measurement = "Select unit";

        // ✅ Cases & Bottles
        if (!nocase) {
            newerror.nocase = "Enter number of cases";
        } else if (!isNumber(nocase) || Number(nocase) <= 0) {
            newerror.nocase = "Enter valid number (>0)";
        }

        if (!bottles) {
            newerror.bottles = "Enter bottles count";
        } else if (!isNumber(bottles) || Number(bottles) <= 0) {
            newerror.bottles = "Enter valid number (>0)";
        }

        if (!openstock) {
            newerror.openstock = "Enter Opening  stock";
        } else if (!isNumber(openstock) || Number(openstock) <= 0) {
            newerror.openstock = "Enter valid number (>0)";
        }

        // ✅ Prices (VERY IMPORTANT)
        if (!sprice) {
            newerror.sprice = "Enter selling  price";
        } else if (!isNumber(sprice) || Number(sprice) <= 0) {
            newerror.sprice = "Invalid selling price";
        }

        if (!dPrice) {
            newerror.dPrice = "Enter distributor price";
        } else if (!isNumber(dPrice) || Number(dPrice) <= 0) {
            newerror.dPrice = "Invalid distributor price";
        }

        if (!mrp) {
            newerror.mrp = "Enter MRP";
        } else if (!isNumber(mrp) || Number(mrp) <= 0) {
            newerror.mrp = "Invalid MRP";
        }

        // ✅ Price Logic (IMPORTANT BUSINESS RULE)
        if (isNumber(sprice) && isNumber(mrp) && Number(sprice) > Number(mrp)) {
            newerror.sprice = "Selling price cannot be greater than MRP";
        }

        if (isNumber(dPrice) && isNumber(mrp) && Number(dPrice) > Number(mrp)) {
            newerror.dPrice = "Distributor price cannot be greater than MRP";
        }

        if (
            isNumber(dPrice) &&
            isNumber(sprice) &&
            Number(dPrice) > Number(sprice)
        ) {
            newerror.dPrice = "Distributor price should be ≤ Selling price";
        }

        // ✅ Tax
        if (!taxprc) {
            newerror.taxprc = "Enter tax %";
        } else if (!isNumber(taxprc) || Number(taxprc) < 0 || Number(taxprc) > 100) {
            newerror.taxprc = "Tax must be between 0–100";
        }

        // ✅ Quantity
        // if (!qty) {
        //     newerror.qty = "Enter packing quantity";
        // } else if (!isNumber(qty) || Number(qty) <= 0) {
        //     newerror.qty = "Invalid quantity";
        // }

        // ✅ Duration
        if (!duration.trim()) {
            newerror.duration = "Enter production duration";
        }

        // ✅ Image
        if (!selectedImage) {
            newerror.selectedImage = "Upload product image";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };


    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent multiple clicks

        const isvalid = handleValidation();
        if (!isvalid) return;

        setIsSubmitting(true); //  start loading

        let imageBase64 = "";
        if (selectedImage) {
            const filePath = selectedImage.uri.replace("file://", "");
            const base64 = await RNFS.readFile(filePath, "base64");
            imageBase64 = `data:${selectedImage.type};base64,${base64}`;
        }
        console.log("images------------->", imageBase64);


        const payload = {
            productName: name,
            productCategory: selectedCategory?.name,
            categoryId: selectedCategory?.value,
            hsnCode: hsncode,
            unitOfMeasure: measurement,
           // capacity: capacity,
            openingStock: Number(openstock),
            sellingPrice: Number(sprice),
            distributorPrice: Number(dPrice),
            mrp: Number(mrp),
            taxPercentage: Number(taxprc),
            //packingQuantity: Number(qty),
            productionDuration: duration,
            image: imageBase64, //for image 
            bottlesPerCase:bottles,
            noOfCases:nocase,
        }
        console.log("payload data dispatching from UI to redux code Add Product---------------->", payload);
        try {
            const response = await dispatch(AddProductsInMaster(payload)).unwrap();
            Alert.alert(
                "Success",
                response?.status === 200 ?  "Product Added Successfully" :
                (response?.data?.message || response?.message || "Added Successfully"),

                [
                    {
                        text: "OK",
                        onPress: () => {
                            //setCategory("");
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
            setIsSubmitting(false); //  stop loading
        }


    }


    return (
        <View style={[styles.container]}>
            <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" />

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Add Product</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: responsiveHeight(5) }}>

                <View style={styles.date}>
                    <Text style={styles.first}>Product Category<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror?.selectedCategory ? styles.errorBorder : null, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={category}
                            labelField="label"
                            valueField="value"
                            placeholder="Select category"
                            value={selectedCategory}
                            onChange={item => { setSelectedCategory(item) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>
                {
                    validerror.selectedCategory ? (
                        <Text style={styles.error_text}>{validerror.selectedCategory}</Text>
                    ) : null
                }

                <View style={styles.date}>
                    <Text style={styles.first}>Product Name<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.name ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter product name" style={styles.inputfield} placeholderTextColor="#888" value={name} onChangeText={setName} />
                    </View>
                    {
                        validerror.name ? (
                            <Text style={styles.error_text}>{validerror.name}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>HSN Code<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.hsncode ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter HNC Code" style={styles.inputfield} placeholderTextColor="#888" value={hsncode} onChangeText={setHsncode} />
                    </View>
                    {
                        validerror.hsncode ? (
                            <Text style={styles.error_text}>{validerror.hsncode}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Opening Stock<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.openstock ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter opening stock" style={styles.inputfield} placeholderTextColor="#888" value={openstock} onChangeText={setOpenStock} keyboardType="numeric" />
                    </View>
                    {
                        validerror.openstock ? (
                            <Text style={styles.error_text}>{validerror.openstock}</Text>
                        ) : null
                    }
                </View>

                {/* <View style={styles.date}>
                    <Text style={styles.first}>Bottle Capacity<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror?.capacity ? styles.errorBorder : null, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={capacities}
                            labelField="label"
                            valueField="value"
                            placeholder="Select capacity"
                            value={capacity}
                            onChange={item => { setCapacity(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>
                {
                    validerror.capacity ? (
                        <Text style={styles.error_text}>{validerror.capacity}</Text>
                    ) : null
                } */}




                <View style={styles.date}>
                    <Text style={styles.first}>Unit measurement<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror?.measurement ? styles.errorBorder : null, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={unitmeasurement}
                            labelField="label"
                            valueField="value"
                            placeholder="Select measurements"
                            value={measurement}
                            onChange={item => { setMeasurement(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )
                            }
                        />

                    </View>
                </View>
                {
                    validerror.measurement ? (
                        <Text style={styles.error_text}>{validerror.measurement}</Text>
                    ) : null
                }

                <View style={styles.date}>
                    <Text style={styles.first}>MRP<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.mrp ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} placeholder="MRP" placeholderTextColor="#888" value={mrp} onChangeText={setMrp} keyboardType="numeric" />
                    </View>
                    {
                        validerror.mrp ? (
                            <Text style={styles.error_text}>{validerror.mrp}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Selling Price<Text style={styles.red}>*</Text></Text>
                    {/* <Text style={styles.first}>Retailer Price<Text style={styles.red}>*</Text></Text> */}
                    <View style={[styles.for_border, validerror?.sprice ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter retailer price" style={styles.inputfield} placeholderTextColor="#888" value={sprice} onChangeText={setSPrice} keyboardType="numeric" />
                    </View>
                    {
                        validerror.sprice ? (
                            <Text style={styles.error_text}>{validerror.sprice}</Text>
                        ) : null
                    }

                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Distributor Price<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.dPrice ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Distributor Price" style={styles.inputfield} placeholderTextColor="#888" value={dPrice} onChangeText={setDPrice} keyboardType="numeric" />
                    </View>
                    {
                        validerror.dPrice ? (
                            <Text style={styles.error_text}>{validerror.dPrice}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Tax Percentage<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.taxprc ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} placeholder="Tax Percentage" placeholderTextColor="#888" value={taxprc} onChangeText={setTaxprc} keyboardType="numeric" />
                    </View>
                    {
                        validerror.taxprc ? (
                            <Text style={styles.error_text}>{validerror.taxprc}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Number Of Cases In a Ballet<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.nocase ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter number of cases in a ballet" style={styles.inputfield} placeholderTextColor="#888" value={nocase} onChangeText={setNoCase} keyboardType="numeric" />
                    </View>
                    {
                        validerror.nocase ? (
                            <Text style={styles.error_text}>{validerror.nocase}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Bottles In A Case <Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.bottles ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter bottles in a case" style={styles.inputfield} placeholderTextColor="#888" value={bottles} onChangeText={setBottles} keyboardType="numeric" />
                    </View>
                    {
                        validerror.bottles ? (
                            <Text style={styles.error_text}>{validerror.bottles}</Text>
                        ) : null
                    }
                </View>

                {/* <View style={styles.date}>
                    <Text style={styles.first}>Packing Quantity<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.qty ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} placeholder="Packing Quantity" placeholderTextColor="#888" value={qty} onChangeText={setQty} keyboardType="numeric" />
                    </View>
                    {
                        validerror.qty ? (
                            <Text style={styles.error_text}>{validerror.qty}</Text>
                        ) : null
                    }
                </View> */}


                <View style={styles.date}>
                    <Text style={styles.first}>Production Duration in minutes<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.duration ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} placeholder="Production Duration in minutes " placeholderTextColor="#888" value={duration} onChangeText={setDuration}  keyboardType="numeric"/>
                    </View>
                    {
                        validerror.duration ? (
                            <Text style={styles.error_text}>{validerror.duration}</Text>
                        ) : null
                    }
                </View>



                <View style={styles.date}>
                    <Text style={styles.first}>Description</Text>
                    <View style={styles.for_border}>
                        <TextInput placeholder="Enter Description" style={styles.inputfield} placeholderTextColor="#888" />
                    </View>
                </View>



                <View style={styles.first_new}>
                    <Text style={styles.first}>Upload Image<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.inputfiled_upimg, validerror?.selectedImage ? styles.errorBorder : null]}>
                        <TouchableOpacity onPress={handleUploadImage} style={styles.louch_image}>
                            {selectedImage ? (
                                <Image source={{ uri: selectedImage?.uri }}
                                    style={styles.uploadImage}

                                />

                            ) : (
                                <View>
                                    <Feather name="upload" size={35} color="#8991A6" style={styles.upload_icon} />
                                    <Text style={styles.click}>upload a Image</Text>
                                </View>
                            )}

                        </TouchableOpacity>

                    </View>
                    {
                        validerror.selectedImage ? (
                            <Text style={styles.error_text}>{validerror.selectedImage}</Text>
                        ) : null
                    }

                </View>



                <TouchableOpacity style={[styles.btn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 8 }]}>Submitting...</Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Add Product</Text>
                    )}
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
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        //paddingLeft:10,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium
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
    calender_icon: {
        paddingRight: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    first: {
        color: colors.formtitlegry,
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    red: {
        color: colors.error,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,

    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
    },
    body: {
        flexDirection: 'column',
        alignContent: 'center',
    },
    first_new: {
        marginTop: 13,
    },
    date: {
        marginTop: 13,
    },
    louch_image: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 10,

    },

    btn_text: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 16,
        fontWeight: 700,
        paddingTop: 16,
        paddingBottom: 16,
        fontFamily: fonts.sfbold,

    },


    inputfiled_upimg: {
        height: height * 0.19,
        width: width * 0.9241,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,

    },
    uploadImage: {
        height: '100%',
        width: '100%',
        // width: width * 0.36,
        // height: width * 0.35,
        borderRadius: 6,
        resizeMode: 'cover',
        // resizeMode:'contain'
    },
    upload_icon: {
        textAlign: 'center',
        paddingTop: 20,
    },
    click: {
        color: colors.inputfieldcolor,
        fontSize: 15,
        fontWeight: 500,
        textAlign: 'center',
    },
})
export default AddProduct