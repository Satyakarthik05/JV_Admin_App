import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import MasterData from "../screens/MasterLogin/MasterData";
import ProductMaster from "../screens/MasterLogin/ProductMaster";
import AddCategory from "../screens/MasterLogin/AddCategory";
import AddProduct from "../screens/MasterLogin/AddProduct";
import ProductInventrycontrol from "../screens/MasterLogin/ProductInventrycontrol";
import EditProduct from "../screens/MasterLogin/EditProduct";
import AccessoryMaster from "../screens/MasterLogin/AccessoryMaster";
import AddAccessory from "../screens/MasterLogin/AddAccessory";
import AccessoryInventoryControl from "../screens/MasterLogin/AccessoryInventoryControl";
import EditAccessory from "../screens/MasterLogin/EditAccessory";
import AddInventoryControl from "../screens/MasterLogin/AddInventoryControl";
import Rawmaterialsmaster from "../screens/MasterLogin/RawMaterialsMaster";
import Addrawmaterial from "../screens/MasterLogin/AddRawMaterial";
import Addpurchase from "../screens/MasterLogin/AddPurchase";
import Rawmaterialtransfer from "../screens/MasterLogin/RawMaterialTransfer";
import Addmaterialtransfer from "../screens/MasterLogin/AddMaterialTransfer";
import Editmaterialtransfer from "../screens/MasterLogin/EditMaterialTransfer";
import TelecallerProfile from "../screens/TelecallerLogin/TelecallerProfile";
import MyAttendance from "../screens/HRlogin/MyAttendance";
import ApplyLeave from "../screens/HRlogin/ApplyLeave";
import Myexpense from "../screens/HRlogin/Myexpenses";
import Requestexpense from "../screens/HRlogin/Requestexpense";
import AddAttendance from "../screens/HRlogin/AddAttendance";
import MyLeave from "../screens/TelecallerLogin/MyLeave";
import AddCategoryRaw from "../screens/MasterLogin/AddCategoryRaw";
import AddCategoryAccessory from "../screens/MasterLogin/AddCategoryAccessory";
import AddedCategory from "../screens/MasterLogin/AddedCategory";
import Editrole from "../screens/HRlogin/EditRole";
import EditCategory from "../screens/MasterLogin/EditCategory";
import AddedAccessoryCategory from "../screens/MasterLogin/AddedAccCategoey";
import EditAccessoryCategory from "../screens/MasterLogin/EditAccCategory";
import AddedRawCategory from "../screens/MasterLogin/AddedRawCategory";
import EditRawCategory from "../screens/MasterLogin/EditRawCategory";
import InventoryControlData from "../screens/MasterLogin/InventoryControlData";
import PurchaseData from "../screens/MasterLogin/PurchaseData";
import AccessoriesOverView from "../screens/MasterLogin/AccessoriesOverView";
import ProductsOverView from "../screens/MasterLogin/ProductsOverView";
import HrLeaves from "../screens/HRlogin/HrLeaves";
import EditRawMaterial from "../screens/MasterLogin/EditRawMaterial";
import EditPurchase  from "../screens/MasterLogin/EditPurchase";
import EditInventoryControl from "../screens/MasterLogin/EditInventoryControl";
import RawMaterialTransferGive from "../screens/MasterLogin/RawMaterialTransferGive";
import RawMaterialTrasferItems from "../screens/MasterLogin/RawMaterialTransferItems";
import RawMaterialProducts from "../screens/MasterLogin/RawMaterialProducts";
import AddedUnits from "../screens/MasterLogin/AddedUnits";
import AddUnit from "../screens/MasterLogin/AddUnit";
import EditUnit from "../screens/MasterLogin/EditUnit";
import TakenProducts from "../screens/MasterLogin/TakenProducts";
import ProductsTakenData from "../screens/MasterLogin/ProductsTakenData";
import SupplierData from "../screens/MasterLogin/SuplierData";
import AddSupplier from "../screens/MasterLogin/AddSupplier";
import EditSupplier from "../screens/MasterLogin/EditSupplier";
import CopakersData from "../screens/MasterLogin/CopackersData";
import AddCopackers from "../screens/MasterLogin/AddCopackers";
import EditCopackers from "../screens/MasterLogin/EditCopackers";
import AddPassword from "../screens/MasterLogin/AddPassword";
import Passwords from "../screens/MasterLogin/Passwors";
import ApproveStockData from "../screens/MasterLogin/ApproveStockData";
import ProductionDetails from "../screens/MasterLogin/ProductionDetails";
import ProductionStock from "../screens/MasterLogin/ProductionStock";
import DriverStock from "../screens/MasterLogin/DriverStock";
import DriverStockDetails from "../screens/MasterLogin/DriverStockDetails";

const Stack=createStackNavigator();
const  AppNavigation=()=>{
    return(
        // <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="MasterData">

                {/* Product Master */}
                <Stack.Screen name="MasterData" component={MasterData} options={{headerShown: false}}/>
                <Stack.Screen name="productmaster" component={ProductMaster} options={{headerShown:false}}/> 
                <Stack.Screen name="addcategory" component={AddCategory} options={{headerShown:false}}/>
                <Stack.Screen name="AddProduct" component={AddProduct} options={{headerShown:false}}/>
                <Stack.Screen name="ProductInventrycontrol" component={ProductInventrycontrol} options={{headerShown:false}}/> 
                <Stack.Screen name="EditProduct" component={EditProduct} /> 
                <Stack.Screen name="addedcategories" component={AddedCategory}/>
                <Stack.Screen name="editcategory" component={EditCategory}/>

                {/* Accessories Master */}
                <Stack.Screen name="AccessoryMaster" component={AccessoryMaster}/>
                <Stack.Screen name="AddAccessory" component={AddAccessory}/>
                <Stack.Screen name="AccessoryInventoryControl" component={AccessoryInventoryControl}/>
                <Stack.Screen name="EditAccessory" component={EditAccessory}/>
                <Stack.Screen name="AddInventoryControl" component={AddInventoryControl}/>
                <Stack.Screen name="AddCategoryAccessory" component={AddCategoryAccessory}/>
                <Stack.Screen name="AddedAccCategory" component={AddedAccessoryCategory}/>
                <Stack.Screen name="editAcccategory" component={EditAccessoryCategory}/>
                <Stack.Screen name="InventoryControlData" component={InventoryControlData}/>
                <Stack.Screen name="AccessoryoverView" component={AccessoriesOverView}/>
                <Stack.Screen name="EditInventoryControl" component={EditInventoryControl}/>

                {/* Raw Materials Master */}
                <Stack.Screen name="Rawmaterialsmaster" component={Rawmaterialsmaster}/>
                <Stack.Screen name="addrawmaterial" component={Addrawmaterial}/>
                <Stack.Screen  name="addpurchase" component={Addpurchase}/>
                <Stack.Screen name="AddCategoryRaw" component={AddCategoryRaw}/>
                <Stack.Screen name="addedrawCategory" component={AddedRawCategory}/>
                <Stack.Screen name="editrawcategory" component={EditRawCategory}/>
                <Stack.Screen name="purchaseData" component={PurchaseData}/>
                <Stack.Screen name="productsoverview" component={ProductsOverView}/>
                <Stack.Screen name="EditRawMaterial" component={EditRawMaterial}/>
                <Stack.Screen name="EditpurchaseScreen" component={EditPurchase}/>
                <Stack.Screen name="SupplierData" component={SupplierData}/>
                <Stack.Screen name="addSupplierInfo" component={AddSupplier}/>
                <Stack.Screen name="editsupplierData" component={EditSupplier}/>


                 {/* Raw Materials Transfer */}
                <Stack.Screen name="rawmaterialGiven" component={RawMaterialTransferGive}/>
                <Stack.Screen name="rawmaterialstransfer" component={Rawmaterialtransfer}/>
                <Stack.Screen name="Addmaterialtransfer" component={Addmaterialtransfer}/>
                <Stack.Screen name="Editmaterialtransfer" component={Editmaterialtransfer}/>
                <Stack.Screen name="RawmaterialTransferItems" component={RawMaterialTrasferItems}/>
                <Stack.Screen name="RawMaterailProducts" component={RawMaterialProducts}/>
                <Stack.Screen name="addedUnit" component={AddedUnits}/>
                <Stack.Screen name="addunit" component={AddUnit}/>
                <Stack.Screen name="editUnit" component={EditUnit}/>
                
                <Stack.Screen name="CopackersData" component={CopakersData}/>
                <Stack.Screen name="AddCopackers" component={AddCopackers}/>
                <Stack.Screen name="editCopackers" component={EditCopackers}/>


                {/* New */}
                <Stack.Screen name="master" component={MasterData}/>
                {/* New */}


               {/* Raw material Transfer */}
               <Stack.Screen name="ProductsTaken" component={TakenProducts}/>
               <Stack.Screen name="TakenData" component={ProductsTakenData}/>
               
                 <Stack.Screen name="addpassword" component={AddPassword}/>
                {/* common screens */}
                <Stack.Screen name="TelecallerProfile" component={TelecallerProfile}/>
                {/* <Stack.Screen name="MyLeave" component={MyLeave}/> */}
                <Stack.Screen name="HrLeaves" component={HrLeaves}/> 
                <Stack.Screen name="MyAttendance" component={MyAttendance}/>
                <Stack.Screen name="ApplyLeave" component={ApplyLeave}/>
                <Stack.Screen name="Myexpenses" component={Myexpense}/>
                <Stack.Screen name="reqResponse" component={Requestexpense}/>
                <Stack.Screen name="AddAttendance" component={AddAttendance}/>
                
                <Stack.Screen name="passwords" component={Passwords}/>
                <Stack.Screen name="ApproveStock" component={ApproveStockData}/>
                <Stack.Screen name="ProductionStock" component={ProductionStock}/>
                <Stack.Screen name="ProductionDetails" component={ProductionDetails}/>
                <Stack.Screen name="DriverStock" component={DriverStock}/>
                <Stack.Screen name="DriverStockDetails" component={DriverStockDetails}/>

            </Stack.Navigator>
        // </NavigationContainer>
    )
}
export default AppNavigation