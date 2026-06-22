import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Accounts from "../screens/AccountsLogin/Accounts";
import TelecallerProfile from "../screens/TelecallerLogin/TelecallerProfile";
import Requestexpense from "../screens/HRlogin/Requestexpense";
import Myexpense from "../screens/HRlogin/Myexpenses";
import AddAttendance from "../screens/HRlogin/AddAttendance";
import MyAttendance from "../screens/HRlogin/MyAttendance";
import ApplyLeave from "../screens/HRlogin/ApplyLeave";
import MyLeave from "../screens/TelecallerLogin/MyLeave";
import BottomTabAccounts from "../screens/AccountsLogin/BottomTabAcc";
import AssignRoute from "../screens/AccountsLogin/AssignRoute";
import AssignedCustomer from "../screens/AccountsLogin/AssignedCustomer";
import AddAssignedDriver from "../screens/AccountsLogin/AddAssignedDriver";
//import AddSales from "../screens/AccountsLogin/AddSales";
import AllSales from "../screens/AccountsLogin/AllSales";
import SalesOverView from "../screens/AccountsLogin/SalesOverView";
import AddSalesInSales from "../screens/AccountsLogin/AddSalesInSales";
import FactorySales from "../screens/AccountsLogin/FactorySales";
import FactorySalesOverView from "../screens/AccountsLogin/FactorySalesOverView";
import DistributorSales from "../screens/AccountsLogin/DistributorSales";
import DistributorSalesOverView from "../screens/AccountsLogin/DistributorSalesOverView";
import AddSalesInFactorySales from "../screens/AccountsLogin/AddSalesInFactorysale";
import AddSalesInDistributorsales from "../screens/AccountsLogin/AddSalesInDistributorSales";
import HrLeaves from "../screens/HRlogin/HrLeaves";
import VehicleDetailsData from "../screens/AccountsLogin/VehicleDetailsData";
import AddVehicleDetails from "../screens/AccountsLogin/AddVehicledetails";
import EditVehicleDetails from "../screens/AccountsLogin/EditVehicleDetails";
import EditAssignDriver from "../screens/AccountsLogin/EditAssignDriver";
import AddAccExpenses from "../screens/AccountsLogin/AddAccExpenses";
import DistributorSaleItems from "../screens/AccountsLogin/DistributorSaleItems";
import FactorySaleItems from "../screens/AccountsLogin/FactorySaleItems";
import AssignedStock from "../screens/AccountsLogin/AssignedStock";
import Stock from "../screens/AccountsLogin/Sales";
import AccCustomerDetails from "../screens/AccountsLogin/AccCustomerDetails";
import AccCustomerDetailsitems from "../screens/AccountsLogin/AccCustomerDetailsItems";

const Stack = createStackNavigator();
const AppNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Accounts">

            <Stack.Screen name="Accounts" component={Accounts} />
            <Stack.Screen  name="BottomTabAcc" component={BottomTabAccounts}/>
            <Stack.Screen name="AssignRoute" component={AssignRoute}/>
            <Stack.Screen name="AssignCustomer" component={AssignedCustomer}/>
            <Stack.Screen name="AddAssignedDriver" component={AddAssignedDriver}/>
            <Stack.Screen name="AssignedStock" component={AssignedStock}/>
            <Stack.Screen name="StockData" component={AllSales}/>
            {/* <Stack.Screen name="StockData" component={Stock}/> */}
            <Stack.Screen name="SalesOverView" component={SalesOverView}/>
            <Stack.Screen name="AddSalesInSales" component={AddSalesInSales}/>

            <Stack.Screen name="FactorySales" component={FactorySales}/>
            <Stack.Screen name="FactorySalesOverView" component={FactorySalesOverView}/>
            <Stack.Screen name="AddSalesInFactorySales" component={AddSalesInFactorySales}/>
            <Stack.Screen name="Factoryitemsdata" component={FactorySaleItems}/>

            <Stack.Screen name="DistributorSales" component={DistributorSales}/>
            <Stack.Screen name="DistributorSalesOverView" component={DistributorSalesOverView}/>
            <Stack.Screen name="AddSalesInDistributorsales" component={AddSalesInDistributorsales}/>
            <Stack.Screen name="distributoritems" component={DistributorSaleItems}/>


            <Stack.Screen name="VehicleDetails" component={VehicleDetailsData}/>
            <Stack.Screen name="AddVehicleData" component={AddVehicleDetails}/>
            <Stack.Screen name="EditvehicleDetails" component={EditVehicleDetails}/>

            <Stack.Screen name="EditAssignDriver" component={EditAssignDriver}/>

            <Stack.Screen name="AddAccExpenses" component={AddAccExpenses}/>


              {/* Accounts Customer Details(Distributor Orders Data) */}
             <Stack.Screen name="AccCustomerDetails" component={AccCustomerDetails}/>
             <Stack.Screen name="AccCustomerDetailsItems" component={AccCustomerDetailsitems}/>










            <Stack.Screen name="TelecallerProfile" component={TelecallerProfile} />
            <Stack.Screen name="reqResponse" component={Requestexpense} options={{ headerShown: false }} />
            <Stack.Screen name="Myexpenses" component={Myexpense} options={{ headerShown: false }} />
            <Stack.Screen name="AddAttendance" component={AddAttendance} options={{ headerShown: false }} />
            <Stack.Screen name="MyAttendance" component={MyAttendance} options={{ headerShown: false }} />
            <Stack.Screen name="ApplyLeave" component={ApplyLeave} options={{ headerShown: false }} />
            {/* <Stack.Screen name="MyLeave" component={MyLeave}/> */}
            <Stack.Screen name="HrLeaves" component={HrLeaves}/> 

        </Stack.Navigator>
    )
}
export default AppNavigation;