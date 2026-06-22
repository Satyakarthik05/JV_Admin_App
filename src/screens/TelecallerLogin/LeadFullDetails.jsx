// import React, { useCallback } from "react";
// import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from "react-native";
// import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
// import { colors, fonts } from "../../config/theme";
// import Feather from 'react-native-vector-icons/Feather';
// import { SafeAreaView } from "react-native-safe-area-context";
// import { responsiveHeight } from "react-native-responsive-dimensions";
// import { useDispatch, useSelector } from "react-redux";
// import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";

// const LeadFullDetails = () => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();

//     const route = useRoute();
//     const { TotalData } = route.params;
//     console.log("Lead Data------>", TotalData);


//     const formatDate = (date) => {
//         if (!date) return 'N/A';
//         return new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
//     };



//     useFocusEffect(
//         useCallback(() => {
//             StatusBar.setBackgroundColor(colors.white);
//             StatusBar.setBarStyle("dark-content");
//             dispatch(GetRegesteredData())
//         }, [])
//     )

//     const { getEmpdata } = useSelector((state) => state.GetEmp);
//     console.log("Get Employees List Data---->All Employee Data", getEmpdata);

//     const telecallerName = getEmpdata?.find(
//         (emp) => emp.id === TotalData?.telecallerId && emp.roleName === "TELECALLER"
//     )?.name;

//     return (


//         <View style={styles.container}>

//             <SafeAreaView >
//                 <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
//                     <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
//                     <Text style={styles.title}>Lead Details</Text>
//                 </TouchableOpacity>
//             </SafeAreaView>


//             <View style={styles.card}>

//                 <Text style={styles.label}>Lead Code</Text>
//                 <Text style={styles.value}>{TotalData?.leadCode}</Text>

//                 <Text style={styles.label}>Customer Name</Text>
//                 <Text style={styles.value}>{TotalData?.customerName}</Text>

//                 <Text style={styles.label}>Mobile Number</Text>
//                 <Text style={styles.value}>{TotalData?.mobileNumber}</Text>

//                 <Text style={styles.label}>Alternate Number</Text>
//                 <Text style={styles.value}>{TotalData?.alternateNumber}</Text>

//                 <Text style={styles.label}>Email</Text>
//                 <Text style={styles.value}>{TotalData?.emailId}</Text>

//                 <Text style={styles.label}>Lead Source</Text>
//                 <Text style={styles.value}>{TotalData?.leadSource}</Text>

//                 <Text style={styles.label}>Telecaller Name</Text>
//                 <Text style={styles.value}>{telecallerName || 'N/A'}</Text>


//                 <Text style={styles.label}>Address</Text>
//                 <Text style={styles.value}>{TotalData?.address}</Text>

//                 <Text style={styles.label}>Area Location</Text>
//                 <Text style={styles.value}>{TotalData?.areaLocation}</Text>

//                 <Text style={styles.label}>Lead Status</Text>
//                 <Text style={styles.value}>{TotalData?.leadStatus}</Text>

//                 <Text style={styles.label}>Created Date</Text>
//                 <Text style={styles.value}>{formatDate(TotalData?.leadCreatedDate)}</Text>

//                 <Text style={styles.label}>Remarks</Text>
//                 <Text style={styles.value}>{TotalData?.remarks || 'N/A'}</Text>

//             </View>

//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.white,
//         paddingHorizontal: 12,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         // paddingTop: 10,
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 700,
//         color: colors.black,
//         marginLeft: 8,
//         fontFamily: fonts.sfbold,
//     },
//     // heading: {
//     //     fontSize: 18,
//     //     fontWeight: '700',
//     //     color: colors.black,
//     //     marginBottom: 15,
//     //     fontFamily: fonts.sfbold,
//     // },
//     card: {
//         backgroundColor: colors.white,
//         borderRadius: 10,
//         padding: 15,
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         marginTop: responsiveHeight(1),
//     },
//     label: {
//         fontSize: 13,
//         color: colors.foundationgray,
//         marginTop: 10,
//         fontFamily: fonts.sfmedium,
//     },
//     value: {
//         fontSize: 15,
//         color: colors.black,
//         fontWeight: '600',
//         fontFamily: fonts.sfmedium,
//     }
// });

// export default LeadFullDetails;




import React, { useCallback, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    RefreshControl
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from "react-native-safe-area-context";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { GetRegesteredData } from "../../redux/reducers/HRLogin/Empreg";

const LeadFullDetails = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const { TotalData } = route.params;

    const [refreshing, setRefreshing] = useState(false);



    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetRegesteredData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white);
            StatusBar.setBarStyle("dark-content");
            dispatch(GetRegesteredData());
        }, [])
    );

    const { getEmpdata } = useSelector((state) => state.GetEmp);

    const telecallerName = getEmpdata?.find(
        (emp) =>
            emp.id === TotalData?.telecallerId &&
            emp.roleName === "TELECALLER"
    )?.name;

    //  Reusable Row Component
    const RowItem = ({ label, value, isStatus }) => (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text
                style={[
                    styles.rowValue,
                    isStatus && {
                        color: value === "Yes" ? "green" : "red"
                    }
                ]}
            >
                {value || 'N/A'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>

            <SafeAreaView>
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={24} color="#000" />
                    <Text style={styles.title}>Lead Details</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.black]}
                        tintColor={colors.commoncolor}
                    />
                }
            >

                <View style={styles.card}>

                    <RowItem label="Lead Code" value={TotalData?.leadCode} />
                    <RowItem label="Customer Name" value={TotalData?.customerName} />
                    <RowItem label="Mobile Number" value={TotalData?.mobileNumber} />
                    <RowItem label="Alternate Number" value={TotalData?.alternateNumber} />
                    <RowItem label="Email" value={TotalData?.emailId} />
                    <RowItem label="Lead Source" value={TotalData?.leadSource} />
                    <RowItem label="Telecaller Name" value={telecallerName} />
                    <RowItem label="Address" value={TotalData?.address} />
                    <RowItem label="Area Location" value={TotalData?.areaLocation} />
                    <RowItem label="Lead Status" value={TotalData?.leadStatus} isStatus />
                    <RowItem label="Created Date" value={formatDate(TotalData?.leadCreatedDate)} />
                    <RowItem label="Remarks" value={TotalData?.remarks} />

                </View>

            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 15,
        elevation: 4,
        marginHorizontal: 1, // ✅ add this
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginTop: responsiveHeight(1),
    },

    // ✅ Row Styles
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingBottom: 6,
    },
    rowLabel: {
        fontSize: 13,
        color: colors.foundationgray,
        fontFamily: fonts.sfmedium,
        width: '40%',
    },
    rowValue: {
        fontSize: 14,
        color: colors.black,
        fontWeight: '600',
        fontFamily: fonts.sfmedium,
        width: '60%',
        textAlign: 'right',
    },
});

export default LeadFullDetails;

