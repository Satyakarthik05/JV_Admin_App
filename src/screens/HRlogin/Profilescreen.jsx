import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Dimensions, Image, Modal, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { actionLogOut } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveHeight } from "react-native-responsive-dimensions";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { height, width } = Dimensions.get('window')
const ProfileScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation();
    const size = width * 0.35;
    const [userData, setUserData] = useState(null);

    const handleUploadImage = async () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };
        launchImageLibrary(options, async (response) => {
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

                //save to asyncStorege
                await AsyncStorage.setItem(`profileImage_${userData?.empCode}`, uri);
            }

        })


    }

    //newly add
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("userData");

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUserData(parsedUser);

                    // Load profile image using empCode
                    const savedImage = await AsyncStorage.getItem(
                        `profileImage_${parsedUser?.empCode}`
                    );

                    if (savedImage) {
                        setSelectedImage(savedImage);
                    }
                }
            } catch (error) {
                console.log("Error loading user:", error);
            }
        };

        loadUser();
    }, []); //newly added

    console.log("logined user data in  profile screen ---------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";

    // useEffect(() => {
    //     const loadImage = async () => {
    //         const savedImage = await AsyncStorage.getItem(`profileImage_${userData?.empCode}`);
    //         if (savedImage) {
    //             setSelectedImage(savedImage);
    //         }
    //         else {
    //             setSelectedImage(null); // important
    //         }
    //     };
    //     loadImage();
    // }, [])


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )
    // const { roleId,data } = useSelector((state) => state.Login); // when we login here it will dispaly all the details abount that phone number and it id
    // console.log("roleId",roleId);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data in Profile Screen ", data);


    const dispatch = useDispatch();

    const [logoutModal, setLogoutModal] = useState(false);

    // const handleLogOut=()=>{
    //     dispatch(actionLogOut())
    //     setLogoutModal(false);
    //     navigation.replace("Signin");
    //     console.log("Navigation here----------");

    // }

    const handleLogOut = async () => {
        try {
            // ✅ Remove stored login
            await AsyncStorage.removeItem("userData");

            // ✅ Clear Redux
            dispatch(actionLogOut());

            setLogoutModal(false);

            // ✅ Go to Splash (not Signin)
            navigation.replace("Splash");

        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    const { getEmpdata } = useSelector((state) => state.GetEmp);
    console.log("****GetEmployess Data All Employess Data in Profile  Screen****", getEmpdata);


    // Find logged-in employee full data
    const matchedEmployee = getEmpdata?.find(
        (emp) => emp.mobileNumber === userData?.mobileNumber
    );

    console.log("Matched Employee Data:", matchedEmployee);


    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Profile</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.division}>
                <View style={styles.card}>
                    <View style={styles.profile_img}>
                        <TouchableOpacity onPress={handleUploadImage}>
                            {/* {selectedImage ? (
                                <Image source={{ uri: selectedImage }}
                                    style={styles.uploadImage}
                                />

                            ) : (
                                <View style={[styles.circle, { height: size, width: size, borderRadius: size / 2 }]}>
                                    <Image source={require('../../assets/f3.png')} style={styles.uploadImage} />
                                </View>
                            )} */}

                            {selectedImage ? (
                                <Image source={{ uri: selectedImage }} style={styles.uploadImage} />
                            ) : matchedEmployee?.profile ? (
                                <Image
                                    source={{ uri: matchedEmployee.profile }}
                                    style={styles.uploadImage}
                                />
                            ) : (
                                <View
                                    style={[
                                        styles.circle,
                                        { height: size, width: size, borderRadius: size / 2 },
                                    ]}
                                >
                                    <Image
                                        source={require("../../assets/f3.png")}
                                        style={styles.uploadImage}
                                    />
                                </View>
                            )}


                        </TouchableOpacity>
                    </View>

                    <View style={styles.middle}>
                        <View>
                            <Text style={styles.Admin}>Name :<Text style={styles.hr}>{userData?.name}</Text></Text>
                            <Text style={styles.Admin}>Role Name: <Text style={styles.hr}>{userData?.roleName}</Text></Text>
                            <Text style={styles.Admin}>Employee Code  :<Text style={styles.hr}>{userData?.empCode}</Text></Text>
                        </View>
                        <TouchableOpacity style={styles.for_flex}>
                            <Text style={styles.Admin}>Phone No: </Text>
                            <Feather name="phone" color="#4A5565" size={13} />
                            <Text style={styles.phno}> {userData?.mobileNumber}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* <TouchableOpacity style={[styles.card, styles.card_extra]}>
                    <View style={[styles.left, { backgroundColor: colors.lightskyblue }]}>
                        <Feather name="lock" color="#155DFC" size={15} />
                    </View>
                    <View style={styles.night}>
                        <Text style={styles.Admin}>Change Password</Text>
                        <Text style={styles.hr}>Update your account password</Text>
                    </View>
                </TouchableOpacity> */}

               


                {/* {isAdmin && (
                    <TouchableOpacity style={[styles.card_1, { backgroundColor: "#f4bdeb" }]} onPress={() => navigation.navigate("passwords")}>
                        <FontAwesome5 name="key" color="#fff" size={20} style={[styles.icon_2, { paddingRight: 35 }]} />
                        <Text style={styles.request}>Password Management</Text>
                    </TouchableOpacity>
                )} */}


                {
                    isAdmin && (
                        <TouchableOpacity style={[styles.card, styles.card_extra]} onPress={() => navigation.navigate("passwords")} >
                            <View style={[styles.left, { backgroundColor: colors.lightskyblue }]}>
                                <Feather name="lock" color="#155DFC" size={15} />
                            </View>
                            <View style={styles.night}>
                                <Text style={styles.Admin}>Password Management</Text>
                                <Text style={styles.hr}>To Delete The Product Password</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }






                <TouchableOpacity style={[styles.card_last, styles.card_extra]} onPress={() => setLogoutModal(true)}>
                    <View style={[styles.left, { backgroundColor: colors.lightredcolor }]}>
                        <Feather name="log-out" color="#E7000B" size={15} />
                    </View>
                    <View style={styles.night}>
                        <Text style={styles.Admin_new}>Logout</Text>
                        <Text style={styles.hr}>Sign out of your account</Text>
                    </View>
                </TouchableOpacity>



            </View>
            <Modal
                visible={logoutModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modatTitle}>Are You Sure you want to logout?</Text>

                        {/* cancel button */}
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setLogoutModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* Logout Button    navigation.navigate("Phoneno")*/}
                        <TouchableOpacity style={styles.logoutBtn} onPress={() => { setLogoutModal(false); handleLogOut() }}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    division: {
        flexDirection: 'column',
        gap: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    left: {
        borderRadius: 20,
        //alignItems:'center',
        padding: 10,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
    },
    card: {
        borderWidth: 1,
        borderColor: colors.lightbordercolor,
        borderRadius: 14,
        paddingBottom: 15,
    },
    card_last: {
        borderWidth: 1,
        borderColor: colors.hrhomeprofile,
        borderRadius: 14,
        paddingBottom: 15,

    },
    card_extra: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingTop: 25,
        paddingBottom: 25,
    },
    uploadImage: {
        width: width * 0.35,
        height: width * 0.35,
        borderRadius: (width * 0.35) / 2,
        resizeMode: "cover",
    },
    profile_img: {
        marginVertical: 30,
        alignItems: 'center'
    },
    circle: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
    },
    middle: {
        alignItems: 'center',
        flexDirection: 'column',
        gap: 5,
    },
    Admin: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    Admin_new: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.commoncolor,
        fontFamily: fonts.sfmedium,
    },
    hr: {
        color: colors.foundationgray,
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phno: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: 'center',
    },
    modalBox: {
        width: "80%",
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        elevation: 10,
    },
    modatTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 20,
        textAlign: 'center',
        color: colors.black,

    },
    cancelBtn: {
        width: "100%",
        padding: 12,
        backgroundColor: colors.inputfieldborder,
        borderRadius: 8,
        marginBottom: 10,
    },
    cancelText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfbold,
    },
    logoutBtn: {
        width: "100%",
        padding: 12,
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
    },
    logoutText: {
        color: colors.white,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 500,
        fontFamily: fonts.sfbold,
    },
    card_1: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingTop: 32,
        // paddingBottom: 32,
        // paddingLeft: 10,
        // paddingRight: 10,
        // borderRadius: 10,
        // marginBottom: 15,
        // shadowColor: colors.black,
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 8,
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 25,
        borderRadius: 10,

    },





})
export default ProfileScreen

