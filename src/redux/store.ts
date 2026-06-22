import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthSlice from './reducers/auth';

//hr
import allrolesAuth from '../redux/reducers/HRLogin/Roles';
import empregAuth from '../redux/reducers/HRLogin/Empreg';
import loginAuth from '../redux/reducers/HRLogin/Login';//login screen
import addrolesAuth from '../redux/reducers/HRLogin/Roles';
import getempAuth from '../redux/reducers/HRLogin/Empreg';
import DeleteRoleAuth from '../redux/reducers/HRLogin/Roles';
import EditRoleAuth from '../redux/reducers/HRLogin/Roles';

import EditEmployeeDataAuth from '../redux/reducers/HRLogin/Empreg';
import DeleteEmployeeRegDataAuth from '../redux/reducers/HRLogin/Empreg';


import PostReqExpenseAuth from '../redux/reducers/HRLogin/ReqExpenses';
import GetReqExpenseAuth from '../redux/reducers/HRLogin/ReqExpenses';
import GetAllEmpReqExpenseAuth from '../redux/reducers/HRLogin/ReqExpenses';
import PatchCallReqExpenseAuth from '../redux/reducers/HRLogin/ReqExpenses';


import PostApplyLeaveAuth from '../redux/reducers/HRLogin/ReqExpenses';
import GetAppliedLeavesAuth from '../redux/reducers/HRLogin/ReqExpenses';
import GetAllLeavesAuth from '../redux/reducers/HRLogin/ReqExpenses';
import PatchCallForEditLeaveAuth from '../redux/reducers/HRLogin/ReqExpenses';

import PostPuncInhAttendanceAuth from '../redux/reducers/HRLogin/ReqExpenses';
import PatchPunchOutAttendace from '../redux/reducers/HRLogin/ReqExpenses';
import PostAttendanceBasedOnDatesAuth from '../redux/reducers/HRLogin/ReqExpenses';
import EditAttendacePatchCallAuth from '../redux/reducers/HRLogin/ReqExpenses';


import EmployeeAttDatesWiseAuth from '../redux/reducers/HRLogin/EmployyeWiseAtt';
import MonthlyReportDatesWiseAuth from '../redux/reducers/HRLogin/EmployyeWiseAtt';
import AllEmployeeAttcountAuth from '../redux/reducers/HRLogin/EmployyeWiseAtt';


import RolesByDepartMentAuth from '../redux/reducers/HRLogin/ReqExpenses';



//master

//password Data 
import GetPswDataAuth from '../redux/reducers/MasterLogin/AddCategory';
import EditPasswordDataAuth from '../redux/reducers/MasterLogin/AddCategory';

import PostAddCategoryInProductMasterAuth from '../redux/reducers/MasterLogin/AddCategory';
import GetCategoriesPMAuth from '../redux/reducers/MasterLogin/AddCategory';
import PatchCategoriesPMAuth from '../redux/reducers/MasterLogin/AddCategory';
import DeleteCategoryPMAuth from '../redux/reducers/MasterLogin/AddCategory';


import AddProductInPMAuth from '../redux/reducers/MasterLogin/AddProduct';//add Product
import GetProductsInPMAuth from '../redux/reducers/MasterLogin/AddProduct';//get Products 
import EditProductInPMAuth from '../redux/reducers/MasterLogin/AddProduct';//edit products
import DeleteProductPMAuth from '../redux/reducers/MasterLogin/AddProduct';//Delete Product
import GetProductStockDataAuth from '../redux/reducers/MasterLogin/AddProduct';//Get Product Stock


import AddRawMaterialCategoryAuth from '../redux/reducers/MasterLogin/AddCategory';//add category in Raw Materail
import GetAllRawCategoryAuth from '../redux/reducers/MasterLogin/AddCategory';//get Raw cAtegories
import DeleteRawCategoriesAuth from '../redux/reducers/MasterLogin/AddCategory';//delete raw material
import EditRawMaterialCategoriesAuth from '../redux/reducers/MasterLogin/AddCategory';//edit category

import AddRawMaterialMasterAuth from '../redux/reducers/MasterLogin/AddProduct';//Add raw Material
import GetRawMaterialDataAuth from '../redux/reducers/MasterLogin/AddProduct';// Get Raw Material Data 
import EditRawMaterialMasterAuth from '../redux/reducers/MasterLogin/AddProduct';//Edit Raw Material
import DeleteRawMaterialDataAuth from '../redux/reducers/MasterLogin/AddProduct';//Delete Raw Material


import AddPurchaseDataAuth from '../redux/reducers/MasterLogin/AddProduct';//Add Purchase
import GetPurchaseDataAuth from '../redux/reducers/MasterLogin/AddProduct';//Get Purchase Data
import EditPurchaseDataAuth from '../redux/reducers/MasterLogin/AddProduct';//Edit Purchase 
import DeletePurchaseAuth from '../redux/reducers/MasterLogin/AddProduct';//Delete Purchase 

import SupplierInformationAuth from '../redux/reducers/MasterLogin/AddProduct';//Add Supplier Information  
import GetSupplierInfoAuth from '../redux/reducers/MasterLogin/AddProduct';//get Supplier Information
import PatchSupInfoAuth from '../redux/reducers/MasterLogin/AddProduct';//Edit Supplier Information
import DelSupInfoAuth from '../redux/reducers/MasterLogin/AddProduct';//Deleet Supplier Information


import PostCopackerAuth from '../redux/reducers/MasterLogin/AddProduct';//addd copacker
import GetCopackersDataAuth from '../redux/reducers/MasterLogin/AddProduct';// get copackers
import patchCopackersDataAuth from '../redux/reducers/MasterLogin/AddProduct';//edit copackers Data
import DelCopackersDataAuth from '../redux/reducers/MasterLogin/AddProduct';//Delete CopackersData





import AddUnitsRawMasterAuth from '../redux/reducers/MasterLogin/AddCategory';
import GetUnitsRawMasterAuth from '../redux/reducers/MasterLogin/AddCategory';
import EditUnitRawMasterAuth from '../redux/reducers/MasterLogin/AddCategory';
import DeleteUnitRawMasterAuth from '../redux/reducers/MasterLogin/AddCategory';

//raw material transfer
import PostRawMaterialTransferAuth from '../redux/reducers/MasterLogin/AddProduct';
import PostTakenProductsRMTAuth from '../redux/reducers/MasterLogin/AddProduct';
import GetSummaryAuth from '../redux/reducers/MasterLogin/AddProduct';
import GetGivenDataAuth from '../redux/reducers/MasterLogin/AddProduct';
import GetTakenDataAuth from '../redux/reducers/MasterLogin/AddProduct';
import EditGivenDataRMTAuth from '../redux/reducers/MasterLogin/AddProduct';


//Accessory Master 
//Category-->type
import AddAccessoryCategoryAuth from '../redux/reducers/MasterLogin/AddCategory';
import GetAccessoryCategoryAuth from '../redux/reducers/MasterLogin/AddCategory';
import EditAccessoryCategoryAuth from '../redux/reducers/MasterLogin/AddCategory';
import DeleteAccessoryCategoryAuth from '../redux/reducers/MasterLogin/AddCategory';

//Accessories
import AddAccessoriesPostCallAuth from '../redux/reducers/MasterLogin/AddProduct';
import GetAccessoriesGetCallAuth from '../redux/reducers/MasterLogin/AddProduct';
import EditAccessoriespatchCallAuth from '../redux/reducers/MasterLogin/AddProduct';
import DeleteAccessoriesDelCallAuth from '../redux/reducers/MasterLogin/AddProduct';

import GetAccessoriesStocksDataAllAuth from '../redux/reducers/MasterLogin/AddProduct';//stock for accessories

// Accessories inventory
import PostAccInventoryAuth from '../redux/reducers/MasterLogin/AddProduct';
import GetAccessoriesInventoryAuth from '../redux/reducers/MasterLogin/AddProduct';
import EditAccInventoryAccDataAuth from '../redux/reducers/MasterLogin/AddProduct';
import DeleteAccInvDataAuth from '../redux/reducers/MasterLogin/AddProduct';





//************************Telecaller Login ***************************//
import AddNewLeadsPostCallAuth from '../redux/reducers/TelecallerLogin/AddCallers';
import GetTelecallerLeadsAuth from '../redux/reducers/TelecallerLogin/AddCallers';
import EditTelecallerLeadsDataAuth from '../redux/reducers/TelecallerLogin/AddCallers';
import DeleteTelecallerLeadsDataAuth from '../redux/reducers/TelecallerLogin/AddCallers';

//import Lead
import ImportLeadsDataAuth from '../redux/reducers/TelecallerLogin/AddCallers';

//call logs
import AddCallLogsPostCallAuth from '../redux/reducers/TelecallerLogin/AddCallers';
import GetCallLogsDataCallAuth from '../redux/reducers/TelecallerLogin/AddCallers';

//questions
import PostQuestionDataAuth from '../redux/reducers/TelecallerLogin/AddCallers';
import GetQuestionDataAuth from '../redux/reducers/TelecallerLogin/AddCallers';
import EditQuestionDataAuth from '../redux/reducers/TelecallerLogin/AddCallers';
import DeleteQuestionsAuth from '../redux/reducers/TelecallerLogin/AddCallers';

//followup Report
import FollowUpsReportDataAuth from '../redux/reducers/TelecallerLogin/AddCallers';


//***********************************************Driver Login *******************************************//
//Add Customers
import AddCustomerDriverAuth from '../redux/reducers/DriverLogin/Forms';
import GetCustomersAuth from '../redux/reducers/DriverLogin/Forms';
import EditCustomerDataAuth from '../redux/reducers/DriverLogin/Forms';
import DeleteCustomerDataAuth from '../redux/reducers/DriverLogin/Forms';

import DriverStockAuth from '../redux/reducers/DriverLogin/DriverStock';


import VehicleReadingDataAuth from '../redux/reducers/DriverLogin/Forms';

import productionReducer from '../redux/reducers/Production/productionSlice';
import productionModuleReducer from '../redux/reducers/Production/productionModuleSlice'


















//***************************************Accounts Login ***************************************************//
import postvehicleDetailsAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import GetVehiclesDetailsDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import EditVehicleDetailsDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import DeleteVehDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';

//Assign Route 
import AddRoutePostCallAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import AllRoutesInAssignRouteAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import GetRoutesDataByIDAuth from '../redux/reducers/AccounsLogin/VehicleDetails';

import EditAssignRouteDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';


//Add Sales fro Driver(stock to driver )
import AddSalesToDriverStockAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import GetDriverStockDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';


//Distributor Sales 
import PostDistributorsSalesDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import DistributorSalesDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';

//factory sale
import PostsalesforFactoryAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import FactorysalesDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';

//DistributorOrder 
import GetOrdersDataAuth from '../redux/reducers/AccounsLogin/VehicleDetails';

//Expenses
import PostAccountsExpensesAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import GetAccountsExpensesAuth from '../redux/reducers/AccounsLogin/VehicleDetails';
import FilterExpensesDataAccAuth  from '../redux/reducers/AccounsLogin/VehicleDetails';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedAuth = persistReducer(persistConfig, AuthSlice);


export const store = configureStore({
  reducer: {
    Auth: persistedAuth,


    //HR Login
    AllRoles: allrolesAuth, // to show added roles in dropdown
    Empreg: empregAuth,  // to add new emp
    Login: loginAuth, // login page
    AddRoles: addrolesAuth, // to add the roles
    DeleteRole: DeleteRoleAuth,//deleted Role
    EditRole: EditRoleAuth,//Edit Role
    GetEmp: getempAuth, //getEmployessData

    EditEmployeeData: EditEmployeeDataAuth,//Edit Employee Regestered  Data
    DeleteEmployeeRegData: DeleteEmployeeRegDataAuth,

    PostReqExpense: PostReqExpenseAuth, //Post call for ReqExpense
    GetReqExpense: GetReqExpenseAuth,//Get Call for ReqExpense id wise
    GetAllEmpReqExpense: GetAllEmpReqExpenseAuth,//Get Call For All Emp Req Expense
    PatchCallReqExpense: PatchCallReqExpenseAuth,//Patch Call For Req Expense 

    PostApplyLeave: PostApplyLeaveAuth,//Post Call For Apply Leave
    GetAppliedLeaves: GetAppliedLeavesAuth,  //Get Call for Applied Leaves id wise
    GetAllLeaves: GetAllLeavesAuth,//Get All Employee Leaves
    PatchCallForEditLeave: PatchCallForEditLeaveAuth,//Edit Leaves 

    PostPunchInAttendance: PostPuncInhAttendanceAuth,//post punch In attendance
    PatchPunchOutAttendance: PatchPunchOutAttendace,//Patch punch Out Attendance
    PostAttendanceBasedOnDates: PostAttendanceBasedOnDatesAuth,//Post call for to get attendance based on dates
    EditAttendacePatchCall: EditAttendacePatchCallAuth,//Edit Attendace Patch Call

    EmployeeAttDatesWise: EmployeeAttDatesWiseAuth,//Employee Att Dates Wise 
    MonthlyReportDatesWise: MonthlyReportDatesWiseAuth,//monthly report
    AllEmployeeAttcount: AllEmployeeAttcountAuth,//

    RolesByDepartment: RolesByDepartMentAuth,//Monthly report,Emp Attendance


    //*********************************Master Login ********************************//

    GetPswData:GetPswDataAuth,
    EditpasswordData:EditPasswordDataAuth,

    //prodct catrgory
    PostAddCategoryInProductMaster: PostAddCategoryInProductMasterAuth,//Post call for Add Category In product master
    GetCategoriesPM: GetCategoriesPMAuth,// get call for category in Product master
    PatchCategoriesPM: PatchCategoriesPMAuth,//Patch call for edit category
    DeleteCategoryPM: DeleteCategoryPMAuth,//Delete Catgory

    //Product
    AddProductInPM: AddProductInPMAuth,//Add Product in  Product Master
    GetProductsInPM: GetProductsInPMAuth,//Get All Products
    EditProductInPM: EditProductInPMAuth,//Edit Products
    DeleteProductsPM: DeleteProductPMAuth,//Delete Product
    GetProductStockData: GetProductStockDataAuth,//Get Product Stock

    // Raw Material Category 
    AddRawMaterialCategory: AddRawMaterialCategoryAuth,//Add raw Materail Category
    GetAllRawCategy: GetAllRawCategoryAuth,//Get Raw Category
    DeleteRawCategories: DeleteRawCategoriesAuth,//Delete Raw Category
    EditRawMaterialCategory: EditRawMaterialCategoriesAuth,//Edit Raw Material Category


    //Raw Material Master
    AddRawMaterialMaster: AddRawMaterialMasterAuth,//Add Raw Material Master
    GetRawMaterialsData: GetRawMaterialDataAuth,//Get Raw Material Data
    EditRawMaterialMaster: EditRawMaterialMasterAuth,//Edit raw Material
    DeleteRawMaterialData: DeleteRawMaterialDataAuth,//Delete Raw Material 

    //Raw Masterial Units
    AddUnitsRawMaster: AddUnitsRawMasterAuth,
    GetUnitsRawMaster: GetUnitsRawMasterAuth,
    EditUnitRawMaster: EditUnitRawMasterAuth,
    DeleteUnitRawMaster: DeleteUnitRawMasterAuth,

    //Purchase
    AddPurchaseData: AddPurchaseDataAuth,
    GetPuchaseData: GetPurchaseDataAuth,
    EditPurchase: EditPurchaseDataAuth,
    DeletePurchase: DeletePurchaseAuth,


    //Supplier Information 
    SupplierInformation:SupplierInformationAuth,
    GetSupplierInfo:GetSupplierInfoAuth,
    PatchSupInfo:PatchSupInfoAuth,
    DelSupInfo:DelSupInfoAuth,



    //Copackers
    PostCopacker:PostCopackerAuth,
    GetCopackerData:GetCopackersDataAuth,
    pacthCoPackersData:patchCopackersDataAuth,
    DelCopackersData:DelCopackersDataAuth,






    //Raw material Transfer
    PostRawMaterialTransfer: PostRawMaterialTransferAuth,
    PostTakenProductsRMT: PostTakenProductsRMTAuth,
    GetSummary: GetSummaryAuth,
    GetGivenData: GetGivenDataAuth,
    GetTakenData: GetTakenDataAuth,
    EditGivenDataRMT: EditGivenDataRMTAuth,

    //Accessory Master
    //categories(Accessory Type) 
    AddAccessotyCategory: AddAccessoryCategoryAuth,
    GetAccessoryCategory: GetAccessoryCategoryAuth,
    EditAccessoryCategory: EditAccessoryCategoryAuth,
    DeleteAccessoryCategory: DeleteAccessoryCategoryAuth,

    //Accessorries
    AddAccessoriespostCall: AddAccessoriesPostCallAuth,
    GetAccessoriesGetCall: GetAccessoriesGetCallAuth,
    EditAccessoriesPatchCall: EditAccessoriespatchCallAuth,
    DeleteAccessoriesDelCall: DeleteAccessoriesDelCallAuth,

    GetAccessoriesStocksDataAll: GetAccessoriesStocksDataAllAuth,

    //Accessori Inventory
    PostAccInventory: PostAccInventoryAuth,
    GetAccessoriesInventory: GetAccessoriesInventoryAuth,
    EditAccInverntoryData: EditAccInventoryAccDataAuth,
    DeleteAccInvData: DeleteAccInvDataAuth,




    //****************************Telecaller Login **********************//
    //Add Leads
    AddNewLeadsPostCall: AddNewLeadsPostCallAuth,
    GetTelecallerLeads: GetTelecallerLeadsAuth,
    EditTelecallerLeadsData: EditTelecallerLeadsDataAuth,
    DeleteTelecallerLeadsData: DeleteTelecallerLeadsDataAuth,

    //import Lead
    ImportLeadsData: ImportLeadsDataAuth,

    //Call logs
    AddCallLogsPostCall: AddCallLogsPostCallAuth,
    GetCallLogsDataCall: GetCallLogsDataCallAuth,

    //Questions
    PostQuestionsTelecaller: PostQuestionDataAuth,
    GetQuestionsData: GetQuestionDataAuth,
    EditQuestionData: EditQuestionDataAuth,
    DeleteQuestions: DeleteQuestionsAuth,


    //Follow-ups
    FollowUpsReportData: FollowUpsReportDataAuth,

    //********************Driver Login *********************//
    //Add Customer
    AddCustomersDriver:AddCustomerDriverAuth,
    GetCustomers:GetCustomersAuth,
    EditCustomerData:EditCustomerDataAuth,
    DeleteCustomerData:DeleteCustomerDataAuth,

    DriverStock: DriverStockAuth,

    VehicleReadingData:VehicleReadingDataAuth,













    //********************Accounts  Login *********************//
    //Add Vehicle Details 
    postvehicleDetails:postvehicleDetailsAuth,
    GetVehiclesDetailsData:GetVehiclesDetailsDataAuth,
    EditVehicleDetailsData:EditVehicleDetailsDataAuth,
    DeleteVehData:DeleteVehDataAuth,

    //Assign Route 
    AddRoutePostCall:AddRoutePostCallAuth,//post call
    AllRoutesInAssignRoute:AllRoutesInAssignRouteAuth,//get call
    GetRotesDataByID:GetRoutesDataByIDAuth,// get by ID
    EditAssignRouteData:EditAssignRouteDataAuth,//edit call

    //add sales for Drivcer (driver stock)
    AddSalesToDriverStock:AddSalesToDriverStockAuth,//post call
    GetDriverStockData:GetDriverStockDataAuth,//Get Data For Driver stock


    //Distributor Sales 
    PostDistributorsSalesData:PostDistributorsSalesDataAuth,
    DistributorsalesData:DistributorSalesDataAuth,


    //Factory sales 
    PostsalesforFactory:PostsalesforFactoryAuth,
    Factorysaledata:FactorysalesDataAuth,

    //Distributor Data
    GetOrdersData:GetOrdersDataAuth,

    //Expenses
    PostAccounstExpenses:PostAccountsExpensesAuth,
    GetAccountsExpesnes:GetAccountsExpensesAuth,
    FilterexpensesDataAcc:FilterExpensesDataAccAuth,




// production setup
production: productionReducer,
// production 
productionmodule: productionModuleReducer



  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

export const persistorStore = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
 