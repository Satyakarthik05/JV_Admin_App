import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, StatusBar, ScrollView, TextInput, Dimensions, Image } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";


const { height, width } = Dimensions.get("window");
const EditProduction = () => {
    const navigation = useNavigation();


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white),
                StatusBar.setBarStyle("dark-content");
        })
    )
    const [showDate, setShowDate] = useState(false);
    const [date, setDate] = useState(null);

    const TodayDate = (event, selectedDate) => {
        setShowDate(false);
        if (selectedDate) {
            const DATE = selectedDate.toLocaleDateString('en-GB');
            setDate(DATE);
        }
    }

    const [materailCount, setMaterialCount] = useState(1);
    const [material, setMaterial] = useState([
        {
            id: Date.now(),
            materialno: 1,
            category: null,
            name: null,
            start: '',
            end: '',
            duration: '',
            reason: '',
        }
    ])
    const AddMaterial = () => {
        setMaterial(prev => [
            ...prev,
            {
                id: Date.now(),
                materialno: materailCount + 1,
                category: null,
                name: null,
                start: '',
                end: '',
                duration: '',
                reason: '',
            }
        ]);
        setMaterialCount(prev => prev + 1);
    };

    const removeMaterial = (id) => {
        setMaterial(prev => prev.filter(item => item.id !== id));
    }

    const CategoryData = [
        { label: "category1", value: "category1" },
        { label: "category2", value: "category2" },
    ]
    const NameData = [
        { label: "Name1", value: "Name1" },
        { label: "Name2", value: "Name2" },
    ]


    //rawMaterial
    const MaterialCategoryData = [
        { label: "Materialcategory1", value: "Materialcategory1" },
        { label: "Materialcategory2", value: "Materialcategory2" },
    ]
    const MaterialNameData = [
        { label: "MaterialName1", value: "MaterialName1" },
        { label: "MaterialName2", value: "MaterialName2" },
    ]


    const [rawmaterailCount, setRawmaterialCount] = useState(1);
    const [rawmaterial, setRawmaterial] = useState([
        {
            id: Date.now(),
            rawmaterialno: 1,
            rawcategory: null,
            rawname: null,
            quantity: '',
            expoutput: '',
            wastage: '',
            acloutput: '',
        }
    ])
    const AddRawmaterial = () => {
        setRawmaterial(prev => [
            ...prev,
            {
                id: Date.now(),
                rawmaterialno: rawmaterailCount + 1,
                rawcategory: null,
                rawname: null,
                quantity: '',
                expoutput: '',
                wastage: '',
                acloutput: '',
            }
        ]);
        setMaterialCount(prev => prev + 1);
    };

    const removeRawmaterial = (id) => {
        setRawmaterial(prev => prev.filter(item => item.id !== id));
    }

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
                const uri = response.assets?.[0]?.uri;
                setSelectedImage(uri);
            }

        })
    }

    return (
        <View style={styles.container}>

            <SafeAreaView >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Edit Production</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { marginTop: 20 }]}>Production Information</Text>

                <View style={styles.card}>

                    <View style={styles.head}>
                        <Text style={styles.first}>Date</Text>
                        <View style={styles.for_border}>
                            <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Date" placeholderTextColor="#888" />
                            <TouchableOpacity onPress={() => setShowDate(true)}>
                                <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.head}>
                        <Text style={styles.first}>Production Incharge</Text>
                        <View style={styles.for_border}>
                            <TextInput placeholder="Production Incharge" style={styles.inputfield} placeholderTextColor="#888" />
                        </View>
                    </View>

                    <View style={styles.head}>
                        <Text style={styles.first}>Approved By</Text>
                        <View style={styles.for_border}>
                            <TextInput placeholder="Approved By " style={styles.inputfield} placeholderTextColor="#888" />
                        </View>
                    </View>


                </View>

                {/* Production information  Card */}
                <View style={styles.head}>
                    <Text style={styles.title}>Add Product</Text>


                    {
                        material.map((item, index) => (
                            <View style={styles.card} key={item.id}>
                                <View style={styles.left_side}>
                                    <Text style={styles.title}>product {item.materialno}</Text>
                                    <TouchableOpacity onPress={() => removeMaterial(item.id)}>
                                        <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.head}>
                                    <Text style={styles.first}>Product Category</Text>
                                    <View style={styles.for_border_dropdown}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            labelField="label"
                                            valueField="value"
                                            data={CategoryData}
                                            value={item.category}
                                            onChange={val => { setMaterial(prev => prev.map(matl => matl.id === item.id ? { ...matl, category: val.value } : matl)) }}
                                            placeholder="Select Category"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Product Name</Text>
                                    <View style={styles.for_border_dropdown}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            labelField="label"
                                            valueField="value"
                                            data={NameData}
                                            value={item.name}
                                            onChange={val => { setMaterial(prev => prev.map(matl => matl.id === item.id ? { ...matl, name: val.value } : matl)) }}
                                            placeholder="Select Name"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>

                                <View style={styles.head}>
                                    <Text style={styles.first}>Batch no</Text>
                                    <View style={styles.for_border}>
                                        <TextInput placeholder="Batch no" style={styles.inputfield} value={item.duration} placeholderTextColor="#888"
                                            onChangeText={text => {
                                                setMaterial(prev =>
                                                    prev.map(matl =>
                                                        matl.id === item.id ? { ...matl, duration: text } : matl
                                                    )
                                                )
                                            }}
                                        />
                                    </View>
                                </View>

                                <View style={styles.head_new}>
                                    <View style={styles.left}>
                                        <Text style={styles.first}>Start Time</Text>
                                        <View style={styles.for_newborder}>
                                            <TextInput placeholder="Enter Start Time Here" style={styles.newinputfield} value={item.start} placeholderTextColor="#888"
                                                onChangeText={text => {
                                                    setMaterial(prev =>
                                                        prev.map(matl =>
                                                            matl.id === item.id ? { ...matl, start: text } : matl
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.right}>
                                        <Text style={styles.first}>End Time</Text>
                                        <View style={styles.for_newborder}>
                                            <TextInput placeholder=" Enter End Time Here" style={styles.newinputfield} value={item.end} placeholderTextColor="#888"
                                                onChangeText={text => {
                                                    setMaterial(prev =>
                                                        prev.map(matl =>
                                                            matl.id === item.id ? { ...matl, end: text } : matl
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>
                                    </View>


                                </View>

                                <View style={styles.head}>
                                    <Text style={styles.first}>Duration</Text>
                                    <View style={styles.for_border}>
                                        <TextInput placeholder="Duration" style={styles.inputfield} value={item.duration} placeholderTextColor="#888"
                                            onChangeText={text => {
                                                setMaterial(prev =>
                                                    prev.map(matl =>
                                                        matl.id === item.id ? { ...matl, duration: text } : matl
                                                    )
                                                )
                                            }}
                                        />
                                    </View>
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Reason</Text>
                                    <View style={styles.for_border}>
                                        <TextInput placeholder="Reason" style={styles.inputfield} value={item.reason} placeholderTextColor="#888"
                                            onChangeText={text => {
                                                setMaterial(prev =>
                                                    prev.map(matl =>
                                                        matl.id === item.id ? { ...matl, reason: text } : matl
                                                    )
                                                )
                                            }}
                                        />
                                    </View>
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Upload Image</Text>
                                    <View style={styles.inputfiled_upimg}>
                                        <TouchableOpacity onPress={handleUploadImage} style={styles.louch_image}>
                                            {selectedImage ? (
                                                <Image source={{ uri: selectedImage }}
                                                    style={styles.uploadImage}

                                                />

                                            ) : (
                                                <View>
                                                    <Feather name="upload" size={35} color="#8991A6" style={styles.upload_icon} />
                                                    <Text style={styles.first}>upload a Document</Text>
                                                </View>
                                            )}

                                        </TouchableOpacity>

                                    </View>
                                </View>



                            </View>


                        ))
                    }


                </View>

                <TouchableOpacity style={styles.botted} onPress={AddMaterial}>
                    <Entypo name="plus" size={20} color="#4A5565" />
                    <Text style={styles.bottedText}>Add Another Raw Material</Text>
                </TouchableOpacity>


                <Text style={styles.title}>Raw Materials</Text>

                {/* Add Raw Materials  Card */}
                <View style={styles.head}>
                    {/* <Text style={styles.title}>Add Product</Text> */}


                    {
                        rawmaterial.map((item, index) => (
                            <View style={styles.card} key={item.id}>
                                <View style={styles.left_side}>
                                    <Text style={styles.title}>Raw Material {item.rawmaterialno}</Text>
                                    <TouchableOpacity onPress={() => removeRawmaterial(item.id)}>
                                        <Feather name="trash-2" size={16} color="#FF0000" style={styles.bg} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.head}>
                                    <Text style={styles.first}>Material Category</Text>
                                    <View style={styles.for_border_dropdown}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            labelField="label"
                                            valueField="value"
                                            data={MaterialCategoryData}
                                            value={item.rawcategory}
                                            onChange={val => { setRawmaterial(prev => prev.map(matl => matl.id === item.id ? { ...matl, rawcategory: val.value } : matl)) }}
                                            placeholder="Select Category"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Material Name</Text>
                                    <View style={styles.for_border_dropdown}>
                                        <Dropdown
                                            style={styles.dropdown}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.placeholderStyle}
                                            itemTextStyle={styles.placeholderStyle}
                                            labelField="label"
                                            valueField="value"
                                            data={MaterialNameData}
                                            value={item.rawname}
                                            onChange={val => { setRawmaterial(prev => prev.map(matl => matl.id === item.id ? { ...matl, rawname: val.value } : matl)) }}
                                            placeholder="Select Name"
                                            renderRightIcon={() => (
                                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                                            )}
                                        />
                                    </View>
                                </View>

                                <View style={styles.head_new}>
                                    <View style={styles.left}>
                                        <Text style={styles.first}>Quantity</Text>
                                        <View style={styles.for_newborder}>
                                            <TextInput placeholder="Enter Start Time Here" style={styles.newinputfield} value={item.quantity} placeholderTextColor="#888"
                                                onChangeText={text => {
                                                    setRawmaterial(prev =>
                                                        prev.map(matl =>
                                                            matl.id === item.id ? { ...matl, quantity: text } : matl
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.right}>
                                        <Text style={styles.first}>Expected Output</Text>
                                        <View style={styles.for_newborder}>
                                            <TextInput placeholder=" Enter End Time Here" style={styles.newinputfield} value={item.expoutput} placeholderTextColor="#888"
                                                onChangeText={text => {
                                                    setRawmaterial(prev =>
                                                        prev.map(matl =>
                                                            matl.id === item.id ? { ...matl, expoutput: text } : matl
                                                        )
                                                    )
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.head}>
                                    <Text style={styles.first}>Wastage</Text>
                                    <View style={styles.for_border}>
                                        <TextInput placeholder="Wastage" style={styles.inputfield} value={item.wastage} placeholderTextColor="#888"
                                            onChangeText={text => {
                                                setRawmaterial(prev =>
                                                    prev.map(matl =>
                                                        matl.id === item.id ? { ...matl, wastage: text } : matl
                                                    )
                                                )
                                            }}
                                        />
                                    </View>
                                </View>


                                <View style={styles.head}>
                                    <Text style={styles.first}>Actual Output</Text>
                                    <View style={styles.for_border}>
                                        <TextInput placeholder="Actual Output" style={styles.inputfield} value={item.acloutput} placeholderTextColor="#888"
                                            onChangeText={text => {
                                                setRawmaterial(prev =>
                                                    prev.map(matl =>
                                                        matl.id === item.id ? { ...matl, acloutput: text } : matl
                                                    )
                                                )
                                            }}
                                        />
                                    </View>
                                </View>



                            </View>


                        ))
                    }


                </View>

                <TouchableOpacity style={styles.botted} onPress={AddRawmaterial}>
                    <Entypo name="plus" size={20} color="#4A5565" />
                    <Text style={styles.bottedText}>Add Another Raw Material</Text>
                </TouchableOpacity>




                <TouchableOpacity style={styles.button}>
                    <Text style={styles.btn_text}>Add Production</Text>
                </TouchableOpacity>




            </ScrollView>
            {
                showDate &&
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={TodayDate}
                />
            }

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
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
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
    inputfiled_upimg: {
        height: height * 0.19,
        width: width * 0.852,
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
    louch_image: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    calender_icon: {
        paddingRight: 15,
    },
    bg: {
        backgroundColor: colors.lightredcolor,
        padding: 8,
        borderRadius: 8,
    },
    left_side: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.inputfieldborder,
        paddingBottom: 10,
    },
    for_newborder: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
    },
    newinputfield: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        paddingHorizontal: 5,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        fontFamily: fonts.sfmedium,
    },
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.inputfieldcolor,
        fontWeight: 500,
        //paddingLeft: 5,
        paddingHorizontal: 10,
        fontFamily: fonts.sfmedium,
    },
    head_new: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13,
    },
    botted: {
        flexDirection: 'row',
        // alignSelf:'center',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,

        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.commoncolor,

        paddingVertical: 8,
        borderRadius: 6,
        paddingLeft: 90,
    },
    bottedText: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.formtitlegry,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    button: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 20,
    },
    btn_text: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.white,
        textAlign: 'center',
        paddingTop: 16,
        paddingBottom: 16,

    },

})
export default EditProduction