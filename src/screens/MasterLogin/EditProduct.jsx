import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Dimensions, Image, Alert, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { GetCategories } from "../../redux/reducers/MasterLogin/AddCategory";
import { EditProductInMaster } from "../../redux/reducers/MasterLogin/AddProduct";
import RNFS from 'react-native-fs';  // to read the excel data
import commonstyles from "../../commonstyles/commonstyles";

const { width, height } = Dimensions.get('window');
const EditProduct = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();


    const route = useRoute();
    const { getproducts } = route.params;
    console.log("Get Products Data  in Edit Product screen --------------------------->", getproducts)
    const [selectedImage, setSelectedImage] = useState(getproducts?.imageUrl ? { uri: getproducts.imageUrl } : null);




    useEffect(() => {
        dispatch(GetCategories())
    }, [])
    const { getProductCategory } = useSelector((state) => state.GetCategoriesPM);
    console.log("GetCategory Data in Edit  Product Screen -------------->", getProductCategory);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);// for value




    useEffect(() => {
        if (!getProductCategory?.length || !getproducts?.productCategory) return;

        const formattedProducts = getProductCategory.map(item => ({
            label: item.categoryName,
            value: item.categoryName,
        }));

        setCategory(formattedProducts);

        const matchedCategory = formattedProducts.find(
            item =>
                item.value?.toLowerCase().trim() ===
                getproducts.productCategory?.toLowerCase().trim()
        );

        if (matchedCategory) {
            setSelectedCategory(matchedCategory.value);
        }

    }, [getProductCategory, getproducts]);






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
    const [capacity, setCapacity] = useState(getproducts?.capacity);


    const measurements = [
        // { label: "ml", value: "ml" },
        // { label: "L", value: "L" },
        // { label: "KL", value: "KL" },
        { label: "mL", value: "mL" },
        { label: "L", value: "L" },
        { label: "bottle", value: "bottle" },
        { label: "can", value: "can" },
        { label: "pack", value: "pack" },
        { label: "pcs", value: "pcs" }
    ]
    const [measurement, setMeasurement] = useState(getproducts?.unitOfMeasure);

    const StatusData = [
        { label: "Active", value: "Active" },
        { label: "InActive", value: "InActive" },
    ]
    const [status, setStatus] = useState("Active");


    useEffect(() => {
        if (getproducts) {
            setCapacity(getproducts.capacity || null);
            setMeasurement(getproducts.unitOfMeasure || null);
            setStatus(getproducts?.status === 1 ? "Active" : "InActive")
        }
    }, [getproducts]);




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
                // const uri = response.assets?.[0]?.uri;
                // setSelectedImage(uri);
                const asset = response.assets?.[0];
                const data = {
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || `photo_${Date.now()}.jpg`,
                };
                console.log("Selected image", data);
                setSelectedImage(data);
            }

        });
    };

    const [editProductCode, setEditProductCode] = useState(getproducts?.productCode);
    const [editprdname, setEditprdName] = useState(getproducts?.productName);
    const [edithsnCode, setEdithsnCode] = useState(getproducts?.hsnCode?.toString() || "");
    const [editsellingprc, setEditsellingPrice] = useState(getproducts?.sellingPrice?.toString() || "");
    const [editmrp, setEditMrp] = useState(getproducts?.mrp?.toString() || "");
    const [editdisPrice, setEditdisPrice] = useState(getproducts?.distributorPrice?.toString() || "");
    const [edittaxPer, setEditTaxPer] = useState(getproducts?.taxPercentage?.toString() || "");
    const [editqty, setEditQty] = useState(getproducts?.packingQuantity?.toString() || "");
    const [editduration, setEditDuration] = useState(getproducts?.productionDuration);
    const [nocase, setNoCase] = useState(getproducts?.noOfCases?.toString() || "");
    const [bottles, setBottles] = useState(getproducts?.bottlesPerCase?.toString() || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openstock,setOpenStock]=useState(getproducts?.openingStock?.toString() || "");
    const [validerror, setValidError] = useState({});

    const handleValidation = () => {
        const isNumber = (val) => /^[0-9]+(\.[0-9]+)?$/.test(val);

        let newerror = {};

        //  Product Name
        if (!editprdname.trim()) {
            newerror.editprdname = "Please enter product name";
        } else if (editprdname.length < 3) {
            newerror.editprdname = "Name must be at least 3 characters";
        }

        //  HSN Code
        if (!edithsnCode.trim()) {
            newerror.edithsnCode = "Please enter HSN Code";
        } else if (edithsnCode.length < 3) {
            newerror.edithsnCode = "HSN must be at least 3 characters";
        }

        //  Dropdowns
        if (!selectedCategory) newerror.selectedCategory = "Select category";
        // if (!capacity) newerror.capacity = "Select capacity";
        if (!measurement) newerror.measurement = "Select unit";

        //  Cases
        if (!nocase) {
            newerror.nocase = "Enter number of cases";
        } else if (!isNumber(nocase) || Number(nocase) <= 0) {
            newerror.nocase = "Invalid number";
        }

        //  Bottles
        if (!bottles) {
            newerror.bottles = "Enter bottles count";
        } else if (!isNumber(bottles) || Number(bottles) <= 0) {
            newerror.bottles = "Invalid number";
        }

        if (!openstock) {
            newerror.openstock = "Enter Opening  stock";
        } else if (!isNumber(openstock) || Number(openstock) <= 0) {
            newerror.openstock = "Enter valid number (>0)";
        }


        //  Selling Price
        if (!editsellingprc) {
            newerror.editsellingprc = "Enter selling price";
        } else if (!isNumber(editsellingprc) || Number(editsellingprc) <= 0) {
            newerror.editsellingprc = "Invalid selling price";
        }

        //  Distributor Price
        if (!editdisPrice) {
            newerror.editdisPrice = "Enter distributor price";
        } else if (!isNumber(editdisPrice) || Number(editdisPrice) <= 0) {
            newerror.editdisPrice = "Invalid distributor price";
        }

        //  MRP
        if (!editmrp) {
            newerror.editmrp = "Enter MRP";
        } else if (!isNumber(editmrp) || Number(editmrp) <= 0) {
            newerror.editmrp = "Invalid MRP";
        }

        //  Business Rules (IMPORTANT)
        if (isNumber(editsellingprc) && isNumber(editmrp) &&
            Number(editsellingprc) > Number(editmrp)) {
            newerror.editsellingprc = "Selling price cannot exceed MRP";
        }

        if (isNumber(editdisPrice) && isNumber(editmrp) &&
            Number(editdisPrice) > Number(editmrp)) {
            newerror.editdisPrice = "Distributor price cannot exceed MRP";
        }

        if (isNumber(editdisPrice) && isNumber(editsellingprc) &&
            Number(editdisPrice) > Number(editsellingprc)) {
            newerror.editdisPrice = "Distributor price should be ≤ Selling price";
        }

        //  Tax
        if (!edittaxPer) {
            newerror.edittaxPer = "Enter tax %";
        } else if (!isNumber(edittaxPer) || Number(edittaxPer) < 0 || Number(edittaxPer) > 100) {
            newerror.edittaxPer = "Tax must be between 0–100";
        }

        //  Quantity
        // if (!editqty) {
        //     newerror.editqty = "Enter packing quantity";
        // } else if (!isNumber(editqty) || Number(editqty) <= 0) {
        //     newerror.editqty = "Invalid quantity";
        // }

        //  Duration
        if (!editduration?.trim()) {
            newerror.editduration = "Enter production duration";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };


    const handleUpdate = async () => {

        if (isSubmitting) return; //  prevent double click

        const isValid = handleValidation();
        if (!isValid) return;

        setIsSubmitting(true); //  start loading


        let imageBase64 = "";

        if (selectedImage?.uri && !selectedImage.uri.startsWith("http")) {
            const filePath = selectedImage.uri.replace("file://", "");
            const base64 = await RNFS.readFile(filePath, "base64");
            imageBase64 = `data:${selectedImage.type};base64,${base64}`;
        }

        const id = getproducts?.id;
        const payload = {
            productName: editprdname,
            productCategory: selectedCategory,
            hsnCode: edithsnCode,
            unitOfMeasure: measurement,
            // capacity: capacity,
            openingStock: Number(openstock),
            sellingPrice: Number(editsellingprc),
            distributorPrice: Number(editdisPrice),
            mrp: Number(editmrp),
            taxPercentage: Number(edittaxPer),
            // packingQuantity: Number(editqty),
            productionDuration: editduration,
            image: imageBase64 || getproducts?.imageUrl,
            status: status === "Active" ? 1 : 0,
            bottlesPerCase: bottles,
            noOfCases: nocase,
        }
        console.log("Dispatching payload data in Edit Product UI Code --------------------->", payload, id);

        try {
            const response = await dispatch(EditProductInMaster({ id, payload })).unwrap();

            Alert.alert(
                "Success",
                response?.message || response?.data?.message || "Edited Product Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            )

        }
        catch (error) {
            Alert.alert("Error", error || "SomeThing Went Wrong");
        }
        finally {
            setIsSubmitting(false); //  always stop loading
        }


    }



    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />

            <SafeAreaView >
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Edit Product</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView showsVerticalScrollIndicator={false}>


                <View style={styles.sec_1}>
                    <View style={styles.for_flex}>
                        <Text style={styles.name}>{getproducts?.productName}</Text>
                        <Text style={[styles.btn, getproducts?.status === 1 ? styles.green : styles.red]}>{getproducts?.status === 1 ? "Active" : "InActive"}</Text>
                    </View>
                    <Text style={styles.first}>{getproducts?.productCode}</Text>
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Product Category<Text style={commonstyles.required}>*</Text></Text>
                    <View style={styles.for_border_dropdown}>
                        {/* <TextInput placeholder="Select Category" style={styles.inputfield} /> */}
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            labelField="label"
                            valueField="value"
                            data={category}
                            value={selectedCategory}
                            onChange={item => { setSelectedCategory(item.value) }}
                            placeholder="select category"
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Product Name<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.editprdname ? styles.errorBorder : null]}>
                        <TextInput placeholder="Aqura Pure 20L" style={styles.inputfield} placeholderTextColor="#888" value={editprdname} onChangeText={setEditprdName} />
                    </View>
                    {
                        validerror.editprdname ? (
                            <Text style={styles.error_text}>{validerror.editprdname}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Opening Stock<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.openstock ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter opening stock" style={styles.inputfield} placeholderTextColor="#888" value={openstock} onChangeText={setOpenStock} keyboardType="numeric" />
                    </View>
                    {
                        validerror.openstock ? (
                            <Text style={styles.error_text}>{validerror.openstock}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>HSN Code<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.edithsnCode ? styles.errorBorder : null]}>
                        <TextInput placeholder="enter HNC Code" style={styles.inputfield} placeholderTextColor="#888" value={edithsnCode} onChangeText={setEdithsnCode} />
                    </View>
                    {
                        validerror.edithsnCode ? (
                            <Text style={styles.error_text}>{validerror.edithsnCode}</Text>
                        ) : null
                    }
                </View>


                {/* <View style={styles.date}>
                    <Text style={styles.first}>Bottle Capacity</Text>
                    <View style={styles.for_border_dropdown}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={capacities}
                            labelField="label"
                            valueField="value"
                            value={capacity}
                            onChange={item => { setCapacity(item.value) }}
                            placeholder="Select Capacity"
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View> */}

                <View style={styles.date}>
                    <Text style={styles.first}>Unit Measure<Text style={commonstyles.required}>*</Text></Text>
                    <View style={styles.for_border_dropdown}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={measurements}
                            labelField="label"
                            valueField="value"
                            value={measurement}
                            onChange={item => { setMeasurement(item.value) }}
                            placeholder="select units"
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>MRP<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.editmrp ? styles.errorBorder : null]}>
                        <TextInput placeholder="MRP" style={styles.inputfield} placeholderTextColor="#888" value={editmrp} onChangeText={setEditMrp} keyboardType="numeric" />
                    </View>
                    {
                        validerror.editmrp ? (
                            <Text style={styles.error_text}>{validerror.editmrp}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Selling Price<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.editsellingprc ? styles.errorBorder : null]}>
                        <TextInput placeholder="Selling Price" style={styles.inputfield} placeholderTextColor="#888" value={editsellingprc} onChangeText={setEditsellingPrice} keyboardType="numeric" />
                    </View>
                    {
                        validerror.editsellingprc ? (
                            <Text style={styles.error_text}>{validerror.editsellingprc}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Distributor Price<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.editdisPrice ? styles.errorBorder : null]}>
                        <TextInput placeholder="Distributor Price" style={styles.inputfield} placeholderTextColor="#888" value={editdisPrice} onChangeText={setEditdisPrice} keyboardType="numeric" />
                    </View>
                    {
                        validerror.editdisPrice ? (
                            <Text style={styles.error_text}>{validerror.editdisPrice}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Tax Percentage<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.edittaxPer ? styles.errorBorder : null]}>
                        <TextInput placeholder="Tax Percentage" style={styles.inputfield} placeholderTextColor="#888" value={edittaxPer} onChangeText={setEditTaxPer}  keyboardType="numeric" />
                    </View>
                    {
                        validerror.edittaxPer ? (
                            <Text style={styles.error_text}>{validerror.edittaxPer}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Number Of Cases in a Ballet<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.nocase ? styles.errorBorder : null]}>
                        <TextInput placeholder="enter number of cases in a ballet" style={styles.inputfield} placeholderTextColor="#888" value={nocase} onChangeText={setNoCase} keyboardType="numeric" />
                    </View>
                    {
                        validerror.nocase ? (
                            <Text style={styles.error_text}>{validerror.nocase}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Bottles In A Case<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.bottles ? styles.errorBorder : null]}>
                        <TextInput placeholder="enter bottles in a case" style={styles.inputfield} placeholderTextColor="#888" value={bottles} onChangeText={setBottles} keyboardType="numeric" />
                    </View>
                    {
                        validerror.bottles ? (
                            <Text style={styles.error_text}>{validerror.bottles}</Text>
                        ) : null
                    }
                </View>

                {/* <View style={styles.date}>
                    <Text style={styles.first}>Packing Quantity</Text>
                    <View style={[styles.for_border, validerror?.editqty ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} placeholder="Packing Quantity" placeholderTextColor="#888" value={editqty} onChangeText={setEditQty} keyboardType="numeric" />
                    </View>
                    {
                        validerror.editqty ? (
                            <Text style={styles.error_text}>{validerror.editqty}</Text>
                        ) : null
                    }
                </View> */}

                <View style={styles.date}>
                    <Text style={styles.first}>Production Duration in minutes<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.editduration ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} placeholder="Production Duration in minutes" placeholderTextColor="#888" value={editduration} onChangeText={setEditDuration} keyboardType="numeric" />
                    </View>
                    {
                        validerror.editduration ? (
                            <Text style={styles.error_text}>{validerror.editduration}</Text>
                        ) : null
                    }
                </View>

                

                <View style={styles.date}>
                    <Text style={styles.first}>Description</Text>
                    <View style={styles.for_border}>
                        <TextInput style={styles.inputfield} multiline placeholder="Description" placeholderTextColor="#888" />
                    </View>
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Status</Text>
                    <View style={styles.for_border_dropdown}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={StatusData}
                            labelField="label"
                            valueField="value"
                            value={status}
                            onChange={item => { setStatus(item.value) }}
                            placeholder="select Status"
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>


                <View style={styles.first_new}>
                    <Text style={styles.first}>Upload Image<Text style={commonstyles.required}>*</Text></Text>
                    <View style={styles.inputfiled_upimg}>
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
                </View>



                {/* <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.btn_text}>Edit Product</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.6 }]} onPress={handleUpdate} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>Updating...</Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Edit Product</Text>
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
        flexDirection: 'column',
        gap: 15,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
    },
    dropdown: {
        flex: 1,
        height: 48,
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

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 15,
    },
    btn_text: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.white,
        textAlign: 'center',
        paddingTop: 16,
        paddingBottom: 16,
        fontFamily: fonts.sfbold,

    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    sec_1: {
        borderWidth: 1,
        borderColor: colors.commoncolor,
        backgroundColor: colors.commomcolorlight,
        paddingTop: 12,
        paddingBottom: 12,
        paddingleft: 16,
        paddingRight: 16,
        borderRadius: 12,
        paddingHorizontal: 5,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    btn: {

        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
    },
    green: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
    },
    red: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
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
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    date: {
        marginTop: 13,
    },
    first_new: {
        marginTop: 13,
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
    louch_image: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadImage: {
        height: '100%',
        width: '100%',
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
export default EditProduct
