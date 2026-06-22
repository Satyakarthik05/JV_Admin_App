import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { colors, fonts } from "../../config/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { useDispatch, useSelector } from "react-redux";
import { GetAssignedCustomersByID } from "../../redux/reducers/AccounsLogin/VehicleDetails";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import AccountsSkeleton from "../../components/AccountsSkeleton";
import commonstyles from "../../commonstyles/commonstyles";


const AssignedCustomer = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const route = useRoute();
    const { ParamsData, CustomerData } = route.params;
    const id = ParamsData;
    console.log("Id coming from params-------------------->route ID", id);
    console.log("Customer Data Coming in params ----------------------->", CustomerData);


    //**********************no id get call is using here only data coming from params that call only using*****************// 


    
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500); // just show loader briefly
    };


   

   

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.top} >
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Assigned Customers</Text>
                </TouchableOpacity>
            </SafeAreaView>


            <View style={styles.body}>
                {
                    CustomerData?.length === 0 ? (
                        <View>
                            <Text style={{textAlign:'center',fontSize:12,color:colors.black}}>No Customers Found</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={CustomerData}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 150 }}

                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}

                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.card}>
                                        <View style={styles.top}>
                                            <Text style={styles.code}>{item.shopName}</Text>
                                            <Text style={commonstyles.active}>{item.status}</Text>
                                        </View>
                                        <View style={styles.top}>
                                            <Text style={styles.phno}>{item.ownerName}</Text>
                                            <Text style={styles.phno}>{item.mobile}</Text>
                                        </View>
                                        <View style={[styles.for_flex, { alignSelf: 'flex-end' }]}>
                                            <EvilIcons name="location" size={14} color="#EF3D3B" />
                                            <Text style={[styles.code, { color: colors.foundationgray }]}>{item.city}</Text>
                                        </View>
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
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 13,
        shadowRadius: 6,
        elevation: 4,
        // marginleft:10,
        // marginRight:10,
        marginBottom: 5,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: colors.black,
        marginLeft: 10,
        fontFamily: fonts.sfbold,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    code: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.simpleblack,
        fontFamily: fonts.sfbold,
    },
    phno: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.formtitlegry,
        fontFamily: fonts.sfmedium,
    },
})
export default AssignedCustomer