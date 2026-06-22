import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import Employeelist from "./Employeelist";
// import Lucide from 'react-native-vector-icons/Lucide';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { TouchableWithoutFeedback, View } from "react-native";
//import Attendance from "./Attendance";
import Leaves from "./Leaves";
import ProfileScreen from "./Profilescreen";
import EmployeeAttendance from "./EmployeeAttendance";
import { colors, fonts } from "../../config/theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AllEmployeesReqExpense from "./AllEmployesReqExp";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MonthlyReport from "./MonthlyReport";
import Feather from 'react-native-vector-icons/Feather';



const Tab = createBottomTabNavigator();
const Bottomtabnav = () => {
    const insets = useSafeAreaInsets();
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

    console.log("Logined User Data async storege in Hr Login Bottom tab--------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";

    return (
        <Tab.Navigator
            initialRouteName="employeelist"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,//to hide the bottomtab  wehn we are searching
                tabBarActiveTintColor: colors.commoncolor,
                tabBarInactiveTintColor: colors.graynew,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    //   height:responsiveHeight(10),
                    borderTopWidth: 0.5,
                    borderTopColor: colors.gray,
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    // marginBottom:responsiveHeight(2),
                    fontWeight: 600,
                    fontFamily: fonts.sfmedium,
                    // marginBottom:4,
                },
            }}
        >

            {/* EmployeeList */}
            <Tab.Screen name="employeelist" component={Employeelist} options={{
                tabBarLabel: "Employees", tabBarIcon: ({ color }) => (
                    <FontAwesome name="users" size={25} color={color} />

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



            {/* Attendance */}
            <Tab.Screen name="EmployeeAttendance" component={EmployeeAttendance} options={{
                tabBarLabel: "Attendance", tabBarIcon: ({ color }) => (
                    <FontAwesome5 name="user-check" size={25} color={color} />
                ),
                tabBarButton: (props) => (
                    <TouchableWithoutFeedback {...props}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            {props.children}
                        </View>
                    </TouchableWithoutFeedback>
                )
            }} />


            {/* Leaves */}
            <Tab.Screen name="Leaves" component={Leaves} options={{
                tabBarLabel: "Leaves", tabBarIcon: ({ color }) => (
                    <FontAwesome name="folder-open-o" size={20} color={color} />
                ),
                tabBarButton: (props) => (
                    <TouchableWithoutFeedback {...props}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            {props.children}
                        </View>
                    </TouchableWithoutFeedback>
                )
            }} />



            {/* Profile */}
            {
                !isAdmin && (
                    <Tab.Screen name="Profile" component={ProfileScreen} options={{
                        tabBarLabel: "Profile", tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="user-alt" size={25} color={color} />
                        ),
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

            {
                isAdmin && (
                    <Tab.Screen name="Expenses" component={AllEmployeesReqExpense} options={{
                        tabBarLabel: "Expenses", tabBarIcon: ({ color }) => (
                            <FontAwesome6 name="indian-rupee-sign" size={25} color={color} />
                        ),
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


            {
                isAdmin && (
                    <Tab.Screen name="Montly Report" component={MonthlyReport} options={{
                        tabBarLabel: "Monthly Report", tabBarIcon: ({ color }) => (
                            <Feather name="bar-chart-2" size={25} color={color} />
                        ),
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
export default Bottomtabnav


