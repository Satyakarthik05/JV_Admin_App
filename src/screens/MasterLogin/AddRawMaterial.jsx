import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, TextInput, ScrollView, Dimensions, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";
//import DatePicker from "react-native-date-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import { colors, fonts } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { GetRawCategories, GetUnitsData } from "../../redux/reducers/MasterLogin/AddCategory";
import { AddRawMaterialsData } from "../../redux/reducers/MasterLogin/AddProduct";
import commonstyles from "../../commonstyles/commonstyles";


const { width, height } = Dimensions.get('window');

const Addrawmaterial = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();





    const [type, setType] = useState([]);
    const [selectedtype, setSelectedType] = useState('')

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');



    const ProductType = [
        { id: 1, label: "20ML", value: "20ML" },
        { id: 2, label: "50ML", value: "50ML" },
        { id: 3, label: "100ML", value: "100ML" },
        { id: 4, label: "200ML", value: "200ML" },
        { id: 5, label: "L", value: "L" },
    ]

    const [product, setProduct] = useState([]);
    const [materialname, setMaterialName] = useState('');
    const [unitList, setUnitList] = useState([]); // dropdown data
    const [unitmeasurement, setUnitMeasurement] = useState('');



    const [des, setDes] = useState('');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [wastage, setWastage] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [valierror, setValidError] = useState({})


    useFocusEffect(
        useCallback(() => {
            dispatch(GetRawCategories())
            dispatch(GetUnitsData())
        }, [])
    )
    const { GetRawCategory } = useSelector((state) => state.GetAllRawCategy);
    console.log("GetRaw Categories data ------------------>", GetRawCategory);

    const { UnitsData } = useSelector((state) => state.GetUnitsRawMaster);
    console.log("Get Units  data in Add Raw Material  page===============>", UnitsData);



    useEffect(() => {
        if (GetRawCategory && GetRawCategory.length > 0) {
            setType(
                GetRawCategory.map(item => ({
                    // label: String(item.categoryName),
                    // value: item.categoryName,

                    label: item.categoryName,
                    value: item.id,
                    name: item.categoryName
                }))
            )
        }
    }, [GetRawCategory])

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



    const handleValidation = () => {
        let newerror = {};

        if (!code.trim()) newerror.code = "Please Enter HSN Code ";
        //if (!materialname.trim()) newerror.materialname = "Please Enter Material Name ";
        //  Raw Material Name (letters + spaces only, min 3 chars)
        if (!materialname || !materialname.trim()) {
            newerror.materialname = "Please Enter Material Name";
        } else if (!/^[a-zA-Z\s]{3,}$/.test(materialname.trim())) {
            newerror.materialname = "Name must contain only letters (min 3 characters)";
        }
        //if (!selectedtype.trim()) newerror.selectedtype = "Please Select Category";
        if (!selectedCategoryId) newerror.selectedtype = "Please Select Category";
        if (!unitmeasurement) newerror.unitmeasurement = "Please Select Unit";

        // if (!des.trim()) newerror.des = "Please Enter Description";
        //if(!output.trim()) newerror.output="Please Enter Output";
        //if(!wastage.trim()) newerror.wastage="Please Enter Wastage";

        // Wastage Validation
        if (!wastage || !wastage.toString().trim()) {
            newerror.wastage = "Please Enter Wastage";
        } else if (isNaN(wastage)) {
            newerror.wastage = "Wastage must be a number";
        } else if (Number(wastage) < 0 || Number(wastage) > 100) {
            newerror.wastage = "Wastage must be between 0 and 100";
        }



        //just comment
        // if (product.length === 0) newerror.product = "Please Select Product";


        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    }


    const handleSubmit = async () => {
        console.log("***came to handle submit function***");

        if (isSubmitting) return;

        const isvalid = handleValidation();
        if (!isvalid) return;

        setIsSubmitting(true); //  reset always


        const payload = {
            rawMaterialName: materialname,
            // category: selectedtype,

            categoryId: selectedCategoryId,
            category: selectedCategoryName,

            unitOfMeasure: unitmeasurement,
            hsnCode: code,
            description: des,
            //outPut:output,
            //wastage:wastage,
            productIds: product,//product


        }

        console.log("Payload data that dispatching  to redux code Add Raw Material code to redux code -------------------->", payload);
        try {
            const response = await dispatch(AddRawMaterialsData(payload)).unwrap();
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
            setIsSubmitting(false); //  always reset
        }
    }

    const insets = useSafeAreaInsets();


    return (
        <View style={[styles.container]}>
            <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" />

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Add Raw Material</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>

                    <View style={styles.date}>
                        <Text style={styles.first}>Raw Material Category<Text style={styles.red}>*</Text></Text>
                        <View style={[styles.for_border_dropdown, valierror?.selectedtype ? styles.errorBorder : null, { zIndex: 1000 }]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                showsVerticalScrollIndicator={false}
                                data={type}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Raw Material Category"
                                //value={selectedtype}
                                value={selectedCategoryId}
                                //onChange={item => { setSelectedType(item.value) }}

                                onChange={(item) => {
                                    setSelectedCategoryId(item.value)
                                    setSelectedCategoryName(item.name)
                                }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            valierror.selectedtype ? (
                                <Text style={styles.error_text}>{valierror.selectedtype}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.date}>
                        <Text style={styles.first}>HSN Code<Text style={styles.red}>*</Text></Text>
                        <View style={[styles.for_border, valierror?.code ? styles.errorBorder : null]}>
                            <TextInput placeholder="Enter HSN Code " style={styles.inputfield} placeholderTextColor="#888" value={code} onChangeText={setCode} maxLength={8} />
                        </View>
                        {
                            valierror.code ? (
                                <Text style={styles.error_text}>{valierror.code}</Text>
                            ) : null
                        }
                    </View>




                    <View style={styles.date}>
                        <Text style={styles.first}>Raw Material Name<Text style={styles.red}>*</Text></Text>
                        <View style={[styles.for_border, valierror?.materialname ? styles.errorBorder : null]}>
                            <TextInput placeholder="Enter raw material name" style={styles.inputfield} placeholderTextColor="#888" value={materialname} onChangeText={setMaterialName} />
                        </View>
                        {
                            valierror.materialname ? (
                                <Text style={styles.error_text}>{valierror.materialname}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.date}>
                        <Text style={styles.first}>Unit Of Measure<Text style={styles.red}>*</Text></Text>
                        {/* <View style={[styles.for_border, valierror?.unitmeasurement ? styles.errorBorder : null]}>
                            <TextInput placeholder="Unit of Measure" style={styles.inputfield} placeholderTextColor="#888" value={unitmeasurement} onChangeText={setUnitMeasurement} />
                        </View> */}
                        <View style={[styles.for_border_dropdown, valierror?.unitmeasurement ? styles.errorBorder : null]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                showsVerticalScrollIndicator={false}
                                data={unitList}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Unit"
                                value={unitmeasurement}
                                onChange={(item) => {
                                    setUnitMeasurement(item.value);
                                }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            valierror.unitmeasurement ? (
                                <Text style={styles.error_text}>{valierror.unitmeasurement}</Text>
                            ) : null
                        }
                    </View>

                    <View style={styles.date}>
                        <Text style={styles.first}>Output / KG</Text>
                        <View style={[styles.for_border, valierror?.output ? styles.errorBorder : null]}>
                            <TextInput placeholder="Enter output/kg" style={styles.inputfield} placeholderTextColor="#888" value={output} onChangeText={setOutput} />
                        </View>
                        {
                            valierror.output ? (
                                <Text style={styles.error_text}>{valierror.output}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.date}>
                        <Text style={styles.first}>Wastage %</Text>
                        <View style={[styles.for_border, valierror.wastage ? styles.errorBorder : null]}>
                            <TextInput placeholder="Enter wastage %" style={styles.inputfield} placeholderTextColor="#888" value={wastage} onChangeText={setWastage} keyboardType="number-pad" />
                        </View>
                        {
                            valierror.wastage ? (
                                <Text style={styles.error_text}>{valierror.wastage}</Text>
                            ) : null
                        }
                    </View>


                    <View style={styles.date}>
                        <Text style={styles.first}>Description</Text>
                        <View style={styles.for_border}>
                            <TextInput placeholder="Enter Description" style={styles.inputfield} multiline placeholderTextColor="#888" value={des} onChangeText={setDes} />
                        </View>
                        {/* {
                            valierror.des ? (
                                <Text style={styles.error_text}>{valierror.des}</Text>
                            ) : null
                        } */}
                    </View>




                    {/* <View style={styles.date}>
                        <Text style={styles.first}>Products</Text>
                        <View style={[styles.for_border_dropdown, valierror?.product ? styles.errorBorder : null, { zIndex: 1000 }]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                showsVerticalScrollIndicator={false}
                                data={ProductType}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Products"
                                value={product}
                                onChange={item => { setProduct(item.value) }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>
                        {
                            valierror.product ? (
                                <Text style={styles.error_text}>{valierror.product}</Text>
                            ) : null
                        }
                    </View> */}


                    {/* <View style={styles.date}>
                        <Text style={styles.first}>Products</Text>

                        <View style={[styles.for_border_dropdown, valierror?.product ? styles.errorBorder : null, { zIndex: 1000 }]}>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.placeholderStyle}
                                itemTextStyle={styles.placeholderStyle}
                                data={ProductType}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Products"
                                value={product}
                                onChange={item => {

                                    // if (!product.includes(item.value)) {
                                    //     setProduct([...product, item.value])
                                    // }
                                    if (!product.includes(item.id)) {
                                        const updatedProducts = [...product, item.id];
                                        setProduct([...product, item.id])

                                        console.log("Selected Product IDs:", updatedProducts);
                                        console.log("Selected Product Item:", item);
                                    }

                                }}
                                renderRightIcon={() => (
                                    <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                )}
                            />
                        </View>

                       

                        <View style={styles.selectedContainer}>
                            {product.map((id, index) => {

                                const productItem = ProductType.find(p => p.id === id)

                                return (
                                    <View key={index} style={styles.selectedItem}>
                                        <Text style={styles.selectedText}>{productItem?.label}</Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                const filtered = product.filter(p => p !== id)
                                                setProduct(filtered)
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={18} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>

                        {
                            valierror.product ? (
                                <Text style={styles.error_text}>{valierror.product}</Text>
                            ) : null
                        }


                    </View> */}





                    {/* <TouchableOpacity style={[styles.btn, { marginTop: responsiveHeight(4) }]} onPress={handleSubmit}>
                        <Text style={styles.btn_text}>Add Raw Material</Text>
                    </TouchableOpacity> */}


                    <TouchableOpacity style={[styles.button, { marginTop: responsiveHeight(4) }]} onPress={handleSubmit} disabled={isSubmitting} >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btn_text, { marginLeft: 10 }]}>  Submitting...</Text>
                            </View>
                        ) : (
                            <Text style={styles.btn_text}>Add Raw Material</Text>
                        )}
                    </TouchableOpacity>



                </ScrollView>
            </KeyboardAvoidingView>

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
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        //paddingLeft:5,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium,
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

    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    body: {
        flexDirection: 'column',
        alignContent: 'center',
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
    error_text: {
        color: colors.error,
        fontSize: 13,
        marginTop: 4,
        fontFamily: fonts.sfmedium,
    },
    errorBorder: {
        borderColor: colors.error,
    },



    selectedContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },

    selectedItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E6F0FF",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 6,
        marginBottom: 6,
    },

    selectedText: {
        marginRight: 6,
        fontSize: 14,
        color: colors.black,
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
    },
    btn_text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    }

})
export default Addrawmaterial