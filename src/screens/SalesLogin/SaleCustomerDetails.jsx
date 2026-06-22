import React, { useCallback, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import commonstyles from "../../commonstyles/commonstyles";
import { launchImageLibrary } from "react-native-image-picker";
Recentsales = [
    { id: 1, title: 'sale', date: 'Nov 25,2024', payment: '1,500' },
    { id: 2, title: 'payment', date: 'Nov 25,2024', payment: '1,400' },
    { id: 3, title: 'sale', date: 'Nov 25,2024', payment: '1,400' },
    { id: 4, title: 'sale', date: 'Nov 25,2024', payment: '1,500' },
    { id: 5, title: 'sale', date: 'Nov 25,2024', payment: '1,500' },
    { id: 6, title: 'sale', date: 'Nov 25,2024', payment: '1,500' },

]
const SaleCustomerDetails = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [reason, setReason] = useState('');
    const [photo, setPhoto] = useState(null);
    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.7,
            },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    console.log('ImagePicker Error:', response.errorMessage);
                    return;
                }

                const uri = response.assets[0].uri;
                setPhoto(uri);
            }
        );
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.saleNameContainer}>
                <Text style={styles.saletitle}>{item.title}</Text>
                <View style={styles.dateContainer1}>
                    <Text style={styles.DataText}>{item.date}</Text>
                    <Text style={styles.paymentText}>+ {'\u20B9'}{item.payment}</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

            </View>


        )
    }

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )

    return (
        <>
            <SafeAreaView style={styles.Maincontainer}>
                <View style={styles.ListContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={22} color={colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.ListText}>Customer Details</Text>
                </View>

                <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf' }} />

                <View style={styles.StoreContainer}>
                    <Text style={styles.storeText}>Sai Kiran Store</Text>
                    <View style={styles.callContainer}>
                        <Ionicons name="call-outline" size={22} color="#292D32" />
                        <Text style={[commonstyles.text1]}>9513583776</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-clear-outline" size={22} color={colors.dateColor} />
                        <Text style={[commonstyles.text1]} >Last Order:15 cans on 25 Nov</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: '#cfcfcf', marginTop: 5 }} />
                </View>

                <View style={styles.OutstandingContainer}>
                    <Text style={styles.outstandingText}>{'\u20B9'} Outstanding</Text>
                    <Text style={styles.outstandingText}>{'\u20B9'}2,300</Text>
                </View>

                <TouchableOpacity style={styles.shoppingContainer} onPress={() => navigation.navigate("SaleCreateSale")}>
                    <View>
                        <FontAwesome5 name="shopping-cart" size={22} color="#ffffff" />
                    </View>
                    <View style={styles.saleContainer}>
                        <Text style={styles.saleText}>Create Sale</Text>
                        <Text style={styles.saleText1}>Add new order for customer</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shoppingContainer1} onPress={() => navigation.navigate("SaleRecordPayment")}>
                    <View>
                        <MaterialIcons name="payments" size={22} color="#ffffff" />
                    </View>
                    <View style={styles.saleContainer}>
                        <Text style={styles.saleText}>Record Payment</Text>
                        <Text style={styles.saleText1}>Collect outstanding payment</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity style={styles.shoppingContainer2} onPress={() => setModalVisible(true)}>
                    <View>
                        <FontAwesome6 name="delete-left" size={22} color="#ffffff" />
                    </View>
                    <View style={styles.saleContainer}>
                        <Text style={styles.saleText}>Visit Lead</Text>
                        <Text style={styles.saleText1}>Record visit without sale</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.recentActive}>Recent Activity</Text>
                    <FlatList
                        data={Recentsales}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}

                    />
                </View>

            </SafeAreaView>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                        <Text style={styles.modalTitle}>No Sale Reason</Text>

                        {/* Reason Input */}
                        <TextInput placeholder="Enter reason" value={reason} onChangeText={setReason} style={styles.input} placeholderTextColor="#999" multiline />

                        {/* Upload Photo */}
                        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}  >
                            <Text style={styles.uploadText}>{photo ? 'Change Photo' : 'Upload Photo'}</Text>
                        </TouchableOpacity>

                        {photo && (
                            <Image source={{ uri: photo }} style={styles.previewImage} />
                        )}

                        {/* Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.submitBtn} onPress={() => { console.log(reason, photo); setModalVisible(false); }} >
                                <Text style={styles.btnText}>Submit</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </>
    )
};
const styles = StyleSheet.create({
    Maincontainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    ListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 10,
        marginVertical: 10,

    },
    ListText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F1724'
    },
    StoreContainer: {
        marginVertical: 20,
        marginHorizontal: 14,
    },
    callContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 5,
    },
    storeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 5,
    },
    OutstandingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        backgroundColor: '#FEF2F2',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 8,
    },
    outstandingText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#E7000B',
    },
    // shoppingContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#3A77FB',
    //     width: responsiveWidth(95),
    //     height: responsiveHeight(8),
    //     padding: 20,
    //     marginHorizontal: 10,
    //     gap: 16,
    //     borderRadius: 14,
    //     marginVertical: 13,
    // },
    // shoppingContainer1: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#00A63E80',
    //     width: responsiveWidth(95),
    //     height: responsiveHeight(8),
    //     padding: 20,
    //     marginHorizontal: 10,
    //     gap: 16,
    //     borderRadius: 14,
    //     marginBottom: 13,

    // },
    // shoppingContainer2: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#767676',
    //     width: responsiveWidth(95),
    //     height: responsiveHeight(8),
    //     padding: 20,
    //     marginHorizontal: 10,
    //     gap: 16,
    //     borderRadius: 14,
    // },
    shoppingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3A77FB',
        width: responsiveWidth(95),
        paddingVertical: 14,   //  instead of height
        paddingHorizontal: 16,
        marginHorizontal: 10,
        gap: 16,
        borderRadius: 14,
        marginVertical: 13,
    },
    shoppingContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00A63E80',
        width: responsiveWidth(95),
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        gap: 16,
        borderRadius: 14,
        marginBottom: 13,
    },
    shoppingContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#767676',
        width: responsiveWidth(95),
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        gap: 16,
        borderRadius: 14,
    },
    saleContainer: {
        gap: 4
    },
    saleText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700'
    },
    saleText1: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '400'
    },
    card: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 14,
        elevation: 5,
    },
    recentActive: {
        fontSize: 16,
        fontWeight: '600',
        color: '#101828',
    },
    saleNameContainer: {
        paddingHorizontal: 10,
    },
    dateContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    saletitle: {
        fontSize: 18,
        color: '#000',
        fontWeight: '400',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        // backgroundColor: '#000',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        // width:'100%'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        minHeight: 80,
        marginBottom: 12,
        textAlignVertical: 'top',
    },
    uploadBtn: {
        borderWidth: 1,
        borderColor: '#ff3b30',
        borderRadius: 6,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    uploadText: {
        color: '#ff3b30',
        fontWeight: '600',
    },
    previewImage: {
        height: 120,
        borderRadius: 6,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#aaa',
        padding: 12,
        borderRadius: 6,
        marginRight: 8,
        alignItems: 'center',
    },
    submitBtn: {
        flex: 1,
        backgroundColor: '#ff3b30',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
    },
    paymentText: {
        color: colors.btntextgreen,
        fontSize: 14,
        fontWeight: '400',
        fontFamily: fonts.sfmedium,
    },


})
export default SaleCustomerDetails;