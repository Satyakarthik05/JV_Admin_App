import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, TextInput, ScrollView, Dimensions, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";
//import DatePicker from "react-native-date-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import { colors, fonts } from "../../config/theme";
import { GetAccessoryCategoryData } from "../../redux/reducers/MasterLogin/AddCategory";
import { useDispatch, useSelector } from "react-redux";
import { PostAccessory } from "../../redux/reducers/MasterLogin/AddProduct";
import RNFS from 'react-native-fs';  // to read the excel data
import commonstyles from "../../commonstyles/commonstyles";



const { width, height } = Dimensions.get('window');

const AddAccessory = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [validerror, setValidError] = useState({});
    const [type, setType] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [accName, setAccName] = useState('');
    const [size, setSize] = useState('');
    const [description, setDescription] = useState('');
    const [purchaseCost, setPurchaseCost] = useState('');
    const [rentalcost, setRentalCost] = useState('');
    const [assestType, setAssestType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);



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
                setSelectedImage({
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || `photo_${Date.now()}.jpg`
                });
            }

        })
    }



    useFocusEffect(
        useCallback(() => {
            dispatch(GetAccessoryCategoryData())
        }, [dispatch])
    )

    const { GetAccCategory } = useSelector((state) => state.GetAccessoryCategory);
    console.log("Get Acc Categories---------->", GetAccCategory);

    useEffect(() => {
        if (GetAccCategory && GetAccCategory.length > 0) {
            setType(
                GetAccCategory.map(item => ({
                    label: String(item.accessoryType),
                    value: item.accessoryType,
                }))
            )
        }
    }, [GetAccCategory])
    const [selectedType, setSelectedType] = useState(null);





    const handleValidation = () => {
        const isNumber = (val) => /^[0-9]+(\.[0-9]+)?$/.test(val);

        let newerror = {};

        // Accessory Name
        if (!accName.trim()) {
            newerror.accName = "Please enter name";
        } else if (accName.trim().length < 3) {
            newerror.accName = "Name must be at least 3 characters";
        }

        // Accessory Type
        if (!selectedType) {
            newerror.selectedType = "Please select accessory type";
        }

        // Size
        if (!size.trim()) {
            newerror.size = "Please enter size";
        }

        // Asset Type
        if (!assestType.trim()) {
            newerror.assestType = "Please enter asset type";
        }


        // Purchase Cost
        if (!purchaseCost) {
            newerror.purchaseCost = "Enter purchase cost";
        } else if (!isNumber(purchaseCost) || Number(purchaseCost) <= 0) {
            newerror.purchaseCost = "Invalid purchase cost";
        }

        // Rental Charge
        if (!rentalcost) {
            newerror.rentalcost = "Enter rental charge";
        } else if (!isNumber(rentalcost) || Number(rentalcost) <= 0) {
            newerror.rentalcost = "Invalid rental charge";
        }

        // Business Rule (Optional but recommended)
        if (
            isNumber(purchaseCost) &&
            isNumber(rentalcost) &&
            Number(rentalcost) > Number(purchaseCost)
        ) {
            newerror.rentalcost = "Rental should be ≤ Purchase Cost";
        }

        // Image
        if (!selectedImage) {
            newerror.selectedImage = "Please select image";
        }

        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };


    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent multiple clicks

        const isvalid = handleValidation();
        if (!isvalid) return;
        setIsSubmitting(true); // start loading

        let imageBase64 = "";
        if (selectedImage) {
            const filePath = selectedImage.uri.replace("file://", "");
            const base64 = await RNFS.readFile(filePath, "base64");
            imageBase64 = `data:${selectedImage.type};base64,${base64}`;
        }

        const payload = {
            accessoryName: accName,
            accessoryType: selectedType,
            modelOrSize: size,
            assetType: assestType,
            purchaseCost: Number(purchaseCost),
            rentalCharge: Number(rentalcost),
            description: description,
            image: imageBase64,
            //imageUrl: imageBase64,

        }
        console.log("payload data dispatching from UI to redux code Add Accessory ---------------->", payload);
        try {
            const response = await dispatch(PostAccessory(payload)).unwrap();
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "Accessory Added Successfully",

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
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" />

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Add Accessory</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                <View style={styles.date}>
                    <Text style={styles.first}>Accessory Type<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror?.selectedType ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            showsVerticalScrollIndicator={false}
                            data={type}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Accessory Type"
                            value={selectedType}
                            onChange={item => { setSelectedType(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {
                        validerror.selectedType ? (
                            <Text style={styles.error_text}>{validerror.selectedType}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Accessory Name<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.accName ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter accessory name" style={styles.inputfield} placeholderTextColor="#888" value={accName} onChangeText={setAccName} />
                    </View>
                    {
                        validerror.accName ? (
                            <Text style={styles.error_text}>{validerror.accName}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Model/size<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.size ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter model/size" style={styles.inputfield} placeholderTextColor="#888" value={size} onChangeText={setSize} />
                    </View>
                    {
                        validerror.size ? (
                            <Text style={styles.error_text}>{validerror.size}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Asset Type<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.assestType ? styles.errorBorder : null]}>
                        <TextInput placeholder="Assest Type" style={styles.inputfield} placeholderTextColor="#888" value={assestType} onChangeText={setAssestType} />
                    </View>
                    {
                        validerror.assestType ? (
                            <Text style={styles.error_text}>{validerror.assestType}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Purchase Cost<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.purchaseCost ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter cost" style={styles.inputfield} placeholderTextColor="#888" value={purchaseCost} onChangeText={setPurchaseCost} keyboardType="number-pad" />
                    </View>
                    {
                        validerror.purchaseCost ? (
                            <Text style={styles.error_text}>{validerror.purchaseCost}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Rental Charge<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.rentalcost ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Rental Charge" style={styles.inputfield} placeholderTextColor="#888" value={rentalcost} onChangeText={setRentalCost} keyboardType="number-pad" />
                    </View>
                    {
                        validerror.rentalcost ? (
                            <Text style={styles.error_text}>{validerror.rentalcost}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Description</Text>
                    <View style={styles.for_border}>
                        <TextInput placeholder="Enter Description" style={styles.inputfield} multiline placeholderTextColor="#888" value={description} onChangeText={setDescription} />
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



                {/* <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Add Accessory</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={[styles.btn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit}  disabled={isSubmitting} >
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                Adding...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Add Accessory</Text>
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
        borderColor: colors.inputfieldcolor,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldcolor,
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
        fontFamily: fonts.sfmedium,
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
export default AddAccessory