import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import Splash from "../screens/SignInPages/Splash";
import SignIn from "../screens/SignInPages/SignIn";


import HRlogin from '../navigation/HRlogin';
import MasterNav from '../navigation/MasterNav';
import TelecallerNav from '../navigation/TelecallerNav';
import ProductionNav from '../navigation/ProductionNav';
import SalesNavigation from "./SalesNavigation";
import DriverNavigation from "./DriverNavigation";
import AccountsNav from './AccountsNav';
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminNavigation from "./AdminNavigations";





const Stack = createStackNavigator();
const AppNavigation = () => {

    const { data } = useSelector((state) => state.Login)
    console.log("Logined User Data in Main Navigation Screen ------------------------------>", data);

    //const [firstLanch, setFirstLanch] = useState(null);   // created a state to know user was new user or old user (new user-->login, if older user then  no login ) 
    // null because we don't know new first time  login or not
    // true---> app opened first time
    //  false---> app opened  earlier
    // useEffect(() => {
    //     console.log("Logined User Id Her**********************************", data?.id);
    //     const checkLanch = async () => {
    //         const value = await AsyncStorage.getItem("firstLanch");
    //         if (value === null) // firstLanch does not exist-->app opend for first time
    //         {
    //             // first installed the App
    //             setFirstLanch(true); //So we set  firstLanch = true
    //             await AsyncStorage.setItem("firstLanch", "false");// and then we stored the false because  After  some time when app opens it should not show login page thats why we updated to false-->meance now token is there so no login page again
    //         }
    //         else {
    //             setFirstLanch(false);  //firstLanch-->exist app not open first time so no login page will show
    //         }
    //     };
    //     checkLanch();

    // }, []);


    // if(firstLanch === null){
    //     return null; // splash loader
    // }

    // let initialRoute;
    // if(firstLanch){
    //     initialRoute="Splash" // first time use--->then show login page(phone)
    // }
    // else if(data?.id){
    //     // initialRoute="Bottomtabnav" // already logged in(Alrady login once then show there initail route)
    //     switch(data?.roleName){
    //         case "HR":
    //             initialRoute="hrlogin";
    //             break;
    //         case "MASTER":
    //             initialRoute="master";
    //             break;
    //         case "TELECALLER":
    //             initialRoute="telecaller";
    //             break;
    //         case "PRODUCTION":
    //             initialRoute="production";
    //             break;
    //         case "ACCOUNTS":
    //             initialRoute="Accounts";
    //             break;
    //         case "SALES":
    //             initialRoute="sales";
    //             break;
    //         case "DRIVER":
    //             initialRoute="driver";
    //             break;
    //         default:
    //             initialRoute="Splash"; // user logged out / no RoleName-----> if logout then roleNameand id  will remove na thatys whats why it will show  login page(phone)token ? "Bottomtabnav":"Phoneno"

    //     }

    // }



    //"Splash"

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash" >
                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                <Stack.Screen name="Signin" component={SignIn} options={{ headerShown: false }} />

                <Stack.Screen name="adminhome" component={AdminNavigation} />
                
                <Stack.Screen name="hrlogin" component={HRlogin} />
                <Stack.Screen name="master" component={MasterNav} />
                <Stack.Screen name="telecaller" component={TelecallerNav} />
                <Stack.Screen name="production" component={ProductionNav} />
                <Stack.Screen name="sales" component={SalesNavigation} />
                <Stack.Screen name="driver" component={DriverNavigation} />
                <Stack.Screen name="Accounts" component={AccountsNav} />


            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigation