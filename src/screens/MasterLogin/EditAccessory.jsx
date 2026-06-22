import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Dimensions, Image, Alert, ActivityIndicator } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { GetAccessoryCategoryData } from "../../redux/reducers/MasterLogin/AddCategory";
import { EditAccessoriesCall } from "../../redux/reducers/MasterLogin/AddProduct";
import RNFS from 'react-native-fs';  // to read the excel data
import commonstyles from "../../commonstyles/commonstyles";


const { width, height } = Dimensions.get('window');
const EditAccessory = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const { editAccessory } = route.params;
    console.log("All About Edit Data ---------->", editAccessory);
    const [validerror, setValidError] = useState({});

    const [selectedImage, setSelectedImage] = useState(editAccessory?.imageUrl ? { uri: editAccessory.imageUrl } : null);
    const [code, setCode] = useState(editAccessory?.accessoryCode || '');
    const [name, setName] = useState(editAccessory?.accessoryName || '');
    const [type, setType] = useState([]);
    const [selectedType, setSelectedType] = useState(null);

    const [size, setSize] = useState(editAccessory?.modelOrSize || '');
    const [des, setDes] = useState(editAccessory?.description || '');
    const [rentalcharge, setRentalCharge] = useState(editAccessory?.rentalCharge ? String(editAccessory.rentalCharge) : '');
    const [purchasecost, setPurchaseCost] = useState(editAccessory?.purchaseCost ? String(editAccessory.purchaseCost) : '');
    const [assestType, setAssestType] = useState(editAccessory?.assetType || '');
    const [status, setStatus] = useState(editAccessory?.status === 1 ? "Active" : "Inactive");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const statusOptions = [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "InActive" },
    ];


    useFocusEffect(
        useCallback(() => {
            dispatch(GetAccessoryCategoryData())
        }, [dispatch])
    )

    const { GetAccCategory } = useSelector((state) => state.GetAccessoryCategory);
    console.log("Get Acc Categories---------->", GetAccCategory);



    useEffect(() => {
        if (GetAccCategory && GetAccCategory.length > 0) {

            const formattedData = GetAccCategory.map(item => ({
                label: item.accessoryType,
                value: item.accessoryType,
            }));

            setType(formattedData);

            // set default dropdown value from params
            setSelectedType(editAccessory?.accessoryType);
        }
    }, [GetAccCategory]);


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

        })
    }






    const handleValidation = () => {
        const isNumber = (val) => /^[0-9]+(\.[0-9]+)?$/.test(val);
        let newerror = {};
        // Name
        if (!name.trim()) {
            newerror.name = "Please enter name";
        } else if (name.trim().length < 3) {
            newerror.name = "Name must be at least 3 characters";
        }
        // Type
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
        // Description
        if (!des.trim()) {
            newerror.des = "Please enter description";
        } else if (des.trim().length < 5) {
            newerror.des = "Description too short";
        }
        // Purchase Cost
        if (!purchasecost) {
            newerror.purchasecost = "Enter purchase cost";
        } else if (!isNumber(purchasecost) || Number(purchasecost) <= 0) {
            newerror.purchasecost = "Invalid purchase cost";
        }
        // Rental Charge
        if (!rentalcharge) {
            newerror.rentalcharge = "Enter rental charge";
        } else if (!isNumber(rentalcharge) || Number(rentalcharge) <= 0) {
            newerror.rentalcharge = "Invalid rental charge";
        }
        // OPTIONAL BUSINESS RULE 
        // Remove this block if you want rental > purchase allowed
        if (
            isNumber(purchasecost) &&
            isNumber(rentalcharge) &&
            Number(rentalcharge) > Number(purchasecost)
        ) {
            newerror.rentalcharge = "Rental should be ≤ Purchase Cost";
        }
        // Image (optional in edit — only if you want mandatory)
        // if (!selectedImage) {
        //     newerror.selectedImage = "Please select image";
        // }
        setValidError(newerror);
        return Object.keys(newerror).length === 0;
    };



    const handleUpdate = async () => {

        if (isSubmitting) return;

        const isValid = handleValidation();
        if (!isValid) return;

        setIsSubmitting(true); // lock button

        // let imageBase64 = "";
        // if (selectedImage?.uri && !selectedImage.uri.startsWith("http")) {
        //     const filePath = selectedImage.uri.replace("file://", "");
        //     const base64 = await RNFS.readFile(filePath, "base64");
        //     imageBase64 = `data:${selectedImage.type};base64,${base64}`;
        // }

        let imageToSend = "";

        if (selectedImage?.uri) {
            if (selectedImage.uri.startsWith("http")) {
                // already uploaded image (no change)
                imageToSend = selectedImage.uri;
            } else {
                // new image selected → convert to base64
                const filePath = selectedImage.uri.replace("file://", "");
                const base64 = await RNFS.readFile(filePath, "base64");
                imageToSend = `data:${selectedImage.type};base64,${base64}`;
            }
        } else {
            // fallback to existing image
            imageToSend = editAccessory?.imageUrl;
        }



        const id = editAccessory?.id;
        const payload = {

            accessoryName: name,
            accessoryType: selectedType,
            modelOrSize: size,
            //assetTseCost: assestType,
            //rentalCype: Number(rentalcharge),
            //purchaharge: Number(purchasecost),
            assetType: assestType,
            purchaseCost: Number(purchasecost),
            rentalCharge: Number(rentalcharge),
            description: des,
            //image: imageBase64 || editAccessory?.imageUrl
             image: imageToSend,
            //imageUrl: imageToSend,
            status: status === "Active" ? 1 : 0,
        }
        
        console.log("Dispatching payload data in Edit Accessories UI Code --------------------->", payload, id);

        try {
            const response = await dispatch(EditAccessoriesCall({ id, payload })).unwrap();

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
            setIsSubmitting(false);
        }


    }




    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />

            <SafeAreaView >
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Edit  Accessory</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.sec_1}>
                    <View style={styles.for_flex}>
                        <Text style={styles.name}>{editAccessory?.accessoryName}</Text>
                        <Text style={[editAccessory?.status === 1 ? styles.active : styles.rejected]}>{editAccessory?.status === 1 ? "Active" : "InActive"}</Text>
                    </View>
                    <Text style={styles.first}>{editAccessory?.accessoryCode}</Text>
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Accessory Code<Text style={commonstyles.required}>*</Text></Text>
                    <View style={styles.for_border}>
                        <TextInput placeholder="POO2" style={styles.inputfield} placeholderTextColor="#888" value={code} onChangeText={setCode} editable={false} />
                    </View>
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Accessory Name<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.name ? styles.errorBorder : null]}>
                        <TextInput placeholder="Product Rack" style={styles.inputfield} placeholderTextColor="#888" value={name} onChangeText={setName} />
                    </View>
                    {
                        validerror.name ? (
                            <Text style={styles.error_text}>{validerror.name}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Product Category<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror?.selectedType ? styles.errorBorder : null]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            labelField="label"
                            valueField="value"
                            data={type}
                            value={selectedType}
                            onChange={item => { setSelectedType(item.value) }}
                            placeholder="select Board"
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
                    <Text style={styles.first}>Asset Type<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.assestType ? styles.errorBorder : null]}>
                        <TextInput placeholder="Asset Type" style={styles.inputfield} placeholderTextColor="#888" value={assestType} onChangeText={setAssestType} />
                    </View>
                    {
                        validerror.assestType ? (
                            <Text style={styles.error_text}>{validerror.assestType}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Modal/Size<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.size ? styles.errorBorder : null]}>
                        <TextInput placeholder="Modal" style={styles.inputfield} placeholderTextColor="#888" value={size} onChangeText={setSize} />
                    </View>
                    {
                        validerror.size ? (
                            <Text style={styles.error_text}>{validerror.size}</Text>
                        ) : null
                    }
                </View>



                <View style={styles.date}>
                    <Text style={styles.first}>Purchase Cost<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.purchasecost ? styles.errorBorder : null]}>
                        <TextInput placeholder="Cost" style={styles.inputfield} placeholderTextColor="#888" value={purchasecost} onChangeText={setPurchaseCost} />
                    </View>
                    {
                        validerror.purchasecost ? (
                            <Text style={styles.error_text}>{validerror.purchasecost}</Text>
                        ) : null
                    }
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Rental Charge<Text style={commonstyles.required}>*</Text></Text>
                    <View style={[styles.for_border, validerror?.rentalcharge ? styles.errorBorder : null]}>
                        <TextInput placeholder="1000/m" style={styles.inputfield} placeholderTextColor="#888" value={rentalcharge} onChangeText={setRentalCharge} />
                    </View>
                    {
                        validerror.rentalcharge ? (
                            <Text style={styles.error_text}>{validerror.rentalcharge}</Text>
                        ) : null
                    }
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Description</Text>
                    <View style={[styles.for_border, validerror?.des ? styles.errorBorder : null]}>
                        <TextInput style={styles.inputfield} multiline placeholder="Description" placeholderTextColor="#888" value={des} onChangeText={setDes} />
                    </View>
                    {
                        validerror.des ? (
                            <Text style={styles.error_text}>{validerror.des}</Text>
                        ) : null
                    }
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
                                    <Text style={styles.click}>upload a Document</Text>
                                </View>
                            )}

                        </TouchableOpacity>

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
                            showsVerticalScrollIndicator={false}
                            data={statusOptions}
                            labelField="label"
                            valueField="value"
                            value={status}
                            placeholder="Select Status"
                            onChange={item => setStatus(item.value)}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>



                {/* <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.btn_text}>Edit Accessory</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                    onPress={handleUpdate}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.btn_text, { marginLeft: 10 }]}>
                                Updating...
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.btn_text}>Edit Accessory</Text>
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
        color: colors.inputfieldcolor,
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

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 25,
        marginBottom: 15,
    },
    btn_text: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.white,
        textAlign: 'center',
        paddingTop: 16,
        paddingBottom: 16,

    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
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
    sec_1: {
        borderWidth: 1,
        borderColor: colors.commoncolor,
        backgroundColor: colors.lightredcolor,
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
        color: "#000",
    },
    btn: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
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
    active: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        borderWidth: 1,
        borderColor: colors.btntextgreen,
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 4,
    },
    rejected: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
        fontSize: 14,
        fontWeight: 500,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
    },

})
export default EditAccessory
