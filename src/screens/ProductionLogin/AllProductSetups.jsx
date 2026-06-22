// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import React, { useCallback, useEffect } from "react";
// import { StatusBar, StyleSheet, View, TouchableOpacity, Image, Text, FlatList, ActivityIndicator } from "react-native";
// import { colors, fonts } from "../../config/theme";
// import Feather from 'react-native-vector-icons/Feather';
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllProductionSetups } from "../../redux/reducers/Production/productionSlice";

// const AllProductSetups = () => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//     const { allSetups, loading } = useSelector(state => state.production);

//     useFocusEffect(
//         useCallback(() => {
//             StatusBar.setBackgroundColor(colors.commoncolor);
//             StatusBar.setBarStyle("light-content");
//             dispatch(fetchAllProductionSetups());
//         }, [dispatch])
//     );

//    const renderItem = ({ item }) => {
        
//         // Function for Card Click (Details)
//         const handleCardPress = () => {
//             console.log("--- Navigating to Details ---");
//             console.log("Details Data:", JSON.stringify(item, null, 2));
//             navigation.navigate("ProductionSetupDetails", { setup: item });
//         };

//         // Function for Edit Click
//         const handleEditPress = () => {
//             console.log("--- Navigating to Edit (UpdateSetUpProduction) ---");
//             console.log("Edit Data:", JSON.stringify(item, null, 2));
//             navigation.navigate("SetUpProduction", { editData: item });
//         };

//         return (
//             <TouchableOpacity 
//                 style={styles.card} 
//                 onPress={handleCardPress}
//                 activeOpacity={0.7}
//             >
//                 <View style={styles.start_header}>
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.title}>{item.productName}</Text>
//                         <Text style={styles.codeText}>{item.productCode}</Text>
//                     </View>
                    
//                     {/* EDIT BUTTON */}
//                     <TouchableOpacity 
//                         onPress={handleEditPress}
//                         style={styles.editIconContainer}
//                     >
//                         <Feather name="edit" size={20} color={colors.commoncolor} />
//                     </TouchableOpacity>
//                 </View>

//                 <View style={[styles.start_header, { marginTop: 10 }]}>
//                     <Text style={styles.durationText}>
//                         Duration: <Text style={{ fontWeight: 'bold' }}>{item.productionDuration} mins</Text>
//                     </Text>
//                     <View style={styles.materialBadge}>
//                         <Text style={styles.materialCount}>
//                             {item.materials?.length || 0} Materials
//                         </Text>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <View style={styles.start_header}>
//                     <TouchableOpacity style={styles.for_flex} onPress={() => navigation.goBack()}>
//                         <Feather name="arrow-left" size={24} color="#fff" />
//                         <Image source={require('../../assets/signin_logo.png')} style={styles.img_header} />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => navigation.navigate("TelecallerProfile")}>
//                         <Feather name="user" size={24} color="#fff" style={styles.icon} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <View style={styles.body}>
//                 <View style={styles.start_header}>
//                     <Text style={styles.sectionTitleMain}>Product Setups</Text>
//                     <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("SetUpProduction")}>
//                         <Feather name="plus" size={14} color="#fff" />
//                         <Text style={styles.btn_text}>Add Setup</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {loading ? (
//                     <ActivityIndicator size="large" color={colors.commoncolor} style={{ marginTop: 50 }} />
//                 ) : (
//                     <FlatList
//                         data={allSetups}
//                         keyExtractor={item => item.id.toString()}
//                         contentContainerStyle={{ paddingBottom: 100 }}
//                         renderItem={renderItem}
//                     />
//                 )}
//             </View>
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.white,
//     },
//     body:{
//         flex:1,
//         backgroundColor:colors.white,
//         paddingHorizontal:12,
//         flexDirection:'column',
//         gap:15,
//         marginTop:20,
//     },
//     header: {
//         backgroundColor: colors.commoncolor,
//         height: 130,
//         paddingTop: 60,
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//         paddingHorizontal: 15,
//         shadowColor: colors.black,
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 10,
//     },
//     inchange:{
//         fontSize:12,
//         fontWeight:400,
//         fontFamily:fonts.sfregular,
//         color:colors.inputfieldcolor,
//     },
//     BTH:{
//         fontSize:15,
//         fontWeight:500,
//         fontFamily:fonts.sfmedium,
//         color:colors.simpleblack,
//     },
//     start_header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',

//     }, icon: {
//         backgroundColor: colors.hrhomeprofile,
//         padding: 9,
//         borderRadius: 22,
//     },
//     img_header: {
//         height: 39,
//         width: 168,
//         resizeMode: 'contain',
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: 700,
//         fontFamily: fonts.sfbold,
//         color: colors.black,
//     },
//     btn: {
//         backgroundColor: colors.commoncolor,
//         borderRadius: 8,
//         paddingTop: 16,
//         paddingBottom: 16,
//         paddingLeft: 25,
//         paddingRight: 25,
//         flexDirection: 'row',
//         alignItems: 'center',
//         // marginBottom: 15,
//     },
//     btn_text: {
//         paddingLeft: 5,
//         fontSize: 14,
//         fontWeight: 700,
//         fontFamily: fonts.sfbold,
//         color: colors.white
//     },
//     card:{
//         backgroundColor:colors.white,
//         borderRadius: 10,
//         shadowColor: colors.black,
//         shadowOpacity: 0.1,
//         padding: 12,
//         shadowRadius: 6,
//         elevation: 4,
//         marginBottom: 5,
//         marginTop: 10,
//     },
//     for_flex:{
//         flexDirection:'row',
//         alignItems:'center',
//     },
// })
// export default AllProductSetups
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StatusBar, StyleSheet, View, TouchableOpacity, Image, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { colors, fonts } from "../../config/theme";
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductionSetups, deleteProductionSetup } from "../../redux/reducers/Production/productionSlice";
import { responsiveHeight } from "react-native-responsive-dimensions";

const AllProductSetups = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { allSetups, loading } = useSelector(state => state.production);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.commoncolor);
            StatusBar.setBarStyle("light-content");
            dispatch(fetchAllProductionSetups());
        }, [dispatch])
    );

    // DELETE CONFIRMATION LOGIC
    const handleDeletePress = (id) => {
        Alert.alert(
            "Delete Setup",
            "Are you sure you want to delete this production setup?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Yes, Delete", 
                    style: "destructive", 
                    onPress: () => {
                        dispatch(deleteProductionSetup(id)).then((res) => {
                            if (res.meta.requestStatus === 'fulfilled') {
                                Alert.alert("Deleted", "Setup deleted successfully");
                            }
                        });
                    } 
                }
            ]
        );
    };

    // Skeleton Loader Component
    const SkeletonCard = () => (
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonHeader}>
                <View style={{ flex: 1 }}>
                    <View style={[styles.skeletonText, { width: '70%', marginBottom: 8 }]} />
                    <View style={[styles.skeletonText, { width: '50%' }]} />
                </View>
                <View style={styles.skeletonActions}>
                    <View style={styles.skeletonIcon} />
                    <View style={styles.skeletonIcon} />
                </View>
            </View>
            <View style={[styles.skeletonHeader, { marginTop: 10 }]}>
                <View style={[styles.skeletonText, { width: '60%' }]} />
            </View>
        </View>
    );

    const renderItem = ({ item }) => {
        const handleCardPress = () => {
            navigation.navigate("ProductionSetupDetails", { setup: item });
        };

        const handleEditPress = () => {
            navigation.navigate("SetUpProduction", { editData: item });
        };

        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={handleCardPress}
                activeOpacity={0.7}
            >
                <View style={styles.start_header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.productName}</Text>
                        <Text style={styles.codeText}>{item.productCode}</Text>
                    </View>
                    
                    <View style={styles.actionButtons}>
                        {/* EDIT BUTTON */}
                        <TouchableOpacity onPress={handleEditPress} style={styles.iconBtn}>
                            <Feather name="edit" size={18} color={colors.commoncolor} />
                        </TouchableOpacity>

                        {/* DELETE BUTTON */}
                        <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={styles.iconBtn}>
                            <Feather name="trash-2" size={18} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.start_header, { marginTop: 10 }]}>
                    <Text style={[styles.durationText,{color:"#000"}]}>
                        Duration: <Text style={{ fontWeight: 'bold',color:"#000" }}>{item.productionDuration} mins</Text>
                    </Text>
                    {/* <View style={styles.materialBadge}>
                        <Text style={styles.materialCount}>
                            {item.materials?.length || 0} Materials
                        </Text>
                    </View> */}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.start_header}>
                    <TouchableOpacity style={styles.for_flex} onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#fff" />
                        <Image source={require('../../assets/signin_logo.png')} style={styles.img_header} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("TelecallerProfile")}>
                        <Feather name="user" size={24} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.body}>
                <View style={styles.start_header}>
                    <Text style={styles.title}>Production Setups</Text>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("SetUpProduction")}>
                        <Feather name="plus" size={14} color="#fff" />
                        <Text style={styles.btn_text}>Add Setup</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 100,paddingHorizontal: 2, }}
                        renderItem={() => <SkeletonCard />}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        data={allSetups}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // ... your existing styles ...
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    iconBtn: {
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    // Adding missing styles from previous code
    container: { flex: 1, backgroundColor: colors.white },
    body: { flex: 1, paddingHorizontal: 12, marginTop: 20 },
    header: { backgroundColor: colors.commoncolor, height: 130, paddingTop: 60, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingHorizontal: 15, elevation: 10 },
    start_header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    icon: { backgroundColor: colors.hrhomeprofile, padding: 9, borderRadius: 22 },
    img_header: { height: 39, width: 168, resizeMode: 'contain' },
    title: { fontSize: 18, fontWeight: '700', fontFamily: fonts.sfbold, color: colors.black },
    btn: { backgroundColor: colors.commoncolor, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center' },
    btn_text: { paddingLeft: 5, fontSize: 14, fontWeight: '700', color: colors.white },
    card: { backgroundColor: colors.white, borderRadius: 10, padding: 12, elevation: 4, marginBottom: 12,marginTop:responsiveHeight(1), marginHorizontal: 2, },
    for_flex: { flexDirection: 'row', alignItems: 'center' },
    codeText: { fontSize: 12, color: '#666' },
    materialBadge: { backgroundColor: '#e8f0fe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
    materialCount: { fontSize: 12, color: colors.commoncolor, fontWeight: 'bold' },
    skeletonCard: { 
        backgroundColor: colors.white, 
        borderRadius: 10, 
        padding: 12, 
        elevation: 4, 
        marginBottom: 12 
    },
    skeletonHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
    },
    skeletonText: { 
        height: 14, 
        backgroundColor: '#e0e0e0', 
        borderRadius: 4 
    },
    skeletonActions: { 
        flexDirection: 'row', 
        gap: 8 
    },
    skeletonIcon: { 
        width: 28, 
        height: 28, 
        backgroundColor: '#e0e0e0', 
        borderRadius: 4 
    }
});

export default AllProductSetups;