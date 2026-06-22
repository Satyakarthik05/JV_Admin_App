import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Linking, RefreshControl, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { responsiveHeight } from "react-native-responsive-dimensions";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ReportData } from "../../redux/reducers/TelecallerLogin/AddCallers";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const FollowUpReport = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const today = new Date();
    const formateDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const [from, setFrom] = useState(formateDate(today));
    const [todate, setTodate] = useState(formateDate(today));

    const [showFromDate, setShowFromDate] = useState(false);
    const [showToDate, setShowToDate] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const Fromdatefun = (event, selected) => {
        setShowFromDate(false);
        if (selected) {
            setFrom(formateDate(selected));
        }
    };

    const Todatefun = (event, selected) => {
        setShowToDate(false);
        if (selected) {
            setTodate(formateDate(selected));
        }
    };


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )




    useEffect(() => {
        if (!from || !todate) return;
        const payload = {
            fromDate: from,
            toDate: todate
        };
        console.log("Auto API Payload --->", payload);
        dispatch(ReportData(payload));
    }, [from, todate]);


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(ReportData({
                fromDate: from,
                toDate: todate
            })).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };



    const { report, loading } = useSelector((state) => state.FollowUpsReportData);
    console.log("reports Data -------------->", report);

    const validReport = (report || []).filter(
        (item) => item && item.id && item.mobileNumber
    );  // if there is no data on thatd dats it will give  give data with null  in that case it will show empty card so that we are  showing some message



    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Follow-Up Report</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <View style={styles.searchBar_view}>
                <View style={styles.header}>
                    <TextInput placeholder="From  Date" editable={false} style={styles.name} placeholderTextColor="#888" value={from} />
                    <Text style={styles.in_time}>  to:  </Text>
                    <TextInput value={todate} placeholder="To Date" editable={false} style={styles.name} placeholderTextColor="#888" />
                </View>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => setShowFromDate(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={styles.calender_icon} />
                        {/* <Text>From   </Text>  */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowToDate(true)}>
                        <Ionicons name="calendar-clear-outline" size={15} color="#82889A" style={{ marginLeft: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1, marginTop: 10 }}>
                <FlatList
                    //data={report}
                    //keyExtractor={(item) => item.id.toString()}
                    data={validReport}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    // refersh Controller
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.black]} // Android
                            tintColor={colors.inputfieldborder} // iOS
                        />
                    }


                    ListEmptyComponent={() => {
                        if (loading) {
                            return (
                                <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
                            );
                        }

                        return (
                            <Text style={{ textAlign: "center", marginTop: 20 }}> No Follow-Up Data Found </Text>
                        );
                    }}



                    renderItem={({ item }) => {
                        return (
                            <View style={styles.card}>

                                <View style={styles.rowBetween}>
                                    <Text style={styles.name}>{item.customerName}</Text>
                                    <Text style={styles.status}>{item.leadStatus}</Text>
                                </View>

                                <Text style={styles.subText}>{item.address}</Text>
                                <Text style={styles.subText}>MobileNumber: {item.mobileNumber}</Text>
                                {/* <Text style={styles.subText}>alternateNumber: {item.alternateNumber}</Text> */}
                                <View style={styles.actionRow}>
                                    {/* Call Button */}
                                    <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.mobileNumber}`)} >
                                        <Feather name="phone" size={16} color="#fff" />
                                        <Text style={styles.btnText}>Call Now</Text>
                                    </TouchableOpacity>

                                    {/* WhatsApp Button */}
                                    <TouchableOpacity style={styles.whatsappBtn} onPress={() => Linking.openURL(`whatsapp://send?phone=${item.mobileNumber}`)} >
                                        <FontAwesome name="whatsapp" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>



                            </View>
                        )
                    }}
                />
            </View>







            {showFromDate && (
                <DateTimePicker
                    value={new Date(from)}
                    mode="date"
                    display="default"
                    onChange={Fromdatefun}
                    maximumDate={new Date()}
                />
            )}

            {showToDate && (
                <DateTimePicker
                    value={new Date(todate)}
                    mode="date"
                    display="default"
                    onChange={Todatefun}
                    //maximumDate={new Date()}
                    minimumDate={new Date()}
                />
            )}

        </View>
    )
}
export default FollowUpReport

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: colors.white,
        //gap: responsiveHeight(1),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        zIndex: 1,//new
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    searchBar_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1.5),
        borderWidth: 1.5,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        paddingHorizontal: 10,
        //paddingVertical: 10,
        //width: width * 0.89,
        marginRight: 5,
    },
    name: {
        fontSize: 15,
        fontWeight: 800,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    calender_icon: {
        paddingRight: 15,
    },
    in_time: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
    },

    //cards data
    card: {
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        margin: responsiveHeight(1),
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.black,
        fontFamily: fonts.sfbold,
    },
    subText: {
        fontSize: 14,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
        marginTop: 2,
    },
    label: {
        fontSize: 13,
        color: colors.graynew,
    },
    value: {
        fontSize: 13,
        color: colors.black,
    },
    status: {
        fontSize: 12,
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },

    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        gap: 10,
    },

    callBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.commoncolor, // Blue
        paddingVertical: 10,
        borderRadius: 8,
        elevation: 3,
    },

    whatsappBtn: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#25D366", // WhatsApp green
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },

    btnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 6,
    },


})