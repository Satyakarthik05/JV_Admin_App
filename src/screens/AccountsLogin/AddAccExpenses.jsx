import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Dimensions, Image, ActivityIndicator } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { ReqExpense } from "../../redux/reducers/HRLogin/ReqExpenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddAccountsExpenses } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from 'react-native-fs';  // to read the excel data



const { width, height } = Dimensions.get('window');
const AddAccExpenses = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();


    const [valierror, setValiderror] = useState({});
    const [showDate, setShowDate] = useState(false); // show calender
    const [date, setDate] = useState(''); // stores the Date
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [userData, setUserData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);



    const formateDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const today = new Date();
        setDate(formateDate(today));
    }, []);

    const TodaysDate = (event, selectedDate) => {
        setShowDate(false);
        if (selectedDate) {
            const formatted = formateDate(selectedDate);
            setDate(formatted);
        }
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )


    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        };

        loadUser();
    }, []);
    const { roleId, data } = useSelector((state) => state.Login); // when we login here it will dispaly all the details abount that phone number and it id
    console.log("<------------------------------------------------Logined User Data in RequestExpense Screen-------------------------------------->", data);//userData total logesData

    const handleUploadImage = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
            includeBase64: true,//new line ****
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
                const asset = response.assets?.[0];
                const data = {
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName || `photo_${Date.now()}.jpg`,
                    base64: asset.base64,//new line ***
                }
                console.log("Selected image", data);
                setSelectedImage(data);
                setValiderror(prev => ({ ...prev, selectedImage: null }));


            }

        })
    }


    const validations = () => {
        let newerror = {}
        if (!date) {
            newerror.date = "Please Select Date"
        }
        //amount

        if (!amount) {
            newerror.amount = "Please Enter  Amount";
        }
        else if (isNaN(amount)) {
            newerror.amount = "Amount Must Be A Valid Number";
        }
        else if (Number(amount) <= 0) {
            newerror.amount = "Amount Must be Grater than 0";
        }


        if (!selectedImage) {
            newerror.selectedImage = "Upload product image";
        }

        //Reason
        const trimmedReason = reason.trim();
        const specialCharRegex = /[^a-zA-Z0-9\s]/; // allows only letters, numbers & space
        const onlyNumbersRegex = /^[0-9\s]+$/;  // only numbers

        if (!trimmedReason) {
            newerror.reason = "Please Enter Reason";
        }
        else if (specialCharRegex.test(trimmedReason)) {
            newerror.reason = "Reason should not contain special characters";
        }
        else if (onlyNumbersRegex.test(trimmedReason)) {
            newerror.reason = "Reason should not be only numbers";
        }


        setValiderror(newerror);
        return Object.keys(newerror).length === 0;
    }


    const handleSubmit = async () => {
        if (isSubmitting) return; //  prevent multiple clicks

        const isValid = validations();
        if (!isValid) return false;

        setIsSubmitting(true); //  start loading

        let imageBase64 = "";
        if (selectedImage) {
            const filePath = selectedImage.uri.replace("file://", "");
            const base64 = await RNFS.readFile(filePath, "base64");
            imageBase64 = `data:${selectedImage.type};base64,${base64}`;
        }
        console.log("images------------->", imageBase64);

        const payload = {
            employeeId: userData?.id,
            empCode: userData?.empCode,
            expenseType: "Salary request",
            expenseDate: date,
            amount: amount,
            reason: reason,
            expenseSource: 'OFFICE',
            requestType: 'EXPENSE',
            expenseStatus:"Pending",
            // image: imageBase64, //for image 
            image: selectedImage?.base64 || "",
        }
        console.log("Payload Data  that dispatcing  UI Screen Add Accounts Expenses ----------------------->", payload);

        try {
            const response = await dispatch(AddAccountsExpenses(payload)).unwrap();  //fulfilled → returns actual payload  //rejected → throws error to catch block

            //show Api message in alert
            Alert.alert(
                "Success",
                response?.data?.message || response?.message || "Expenses   Added Successfully",

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


    const insets = useSafeAreaInsets();

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <SafeAreaView>
                        <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                            <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                            <Text style={styles.title}>Add Expenses</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <View style={styles.body}>

                            <View style={styles.date}>
                                <Text style={styles.first}>Date<Text style={styles.red}>*</Text></Text>
                                <View style={[styles.for_border, valierror.date ? styles.errorBorder : null]}>
                                    <TextInput style={styles.inputfield} editable={false} value={date} placeholder="Select Date" placeholderTextColor="#888" />
                                    <TouchableOpacity onPress={() => setShowDate(true)}>
                                        <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    valierror.date ? (
                                        <Text style={styles.error_text} >{valierror.date}</Text>
                                    ) : null
                                }
                            </View>

                            <View style={styles.date}>
                                <Text style={styles.first}>Amount<Text style={styles.red}>*</Text></Text>
                                <View style={[styles.for_border, valierror.amount ? styles.errorBorder : null]}>
                                    <TextInput style={styles.inputfield} placeholder="Amount" placeholderTextColor="#888" value={amount} keyboardType="numeric"
                                        onChangeText={(text) => {
                                            setAmount(text);
                                            setValiderror(prev => ({ ...prev, amount: null }));
                                        }}
                                    />
                                </View>
                                {
                                    valierror.amount ? (
                                        <Text style={styles.error_text} >{valierror.amount}</Text>
                                    ) : null
                                }
                            </View>

                            <View style={styles.date}>
                                <Text style={styles.first}>Reason<Text style={styles.red}>*</Text></Text>
                                <View style={[styles.for_border, valierror.reason ? styles.errorBorder : null]}>
                                    <TextInput style={styles.inputfield} placeholder="Reason" placeholderTextColor="#888" value={reason}
                                        onChangeText={(text) => {
                                            setReason(text);
                                            setValiderror(prev => ({ ...prev, reason: null }));
                                        }}
                                    />
                                </View>
                                {
                                    valierror.reason ? (
                                        <Text style={styles.error_text}>{valierror.reason}</Text>
                                    ) : null
                                }
                            </View>

                            <View style={styles.date}>
                                <Text style={styles.first}>Upload Image<Text style={styles.red}>*</Text></Text>
                                <View style={[styles.inputfiled_upimg, valierror?.selectedImage ? styles.errorBorder : null]}>
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
                                {
                                    valierror.selectedImage ? (
                                        <Text style={styles.error_text}>{valierror.selectedImage}</Text>
                                    ) : null
                                }

                            </View>


                        </View>


                        <View style={{ paddingBottom: insets.bottom + 10 }}>
                            <TouchableOpacity style={[styles.btn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting} >
                                {isSubmitting ? (
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <ActivityIndicator color="#fff" size="small" />
                                        <Text style={[styles.btn_text, { marginLeft: 8 }]}>Submitting...</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.btn_text}>Submit</Text>
                                )}
                            </TouchableOpacity>
                        </View>



                    </View>
                    {
                        showDate &&
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            minimumDate={new Date()}
                            onChange={TodaysDate}
                        />
                    }
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 13,
        //justifyContent:'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingTop: 10,
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
    bottom_button: {
        // marginBottom: 25,

    },
    body: {

        paddingTop: 10,
        paddingBottom: 10,
        gap: 20,
    },
    red: {
        color: "red",
    },
    first: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    for_border: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
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
    calender_icon: {
        paddingRight: 15,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,

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
    louch_image: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },


})
export default AddAccExpenses;