import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, View, TouchableOpacity, Text, FlatList, Dimensions } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import { GetCallLogs } from "../../redux/reducers/TelecallerLogin/AddCallers";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import commonstyles from "../../commonstyles/commonstyles";




const Calllogdetails = () => {
    const navigation = useNavigation();
    const { height, width } = Dimensions.get("window");
    const dispatch = useDispatch();

    const route = useRoute();
    const { LeadData } = route.params;
    console.log("Lead Data in CallLog details", LeadData);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            //await dispatch(GetCallLogs()).unwrap();
            await dispatch(GetCallLogs(id)).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };

    const id = LeadData?.id;
    useFocusEffect(
        useCallback(() => {

            const fetchData = async () => {
                StatusBar.setBackgroundColor(colors.white);
                StatusBar.setBarStyle("dark-content");
                setLoading(true);
                if (id) {
                    await dispatch(GetCallLogs(id)).unwrap();
                    setLoading(false);
                }
            }
            fetchData();

        }, [id])
    )

    const { GetCallLogsData } = useSelector((state) => state.GetCallLogsDataCall);
    console.log('Get Call Logs Data--------->', GetCallLogsData);


    const NoDataFound = () => (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: colors.foundationgray }}>No Call Logs Found</Text>
        </View>
    );


    return (
        <View style={styles.container}>

            <SafeAreaView >
                <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={commonstyles.title}>Call Log Details</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("AddCallLog", { ParamsData: LeadData, CallLogsData: GetCallLogsData })}>
                <Feather name="plus" size={14} color="#fff" />
                <Text style={styles.btn_text}>Add Call Log</Text>
            </TouchableOpacity>




            <View style={styles.cards_begin}>
                {
                    loading ? (
                        <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            <ProductSkeleton />
                        </View>
                    ) : (
                        <FlatList
                            data={GetCallLogsData}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 180 }}

                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}
                            ListEmptyComponent={!loading ? <NoDataFound /> : null}  // Show when no data & not loading
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.card}>
                                        <View style={styles.for_flex}>
                                            <Text style={styles.id}>{item.leadCode}</Text>
                                            {/* <Text style={styles.interested}>{item.callOutcome}</Text> */}
                                            {/* <Text style={styles.btn_new}>{item.actionRequired}</Text> */}
                                            <Text style={styles.btn_new}>{item.callType}</Text>
                                        </View>
                                        <Text style={styles.date}>Call Date: {new Date(item.callDate).toLocaleDateString('en-GB').replace(/\//g, '-')}</Text>
                                        <View style={styles.for_flex}>
                                            <Text style={styles.out}>Call type: {item.callType}</Text>
                                            <Text style={styles.id}>{item.action}</Text>
                                        </View>
                                        <Text style={styles.out}>Call Time: {item.callTime}</Text>
                                        <View style={styles.for_flex}>
                                            <Text style={[styles.color, { width: width * 0.65 }]}>{item.discussionSummary}</Text>

                                        </View>

                                        {/* QA List */}
                                        {item.qaList && item.qaList.length > 0 && (
                                            <View style={{ marginTop: 10 }}>
                                                {item.qaList.map((qa, index) => (
                                                    <View key={qa.id} style={{ marginBottom: 5 }}>
                                                        <Text style={{ fontWeight: '600', color: colors.black }}>
                                                            {index + 1}. {qa.question}
                                                        </Text>
                                                        <Text style={{ color: colors.foundationgray, marginLeft: 10 }}>
                                                            Ans: {qa.answer}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}

                                    </View>
                                )
                            }}
                        />
                    )
                }

            </View>

        </View>
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
        paddingTop: 10,
    },
    color: {
        color: colors.foundationgray,
    },
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        borderRadius: 8,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 25,
        paddingRight: 25,
        alignSelf: "flex-end",
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    btn_text: {
        paddingLeft: 5,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        color: colors.white
    },
    btn_new: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
        padding: 5,
        borderRadius: 4,
    },
    id: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: fonts.sfmedium,
        color: colors.black,
    },
    out: {
        fontSize: 12,
        fontWeight: 700,
        fontFamily: fonts.sfmedium,
        color: colors.foundationgray,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    date: {
        fontSize: 14,
        fontWeight: 700,
        fontFamily: fonts.sfmedium,
        color: colors.black,

    },
    interested: {
        color: colors.btntextgreen,
        fontFamily: fonts.sfmedium,
        fontSize: 14,
        fontWeight: 500,
    },
    plain_card: {
        gap: 5,
        paddingHorizontal: 2,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 13,
        gap: 3,
    },
})
export default Calllogdetails