import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from "@react-navigation/stack";


import Splash from '../screens/SignInPages/Splash';
import SignIn from '../screens/SignInPages/SignIn';

import Requestexpense from '../screens/HRlogin/Requestexpense';
import Myexpense from '../screens/HRlogin/Myexpenses';
import AddAttendance from '../screens/HRlogin/AddAttendance';
import MyAttendance from '../screens/HRlogin/MyAttendance';
import ApplyLeave from '../screens/HRlogin/ApplyLeave';
import Production from '../screens/ProductionLogin/Production';
import TelecallerProfile from '../screens/TelecallerLogin/TelecallerProfile';
import ProductionHome from '../screens/ProductionLogin/ProductionHome';
import MyLeave from '../screens/TelecallerLogin/MyLeave';
import AddProduction from '../screens/ProductionLogin/AddProduction';
import EditProduction from '../screens/ProductionLogin/EditProduction';
import HrLeaves from '../screens/HRlogin/HrLeaves';

import SetUpProduction from '../screens/ProductionLogin/SetUpProduction';
import AllProductSetups from '../screens/ProductionLogin/AllProductSetups';
import ProductionSetupDetails from '../screens/ProductionLogin/ProductionSetupDetails';
import UpdateSetUpProduction from '../screens/ProductionLogin/UpdateSetUpProduction';


const Stack=createStackNavigator();
const AppNavigation = () => {
  return (
  
   <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="production">
   
   <Stack.Screen name="production" component={Production}/>
   <Stack.Screen  name="TelecallerProfile" component={TelecallerProfile}/>
    <Stack.Screen name="reqResponse" component={Requestexpense} options={{headerShown:false}}/>
    <Stack.Screen name="Myexpenses" component={Myexpense} options={{headerShown:false}}/>
    <Stack.Screen name="AddAttendance" component={AddAttendance} options={{headerShown:false}}/>
    <Stack.Screen name="MyAttendance" component={MyAttendance} options={{headerShown:false}}/>
    <Stack.Screen name="ApplyLeave" component={ApplyLeave} options={{headerShown:false}}/>

    <Stack.Screen name="Productionhome" component={ProductionHome}/>
    <Stack.Screen name="AddProduction" component={AddProduction}/>
     {/* <Stack.Screen name="MyLeave" component={MyLeave}/> */}
     <Stack.Screen name="HrLeaves" component={HrLeaves}/> 
     <Stack.Screen name="EditProduction" component={EditProduction}/>
     <Stack.Screen name="SetUpProduction" component={SetUpProduction}/>
     <Stack.Screen name="AllProductSetups" component={AllProductSetups}/>
     <Stack.Screen name="ProductionSetupDetails" component={ProductionSetupDetails}/>
     <Stack.Screen name="UpdateSetUpProduction" component={UpdateSetUpProduction}/>
    
   </Stack.Navigator> 
  );
};

export default AppNavigation;
