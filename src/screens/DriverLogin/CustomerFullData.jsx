import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, StatusBar, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import commonstyles from "../../commonstyles/commonstyles";

const CustomerfullDetails = () => {
    const route = useRoute();
    const { customersData } = route.params;
    console.log("customer data cooming from params------------>", customersData);
    const navigation=useNavigation();


    return (
        <ScrollView style={styles.container}>

            <View style={styles.sec_1}>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Customer Details </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            {/* Card */}
            <View style={commonstyles.card}>

                {/* Image */}
                <Image
                    source={{ uri: customersData.photo }}
                    style={styles.image}
                />

                {/* Shop Name */}
                <Text style={styles.shopName}>{customersData.shopName}</Text>
                <Text style={styles.owner}>Owner: {customersData.ownerName}</Text>

                {/* Info Section */}
                <View style={styles.row}>
                    <Text style={styles.label}>Mobile:</Text>
                    <Text style={styles.value}>{customersData.mobile}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Type:</Text>
                    <Text style={styles.value}>{customersData.customerType}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Shop Type:</Text>
                    <Text style={styles.value}>{customersData.shopType}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Opening Balance:</Text>
                    <Text style={styles.value}>₹ {customersData.openingBalance}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Outstanding:</Text>
                    <Text style={[styles.value, { color: "red" }]}>
                        ₹ {customersData.outstandingAmount}
                    </Text>
                </View>

                {/* Address */}
                <Text style={styles.sectionTitle}>Address</Text>

                <Text style={styles.address}>
                    {customersData.doorNo}, {customersData.street},{"\n"}
                    {customersData.area},{"\n"}
                    {customersData.city} - {customersData.pincode}
                </Text>

                {/* Notes */}
                {customersData.notes ? (
                    <>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <Text style={styles.notes}>{customersData.notes}</Text>
                    </>
                ) : null}

            </View>
        </ScrollView>
    );
};

export default CustomerfullDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        padding: 12,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 4,
    },

    image: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 12,
    },

    shopName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111",
    },

    owner: {
        fontSize: 14,
        color: "#555",
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },

    label: {
        fontSize: 14,
        color: "#666",
    },

    value: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111",
    },

    sectionTitle: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: "bold",
        color: "#333",
    },

    address: {
        fontSize: 13,
        color: "#444",
        marginTop: 4,
        lineHeight: 18,
    },

    notes: {
        fontSize: 13,
        color: "#444",
        marginTop: 4,
    },
});
