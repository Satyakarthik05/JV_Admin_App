import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Telecallerhome from "../screens/TelecallerLogin/Telecallhome";
import BottomtabTC from "../screens/TelecallerLogin/BottomtabTC";
import Telecaller from "../screens/TelecallerLogin/Telecaller";
import Followups from "../screens/TelecallerLogin/FollowUps";
import TelecallerProfile from "../screens/TelecallerLogin/TelecallerProfile";
import AddFollowUp from "../screens/TelecallerLogin/AddFollowUp";
import Calllogdetails from "../screens/TelecallerLogin/CallLogDetails";
import Addlead from "../screens/TelecallerLogin/AddLead";
import EditLead from "../screens/TelecallerLogin/EditLead";
import AddCallLog from "../screens/TelecallerLogin/AddCallLog";
import EditFollowups from "../screens/TelecallerLogin/EditFollowUps";
import ImportLead from "../screens/TelecallerLogin/ImportLeads";
import AddAttendance from "../screens/HRlogin/AddAttendance";
import ApplyLeave from "../screens/HRlogin/ApplyLeave";
import Requestexpense from "../screens/HRlogin/Requestexpense";
import AddOrder from "../screens/TelecallerLogin/AddSale";
import MyAttendance from "../screens/HRlogin/MyAttendance";
import Myexpense from "../screens/HRlogin/Myexpenses";
import MyLeave from "../screens/TelecallerLogin/MyLeave";
import HrLeaves from "../screens/HRlogin/HrLeaves";
import Customers from "../screens/TelecallerLogin/Customers";
import EditSale from "../screens/TelecallerLogin/EditSale";
import AddedSale from "../screens/TelecallerLogin/AddedSale";
import AddSale from "../screens/TelecallerLogin/AddSale";
import SaleItems from "../screens/TelecallerLogin/SaleItems";
import LeadFullDetails from "../screens/TelecallerLogin/LeadFullDetails";
import QuestionAndAns from "../screens/TelecallerLogin/QuestionsAndAns";
import FollowUpReport from "../screens/TelecallerLogin/FollowUpReport";
import QuestionAndAnsForm from "../screens/TelecallerLogin/QnsAndAnsForm";
import EditQuestionAndAnsForm from "../screens/TelecallerLogin/EditQuestionForm";
import EditQuestionForm from "../screens/TelecallerLogin/EditQuestionForm";
//import ProductSetupScreen from "../screens/TelecallerLogin/ProductsSetUpKissantart";
//import KisaanKarthome from "../screens/TelecallerLogin/Kisannkarthome";

const Stack=createStackNavigator();
const AppNavigation=()=>{
    return(
        // <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Telecallerhome">
                <Stack.Screen name="Telecallerhome" component={Telecallerhome}/>
                <Stack.Screen name="BottomtabTC" component={BottomtabTC}/>
                <Stack.Screen name="Telecaller" component={Telecaller}/>
                <Stack.Screen name="FollowUps" component={Followups}/>
                <Stack.Screen name="customers" component={Customers}/>
                <Stack.Screen name="TelecallerProfile" component={TelecallerProfile}/>
                <Stack.Screen name="MyAttendance" component={MyAttendance}/>
                <Stack.Screen name="AddFollowUp" component={AddFollowUp}/>
                <Stack.Screen name="Calllogdetails" component={Calllogdetails}/>
                <Stack.Screen name="addlead" component={Addlead}/>
                <Stack.Screen name="EditLead" component={EditLead}/>
                <Stack.Screen name="AddCallLog" component={AddCallLog}/>
                <Stack.Screen name="EditFollowups" component={EditFollowups}/>
                <Stack.Screen name="ImportLeads" component={ImportLead}/>
                <Stack.Screen name="AddAttendance" component={AddAttendance}/>
                <Stack.Screen name="ApplyLeave" component={ApplyLeave}/>
                <Stack.Screen name="reqResponse" component={Requestexpense}/>
                <Stack.Screen name="AddSale" component={AddSale}/>
                <Stack.Screen name="AddedSale" component={AddedSale}/>
                <Stack.Screen name="saleItems" component={SaleItems}/>
                <Stack.Screen name="EditSale" component={EditSale}/>
                {/* <Stack.Screen name="MyLeave" component={MyLeave}/>  */}
                <Stack.Screen name="HrLeaves" component={HrLeaves}/>
                <Stack.Screen name="LeadDetails" component={LeadFullDetails}/> 
                <Stack.Screen name="QuestionsAns" component={QuestionAndAns}/>
                <Stack.Screen name="QuestionForm" component={QuestionAndAnsForm}/>
                <Stack.Screen name="followupReport" component={FollowUpReport}/>
                <Stack.Screen name="EditQnsForm" component={EditQuestionForm}/>

                <Stack.Screen name="Myexpenses" component={Myexpense}/>

                {/* <Stack.Screen name="productssetUp" component={ProductSetupScreen}/>
                <Stack.Screen name="kissankarthome" component={KisaanKarthome}/> */}
            </Stack.Navigator>
        //  </NavigationContainer>
    )
}
export default AppNavigation;