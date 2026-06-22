import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Customer, Driver, Expenses, Profile, Returns } from "../../components/svgs";
import Customers from "./Customers";
import DriverProfile from "./DriverProfile";
import ExpensesScreen from "./ExpensesScreen";
import ReturnsSummaryScreen from "./ReturnsSummaryScreen";
import DriverHome from "./DriverHome";
import TelecallerProfile from "../TelecallerLogin/TelecallerProfile";
import { TouchableWithoutFeedback, View } from "react-native";
import { colors, fonts } from "../../config/theme";
import Home from "./Home";
import Feather from 'react-native-vector-icons/Feather'; 

const Tab = createBottomTabNavigator();
const BottomTabNav = () => {
    return (
        <Tab.Navigator
            //initialRouteName="DriverHome"
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#EF3D3B",
                tabBarInactiveTintColor: "#AEAEAE",
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 70,
                    borderTopWidth: 0.5,
                    borderTopColor: colors.gray,
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    marginBottom: 4,
                    fontFamily: fonts.sfmedium,
                },

            }}
        >
            {/* name="DriverHome" component={DriverHome} */}
            <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarLabel: "Driver", tabBarIcon: ({ color, size }) => (
                        <Driver width={size} height={size} fill={color} />
                    ),
                    //remove press background
                    tabBarButton: (props) => (
                        <TouchableWithoutFeedback {...props}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                {props.children}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }}
            />
            <Tab.Screen name="Customers" component={Customers}
                options={{
                    tabBarLabel: "Customers", tabBarIcon: ({ color, size }) => (
                        // <Customer width={size} height={size} fill={color} />
                         <Feather name="users" size={25} color={color}/>

                    ),
                    //remove press background
                    tabBarButton: (props) => (
                        <TouchableWithoutFeedback {...props}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                {props.children}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }}
            />
            <Tab.Screen name="ExpensesScreen" component={ExpensesScreen}
                options={{
                    tabBarLabel: "Expenses", tabBarIcon: ({ color, size }) => (
                        <Expenses width={size} height={size} color={color} />
                    ),
                    //remove press background
                    tabBarButton: (props) => (
                        <TouchableWithoutFeedback {...props}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                {props.children}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }}
            />
            {/* <Tab.Screen name="ReturnsSummaryScreen" component={ReturnsSummaryScreen}
                options={{
                    tabBarLabel: "Returns", tabBarIcon: ({ color, size }) => (
                        <Returns width={size} height={size} fill={color} />
                    ),
                    //remove press background
                    tabBarButton: (props) => (
                        <TouchableWithoutFeedback {...props}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                {props.children}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }}
            /> */}
            
            <Tab.Screen name="DriverProfile" component={TelecallerProfile}
                options={{
                    tabBarLabel: "Profile", tabBarIcon: ({ color, size }) => (
                        <Profile width={size} height={size} fill={color} />
                    ),
                    //remove press background
                    tabBarButton: (props) => (
                        <TouchableWithoutFeedback {...props}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                {props.children}
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }}
            />


        </Tab.Navigator>

    )
}
export default BottomTabNav;