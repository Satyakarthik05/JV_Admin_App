import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import BottomNav from "../screens/SalesLogin/BottomNav";
import SalesOrder from "../screens/SalesLogin/SalesOrder";
import AssigntoRsm from "../screens/SalesLogin/AssigntoRsm";
import TargetView from "../screens/SalesLogin/TargetView";
import AddOrder from "../screens/SalesLogin/AddOrder";
import DeliveryRoutes from "../screens/SalesLogin/DelvieryRoutes";
import SaleCustomerList from "../screens/SalesLogin/SaleCustomerList";
import SaleCustomerDetails from "../screens/SalesLogin/SaleCustomerDetails";
import SaleAddCustomer from "../screens/SalesLogin/SaleAddCustomer";
import SaleCreateSale from "../screens/SalesLogin/SaleCreateSale";
import SalePayment from "../screens/SalesLogin/SalePayment";
import NewSaleCompleted from "../screens/SalesLogin/NewSaleCompleted";
import SaleDailyReports from "../screens/SalesLogin/SaleDailyReports";
import SaleAddExpense from "../screens/SalesLogin/SaleAddExpense";
import SalePaymentDetails from "../screens/SalesLogin/SalePaymentDetails";
import TelecallerProfile from "../screens/TelecallerLogin/TelecallerProfile";
import MyAttendance from "../screens/HRlogin/MyAttendance";
import Myexpense from "../screens/HRlogin/Myexpenses";
import MyLeave from "../screens/TelecallerLogin/MyLeave";
import AddAttendance from "../screens/HRlogin/AddAttendance";
import Requestexpense from "../screens/HRlogin/Requestexpense";
import ApplyLeave from "../screens/HRlogin/ApplyLeave";
import ReturnSumary from "../screens/SalesLogin/SaleReturnSumary";
import SaleCart from "../screens/SalesLogin/SaleCart";
import SaleRecordPayment from "../screens/SalesLogin/SaleRecordPayment";
import HrLeaves from "../screens/HRlogin/HrLeaves";
import HomeSale from "../screens/SalesLogin/HomeSale";
import AddExpenseScreen from "../screens/DriverLogin/AddExpenseScreen";





const Stack = createStackNavigator();
const SalesNavigation = () => {
    return (
        // <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SaleHome" >
                <Stack.Screen name="SaleHome" component={HomeSale} options={{headerShown:false}}/>
                <Stack.Screen name="BottomNav"  component={BottomNav} options={{headerShown:false}}/>
                <Stack.Screen name="SalesOrder" component={SalesOrder} options={{ headerShown: false }} />
                <Stack.Screen name="AssigntoRsm" component={AssigntoRsm} options={{headerShown:false}} />
                <Stack.Screen name="TargetView" component={TargetView} options={{headerShown:false}} />
                <Stack.Screen name="AddOrder" component={AddOrder} options={{headerShown:false}} />
                <Stack.Screen name="DeliveryRoutes" component={DeliveryRoutes} options={{headerShown:false}}/>
                <Stack.Screen name="SaleCustomerList" component={SaleCustomerList} options={{headerShown:false}}/>
                <Stack.Screen name="SaleCustomerDetails" component={SaleCustomerDetails} options={{headerShown:false}}/>
                <Stack.Screen name="SaleAddCustomer" component={SaleAddCustomer} options={{headerShown:false}}/>
                <Stack.Screen name="SaleCreateSale" component={SaleCreateSale} options={{headerShown:false}}/>
                <Stack.Screen name="SalePayment" component={SalePayment} options={{headerShown:false}}/>
                <Stack.Screen name="NewSaleCompleted" component={NewSaleCompleted} options={{headerShown:false}}/>
                <Stack.Screen name="SaleDailyReports" component={SaleDailyReports} options={{headerShown:false}}/>

                {/* <Stack.Screen name="SaleAddExpense" component={SaleAddExpense} options={{headerShown:false}}/> */}
                <Stack.Screen name="AddExpenseScreen" component={AddExpenseScreen} options={{headerShown:false}}/>


                <Stack.Screen name="SalePaymentDetails" component={SalePaymentDetails} options={{headerShown:false}}/>
                <Stack.Screen name="SaleCart" component={SaleCart} options={{headerShown:false}}/>
                <Stack.Screen name="SaleRecordPayment" component={SaleRecordPayment} options={{headerShown:false}}/>
                <Stack.Screen name="TelecallerProfile" component={TelecallerProfile}/>
                <Stack.Screen name="MyAttendance" component={MyAttendance}/>
                <Stack.Screen name="Myexpenses" component={Myexpense}/>
                {/* <Stack.Screen name="MyLeave" component={MyLeave}/>  */}
                <Stack.Screen name="HrLeaves" component={HrLeaves}/> 

                <Stack.Screen name="AddAttendance" component={AddAttendance}/>
                <Stack.Screen name="reqResponse" component={Requestexpense}/>
                <Stack.Screen name="ApplyLeave" component={ApplyLeave}/>
                <Stack.Screen name="ReturnSumary" component={ReturnSumary}/>
            </Stack.Navigator>



//  <Stack.Screen name="MyAttendance" component={MyAttendance}/>
//  <Stack.Screen name="Myexpenses" component={Myexpense}/>
//  <Stack.Screen name="MyLeave" component={MyLeave}/> 
    )
};

export default SalesNavigation;