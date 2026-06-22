import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import commonstyles from "../../commonstyles/commonstyles";
import { colors } from "../../config/theme";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";



const SaleCart = () => {
    const navigation = useNavigation();
    const products = [
        {
            id: "1",
            title: "Promotional Banner",
            status: "24 bottles/case",
            price: 480,
            qty: 2,
            image: require("../../assets/coco.png"),
        },
        {
            id: "2",
            title: "Orange Juice",
            status: "24 bottles/case",
            price: 120,
            qty: 1,
            image: require("../../assets/watercan.png"),
        },
        {
            id: "3",
            title: "Orange Juice",
            status: "24 bottles/case",
            price: 120,
            qty: 1,
            image: require("../../assets/coco.png"),
        }, {
            id: "4",
            title: "Orange Juice",
            status: "24 bottles/case",
            price: 120,
            qty: 1,
            image: require("../../assets/coco.png"),
        },
    ];
    const renderItem = ({ item }) => {
        return (
            <View style={[commonstyles.card, { marginVertical: 7, marginHorizontal: 10 }]}>
                <View style={commonstyles.row1}>

                    <Image
                        source={item.image}
                        resizeMode="contain"
                        style={commonstyles.image}
                    />

                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={commonstyles.text3}>{item.title}</Text>

                        <Text style={[commonstyles.text5]}>
                            {item.status}
                        </Text>

                        <Text style={commonstyles.text3}>
                            {'\u20B9'}{item.price}
                        </Text>
                    </View>

                    {/* RIGHT SIDE */}
                    <View style={{ marginLeft: 'auto' }}>
                        <View style={[commonstyles.row, commonstyles.incrementContainer, { gap: 10 }]}>
                            <TouchableOpacity>
                                <Text style={[commonstyles.header4]}>-</Text>
                            </TouchableOpacity>
                            <Text style={[commonstyles.header4]}>1</Text>
                            <TouchableOpacity>
                                <Text style={[commonstyles.header4]}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[commonstyles.row1, { gap: 8 }]}>
                            <Text style={[commonstyles.text2, { textDecorationLine: 'line-through' }]}>{'\u20B9'}660</Text>
                            <Text style={[commonstyles.text9, { color: colors.simpleblack }]}>{'\u20B9'}313</Text>
                        </View>


                    </View>

                </View>
            </View>
        )

    }
    return (
        <SafeAreaView style={[commonstyles.mainContainer]}>

            <View style={[commonstyles.row1, { gap: 16, marginHorizontal: 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color={colors.black} />
                </TouchableOpacity>
                <Text style={[commonstyles.header3]}>Cart</Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >

                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    // style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 20 }}

                />
                <View style={[{ marginHorizontal: 10 }]}>
                    <Text style={[commonstyles.text4]}>Delivery Details</Text>
                </View>

                <View style={[commonstyles.card, commonstyles.cardgap]}>
                    <View style={[commonstyles.row]}>
                        <View style={[commonstyles.row1, { gap: 8 }]}>
                            <FontAwesome6 name="truck-fast" size={22} color={colors.commoncolor} />
                            <View>
                                <Text style={[commonstyles.text9, { color: colors.black }]}>Address</Text>
                                <Text style={[commonstyles.text10]}>301, JSR Enclave,Danvaipeta</Text>
                                <Text style={[commonstyles.text10]}>Lorem Ipsum Lorem Dolor Sit</Text>
                            </View>
                        </View>
                        <FontAwesome6 name="angle-right" size={22} color={colors.inputfieldcolor} />

                    </View>
                </View>

                <View style={[{ marginHorizontal: 10 }]}>
                    <Text style={[commonstyles.text4]}>Billing</Text>
                </View>

                <View style={[commonstyles.card, commonstyles.cardgap]}>
                    <View style={[commonstyles.row]}>
                        <View>
                            <Text style={[commonstyles.text5]}>Amount</Text>
                            <Text style={[commonstyles.text5]}>Savings</Text>
                            <Text style={[commonstyles.text5]}>Discount</Text>
                            <Text style={[commonstyles.text6, { color: colors.commoncolor }]}>"FIRSTORDER"</Text>
                        </View>
                        <View>
                            <Text style={[commonstyles.text4]}>{'\u20B9'}188.22</Text>
                            <Text style={[commonstyles.text4]}>{'\u20B9'}20.00</Text>
                            <Text style={[commonstyles.text4]}>{'\u20B9'}20.00</Text>
                        </View>
                    </View>
                    <View style={[commonstyles.row]}>
                        <Text style={[commonstyles.text5]}>TOTAL</Text>
                        <Text style={[commonstyles.text4]}>{'\u20B9'}70.00</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.inputfieldcolor, borderStyle: 'dashed' }}></View>
                    <View style={[commonstyles.row]}>
                        <Text style={[commonstyles.text5]}>GST</Text>
                        <Text style={[commonstyles.text4, { color: colors.goldyellow }]}>{'\u20B9'}20.00</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.inputfieldcolor, borderStyle: 'dashed' }}></View>
                    <View style={[commonstyles.row]}>
                        <View>
                            <Text style={[commonstyles.text5]}>Delivery Change</Text>
                            <Text style={[commonstyles.text6]}>(GST Included)</Text>
                        </View>
                        <Text style={[commonstyles.text4]}>{'\u20B9'}70.00</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.inputfieldcolor, borderStyle: 'dashed' }}></View>
                    <View style={[commonstyles.row]}>
                        <Text style={[commonstyles.header1]}>TOTAL</Text>
                        <Text style={[commonstyles.header1]}>{'\u20B9'}220.22</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={[commonstyles.row, { gap: 10 }]}>
                <View style={[{ marginBottom: 10, marginHorizontal: 10 }]}>
                    <View style={[commonstyles.row1, { gap: 6, }]}>
                        <Text style={[commonstyles.text6]}>PAYMENT TYPE</Text>
                        <FontAwesome6 name="caret-down" size={22} color={colors.black} />
                    </View>
                    <Text style={[commonstyles.text5]}>Online</Text>
                </View>

                <TouchableOpacity style={[commonstyles.row, commonstyles.redbutton1,]}>
                    <View>
                        <Text style={[commonstyles.text5, { color: colors.white }]}>{'\u20B9'}200</Text>
                        <Text style={[commonstyles.text2, { color: colors.white }]}>Total</Text>
                    </View>
                    <View style={[commonstyles.row1, { gap: 10 }]}>
                        <Text style={[commonstyles.text9, { color: colors.white }]}>Place Order</Text>
                        <FontAwesome6 name="caret-right" size={22} color={colors.white} />
                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}
export default SaleCart;