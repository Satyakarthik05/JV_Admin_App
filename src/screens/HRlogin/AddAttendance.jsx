import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, ScrollView, Platform, PermissionsAndroid, Alert, Linking, Image } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, fonts } from "../../config/theme";
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from "react-redux";
import { Location } from "../../components/svgs";
// import Geocoder from "react-native-geocoding";
import { AttendanceBasedOnDates, PunchInAtt, PunchOutAtt } from "../../redux/reducers/HRLogin/ReqExpenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RNFS from 'react-native-fs';  // to read the excel data




const { height, width } = Dimensions.get('window')
const AddAttendance = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();


    const [inTime, setInTime] = useState('');//store In time
    const [outTime, setOutTime] = useState('');//store out time
    const [inlocation, setInLocation] = useState(''); // store inlocation
    const [outlocation, setOutLocation] = useState('');// store outlocation

    const [photo, setPhoto] = useState(null); // for photto
    const [isSubmitting, setIsSubmitting] = useState(false);





    // const openGallery = async () => {

    //     const options = {
    //         mediaType: 'photo',
    //         quality: 0.8,
    //         selectionLimit: 1,   // only one photo
    //     };

    //     launchImageLibrary(options, (response) => {
    //         if (response.didCancel) {
    //             console.log("User cancelled gallery");
    //         }
    //         else if (response.errorCode) {
    //             console.log("Gellery Error:", response.errorMessage);
    //             Alert.alert("Gallery Error", response.errorMessage);
    //         }
    //         else if (response.assets && response.assets.length > 0) {
    //             const image = response.assets[0];
    //             console.log("Selected  Image:", image);
    //             setPhoto(image);
    //         }
    //     });
    // };


    const pickProfilePhoto = async () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,   //  only one image
                includeBase64: false,
            },
            (response) => {
                if (response.didCancel) return;

                if (response.errorCode) {
                    Alert.alert("Error", response.errorMessage);
                    return;
                }

                if (response.assets && response.assets.length > 0) {
                    setPhoto(response.assets[0]); // only one image
                }
            }
        );
    };


    const [remarks, setRemarks] = useState('');
    const cleanedReason = remarks.replace(/\n/g, " ");

    const [userData, setUserData] = useState(null);
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





    //Attendance 
    //const [showAtt, setShowAtt] = useState(false);
    // const [attendance, setAttendance] = useState(TodayaDate());
    const [attendance, setAttendance] = useState();

    const formateDate = (date) => {

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    // to convert 19/2/2025-->19-02-2026
    useEffect(() => {
        const today = new Date();
        setAttendance(formateDate(today));
    }, []);

    // const Attendance = (event, selected) => {
    //     setShowAtt(false)
    //     if (selected) {
    //         const AttendanceDate = formateDate(selected)
    //         setAttendance(AttendanceDate);
    //     }
    // }

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
            // dispatch(AttendanceBasedOnDates({employeeId: data?.id,}));
            if (userData?.id) {
                dispatch(AttendanceBasedOnDates({
                    employeeId: userData?.id,
                }));
            }

        }, [userData?.id])
    )

    // for Permissions taking background location when punch IN 
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);
            const fineGranted = granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED;

            if (!fineGranted) {  // if permissions denied then it will show this alert to go to setting to allow permissions
                Alert.alert(
                    "Permission Required",
                    "Please allow location permission to punch In",
                    [
                        { text: "cancel", style: "cancel" },
                        {
                            text: "open settings",
                            onPress: () => Linking.openSettings(),
                        },
                    ]
                );
            }
            return fineGranted;
        }
        return true;
    }







    const getAddressFromLatLng = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                {
                    headers: {
                        "User-Agent": "AttendanceApp/1.0"
                    }
                }
            );

            const data = await response.json();

            if (data.display_name) {
                return data.display_name;
            }
            else {
                return `${latitude}, ${longitude}`;
            }


        } catch (error) {
            console.log("OSM Error:", error);
            return `${latitude}, ${longitude}`;

        }
    };






    //free address
    const getLocation = async (onSuccess) => {  //function for  fetching location it will exectutse when onSucess
        const hasPermission = await requestLocationPermission();// taking permisssions fromm GPS
        if (!hasPermission) {        // if no permissions then it will show alert
            Alert.alert("Location Permission denied");
            return;
        }

        Geolocation.getCurrentPosition(                      //Get Current GPS Position
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;  //when GPS extrated lat,lon 

                console.log("Lat:", latitude);
                console.log("Lon:", longitude);
                console.log("Accuracy (meters):", accuracy);

                const address = await getAddressFromLatLng(latitude, longitude);
                onSuccess(latitude, longitude, address);
            },
            (error) => {
                console.log(error);
                Alert.alert("Unable to fetch location");//user turned off location
            },
            {
                enableHighAccuracy: true,//use GPS instead of network for better accuracy. 
                timeout: 9000, //stop trying after 9 seconds.
                maximumAge: 10000, //can use cached location if it's less than 10s old.
                forceRequestLocation: true, //request fresh location
                showLocationDialog: true,  //prompts user to turn on GPS if it’s off.
            }
        );
    };


    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    const [localPunchIn, setLocalPunchIn] = useState(false);
    const [localPunchOut, setLocalPunchOut] = useState(false);

    const handlePunchIn = () => {
        console.log("Punch In Button clicked");
        getLocation((lat, log, address) => {
            const time = getCurrentTime();

            //  setIsPunchedIn(true); // just for btns
            //setIsPunchedOut(false);//

            setInTime(time); // storeing in time
            // setInLocation(`${lat},${log}`);// store in location to show lat,lon in input filed 
            setInLocation(address);//store address here // to show address in inputfiled


            setLocalPunchIn(true);

            //console.log("All About Punch In Data When i Click On puch IN =============================================================>", { InTime: time, InLocation: `${lat},${log}`, InLocation: address, });
            console.log("Punch In Data:", {
                InTime: time,
                Latitude: lat,
                Longitude: log,
                Address: address,
            });



        })
    }

    const handlePunchOut = () => {
        console.log("PunchOut button Clicked");
        getLocation((lat, log, address) => {
            const time = getCurrentTime();

            // setIsPunchedOut(true);

            setOutTime(time);//time will store
            //setOutLocation(`${lat},${log}`);// store  out location
            setOutLocation(address);

            setLocalPunchOut(true);


            console.log("All About Punch Out  Data When i Click On puch Out =============================================================>", { OutTime: time, OutLocation: `${lat},${log}`, OutLocation: address, });







        })

    }


    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data In Add Attendance Screen------------------->", data);

    const [valierror, setValidError] = useState({});

    const handleValid = () => {
        let newerror = {};
        if (!attendance) newerror.attendance = "Please Select the Date";
        // if (!remarks) newerror.remarks = "Please Enter the Remarks";

        if (!todayAttendance?.inTime && !inlocation) {
            newerror.location = "Please Punch In to get Location";
        }

        if (todayAttendance?.inTime && !todayAttendance?.outTime && !outlocation) {
            newerror.location = "Please Punch Out to get Location";
        }

        if (!photo) newerror.photo = "please Pick photo";

        setValidError(newerror)
        return Object.keys(newerror).length === 0;
    }

    const { AttendanceBasedOnDatesfilters } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("attendance Data Based On dates-----------------came to Add Attendance Screen ---------------------------->", AttendanceBasedOnDatesfilters);









    const calculateWorkingHours = () => {
        console.log("------ CALCULATING WORKING HOURS ------");
        console.log("inTime:", inTime);
        console.log("outTime:", outTime);


        if (!inTime || !outTime) {
            console.log("Misssing-------------------->");
            return "";
        }

        const convertTo24Hours = (timeStr) => {
            console.log("Converting:", timeStr);
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":");

            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);

            if (modifier === "PM" && hours !== 12) {
                hours += 12;
            }

            if (modifier === "AM" && hours === 12) {
                hours = 0;
            }

            return new Date(0, 0, 0, hours, minutes);

        };

        const start = convertTo24Hours(inTime);
        const end = convertTo24Hours(outTime);
        console.log("Start:", start);
        console.log("End:", end);

        const diffMs = end - start;
        console.log("Difference in ms:", diffMs);

        if (diffMs <= 0) {
            console.log("Invalid time difference");
            return "0 Hours";
        }
        const diffHours = diffMs / (1000 * 60 * 60);
        console.log(" Working Hours:", diffHours.toFixed(1));

        return `${diffHours.toFixed(1)} Hours`;
    };



    const route = useRoute();
    const { id, attendanceDate, InTime } = route.params || {};
    console.log("iddddddddddddddddddddddddddddddddddddddddddddddd", id, attendanceDate, InTime);

    // when i'm going from My arrence apage when i click on puch out then data will automaticall shown thay 
    useEffect(() => {
        if (attendanceDate) {
            const formatted = formateDate(new Date(attendanceDate));
            setAttendance(formatted);
        }
    }, [attendanceDate])

    useEffect(() => {
        if (InTime) {
            console.log("Setting InTime from previous screen:", InTime);
            setInTime(InTime);// we are storeing InTime which was coming from the previous screen that time not in this screen usetate intime
            // setIsPunchedIn(true);

        }
    }, [InTime]);



    const handleSubmit = async () => {

        if (isSubmitting) return;

        //  If already completed
        if (isAttendanceCompleted) {
            Alert.alert("Attendance Info", "Today's attendance is already completed.");
            return;
        }

        const isvalid = handleValid();
        if (!isvalid) return;


        try {
            setIsSubmitting(true); // ✅ START LOADER
            let profileBase64 = null;
            if (photo) {
                console.log("Profile URI:", photo.uri);
                console.log("Profile Type:", photo.type);

                const base64 = await RNFS.readFile(photo.uri, "base64");
                profileBase64 = `data:${photo.type};base64,${base64}`;
                console.log("uploadeed Image -------------->", profileBase64);

            }

            const payload = {
                employeeId: userData?.id,
                empCode: userData?.empCode,
                attendanceDate: attendance,
                inTime: inTime,//outTime
                inLocation: inlocation,//outlocation
                inImage: profileBase64, //in image

            }

            // dispatch(PunchInAtt(payload))
            // console.log("Payload in  Add Attendace Screen POST Call Punch IN Data#####################################", payload);

            const payloadOut = {
                employeeId: userData?.id,
                empCode: userData?.empCode,
                attendanceDate: attendance,
                outTime: outTime,
                workingHours: calculateWorkingHours(),
                outLocation: outlocation,
                remarks: cleanedReason,
                outImage: profileBase64,//out image
            }

            //isPunchedIn && !isPunchedOut
            //else if isPunchedOut
            if (!todayAttendance?.inTime) {
                await dispatch(PunchInAtt(payload)).unwrap();
                console.log("Payload in  Add Attendace Screen POST Call Punch IN Data#####################################", payload);
            }
            else if (todayAttendance?.inTime && !todayAttendance?.outTime) {
                await dispatch(PunchOutAtt({ id, payloadOut })).unwrap();
                console.log("Punch Out data is going from AddAttendance to my redux code&&&&&&&&&&&&&&&&&&&&&&&&&&&&7777", payloadOut);
            }
            // dispatch(PunchOutAtt(payloadOut))
            // console.log("Id is going from AddAttendance to my redux code ", payloadOut);

            await dispatch(AttendanceBasedOnDates({
                employeeId: userData?.id,
            })).unwrap();



            Alert.alert("Success", "Successfully submitted",
                [
                    {
                        text: "OK",
                        //onPress: () => navigation.goBack(),
                        onPress: async () => {
                            await dispatch(
                                AttendanceBasedOnDates({
                                    employeeId: userData?.id,
                                })
                            ).unwrap();

                            navigation.goBack();
                        },
                    },
                ]
            )
        }
        catch (error) {
            console.log("Submit Error:", error);
            Alert.alert("Error", "Something went wrong")
        }
        finally {
            setIsSubmitting(false); // ✅ STOP LOADER
        }
    }

    const insets = useSafeAreaInsets();


    const { SingleEmployeeAttendanceData } = useSelector((state) => state.PostAttendanceBasedOnDates);
    console.log("attendance Data  emp ID wise-------------------------single Employee Attendance Data -------------------------------------------->", SingleEmployeeAttendanceData);

    const todayDate = new Date();
    const DateFormate = todayDate.getFullYear() + "-" + String(todayDate.getMonth() + 1).padStart(2, "0") + "-" + String(todayDate.getDate()).padStart(2, "0");
    console.log("Date Formate-------------------------->", DateFormate);

    //finding today date existing the My attendate data (single Employee data )
    const todayAttendance = SingleEmployeeAttendanceData?.find(att => {
        const attDateObj = new Date(att.attendanceDate);
        const attDate = attDateObj.getFullYear() + "-" + String(attDateObj.getMonth() + 1).padStart(2, "0") + "-" + String(attDateObj.getDate()).padStart(2, "0");

        return attDate === DateFormate &&
            att.employeeId === userData?.id;
    });

    //if both puch in and punchOut done 
    const isAttendanceCompleted = !!todayAttendance?.inTime && !!todayAttendance?.outTime;

    // Determine if Punch In / Punch Out buttons should be disabled
    const isPunchInDisabled = !!todayAttendance?.inTime || localPunchIn;  // true if already punched in
    //const isPunchOutDisabled = !todayAttendance?.inTime || !!todayAttendance?.outTime; // can't punch out if not punched in or already punched out
    const isPunchOutDisabled =
        (!todayAttendance?.inTime && !localPunchIn) ||
        !!todayAttendance?.outTime ||
        localPunchOut;


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.white }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <View style={styles.container}>
                {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

                <SafeAreaView>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={styles.title}>Add Attendance</Text>
                    </TouchableOpacity>
                </SafeAreaView>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 21 }}>
                    <View style={[styles.body, { paddingBottom: insets.bottom + 10, }]}>

                        <View style={styles.date}>
                            <Text style={styles.first}>Employee Code</Text>
                            <View style={styles.for_border}>
                                <TextInput style={styles.inputfield} placeholder="Employee Code " placeholderTextColor="#888" value={userData?.empCode} />
                            </View>
                        </View>

                        {/* value={inlocation || outlocation}  value={localPunchOut ? outlocation : inlocation}*/}
                        <View style={styles.date}>
                            <Text style={styles.first}>Location</Text>
                            <View style={[styles.for_border, valierror.location ? styles.errorBorder : null]}>
                                <TextInput style={styles.inputfield} placeholder="Location" placeholderTextColor="#888" multiline numberOfLines={2} editable={false} value={inlocation || outlocation} />
                            </View>
                            {valierror.location && (
                                <Text style={styles.error_text}>{valierror.location}</Text>
                            )}
                        </View>

                        <View style={styles.date}>
                            <Text style={styles.first}>Attendance Date</Text>
                            <View style={[styles.for_border, valierror.attendance ? styles.errorBorder : null]}>
                                <TextInput style={styles.inputfield} placeholder="Attendance Date" editable={false} value={attendance} placeholderTextColor="#888" />
                                <TouchableOpacity>
                                    <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                                </TouchableOpacity>
                            </View>
                            {valierror.attendance ? (
                                <Text style={styles.error_text} >{valierror.attendance}</Text>
                            ) : null}
                        </View>


                        <View style={styles.in_out}>
                            <View style={styles.date}>
                                <Text style={styles.first}>In Time<Text style={{ color: colors.error }}>*</Text></Text>
                                <TouchableOpacity style={[styles.for_border_time, isPunchInDisabled ? styles.normal_btn : { borderColor: colors.btntextgreen, backgroundColor: colors.btnbggreen }]} onPress={handlePunchIn} disabled={isPunchInDisabled}>
                                    <Text style={styles.inputfield_time}>Punch IN</Text>
                                </TouchableOpacity>
                                {/* {isPunchInDisabled && <Text style={{ color: 'red', fontSize: 12 }}>Already punched in today</Text>} */}
                            </View>

                            <View style={styles.date}>
                                <Text style={styles.first}>Out Time<Text style={{ color: colors.error }}>*</Text></Text>
                                <TouchableOpacity style={[styles.for_border_time, isPunchOutDisabled ? styles.normal_btn : { borderColor: colors.commoncolor, backgroundColor: colors.commomcolorlight }]} onPress={handlePunchOut} disabled={isPunchOutDisabled}>
                                    <Text style={styles.inputfield_time}>Punch Out</Text>
                                </TouchableOpacity>
                                {/* {isPunchOutDisabled && <Text style={{ color: 'red', fontSize: 12 }}>Cannot punch out yet</Text>} */}
                            </View>
                        </View>
                        {/* disabled={!isPunchedIn} */}

                        <View style={styles.date}>
                            <Text style={styles.first}>Remarks</Text>
                            <TextInput placeholderTextColor="#888" color="#000" style={[styles.inputfiled_large, valierror.remarks ? styles.errorBorder : null]} placeholder="Remarks"
                                multiline
                                textAlignVertical="top"
                                value={remarks}
                                onChangeText={setRemarks}
                            />

                        </View>
                        {valierror.remarks ? (
                            <Text style={styles.error_text} >{valierror.remarks}</Text>
                        ) : null}


                        <View style={styles.date}>
                            <Text style={styles.first}>Upload  Photo</Text>

                            <TouchableOpacity
                                style={[styles.for_border_time, { borderColor: colors.commoncolor, backgroundColor: colors.commomcolorlight }]}
                                onPress={pickProfilePhoto}
                            >
                                <Text style={styles.inputfield_time}>{photo ? "Photo Uploaded" : "Capture Photo"}</Text>
                            </TouchableOpacity>

                            {photo && (
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        marginTop: 10,
                                        borderRadius: 8
                                    }}
                                />
                            )}
                            {valierror.photo ? (
                                <Text style={styles.error_text} >{valierror.photo}</Text>
                            ) : null}

                        </View>



                    </View>





                    {/* <View style={styles.bottom_button}>
                        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                            <Text style={styles.btn_text}>Submit Attendance</Text>
                        </TouchableOpacity>
                    </View> */}

                    <TouchableOpacity style={[styles.btn, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}  >
                        <Text style={styles.btn_text}>
                            {isSubmitting ? "Submitting..." : "Submit Attendance"}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>

                {/* {
                    showAtt &&
                    <DateTimePicker
                       // value={new Date()}
                        value={attendance ? new Date(attendance) : new Date()}
                        mode="date"
                        display="default"
                        //minimumDate={new Date()}
                        onChange={Attendance}
                    />
                } */}
            </View>
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
    error_text: {
        color: colors.error,
        fontSize: 13,
        marginTop: 4,
        fontFamily: fonts.sfmedium,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
    },
    body: {
        flexDirection: 'column',
        gap: 20,
        // paddingTop:responsiveHeight(2),
        //paddingBottom:responsiveHeight(3),
    },
    inputfield: {
        flex: 1,
        color: colors.black,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    inputfiled_large: {
        height: height * 0.19,
        width: width * 0.9253,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    inputfield_time: {
        // flex: 1,
        color: colors.inputfieldcolor,
        fontSize: 16,
        fontWeight: 500,
        width: width * 0.38,
        padding: 10,
        textAlign: 'center',
        fontFamily: fonts.sfmedium,
    },
    in_out: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    for_border_time: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    first: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 5,
        fontFamily: fonts.sfmedium,
        color: colors.formtitlegry,
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
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    for_border_width: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inputfieldcolor,
        borderRadius: 5,
        paddingHorizontal: 10,
        // height:height*,
        // width:width*2.4, 
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
    normal_btn: {
        borderColor: colors.inputfieldborder,
        backgroundColor: colors.gray,
    },


})
export default AddAttendance