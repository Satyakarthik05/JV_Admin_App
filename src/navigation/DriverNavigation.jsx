import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SplashScreen from "../screens/DriverLogin/SplashScreen";
import SignIn from "../screens/DriverLogin/LoginScreen";
import MyDeliveryRoutes from "../screens/DriverLogin/MyDelivery_Routes";
import AddExpenseScreen from "../screens/DriverLogin/AddExpenseScreen";
import VehicleReadingScreen from "../screens/DriverLogin/Vehicle_Reading";
import CustomerList from "../screens/DriverLogin/CustomerList";
import CustomerDetails from "../screens/DriverLogin/CustomerDetails";
import CreateSale from "../screens/DriverLogin/Createsale";
import PaymentScreen from "../screens/DriverLogin/Payment";
import SaleCompleted from "../screens/DriverLogin/SaleCompleted";
import AddCustomerScreen from "../screens/DriverLogin/AddcustomerScreen";
import AddReturnScreen from "../screens/DriverLogin/AddReturnScreen";
import DailyReports from "../screens/DriverLogin/DailyClosingReport";
import PaymentDetails from "../screens/DriverLogin/PaymentDetails";
import BottomTabNav from "../screens/DriverLogin/BottomNavigation";
import Home from "../screens/DriverLogin/Home";
import TelecallerProfile from "../screens/TelecallerLogin/TelecallerProfile";
import MyAttendance from "../screens/HRlogin/MyAttendance";
import Myexpense from "../screens/HRlogin/Myexpenses";
import MyLeave from "../screens/TelecallerLogin/MyLeave";
import AddAttendance from "../screens/HRlogin/AddAttendance";
import Requestexpense from "../screens/HRlogin/Requestexpense";
import ApplyLeave from "../screens/HRlogin/ApplyLeave";
import ReturnsSummaryScreen from "../screens/DriverLogin/ReturnsSummaryScreen";
import RecordPayment from "../screens/DriverLogin/RecordPayment";
import HrLeaves from "../screens/HRlogin/HrLeaves";
import DriverHome from "../screens/DriverLogin/DriverHome";
import EditCustomerScreen from "../screens/DriverLogin/EditCustomerScreen";
import RouteMapScreen from "../screens/DriverLogin/RouteMapScreen";
import CustomerfullDetails from "../screens/DriverLogin/CustomerFullData";
const Stack = createStackNavigator();
const DriverNavigation = () => {
    return (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="DriverHome" >
                {/* <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} /> */}
                {/* <Stack.Screen name="LoginScreen" component={SignIn} options={{ headerShown: false }} />  name="DriverHome" component={DriverHome} */}
                <Stack.Screen name="DriverHome" component={DriverHome} options={{headerShown:false}}/>
                <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
                <Stack.Screen name="BottomTabNav" component={BottomTabNav} options={{ headerShown: false }} />
                <Stack.Screen name="MyDelivery_Routes" component={MyDeliveryRoutes} options={{ headerShown: false }} />
                <Stack.Screen name="AddExpenseScreen" component={AddExpenseScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Vehicle_Reading" component={VehicleReadingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CustomerList" component={CustomerList} options={{ headerShown: false }} />
                <Stack.Screen name="CustomerDetails" component={CustomerDetails} options={{ headerShown: false }} />
                <Stack.Screen name="CreateSale" component={CreateSale} options={{ headerShown: false }} />
                <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SaleCompleted" component={SaleCompleted} options={{ headerShown: false }} />
                <Stack.Screen name="AddCustomerScreen" component={AddCustomerScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AddReturnScreen" component={AddReturnScreen} options={{ headerShown: false }} />
                <Stack.Screen name="DailyReports" component={DailyReports} options={{ headerShown: false }} />
                <Stack.Screen name="PaymentDetails" component={PaymentDetails} options={{ headerShown: false }} />
                <Stack.Screen name="ReturnsSummaryScreen" component={ReturnsSummaryScreen} options={{headerShown:false}}/>
                <Stack.Screen name="RecordPayment" component={RecordPayment} options={{headerShown:false}}/>

                <Stack.Screen name="EditCustomer" component={EditCustomerScreen} options={{headerShown:false}}/>


                {/* <Stack.Screen name="RouteMap" component={RouteMapScreen} options={{headerShown:false}}/> */}
                <Stack.Screen name="CustomerfullDetails" component={CustomerfullDetails} options={{headerShown:false}}/>


                <Stack.Screen name="TelecallerProfile" component={TelecallerProfile}/>
                <Stack.Screen name="MyAttendance" component={MyAttendance}/>
                <Stack.Screen name="Myexpenses" component={Myexpense}/>
                {/* <Stack.Screen name="MyLeave" component={MyLeave}/>  */}
                <Stack.Screen name="HrLeaves" component={HrLeaves}/> 

                <Stack.Screen name="AddAttendance" component={AddAttendance}/>
                <Stack.Screen name="reqResponse" component={Requestexpense}/>
                <Stack.Screen name="ApplyLeave" component={ApplyLeave}/>
            </Stack.Navigator>

    );
};

export default DriverNavigation;