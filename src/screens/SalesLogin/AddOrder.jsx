import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import commonstyles from "../../commonstyles/commonstyles";
import { FlatList, Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { colors } from "../../config/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
const products = [
    {
        id: "1",
        title: "Promotional Banner",
        status: "Available",
        price: 480,
        qty: 2,
        image: require("../../assets/jucie.png"),
    },
    {
        id: "2",
        title: "Orange Juice",
        status: "Available",
        price: 120,
        qty: 1,
        image: require("../../assets/jucie.png"),
    },
    {
        id: "3",
        title: "Orange Juice",
        status: "Available",
        price: 120,
        qty: 1,
        image: require("../../assets/jucie.png"),
    }, {
        id: "4",
        title: "Orange Juice",
        status: "Available",
        price: 120,
        qty: 1,
        image: require("../../assets/jucie.png"),
    },
];


const AddOrder = () => {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBackgroundColor(colors.white)
            StatusBar.setBarStyle("dark-content")
        }, [])
    )
    
    const renderItem = ({ item }) => {
        return (
            <View style={[commonstyles.card, commonstyles.cardgap]}>
                <View style={commonstyles.row1}>

                    <Image
                        source={item.image}
                        resizeMode="contain"
                        style={commonstyles.image}
                    />

                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={commonstyles.text3}>{item.title}</Text>

                        <Text style={[commonstyles.greenbtn, { color: colors.btntextgreen }]}>
                            {item.status}
                        </Text>

                        <Text style={commonstyles.text3}>
                            {'\u20B9'}{item.price}
                        </Text>
                    </View>

                    {/* RIGHT SIDE */}
                    <View style={{ marginLeft: 'auto', gap: 10 }}>
                        <View style={[commonstyles.row, commonstyles.incrementbtn, { gap: 8 }]}>
                            <TouchableOpacity style={commonstyles.bothbtn}>
                                <Text style={commonstyles.text3}>-</Text>
                            </TouchableOpacity>

                            <Text style={commonstyles.text1}>{item.qty}</Text>

                            <TouchableOpacity style={commonstyles.bothbtn}>
                                <Text style={commonstyles.text3}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={commonstyles.redbutton} onPress={() => navigation.navigate("SaleCart")}>
                            <Text style={commonstyles.redbuttonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )

    }

    return (
        <SafeAreaView style={[commonstyles.mainContainer]}>
            <View style={[commonstyles.row1, { gap: 12, marginVertical: 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={colors.black} />
                </TouchableOpacity>
                <Text style={[commonstyles.assignText]}>Add Order</Text>
            </View>
            <View style={{ marginHorizontal: 13 }}>
                <Text style={[commonstyles.assignText, { color: colors.commoncolor }]}>Accessories</Text>
                <View style={{ borderBottomWidth: 4, borderColor: colors.thickred, width: "40%" }}></View>
            </View>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

        </SafeAreaView>
    )
}
export default AddOrder;