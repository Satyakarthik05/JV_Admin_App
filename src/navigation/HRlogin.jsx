import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from "@react-navigation/stack";
// import Splash from '../screens/HRlogin/Splash';
// import SignIn from '../screens/HRlogin/SignIn';

import Splash from '../screens/SignInPages/Splash';
import SignIn from '../screens/SignInPages/SignIn';

import Home from '../screens/HRlogin/Home';
import Requestexpense from '../screens/HRlogin/Requestexpense';
import Employeelist from '../screens/HRlogin/Employeelist';
import BottomtabNav from '../screens/HRlogin/BottomtabNav';
import Leaves from '../screens/HRlogin/Leaves';
import ProfileScreen from '../screens/HRlogin/Profilescreen';
import Myexpense from '../screens/HRlogin/Myexpenses';
import Addrole from '../screens/HRlogin/Addrole';
import EmployeeReg from '../screens/HRlogin/EmployeeReg';
import EmployeeAttendance from '../screens/HRlogin/EmployeeAttendance';
import AddAttendance from '../screens/HRlogin/AddAttendance';
import EditAttendance from '../screens/HRlogin/EditAttendance';
import MyAttendance from '../screens/HRlogin/MyAttendance';
import LeaveDetails from '../screens/HRlogin/LeaveDetails';
import ApplyLeave from '../screens/HRlogin/ApplyLeave';
import AddedRoles from '../screens/HRlogin/AddedRoles';
import Editrole from '../screens/HRlogin/EditRole';
import HrLeaves from '../screens/HRlogin/HrLeaves';
import AllEmployeesReqExpense from '../screens/HRlogin/AllEmployesReqExp';
import EditEmployeeRegFrom from '../screens/HRlogin/EditEmployeeRegForm';
import Emplyview from '../screens/HRlogin/Emplyview';
import MonthlyReport from '../screens/HRlogin/MonthlyReport';




const Stack=createStackNavigator();
const AppNavigation = () => {
  return (
  //  <></>
  // <NavigationContainer>
   <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">

    <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
    <Stack.Screen name="reqResponse" component={Requestexpense} options={{headerShown:false}}/>
    <Stack.Screen name="BottomNavigation" component={BottomtabNav}  options={{headerShown:false}}/>
    <Stack.Screen name="employeelist" component={Employeelist} options={{headerShown:false}}/>
    <Stack.Screen name="EditEmployeeRegFrom" component={EditEmployeeRegFrom} options={{headerShown:false}}/>
    <Stack.Screen name="Leaves" component={Leaves} options={{headerShown:false}}/>
    <Stack.Screen name="HrLeaves" component={HrLeaves} options={{headerShown:false}}/>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}}/>
    <Stack.Screen name="Myexpenses" component={Myexpense} options={{headerShown:false}}/>
    <Stack.Screen  name="Addedroles" component={AddedRoles}/>
    <Stack.Screen name="Addrole" component={Addrole} options={{headerShown:false}}/>
    <Stack.Screen name="editrole" component={Editrole}/>
    <Stack.Screen name="EmployeeReg" component={EmployeeReg} options={{headerShown:false}}/>
    <Stack.Screen name="EmployeeAttendance" component={EmployeeAttendance} options={{headerShown:false}}/>
    <Stack.Screen name="AddAttendance" component={AddAttendance} options={{headerShown:false}}/>
    <Stack.Screen name="EditAttendance" component={EditAttendance} options={{headerShown:false}}/>
    <Stack.Screen name="MyAttendance" component={MyAttendance} options={{headerShown:false}}/>
    <Stack.Screen name="LeaveDetails"  component={LeaveDetails} options={{headerShown:false}}/> 
    <Stack.Screen name="ApplyLeave" component={ApplyLeave} options={{headerShown:false}}/>
    <Stack.Screen name="AllEmpReqExpenses" component={AllEmployeesReqExpense}/>
    <Stack.Screen name="monthlyreport" component={MonthlyReport}/>
    <Stack.Screen name="Emplyview" component={Emplyview}/>
    
   </Stack.Navigator> 
  // </NavigationContainer>
  );
};

export default AppNavigation;
