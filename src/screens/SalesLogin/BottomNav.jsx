import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeSale from "./HomeSale";
import { colors } from "../../config/theme";
import { Customer,  Expenses,  Profile, Sales } from "../../components/svgs";
// import SaleExpenses from "./SaleExpenses";
import SaleProfile from "./SaleProfile";
import SaleCustomer from "./saleCustomers";
import SaleExpenses from "./SaleExpenses";
import TelecallerProfile from "../TelecallerLogin/TelecallerProfile";
import SalesOrder from "./SalesOrder";




const Tab = createBottomTabNavigator();
const BottomNav = () => {
    return(
        <Tab.Navigator
        //  initialRouteName="HomeSale"
        initialRouteName="SalesOrder"
         screenOptions={{
            headerShown:false,
            tabBarShowLabel:true,
            tabBarActiveTintColor:"#ef3d3b",
            tabBarInactiveTintColor:"#aeaeae",
            tabBarStyle:{
                backgroundColor:colors.white,
                height:60,
                borderTopWidth:0.5,
                borderTopColor:"#ccc"
            },
            tabBarLabelStyle:{
                fontSize:13,
                marginBottom:4,
                fontWeight:"600"
            }
         }}
        >
            {/* name="HomeSale" component={HomeSale} */}
            <Tab.Screen  name="SalesOrder" component={SalesOrder}
            options={{tabBarLabel:"Sales",tabBarIcon:({color,size})=>(
                <Sales width={size} height={size} fill={color}/>
            )}}
            />

            <Tab.Screen name="SaleCustomer" component={SaleCustomer}
            options={{tabBarLabel:"Customers",tabBarIcon:({color,size})=>(
                <Customer width={size} height={size} fill={color}/>
            )}}
            />

           <Tab.Screen name="SaleExpenses" component={SaleExpenses}
           options={{tabBarLabel:"Expenses",tabBarIcon:({color,size}) => (
             <Expenses width={size} height={size} color={color}/>
           )}}
           />

          <Tab.Screen name="TelecallerProfile" component={TelecallerProfile}
           options={{tabBarLabel:"Profile",tabBarIcon:({color,size})=>(
            <Profile width={size} height={size} fill={color}/>
           )}}
          />

        </Tab.Navigator>
    )
}
export default BottomNav;