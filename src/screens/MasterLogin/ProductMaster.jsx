import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, Text, View, FlatList, Image, Alert, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts, colors } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProductData, GetProductsInMaster, GetStock } from "../../redux/reducers/MasterLogin/AddProduct";
import ProductSkeleton from "../../components/Skeletonplaceholder";
import { GetPasswordsData } from "../../redux/reducers/MasterLogin/AddCategory";
import commonstyles from "../../commonstyles/commonstyles";
import { requestLogin } from "../../redux/reducers/HRLogin/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductMaster = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userData, setUserData] = useState(null);



    // new modal
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [showPassword, setShowPassword] = useState(false);




    //to refresh the data
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(GetProductsInMaster()).unwrap();
        } catch (error) {
            console.log("Refresh error:", error);
        }
        setRefreshing(false);
    };

    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);





    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await dispatch(GetProductsInMaster()).unwrap();
                await dispatch(GetPasswordsData()).unwrap();
                setLoading(false);
            };

            fetchData();
        }, [dispatch])
    );


    const { GetProductData } = useSelector((state) => state.GetProductsInPM);
    console.log("GetProducts Data in Ui Screen ----------------------->", GetProductData);

    const { getpasswordata } = useSelector((state) => state.GetPswData);
    console.log("password Data ---------->", getpasswordata);

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

    console.log("Logined User Data async storege in Product master  Screen  --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";



    // const handleDelete = (id) => {
    //     Alert.alert(
    //         "Delete the Product", "Are you sure you want to delete this Product?",
    //         [
    //             {
    //                 text: "No",
    //                 onPress: () => console.log("Deletion Cancelled"),
    //                 style: "cancel",

    //             },
    //             {
    //                 text: "Yes",
    //                 //onPress: () => dispatch(DeleteProductData({ id }));
    //                 onPress: async () => {
    //                     await dispatch(DeleteProductData({ id })).unwrap();
    //                     dispatch(GetProductsInMaster()).unwrap(); //  refresh after delete
    //                 }
    //             },
    //         ],
    //         { cancelable: true }
    //     )
    // };


    // for password modal to delete the product 

    const handleConfirmDelete = async () => {

        if (!deletePassword || deletePassword.trim() === "") {
            setDeleteError("Enter Password");
            return;
        }

        if (deletePassword !== getpasswordata?.[0]?.password) {
            setDeleteError("!Incorrect Password");
            return;
        }

        try {
            //  Replace with API validation if needed
            // if (deletePassword !== "1234") {
            //     Alert.alert("Error", "Incorrect Password");
            //     return;
            // }

            await dispatch(DeleteProductData({ id: selectedProductId })).unwrap();
            await dispatch(GetProductsInMaster()).unwrap();

            Alert.alert("Success", "Product Deleted Successfully");

            setDeleteModalVisible(false);
            setDeletePassword('');

        } catch (error) {
            Alert.alert("Error", "Delete Failed");
        }
    };


    const confirmDelete = (id) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                {
                    text: "No",
                    style: "cancel",
                    onPress: () => console.log("Cancelled"),
                },
                {
                    text: "Yes",
                    onPress: () => {
                        setSelectedProductId(id);
                        setDeleteModalVisible(true);
                    },
                },
            ],
            { cancelable: true }
        );
    };


    return (
        <View style={styles.container}>

            <View>
                <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
                <SafeAreaView>
                    <TouchableOpacity style={commonstyles.header} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                        <Text style={commonstyles.title}>Product Master</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <View style={[styles.Button,isAdmin && { justifyContent: 'flex-end' }]}>

                {
                    !isAdmin && (
                        <TouchableOpacity style={styles.btns} onPress={() => navigation.navigate("AddProduct")}>
                            <Feather name="plus" color="#fff" size={14} />
                            <Text style={styles.text}>Add New</Text>
                        </TouchableOpacity>
                    )
                }

                <TouchableOpacity style={styles.btns} onPress={() => navigation.navigate("addedcategories")}>
                    <Feather name="plus" color="#fff" size={14} />
                    <Text style={styles.text}>{ isAdmin ?"Categories Data ": "Add Category"}</Text>
                </TouchableOpacity>
            </View>





            <View style={styles.flatlist_data}>
                {
                    loading ? (
                        <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            <ProductSkeleton />
                        </View>
                    ) : (
                        <FlatList
                            data={GetProductData}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 2 }}
                            // to refresh
                            refreshing={refreshing}      //  loader on pull
                            onRefresh={onRefresh}

                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={styles.card}
                                        onPress={() => {
                                            //dispatch(GetStock(item.id));
                                            navigation.navigate("ProductInventrycontrol", { GetProductsdata: item })
                                        }}>
                                        <View style={styles.for_flex}>
                                            <View style={styles.sec_2}>
                                                <Image source={{ uri: item.imageUrl }} style={styles.img} />
                                            </View>
                                            <View style={styles.sec_3}>
                                                <View style={styles.status}>
                                                    <Text style={styles.name}>{item.productName}</Text>
                                                    <Text style={[styles.status_btn, item.status === 1 ? styles.green : styles.red]}>{item.status === 1 ? "Active" : "InActive"}</Text>
                                                </View>
                                                <Text style={styles.poo2}>{item.productCode}</Text>
                                                <View style={styles.icons}>
                                                    <Text style={styles.poo2}>{item.productCategory}</Text>

                                                    {
                                                        !isAdmin && (
                                                            <View style={styles.right_icons}>
                                                                {/* onPress={() => handleDelete(item.id)} */}
                                                                <TouchableOpacity style={styles.eye} onPress={() => confirmDelete(item.id)}>
                                                                    <Feather name="trash" size={18} color="#EF3D3B" />
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => navigation.navigate("EditProduct", { getproducts: item })}>
                                                                    <Feather name="edit" size={18} color="#00AD41" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )
                                                    }

                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    )
                }
            </View>


            {/* modal to show password */}
            <Modal visible={deleteModalVisible} transparent animationType="fade" >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>

                        <Text style={styles.modalTitle}>To Delete Product Enter Password</Text>
                        {deleteError ? (
                            <Text style={{ color: 'red', marginTop: 5 }}>{deleteError} </Text>
                        ) : null}
                        <View style={{ position: 'relative' }}>
                            <TextInput placeholder="Enter Password" secureTextEntry={!showPassword} style={styles.modalInput} value={deletePassword} onChangeText={(text) => { setDeletePassword(text); setDeleteError(''); }} />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: 12 }} >
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={18} color="#555" />
                            </TouchableOpacity>
                        </View>



                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setDeleteModalVisible(false); setDeletePassword(''); setDeleteError(''); setDeletePassword(''); setShowPassword(false); }} >
                                <Text style={{ color: colors.inputfieldcolor, fontWeight: '800' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.deleteBtn} onPress={handleConfirmDelete} >
                                <Text style={{ color: "#fff", fontWeight: '800' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingHorizontal: 10,
        flexDirection: 'column',
        gap: 10,
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
    Button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sec_3: {
        flex: 1,
        marginLeft: 10,
    },
    btns: {
        backgroundColor: colors.commoncolor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveHeight(5),
        paddingVertical: 16,
        // paddingLeft: 45,
        // paddingRight: 45,
        borderRadius: 8,
    },
    status_btn: {
        padding: 5,
        borderRadius: 4,
        fontFamily: fonts.sfmedium,
    },
    green: {
        backgroundColor: colors.btnbggreen,
        color: colors.btntextgreen,
    },
    red: {
        backgroundColor: colors.commomcolorlight,
        color: colors.commoncolor,
    },
    text: {
        fontSize: 12,
        fontWeight: 700,
        color: colors.white,
        fontFamily: fonts.sfbold,
    },
    for_flex: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    eye: {
        marginRight: 8,
    },
    img: {
        height: 80,
        width: 74,
        resizeMode: 'contain',
    },
    name: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.simpleblack,
        fontFamily: fonts.sfmedium,
    },
    poo2: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.graynew,
        fontFamily: fonts.sfmedium,
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    right_icons: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        padding: 12,

        shadowRadius: 6,
        elevation: 4,
        marginBottom: 5,
        marginTop: 10,
        flexDirection: 'column',
        gap: 5,

    },

    // for modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.black
    },
    modalInput: {
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        borderRadius: 5,
        padding: 8,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelBtn: {
        padding: 10,
    },
    deleteBtn: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },


})
export default ProductMaster
