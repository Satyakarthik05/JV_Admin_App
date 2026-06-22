import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, TextInput, ScrollView, Dimensions, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchImageLibrary } from "react-native-image-picker";
//import DatePicker from "react-native-date-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import { colors, fonts } from "../../config/theme";
// import * as DocumentPicker from '@react-native-documents/picker';
import { useDispatch, useSelector } from "react-redux";
import { Roles } from "../../redux/reducers/HRLogin/Roles";
import { Empreg } from "../../redux/reducers/HRLogin/Empreg";
import { responsiveHeight } from "react-native-responsive-dimensions";
import RNFS from 'react-native-fs';  // to read the excel data
import useImagePicker from "../../components/useImagePicker";
// import DocumentPicker from 'react-native-document-picker';
import * as DocumentPicker from '@react-native-documents/picker';
import commonstyles from "../../commonstyles/commonstyles";




const { width, height } = Dimensions.get('window');

const EmployeeReg = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [emcode, setEmpcode] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [address, setAddress] = useState('');
    const [salery, setSalary] = useState('');
    const [password, setPassword] = useState('');
    const [workinghrs, setWorkingHrs] = useState('');

    const [showDOB, setShowDOB] = useState(false); // to show calender
    const [dob, setDob] = useState(''); // to store the selected value

    const [profilePhoto, setProfilePhoto] = useState(null);// for photo uplad from gallry for profile

    const departmentData = [
        { label: "HR", value: 'HR' },
        { label: "MASTER", value: 'MASTER' },
        { label: "TELECALLER", value: 'TELECALLER' },
        { label: "ACCOUNTS", value: 'ACCOUNTS' },
        { label: "SALES", value: 'SALES' },
    ]



    //new
    const genderData = [
        { label: "Male", value: 'Male' },
        { label: "Female", value: 'Female' }
    ]

    const [gender, setGender] = useState(null);

    const statusData = [
        { label: "Active", value: 'Active' },
        { label: "InActive", value: 'In Active' }
    ]

    const [roleId, setRoleID] = useState(null);
    const [rolesIdData, setRoleIdData] = useState([]);

    const [rolename, setRoleName] = useState(null);
    const [roleNameData, setRoleNameData] = useState([]);

    const [status, setStatus] = useState("Active");//new


    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // for multiple Documents
    const pickDocument = async () => {
        console.log("Upload button clicked ");
        try {
            const results = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: [
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.doc,
                    DocumentPicker.types.docx,
                    DocumentPicker.types.xls,
                    DocumentPicker.types.xlsx,
                    DocumentPicker.types.images, // optional if you want images also
                ],
                copyTo: "cachesDirectory",
            });
            console.log("Picked Files:", results);

            if (results && results.length > 0) {
                setSelectedImages(prev => [...prev, ...results]);
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled document picker");
            } else {
                console.log("Document Picker Error:", err);
            }
        }
    };


    const removeImage = (index) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };
    const formateDate = (date) => {

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const DateofBirth = (event, selectedDate) => {
        setShowDOB(false);

        if (selectedDate) {
            const Date = formateDate(selectedDate);
            setDob(Date);
        }
    }




    const getTodayFormatted = () => {
        return formateDate(new Date());
    };

    //const [showDoj, setShowDoj] = useState(false); // to show calender
    // const [doj, setdoj] = useState(TodayaDate()); // to store the selected value
    const [doj, setdoj] = useState(getTodayFormatted()); // to store the selected value

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
                    setProfilePhoto(response.assets[0]); // only one image
                }
            }
        );
    };




    const handleSubmit = async () => {

        if (isSubmitting) return;

        if (!validationForm()) return;

        setIsSubmitting(true);

        try {


            // for ducment
            let documentsArray = [];

            for (let file of selectedImages) {

                const extension = file.name?.includes(".")
                    ? file.name.split(".").pop().toLowerCase()
                    : "unknown";

                //const base64 = await RNFS.readFile(file.uri, "base64");
                // const fileUri =file.uri.startsWith("content://")? file.fileCopyUri: file.uri;
                // const cleanedPath = fileUri.replace("file://", "");
                // const base64 = await RNFS.readFile(cleanedPath, "base64");

                const fileUri = file.fileCopyUri || file.uri;

                if (!fileUri) {
                    console.log("File URI is missing:", file);
                    continue;
                }

                const cleanedPath = fileUri.replace("file://", "");
                const base64 = await RNFS.readFile(cleanedPath, "base64");



                documentsArray.push({
                    //documentName: file.fileName || `image_${Date.now()}.jpg`,
                    documentName: file.name,
                    filetype: extension,
                    base64: `data:${file.type};base64,${base64}`
                });
            }

            console.log("Final Documents Array:", documentsArray);

            // for uplod profile pic
            let profileBase64 = null;
            if (profilePhoto) {
                console.log("Profile URI:", profilePhoto.uri);
                console.log("Profile Type:", profilePhoto.type);

                const base64 = await RNFS.readFile(profilePhoto.uri, "base64");
                profileBase64 = `data:${profilePhoto.type};base64,${base64}`;
                console.log("uploadeed Image -------------->", profileBase64);

            }

            const data = {
                name,
                mobileNumber: mobile,
                emailId: email,
                gender: gender?.toLowerCase(),
                roleId: String(roleId),
                roleName: rolename,
                password,
                department,
                joiningDate: doj,
                dateOfBirth: dob,
                address,
                salary: salery,
                workingHours: Number(workinghrs),
                profile: profileBase64,   // NEW FIELD  for upload image (profile Image)
                documents: documentsArray   //  correct
            };

            console.log("Final Payload:", data);

            // Call your API here
            await dispatch(Empreg(data)).unwrap();
            // Alert.alert("Employee Added successfully")

            Alert.alert(
                "Success",
                "Employee Added Successfully",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ],
                { cancelable: false }
            );

        } catch (error) {
            console.log("Submit Error:", error);
            Alert.alert("Error", "Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )




    useEffect(() => {
        dispatch(Roles());
        //getRole();

    }, [])

    const { error, loading, rolesData } = useSelector((state) => state.AllRoles);
    console.log("Roles in Employess Regration screen---------------------->", rolesData);



    useEffect(() => {
        if (rolesData && rolesData.length > 0) {

            setRoleNameData(
                rolesData.map(item => ({
                    label: String(item.roleName),
                    value: item.roleName,
                    roleId: item.id,
                }))
            )


        }
    }, [rolesData])


    const { regestrationdata } = useSelector((state) => state.Empreg);
    console.log("regestration Data post Call in Employye regestion Screen ", regestrationdata);


    const [validerror, setValidError] = useState({});
    const validationForm = () => {
        let newerror = {};

        //mobilenumber:
        const phoneRegex = /^[6-9][0-9]{9}$/;
        if (!mobile.trim()) {
            newerror.mobile = "Please enter mobile number";
        } else if (!phoneRegex.test(mobile)) {
            newerror.mobile = "Enter valid 10-digit number starting with 6-9";
        }

        //email:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newerror.email = "Please enter email";
        } else if (!emailRegex.test(email)) {
            newerror.email = "Please enter valid email address";
        }

        //password:
        // const passwordRegex =
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!password.trim()) {
            newerror.password = "Please enter password";
        }



        if (!name.trim()) newerror.name = "Please Enter Name";
        if (!gender) newerror.gender = "Please Select Gender";
        if (!dob) newerror.dob = "Please Select Date Of Birth";
        if (!address) newerror.address = "Please Enter Address";
        if (!department.trim()) newerror.department = "Please Enter Department";
        if (!workinghrs) newerror.workinghrs = "Please Enter Working Hours";
        //if (!roleId) newerror.roleId = "Please Select RoleID";
        if (!rolename) newerror.rolename = "Please Select RoleName";
        if (!doj) newerror.doj = "Please Select Date Of Joining";
        if (!salery.trim()) newerror.salery = "Please Enter Salery";
        if (!profilePhoto) newerror.profilePhoto = "Please Upload Profile Photo";

        // if (files.length == 0) {
        //     newerror.files = "Please Upload at Least one Document";
        // }

        if (selectedImages.length === 0) {
            newerror.files = "Please Upload at Least one Document";
        }

        setValidError(newerror);

        return Object.keys(newerror).length === 0;
    }


    const convertToBase64 = async (uri) => {
        try {
            const base64 = await RNFS.readFile(uri, "base64");
            return base64;
        }
        catch (error) {
            console.log("Base64 conversion error:", error);
            return null;
        }
    }







    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;  // Format: DD/MM/YYYY
    };

    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container]}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView>
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Employee Registration</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: responsiveHeight(5) }} >
                {/* <View style={styles.date}>
                    <Text style={styles.first}>Employee ID<Text style={styles.red}>*</Text></Text>
                    <View style={styles.for_border}>
                        <TextInput placeholder="enter ID" style={styles.inputfield} placeholderTextColor="#888" value={emcode} onChangeText={setEmpcode} />
                    </View>
                </View> */}


                <View style={styles.date}>
                    <Text style={styles.first}>Name<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.name ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Name" style={styles.inputfield} placeholderTextColor="#888" value={name} onChangeText={setName} />
                    </View>
                    {validerror.name ? (
                        <Text style={styles.error_text}>{validerror.name}</Text>
                    ) : null}
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Password<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.password ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Password" style={styles.inputfield} placeholderTextColor="#888" value={password} onChangeText={setPassword} />
                    </View>
                    {validerror.password ? (
                        <Text style={styles.error_text}>{validerror.password}</Text>
                    ) : null}

                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Gender<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror.gender ? styles.errorBorder : null, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={genderData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Gender"
                            value={gender}
                            onChange={item => { setGender(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {validerror.gender ? (
                        <Text style={styles.error_text}>{validerror.gender}</Text>
                    ) : null}
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Date Of Birth<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.dob ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Date Of birth" style={styles.inputfield} value={dob} editable={false} placeholderTextColor="#888" />
                        <TouchableOpacity onPress={() => setShowDOB(true)}>
                            <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                        </TouchableOpacity>
                    </View>
                    {validerror.dob ? (
                        <Text style={styles.error_text}>{validerror.dob}</Text>
                    ) : null}
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Mobile Number<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.mobile ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Mobile Number" style={styles.inputfield} placeholderTextColor="#888" keyboardType="numeric" maxLength={10} value={mobile} onChangeText={setMobile} />
                    </View>
                    {validerror.mobile ? (
                        <Text style={styles.error_text}>{validerror.mobile}</Text>
                    ) : null}
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Email ID<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.email ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Email ID" style={styles.inputfield} placeholderTextColor="#888" value={email} onChangeText={setEmail} />
                    </View>
                    {validerror.email ? (
                        <Text style={styles.error_text}>{validerror.email}</Text>
                    ) : null}
                </View>

                <View style={styles.date}>
                    <Text style={styles.first}>Address<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.address ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Address" style={styles.inputfield} placeholderTextColor="#888" value={address} onChangeText={setAddress} />
                    </View>
                    {validerror.address ? (
                        <Text style={styles.error_text}>{validerror.address}</Text>
                    ) : null}
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Profile Photo<Text style={styles.red}>*</Text></Text>

                    <View style={[styles.inputfiled_upimg, validerror.profilePhoto ? styles.errorBorder : null]}>
                        <TouchableOpacity onPress={pickProfilePhoto} style={styles.louch_image}>
                            {profilePhoto ? (
                                <Image
                                    source={{ uri: profilePhoto.uri }}
                                    style={{ width: "100%", height: "100%", borderRadius: 6 }}
                                />
                            ) : (
                                <View style={{ alignItems: "center" }}>
                                    <Feather name="camera" size={35} color="#8991A6" />
                                    <Text style={styles.click}>Upload Profile Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    {validerror.profilePhoto ? (
                        <Text style={styles.error_text}>{validerror.profilePhoto}</Text>
                    ) : null}
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Document<Text style={styles.red}>*</Text></Text>
                    {/* pickImage */}
                    <View style={[styles.inputfiled_upimg, validerror.files ? styles.errorBorder : null]}>
                        <TouchableOpacity onPress={pickDocument} style={styles.louch_image}>
                            <View style={{ alignItems: "center" }}>
                                <Feather name="upload" size={35} color="#8991A6" />
                                <Text style={styles.click}>Upload Documents</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {validerror.files ? (
                        <Text style={styles.error_text}>{validerror.files}</Text>
                    ) : null}

                    {/* Show Selected Images */}
                    {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                        {selectedImages.map((item, index) => (
                            <View key={index} style={{ marginRight: 10, marginBottom: 10 }}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{ width: 90, height: 90, borderRadius: 8 }}
                                />
                                <TouchableOpacity
                                    onPress={() => removeImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        backgroundColor: 'red',
                                        borderRadius: 12,
                                        padding: 4
                                    }}
                                >
                                    <Feather name="x" size={14} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View> */}

                    {/* Show Selected Documents */}
                    <View style={{ marginTop: 10 }}>
                        {selectedImages.map((item, index) => (
                            <View key={index} style={styles.selected_Doc} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Feather name="file-text" size={20} color="#17498F" />
                                    <Text numberOfLines={1} style={{ marginLeft: 8, flex: 1, color: '#000', fontSize: 14, }}>{item.name}</Text>
                                </View>

                                <TouchableOpacity onPress={() => removeImage(index)}>
                                    <Feather name="x-circle" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                </View>


                {/* <View style={styles.date}>
                    <Text style={styles.first}>Department<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.department ? styles.errorBorder : null]}>
                        <TextInput placeholder="Select Department" style={styles.inputfield} placeholderTextColor="#888" value={department} onChangeText={setDepartment} />
                    </View>
                    {validerror.department ? (
                        <Text style={styles.error_text}>{validerror.department}</Text>
                    ) : null}
                </View> */}



                <View style={styles.date}>
                    <Text style={styles.first}>Department<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror.department ? styles.errorBorder : null, { zIndex: 1000 }]}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={departmentData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Department"
                            value={department}
                            onChange={item => { setDepartment(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                    {validerror.department ? (
                        <Text style={styles.error_text}>{validerror.department}</Text>
                    ) : null}
                </View>





                <View style={styles.date}>
                    <Text style={styles.first}>Role Name<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border_dropdown, validerror.rolename ? styles.errorBorder : null, { zIndex: 1000 }]}>

                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            data={roleNameData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select role Name"
                            value={rolename}
                            onChange={item => { setRoleName(item.value); setRoleID(item.roleId) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />

                    </View>
                    {validerror.rolename ? (
                        <Text style={styles.error_text}>{validerror.rolename}</Text>
                    ) : null}
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Working Hours<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.workinghrs ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Working Hours" style={styles.inputfield} placeholderTextColor="#888" value={workinghrs} onChangeText={setWorkingHrs} keyboardType="numeric" />
                    </View>
                    {validerror.workinghrs ? (
                        <Text style={styles.error_text}>{validerror.workinghrs}</Text>
                    ) : null}
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Date Of Joining<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.doj ? styles.errorBorder : null]}>
                        <TextInput placeholder="Select The Date " style={styles.inputfield} editable={false} value={doj} placeholderTextColor="#888" />
                        <TouchableOpacity>
                            <Ionicons name="calendar-clear-outline" size={18} color="#82889A" style={styles.calender_icon} />
                        </TouchableOpacity>
                    </View>
                    {validerror.doj ? (
                        <Text style={styles.error_text}>{validerror.doj}</Text>
                    ) : null}
                </View>


                {/* <View style={styles.date}>
                    <Text style={styles.first}>Employement Type<Text style={styles.red}>*</Text></Text>
                    <View style={styles.for_border}>
                        <TextInput placeholder="Select Employment Type" style={styles.inputfield} placeholderTextColor="#888" />
                    </View>
                </View> */}


                <View style={styles.date}>
                    <Text style={styles.first}>Salary<Text style={styles.red}>*</Text></Text>
                    <View style={[styles.for_border, validerror.salery ? styles.errorBorder : null]}>
                        <TextInput placeholder="Enter Salary" style={styles.inputfield} placeholderTextColor="#888" value={salery} onChangeText={setSalary} keyboardType="numeric" />
                    </View>
                    {validerror.salery ? (
                        <Text style={styles.error_text}>{validerror.salery}</Text>
                    ) : null}
                </View>


                <View style={styles.date}>
                    <Text style={styles.first}>Status<Text style={styles.red}>*</Text></Text>
                    <View style={styles.for_border_dropdown}>


                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.placeholderStyle}
                            itemTextStyle={styles.placeholderStyle}
                            dropdownPosition="auto"
                            data={statusData}
                            labelField="label"
                            valueField="value"
                            placeholder="Select status"
                            value={status}
                            onChange={item => { setStatus(item.value) }}
                            renderRightIcon={() => (
                                <Entypo name="chevron-small-down" size={18} color="#82889A" style={styles.calender_icon} />
                            )}
                        />
                    </View>
                </View>




                {/* <TouchableOpacity style={[styles.btn, { marginBottom: responsiveHeight(3) }]} onPress={handleSubmit}>
                    <Text style={styles.btn_text}>Add Employee</Text>
                </TouchableOpacity> */}

                <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 12 }]}>
                    <TouchableOpacity
                        style={[styles.button, { opacity: isSubmitting ? 0.6 : 1 }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <ActivityIndicator color="#fff" size="small" />
                                <Text style={[styles.btnText, { marginLeft: 8 }]}>Submitting...</Text>
                            </View>
                        ) : (
                            <Text style={styles.btnText}>Add Employee</Text>
                        )}
                    </TouchableOpacity>
                </View>



            </ScrollView >
            {showDOB && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={DateofBirth}
                />
            )}
            {/* {showDoj && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={Dateofjoining}
                />
            )} */}


        </View >

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
        //paddingTop: responsiveHeight(2),
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
    dropdown: {
        flex: 1,
        height: 48,
    },
    placeholderStyle: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        // paddingLeft:5,
        paddingHorizontal: 10,
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
    filenames: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
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
        //justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    for_border_dropdown: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        // position: 'relative',
        // zIndex: 10,

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
    // first_new: {
    //     marginTop: 13,
    // },
    date: {
        marginTop: responsiveHeight(2),
    },
    louch_image: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    // btn: {
    //     backgroundColor: colors.commoncolor,
    //     borderRadius: 8,
    //     // marginTop: 50,
    //     // marginBottom: 10,
    //     marginTop: responsiveHeight(3),
    //     //marginBottom:responsiveHeight(1),

    // },

    // btn_text: {
    //     textAlign: 'center',
    //     color: colors.white,
    //     fontSize: 16,
    //     fontWeight: 700,
    //     paddingTop: 16,
    //     paddingBottom: 16,
    //     fontFamily: fonts.sfmedium,

    // },

    button: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    bottomContainer: {
        marginTop: responsiveHeight(3), // space above button
    },


    inputfiled_upimg: {
        height: height * 0.19,
        width: width * 0.9241,
        // borderWidth: 1,
        // borderColor: "#17498F",
        // borderRadius: 6,
        // //textDecorationLine: "line-through",
        // //borderStyle: "dashed",
        // alignSelf: "center",

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        //paddingHorizontal: 10,

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
    uploadImage: {
        width: "100%",
        height: "100%",
        borderRadius: 6,
        resizeMode: "cover",
    },
    //selected Documents
    selected_Doc: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
    },

})
export default EmployeeReg