// import React from "react";
// import { View, Text, Image, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import commonstyles from "../../commonstyles/commonstyles";
// import Feather from "react-native-vector-icons/Feather";
// import Ionicons from "react-native-vector-icons/Ionicons"
// import { colors } from "../../config/theme";
// import Entypo from "react-native-vector-icons/Entypo";
// import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
// const SaleProfile = () => {
//     return (
//         <SafeAreaView style={[commonstyles.mainContainer]}>
//             <View style={[commonstyles.row1, { gap: 12, marginVertical: 12 }]}>
//                 <Feather name="arrow-left" size={24} color={colors.black} />
//                 <Text style={[commonstyles.assignText]}>Profile</Text>
//             </View>
//             <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{paddingBottom:30,marginVertical:5}}
//             >
//                 <View style={[commonstyles.card, { marginHorizontal: 12 }]}>
//                     <View style={[commonstyles.profileContainer]}>
//                         <Image source={require("../../assets/f1.png")} resizeMode="contain" />
//                         <Text style={[commonstyles.header1]}>Admin User</Text>
//                         <Text style={[commonstyles.text1]}>SO</Text>
//                         <View style={[commonstyles.row1]}>
//                             <Ionicons name="call-outline" size={22} color={colors.foundationgray} />
//                             <Text>+91 9387977399</Text>
//                         </View>
//                     </View>
//                 </View>

//                 <View style={[commonstyles.card, { backgroundColor: colors.hrhomegreen, marginVertical: 16, marginHorizontal: 12 }]}>
//                     <View style={[commonstyles.row1, { gap: 16, padding: 16 }]}>
//                         <Feather name="user-check" size={24} color={colors.simplegreen} />
//                         <Text style={[commonstyles.text3]}>My Attendance</Text>
//                     </View>
//                 </View>
//                 <View style={[commonstyles.card, { backgroundColor: colors.hrhomenewviolet, marginHorizontal: 12 }]}>
//                     <View style={[commonstyles.row1, { gap: 16, padding: 16 }]}>
//                         <FontAwesome6 name="door-open" size={24} color={colors.homepink} />
//                         <Text style={[commonstyles.text3]}>My Leaves</Text>
//                     </View>
//                 </View>
//                 <View style={[commonstyles.card, { backgroundColor: colors.hrhomeviolate, marginVertical: 12, marginHorizontal: 12 }]}>
//                     <View style={[commonstyles.row1, { gap: 16, padding: 16 }]}>
//                         <Entypo name="wallet" size={24} color={colors.simpleviolet} />
//                         <Text style={[commonstyles.text3]}>My Expenses</Text>
//                     </View>
//                 </View>

//                 <View style={[commonstyles.card, { marginVertical: 16, marginHorizontal: 12 }]}>
//                     <View style={[commonstyles.row1, { gap: 16 }]}>
//                         <View>
//                             <Feather name="lock" size={24} color={colors.lockblue} />
//                         </View>
//                         <View>
//                             <Text style={[commonstyles.text4]}>Change Password</Text>
//                             <Text style={[commonstyles.text5]}>Update your account password</Text>
//                         </View>

//                     </View>
//                 </View>

//                 <View style={[commonstyles.card, { marginHorizontal: 12, borderWidth: 1, borderColor: colors.simpleredborder,padding:17 }]}>
//                     <View style={[commonstyles.row1, { gap: 16 }]}>
//                         <View>
//                             <Entypo name="log-out" size={24} color={colors.thickred} />
//                         </View>
//                         <View>
//                             <Text style={[commonstyles.text4, { color: colors.thickred }]}>Logout</Text>
//                             <Text style={[commonstyles.text5]}>Sign out of your account</Text>
//                         </View>

//                     </View>
//                 </View>
//             </ScrollView>


//         </SafeAreaView>
//     )
// }
// export default SaleProfile;


















import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, Modal } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors, fonts } from "../../config/theme";

const { height, width } = Dimensions.get('window')
const TelecallerProfile = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation();
    const size = width * 0.35;


    const handleUploadImage = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancle) {
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
    
    

    useFocusEffect(
        useCallback(()=>{
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content")
        })
    )

    const [logoutModal,setLogoutModal]=useState(false);

    const handleLogOut=()=>{
        setLogoutModal(false);
        navigation.navigate("Signin");
    }
//LoginScreen

    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" /> */}

            <SafeAreaView>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Profile</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.division}>
                    <View style={styles.card}>
                        <View style={styles.profile_img}>
                            <TouchableOpacity onPress={handleUploadImage}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage }}
                                        style={styles.uploadImage}
                                    />

                                ) : (
                                    <View style={[styles.circle, { height: size, width: size, borderRadius: size / 2 }]}>
                                        <Image source={require('../../assets/f3.png')} style={styles.uploadImage} />
                                    </View>
                                )}

                            </TouchableOpacity>
                        </View>

                        <View style={styles.middle}>
                            <View>
                                <Text style={styles.Admin}>Admin User</Text>
                                <Text style={styles.hr}>TeleCaller</Text>
                            </View>
                            <TouchableOpacity style={styles.for_flex}>
                                <Feather name="phone" color="#4A5565" size={13} />
                                <Text style={styles.phno}>  +91 9345678900</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.new_Data}>
                        <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomegreen }]}  onPress={()=>navigation.navigate("MyAttendance")}>
                            <FontAwesome6 name="user-check" size={20} color="#00A63E" style={styles.icon_2} />
                            <Text style={styles.request}>My Attendance</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomenewviolet }]} onPress={()=>navigation.navigate("MyLeave")}>
                            <FontAwesome name="folder-open-o" size={20} color="#E60076" style={styles.icon_2} />
                            <Text style={styles.request}>My Leave</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.card_1, { backgroundColor: colors.hrhomeviolate }]} onPress={()=>navigation.navigate("Myexpenses")}>
                            <FontAwesome name="file-photo-o" size={20} color="#9810FA" style={styles.icon_2} />
                            <Text style={styles.request}>My Expenses</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={[styles.card, styles.card_extra]}>
                        <View style={[styles.left, { backgroundColor: colors.lightskyblue }]}>
                            <Feather name="lock" color="#155DFC" size={15} />
                        </View>
                        <View style={styles.night}>
                            <Text style={styles.Admin}>Change Password</Text>
                            <Text style={styles.hr}>Update your account password</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.card_last, styles.card_extra]} onPress={()=>setLogoutModal(true)} activeOpacity={1}>
                        <View style={[styles.left, { backgroundColor: colors.lightredcolor }]}>
                            <Feather name="log-out" color="#E7000B" size={15} />
                        </View>
                        <View style={styles.night}>
                            <Text style={styles.Admin_new}>Logout</Text>
                            <Text style={styles.hr}>Sign out of your account</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
            visible={logoutModal}
            transparent
            animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modatTitle}>Are You Sure you want to logout?</Text>

                        {/* cancel button */}
                        <TouchableOpacity style={styles.cancelBtn} onPress={()=>setLogoutModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* Logout Button    navigation.navigate("Phoneno")*/}
                        <TouchableOpacity style={styles.logoutBtn} onPress={()=>{setLogoutModal(false);handleLogOut()}}>
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
    new_Data:{
        paddingHorizontal:4,
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
        paddingTop: 10,
        marginBottom: 15,
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
        marginBottom:20,

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

    card_1: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor:colors.black,
        shadowOpacity:0.1,
        shadowRadius:8,
        elevation:8,
        
    },
    request: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 500,
        color: colors.black,
        fontFamily:fonts.sfmedium,
    },
    icon_2: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    modalBackground:{
        flex:1,
        backgroundColor:"rgba(0,0,0,0.5)",
        justifyContent:"center",
        alignItems:'center',
    },
    modalBox:{
        width:"80%",
        backgroundColor:colors.white,
        padding:20,
        borderRadius:12,
        alignItems:"center",
        elevation:10,
    },
    modatTitle:{
        fontSize:18,
        fontWeight:600,
        marginBottom:20,
        textAlign:'center',
        
    },
    cancelBtn:{
        width:"100%",
        padding:12,
        backgroundColor:colors.inputfieldborder,
        borderRadius:8,
        marginBottom:10,
    },
    cancelText:{
        textAlign:"center",
        fontSize:16,
        fontWeight:500,
        fontFamily:fonts.sfbold,
    },
    logoutBtn:{
        width:"100%",
        padding:12,
        backgroundColor:colors.commoncolor,
        borderRadius:8,
    },
    logoutText:{
        color:colors.white,
        textAlign:'center',
        fontSize:16,
        fontWeight:500,
        fontFamily:fonts.sfbold,
    },


})
export default TelecallerProfile