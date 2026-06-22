import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { colors, fonts } from "../../config/theme";
import Telecaller from "./Telecaller";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableWithoutFeedback, View } from "react-native";
import Followups from "./FollowUps";
import TelecallerProfile from "./TelecallerProfile";
import Customers from "./Customers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";


const Tab = createBottomTabNavigator();
const BottomTabPD = () => {
    const [userData, setUserData] = useState(null);
    const { data } = useSelector((state) => state.Login);
    console.log("Logined User Data --------------------->", data);

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

    console.log("Logined User Data async storege in Telecaller Bottom Tab Navigation  --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";

    return (
        <Tab.Navigator initialRouteName="Telecaller"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.commoncolor,
                tabBarInactiveTintColor: colors.graynew,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    height: 60,
                    borderTopWidth: 0.5,
                    borderTopColor: colors.gray,
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    marginBottom: 4,
                    fontWeight: 600,
                    fontFamily: fonts.sfmedium,
                },
            }}
        >
            <Tab.Screen name="Telecaller" component={Telecaller} options={{
                tabBarLabel: "Leads", tabBarIcon: ({ color }) => (
                    <Feather name="users" size={25} color={color} />
                ),
                //remove press background
                tabBarButton: (props) => (
                    <TouchableWithoutFeedback {...props}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            {props.children}
                        </View>
                    </TouchableWithoutFeedback>
                )
            }} />

            <Tab.Screen name="customers" component={Customers} options={{
                tabBarLabel: "Customers", tabBarIcon: ({ color }) => (
                    <Ionicons name="calendar-clear-outline" size={25} color={color} />
                ),
                //name FollowUps
                //Followups component
                //remove press background
                tabBarButton: (props) => (
                    <TouchableWithoutFeedback {...props}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            {props.children}
                        </View>
                    </TouchableWithoutFeedback>
                )
            }} />


            {
                !isAdmin && (
                    <Tab.Screen name="TelecallerProfile" component={TelecallerProfile} options={{
                        tabBarLabel: "Profile", tabBarIcon: ({ color }) => (
                            <Feather name="user" size={25} color={color} />
                        ),
                        //remove press background
                        tabBarButton: (props) => (
                            <TouchableWithoutFeedback {...props}>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    {props.children}
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }} />
                )
            }     


        </Tab.Navigator>
    )
}
export default BottomTabPD