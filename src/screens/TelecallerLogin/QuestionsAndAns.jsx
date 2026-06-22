import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { responsiveHeight } from "react-native-responsive-dimensions";
import Entypo from 'react-native-vector-icons/Entypo';
import { DeleteQuestionData, GetCallQuestions, } from "../../redux/reducers/TelecallerLogin/AddCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QuestionAndAns = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
            dispatch(GetCallQuestions())
        }, [])
    )

    const [refreshing, setRefreshing] = useState(false);


    const { GetQnData } = useSelector((state) => state.GetQuestionsData);
    console.log("Get Qtn Data ----------->", GetQnData);


    const handleDelete = (id) => {

        Alert.alert(
            "Delete the Question", "Are you sure you want to delete this Questions?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",

                },
                {
                    text: "Yes",
                    //onPress: () => dispatch(DeleteProductData({ id }));
                    onPress: async () => {
                        await dispatch(DeleteQuestionData({ id })).unwrap();
                        dispatch(GetCallQuestions()).unwrap(); //  refresh after delete
                    }


                },
            ],
            { cancelable: true }
        )
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetCallQuestions()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };


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

    console.log("Logined User Data async storege in Telecaller login Qns and ans Screen --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";






    return (
        <View style={[styles.container]}>

            <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Questions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("QuestionForm")}>
                    <Text style={styles.btn_text}>Add Question</Text>
                </TouchableOpacity>

            </SafeAreaView>


            <View style={{ flex: 1, marginTop: 10 }}>
                <FlatList
                    data={GetQnData}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.black]} // Android
                            tintColor={colors.inputfieldborder} // iOS
                        />
                    }

                    ListEmptyComponent={() => (
                        <Text style={{ textAlign: "center", marginTop: 20 }}>
                            No Questions Data
                        </Text>
                    )}

                    renderItem={({ item }) => {
                        return (
                            <View style={styles.card}>


                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {/* Call Type */}
                                    <View>
                                        <Text style={styles.callType}>{item.questionType}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', gap: 8 }}>

                                        <TouchableOpacity onPress={() => navigation.navigate("EditQnsForm", { EditData: item })}>
                                            <Feather name="edit" size={18} color="#00AD41" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                            <Feather name="trash" size={18} color="red" />
                                        </TouchableOpacity>

                                    </View>

                                </View>

                                {/* Questions */}
                                {item.questions && item.questions.length > 0 ? (
                                    item.questions.map((q, index) => (
                                        <View key={index} style={styles.questionBox}>
                                            <Text style={styles.questionText}>
                                                {index + 1}. {q}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noData}>No Questions</Text>
                                )}

                            </View>
                        );
                    }}



                />
            </View>


        </View>
    )
}
export default QuestionAndAns
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
    title: {
        fontSize: 18,
        fontWeight: 700,
        color: colors.black,
        marginLeft: 8,
        fontFamily: fonts.sfbold,
    },

    btn_text: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        paddingVertical: 14,
        fontFamily: fonts.sfbold,
    },
    btn: {
        backgroundColor: colors.commoncolor,
        paddingHorizontal: 12,
        borderRadius: 8,
    },

    //data inside cards
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 12,
        marginTop: 12,
        elevation: 3,
        margin: responsiveHeight(1),
    },
    callType: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.black,
        marginBottom: 10,
        fontFamily: fonts.sfbold,
    },

    questionBox: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 6,
        padding: 10,
        marginBottom: 6,
    },

    questionText: {
        fontSize: 14,
        color: colors.black,
        fontFamily: fonts.sfmedium,
    },

    noData: {
        fontSize: 14,
        color: colors.formtitlegry,
        textAlign: 'center',
    },


})
