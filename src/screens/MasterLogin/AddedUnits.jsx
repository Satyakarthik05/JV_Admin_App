import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { DeleteUnitsData, GetUnitsData } from "../../redux/reducers/MasterLogin/AddCategory";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AddedUnits = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);



    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetUnitsData()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };


    useFocusEffect(
        useCallback(() => {
            dispatch(GetUnitsData())
        }, [dispatch])
    )

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("userData");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            }
        }
        loadUser();
    }, []);

    console.log("Logined User Data async storege in Raw material Master-------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";



    const handleDelete = (id) => {
        Alert.alert(
            "Delete the Unit", "Are You Sure To Delete  Unit ",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await dispatch(DeleteUnitsData(id)).unwrap();
                        dispatch(GetUnitsData());
                    }
                }
            ],
            { cancelable: true }
        )
    }

    const { UnitsData } = useSelector((state) => state.GetUnitsRawMaster);
    console.log("Get Units  data in Added Units page===============>", UnitsData);



    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.top}>
                <TouchableOpacity style={styles.head} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Added Units</Text>
                </TouchableOpacity>
                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("addunit")}>
                            <Text style={styles.btn_text}>Add Unit</Text>
                        </TouchableOpacity>
                    )
                }

            </SafeAreaView>


            <View style={styles.table}>
                <View style={styles.table_main}>
                    <Text style={styles.th}>S.No</Text>
                    <Text style={styles.th}>Units</Text>
                    {
                        !isAdmin && (
                            <Text style={styles.th}>Actions</Text>
                        )
                    }
                </View>
                <FlatList
                    data={UnitsData}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}

                    //contentContainerStyle={{ flexGrow: 1 }}   //  important
                    style={{ maxHeight: responsiveHeight(85) }}

                    // to refresh
                    refreshing={refreshing}      //  loader on pull
                    onRefresh={onRefresh}

                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.table_main}>
                                <Text style={styles.tb}>{index + 1}</Text>
                                <Text style={styles.tb}>{item.unitName}</Text>
                                {
                                    !isAdmin && (
                                        <View style={styles.iconCell} >
                                            <TouchableOpacity onPress={() => handleDelete(item.id)} >
                                                <Feather name="trash" color="#FF0000" size={18} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate("editUnit", { editdata: item })}>
                                                <Feather name="edit" color="#00A63E" size={18} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                            </View>
                        )
                    }}
                />
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
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 800,
        color: colors.black,
        marginLeft: 10,
        fontFamily: fonts.sfbold,
    },
    button: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 10,
        borderRadius: 8,
        width: 120,
    },
    btn_text: {
        fontSize: 14,
        fontWeight: 700,
        color: colors.white,
        fontFamily: fonts.sfbold,
        textAlign: 'center',
    },
    table: {
        // flex:1,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        // marginTop: 20,
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2),
    },
    table_main: {
        flexDirection: 'row',
        //alignItems: 'center',
    },
    th: {
        flex: 1,
        paddingVertical: 12,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "700",
        fontFamily: fonts.sfbold,
        backgroundColor: colors.commomcolorlight,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        color: colors.black,
    },
    tb: {
        flex: 1,
        paddingVertical: 12,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "500",
        fontFamily: fonts.sfbold,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        color: colors.foundationgray,
    },
    iconCell: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
    },




})
export default AddedUnits