import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { colors, fonts } from "../../config/theme";
import Sales from "./Sales";
import { TouchableWithoutFeedback, View } from "react-native";
import Expenses from "./Expenses";
import TelecallerProfile from "../TelecallerLogin/TelecallerProfile";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Expense } from "../../components/svgs";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Tab=createBottomTabNavigator();
const BottomTabAccounts=()=>{
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

    console.log("Logined User Data async storege in Accounts Bottom Tab --------------------->", userData);
    const isAdmin = userData?.roleName === "ADMIN";


    return(
        <Tab.Navigator
        initialRouteName="Sales"
        screenOptions={{
            headerShown:false,
            tabBarShowLabel:true,
            tabBarActiveTintColor:colors.commoncolor,
            tabBarInactiveTintColor:colors.graynew,
            tabBarStyle:{
                backgroundColor:colors.white,
                height:60,
                borderTopWidth:0.5,
                borderTopColor:colors.gray,
            },
            tabBarLabelStyle:{
                fontSize:13,
                marginBottom:4,
                fontWeight:600,
                fontFamily:fonts.sfmedium,
            },
        }}
        >

             
             {/* Sales */}
            <Tab.Screen name="Sales" component={Sales} options={{tabBarLabel:"Sales",tabBarIcon:({color})=>(
                <FontAwesome name="shopping-bag" size={25} color={color}/>
            ),
            //remove press background
            tabBarButton:(props)=>(
                <TouchableWithoutFeedback {...props}>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        {props.children}
                    </View>
                </TouchableWithoutFeedback>
            )
            }}/>

            {/* Expenses */}
            <Tab.Screen name="Expenses" component={Expenses} options={{tabBarLabel:"Expenses",tabBarIcon:({color,size})=>(
                // <FontAwesome name="file-photo-o" size={25} color={color} />
                <Expense size={size} color={color} />
            ),
            //remove press background
            tabBarButton:(props)=>(
                <TouchableWithoutFeedback {...props}>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        {props.children}
                    </View>
                </TouchableWithoutFeedback>
            )
            }}/>


            {/* Profile */}

            {
                !isAdmin && (
                     <Tab.Screen name="TelecallerProfile" component={TelecallerProfile} options={{tabBarLabel:"Profile",tabBarIcon:({color})=>(
                <Feather name="user" size={25} color={color}  />
            ),
            //remove press background
            tabBarButton:(props)=>(
                <TouchableWithoutFeedback {...props}>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        {props.children}
                    </View>
                </TouchableWithoutFeedback>
            )
            }}/>
                )
            }
           

        </Tab.Navigator>
    )
}
export default BottomTabAccounts