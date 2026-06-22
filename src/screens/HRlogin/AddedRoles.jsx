import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, FlatList, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from "../../config/theme";
import { useDispatch, useSelector } from "react-redux";
import { Roles } from "../../redux/reducers/HRLogin/Roles";
import { DeletetheRole } from "../../redux/reducers/HRLogin/Roles";
import { responsiveHeight } from "react-native-responsive-dimensions";







const AddedRoles = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            // StatusBar.setBackgroundColor(colors.white)
            // StatusBar.setBarStyle("dark-content")

            dispatch(Roles())

        }, [])
    )
    // const [role, setRole] = useState(rolesData);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await dispatch(Roles()).unwrap(); // re-fetch data
        } catch (error) {
            console.log("Refresh Error:", error);
        } finally {
            setRefreshing(false);
        }
    };




    const handleDelete = (id) => {
        // dispatch(DeletetheRole({ id }))
        // dispatch(Roles()); // refresh after delete

        Alert.alert(
            "Delete the Role", "Are you sure you want to delete this role?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Deletion Cancelled"),
                    style: "cancel",

                },
                {
                    text: "Yes",
                    onPress: () => dispatch(DeletetheRole({ id }))

                },
            ],
            { cancelable: true }
        )
    };





    const { rolesData } = useSelector((state) => state.AllRoles);
    console.log("Added Roles Data in AddedRoles Screen-------------------------------------------------> ", rolesData);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" translucent={false} barStyle="dark-content" />
            <SafeAreaView style={styles.top}>
                <TouchableOpacity style={styles.head} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" style={styles.arrow} />
                    <Text style={styles.title}>Added Roles</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Addrole")}>
                    <Text style={styles.btn_text}>Add Role</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.table}>

                <View style={styles.row}>
                    <Text style={styles.header} >Serial Number</Text>
                    <Text style={styles.header}>Role Name </Text>
                    <Text style={styles.header} >No Leaves</Text>
                    <Text style={styles.header} >Actions</Text>
                </View>
                <FlatList
                    data={rolesData}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}

                    style={{ maxHeight: responsiveHeight(85) }}
                    
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }

                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.row}>
                                <Text style={styles.cell}>{index + 1}</Text>
                                <Text style={styles.cell}>{item.roleName}</Text>
                                <Text style={styles.cell}>{item.noOfLeaves}</Text>
                                <View style={styles.iconCell} >
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} >
                                        <Feather name="trash" color="#FF0000" size={18} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate("editrole", { editdetailsData: item })}>
                                        <Feather name="edit" color="#00A63E" size={18} />
                                    </TouchableOpacity>
                                </View>
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
    head: {
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
    button: {
        backgroundColor: colors.commoncolor,
        paddingVertical: 10,
        borderRadius: 8,
        width: 120,
    },
    btn_text: {
        fontSize: 16,
        fontWeight: 700,
        color: colors.white,
        fontFamily: fonts.sfbold,
        textAlign: 'center',
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: "row",
    },

    header: {
        flex: 1,
        paddingVertical: 12,
        fontsize: 16,
        textAlign: "center",
        fontWeight: 700,
        fontFamily: fonts.sfbold,
        backgroundColor: colors.commomcolorlight,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        color: colors.black
    },

    cell: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        textAlign: "center",
        fontWeight: 500,
        fontFamily: fonts.sfmedium,
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
        color: colors.foundationgray,
    },

    iconCell: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.inputfieldborder,
    },
    table: {
        marginTop: responsiveHeight(2),
    },





})
export default AddedRoles