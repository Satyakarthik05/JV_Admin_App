import React, { useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Linking,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import commonstyles from "../../commonstyles/commonstyles";

const { width } = Dimensions.get("window");

const EmployeeDetailsScreen = ({ route, navigation }) => {
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        })
    )


    const employee = route?.params?.data;
    console.log("Employee data from params--------------->", employee);


    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-GB");
    };

    // const openDocument = async (url) => {
    //     const supported = await Linking.canOpenURL(url);

    //     if (supported) {
    //         await Linking.openURL(url);
    //     } else {
    //         Alert.alert("Error", "Cannot open this document");
    //     }
    // };
    const openDocument = async (url) => {
        try {
            console.log("Opening:", url);
            await Linking.openURL(url); //  directly open
        } catch (error) {
            console.log("Error:", error);
            Alert.alert("Error", "Cannot open this document");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Employee Details</Text>
                <View style={{ width: 24 }} /> */}

            <SafeAreaView >
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Employee Details</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Basic Info Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Employee Code</Text>
                        <Text style={styles.label}>Name</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.value}>{employee?.empCode}</Text>
                        <Text style={styles.value}>{employee?.name}</Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Mobile</Text>
                        <Text style={styles.label}>Email</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.value}>{employee?.mobileNumber}</Text>
                        <Text style={styles.value}>{employee?.emailId}</Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Gender</Text>
                        <Text style={styles.label}>Password</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.value}>{employee?.gender}</Text>
                        <Text style={styles.value}>{employee?.password}</Text>
                    </View>

                </View>

                {/* Role & Department */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Work Details</Text>


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Role</Text>
                        <Text style={styles.label}>Department</Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.value}>{employee?.roleName}</Text>
                        <Text style={styles.value}>{employee?.department}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Salary</Text>
                        <Text style={styles.label}>Working Hours</Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.value}>₹ {employee?.salary}</Text>
                        <Text style={styles.value}>{employee?.workingHours}</Text>
                    </View>

                </View>

                {/* Dates */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Dates</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>Joining Date</Text>
                        <Text style={styles.label}>Date of Birth</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.value}>
                            {formatDate(employee?.joiningDate)}
                        </Text>

                        <Text style={styles.value}>
                            {formatDate(employee?.dateOfBirth)}
                        </Text>
                    </View>

                </View>

                {/* Address */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Address</Text>
                    <Text style={styles.value}>{employee?.address}</Text>
                </View>

                {/* For Profile Image */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <View style={{ alignItems: "center", marginTop: 15 }}>

                        <Image
                            source={{
                                uri: employee?.profile
                                    ? employee.profile
                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                            }}
                            style={styles.profileImage}
                        />
                    </View>
                </View>

                {/* Documents */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Documents</Text>

                    {/* <View style={styles.imageContainer}>
                        {employee?.documents?.map((doc, index) => (
                            <Image
                                key={index}
                                source={{ uri: doc.documentPath }}
                                style={styles.image}
                            />
                        ))}
                    </View> */}

                    <View style={styles.imageContainer}>
                        {employee?.documents?.length > 0 ? (
                            employee.documents.map((doc, index) => {
                                const isPDF = doc.documentName?.toLowerCase().endsWith(".pdf");

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.documentBox}
                                        onPress={() => openDocument(doc.documentPath)}
                                    >
                                        {isPDF ? (
                                            <Feather name="file-text" size={40} color="#C62828" />
                                        ) : (
                                            <Image
                                                source={{ uri: doc.documentPath }}
                                                style={styles.image}
                                            />
                                        )}
                                        <Text numberOfLines={1} style={styles.docName}>
                                            {doc.documentName}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <Text style={{ color: "#999" }}>No documents uploaded</Text>
                        )}
                    </View>

                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

export default EmployeeDetailsScreen;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: "#fff",
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,

    },
    // header: {
    //     height: 60,
    //     backgroundColor: colors.commoncolor,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     paddingHorizontal: 12,
    // },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingTop: responsiveHeight(1),
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    card: {
        backgroundColor: "#fff",
        margin: 12,
        padding: 15,
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#C62828",
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#C62828",
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        color: "#C62828",
        marginTop: 8,
    },
    value: {
        fontSize: 15,
        color: "#333",
        fontWeight: "500",
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    image: {
        width: width / 3.5,
        height: width / 3.5,
        borderRadius: 8,
        margin: 5,
        borderWidth: 2,
        borderColor: "#C62828",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: "#C62828",
    },
    documentBox: {
        width: width / 3.2,
        alignItems: "center",
        margin: 8,
    },

    docName: {
        fontSize: 12,
        marginTop: 5,
        textAlign: "center",
        color: "#333",
    },


});
