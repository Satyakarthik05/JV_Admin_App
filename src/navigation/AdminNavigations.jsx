import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AdminHome from "../screens/AdminLogin/AdminHome";

import HRlogin from '../navigation/HRlogin';
import MasterNav from '../navigation/MasterNav';
import TelecallerNav from '../navigation/TelecallerNav';
import ProductionNav from '../navigation/ProductionNav';
import SalesNavigation from "./SalesNavigation";
import DriverNavigation from "./DriverNavigation";
import AccountsNav from './AccountsNav';
import BottomtabTC from "../screens/TelecallerLogin/BottomtabTC";
import BottomNav from "../screens/SalesLogin/BottomNav";
import BottomTabNav from "../screens/DriverLogin/BottomNavigation";
import BottomTabAccounts from "../screens/AccountsLogin/BottomTabAcc";
import ProfileScreen from "../screens/HRlogin/Profilescreen";
import Bottomtabnav from "../screens/HRlogin/BottomtabNav";
import EmployeeDetailsScreen from "../screens/HRlogin/Emplyview";
import QuestionAndAns from "../screens/TelecallerLogin/QuestionsAndAns";
import FollowUpReport from "../screens/TelecallerLogin/FollowUpReport";
import LeadFullDetails from "../screens/TelecallerLogin/LeadFullDetails";
import AssignRoute from "../screens/AccountsLogin/AssignRoute";
import AssignedCustomer from "../screens/AccountsLogin/AssignedCustomer";
import AssignedStock from "../screens/AccountsLogin/AssignedStock";
import AllSales from "../screens/AccountsLogin/AllSales";
import SalesOverView from "../screens/AccountsLogin/SalesOverView";
import FactorySales from "../screens/AccountsLogin/FactorySales";
import FactorySalesOverView from "../screens/AccountsLogin/FactorySalesOverView";
import DistributorSales from "../screens/AccountsLogin/DistributorSales";
import DistributorSalesOverView from "../screens/AccountsLogin/DistributorSalesOverView";
import VehicleDetailsData from "../screens/AccountsLogin/VehicleDetailsData";
import AccCustomerDetails from "../screens/AccountsLogin/AccCustomerDetails";
import AccCustomerDetailsitems from "../screens/AccountsLogin/AccCustomerDetailsItems";
import AddedSale from "../screens/TelecallerLogin/AddedSale";
import QuestionAndAnsForm from "../screens/TelecallerLogin/QnsAndAnsForm";
import EditQuestionForm from "../screens/TelecallerLogin/EditQuestionForm";
import Passwords from "../screens/MasterLogin/Passwors";


const Stack = createStackNavigator();
const AdminNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="adminhome">


            <Stack.Screen name="adminhome" component={AdminHome} />

            {/* Hr login */}
            <Stack.Screen name="hrlogin" component={HRlogin} />
            <Stack.Screen name="hrloginBT" component={Bottomtabnav} />
            <Stack.Screen name="Emplyview" component={EmployeeDetailsScreen}/>


            {/* Master Login */}
            <Stack.Screen name="master" component={MasterNav} />


            {/* Telecaller Login */}
            <Stack.Screen name="telecaller" component={TelecallerNav} />
            <Stack.Screen name="telecallerBT" component={BottomtabTC} />
            <Stack.Screen name="QuestionsAns" component={QuestionAndAns}/>
            <Stack.Screen name="followupReport" component={FollowUpReport}/>
            <Stack.Screen name="LeadDetails" component={LeadFullDetails}/>
            <Stack.Screen name="AddedSale" component={AddedSale}/>
            <Stack.Screen name="QuestionForm" component={QuestionAndAnsForm}/>
            <Stack.Screen name="EditQnsForm" component={EditQuestionForm}/>




            <Stack.Screen name="production" component={ProductionNav} />
            <Stack.Screen name="sales" component={SalesNavigation} />
            <Stack.Screen name="driver" component={DriverNavigation} />


            {/* Accounts */}
            <Stack.Screen name="Accounts" component={AccountsNav} />
            <Stack.Screen name="AccountsBT" component={BottomTabAccounts} />

            <Stack.Screen name="AssignRoute" component={AssignRoute}/>
            <Stack.Screen name="AssignCustomer" component={AssignedCustomer}/>

            <Stack.Screen name="AssignedStock" component={AssignedStock}/>
            <Stack.Screen name="SalesOverView" component={SalesOverView}/>

            <Stack.Screen name="FactorySales" component={FactorySales}/>
            <Stack.Screen name="FactorySalesOverView" component={FactorySalesOverView}/>

            <Stack.Screen name="DistributorSales" component={DistributorSales}/>
            <Stack.Screen name="DistributorSalesOverView" component={DistributorSalesOverView}/>

            <Stack.Screen name="VehicleDetails" component={VehicleDetailsData}/>

            <Stack.Screen name="AccCustomerDetails" component={AccCustomerDetails}/>
            <Stack.Screen name="AccCustomerDetailsItems" component={AccCustomerDetailsitems}/>
            
           
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="passwords" component={Passwords}/>


            
            


           
            {/* <Stack.Screen name="telecallerBottomTab" component={BottomtabTC} />
            <Stack.Screen name="salesBottomTab" component={BottomNav} />
            <Stack.Screen name="driverBottomTab" component={BottomTabNav} />
            <Stack.Screen name="AccountsBottomTab" component={BottomTabAccounts} /> */}
           
            
            

        </Stack.Navigator>
    )
}
export default AdminNavigation;