//export const baseURL = 'https://mycitycoupons.in:2370/nodeapp';
// export const baseURL = 'http://192.168.0.156:2370/nodeapp';

export const baseURL = 'https://godavariwave.in:2371/nodeapp/';

export const endpoints = {
  REQUEST_LOGIN_OTP: 'user/login',
  USER_REGISTRATION: 'user',
  USER_VERIFICATION: 'user/verification',
  GET_USER_PROFILE: 'user',
  GET_CATEGORIES_WITH_VENDORS: 'categoryswithvendors',
  GET_COUPONS: 'coupons',
  GET_TRENDING_COUPONS: 'trendingcoupons',

  //******************************HR Login*************************************//
  EMPLOYEE_REG: 'employees', // to post new emp
  ROLES: 'roles', // get the roles for dropdown
  LOGIN: 'login', //login
  ADDROLES: 'roles', // add the new roles
  DELETE_ROLE: 'roles', //delete the Role
  PATCH_EDIT_ROLE: 'roles', //Edit Role
  GET_EMPLOYEES: 'employees', // Get All Employess Data
  PATCH_EDIT_EMPLOYEE: 'employees', //Edit Employee Data
  DELETE_EMPLOYEE_DATA: 'employees', //Delete Employee Data

  REQ_EXPENSE: 'expense', // to Post ReqExpenses
  EXPENSE_FILTER:"expense/filter", // POST filtered expenses by employee + date range
  GET_REQEXPENSE: 'expense/employee', //Get Request Expense emp id wise
  GET_ALL_EMP_REQEXPENSE: 'expense', //Get All Employees Req Expense Data
  PATCH_EDIT_REQEXPENSE: 'expense/status', //Patch Call for Req Expense Screen here we are updating the status(rejected,aproved,forwared)

  POST_APPLYLEAVE: 'leave', //Post Call For Applying Leave
  GET_APPLIEDLEAVES: 'leave/employee', // Get Applied Leaves Data  id Wise
  GET_ALL_LEAVES: 'leave', // Get All Employee Leaves
  PATCH_EDIT_LEAVES: 'leave/status', //Patch Call ForEdit Leave

  POST_PUNCH_IN_ATTENDANCE:"attendance",//PUNCH IN 
  POST_PUNCH_OUT_ATTENDANCE:"attendance/punch-out",//Punch_out Attendance 
  POST_BASED_ON_DATES:"attendance/filters", // Attendance Based On Dates
  PATCH_EDIT_ATTENDANCE:"attendance/full-update",//Edit Attedance Patch Call





  //master 
  ADDCATEGORY_PRODUCTMASTER:"category",// add Category In Product master;
  GET_ALL_PRODUCT_CAT:"category",// get All Categories  for Product Master
  edit_cat_PM:"category",//edit category for PM 

EMP_ATT_DATES:"attendance/filters",//Emp Att Dates Wise
  MONTH_REPORT:"attendance/salary",//monthly report
  ATTENDANCE_DATA:"empCounts",

  //
  APPROVE_DRIVER_STOCK_TO_DISPATCH:"dispatchDriverStock",
  
//get Role By Department
  GET_ROLE_DEPARTMENT:"rolesbydepartment/Master",//GetRole By Departments using in monthly report,Emp attendance


   //password data
  GET_PASSWORD:"admin-password",
  EDIT_PSW:"admin-password",
 DEL_CAT_PM:"category",//delete the category in PM 


  ADD_PRODUCT:"products",//Add Product
  GET_PRODUCTS:"products",//Get Products 
  EDIT_PRODUCT:"products",//Edit Products
  DELETE_PRODUCT:"products",//Delete product
  GET_STOCK:"inventory",//Get Stock By Product


  //Raw Material Category
  ADDCATEGORY_RAWMASTER:"rawmaterialcategory",//Add Raw Material Category
  GET_ALL_RAW_CAT:"rawmaterialcategory",// Get Categories  for Raw Material
  DEL_CAT_RAW:"rawmaterialcategory",// Delete Raw Category
  EDIT_RAW_MATERIAL_CAT:"rawmaterialcategory",// Edit Raw Material Category

  //Add Raw Material
  ADD_RAW_MATERIAL:"raw-materials",//Add raw Material 
  GET_RAW_MATERIAL:"raw-materials",//Get Raw Material Data
  EDIT_RAW_MATERIAL:"raw-materials",//Edit Raw Material
  DELETE_RAW_MATERIAL:"raw-materials",//Delete Raw Material Data 

  //Add Purchase
  ADD_PURCHASE:"raw-material/purchase",//Add Purchase
  GET_PURCHASE_DATA:"raw-material/purchase",//Get Purchase Data
  EDIT_PURCHASE:"raw-material/purchase",//Edit Purchase
  DELETE_PURCHASE:"raw-material/purchase",//Detele Purchase Data


  //Supplier Inforamtion 
  ADD_SUP_INFO:"supplier",
  GET_SUP_INFORMATION:"supplier",
  EDIT_SUP_INFO:"supplier",
  DELETE_SUP_INFO:"supplier",



  //Units In Raw Material Master 
  ADD_UNIT:"unit",
  GET_UNIT:"unit",
  EDIT_UNIT:"unit",
  DEL_UNIT:"unit",


  //Raw Material Transfer
  POST_RAW_MATERIAL_TRANSFER:"material-given/create",//material-transfer/create
  POST_TAKE_PRODUCT:"material-taken/create",//material-transfer/receive
  GET_SUMMARY:"material-summary",
  POST_GIVEN:"material-given/list-by-vendor",//material-vendor-details
  POST_TAKEN:"taken/details",//post name,phno get Taken Products Data
  EDIT_GIVEN_DATA:"material-given/update",//Edit Given Data Raw Material Transfer 

  //Copackers
  ADD_COPACKER:"copacker",
  GET_COPACKERS:"copacker",
  EDIT_COPACKER:"copacker",
  DELETE_COPACKERS:"copacker",



  //Accessory Master 
  //Categories Types
  ADDCATEGORY_ACCESSORY_MASTER:"accessoryType",
  GET_ALL_ACCESSORY_CAT:"accessoryType",
  EDIT_ACC_CAT:"accessoryType",
  DEL_ACC_CAT:"accessoryType",

  //Accessories
  ADD_ACCESSORY:"accessories",
  GET_ACCESSORIES:"accessories",
  EDIT_ACCESSORIES:"accessories",
  DELETE_ACCESSORIES:"accessories",
  GET_ACC_STOCK:"accessories/inventory",

  //Accessori Inventory
  ADD_ACC_INVENTORY:"accessory-purchase",
  GET_ACCESSORIES_INVENTORY:"accessory-purchase",
  EDIT_ACC_INV:"accessory-purchase",
  DEL_ACC_INV:"accessory-purchase",



  //**********************************Telecaller Login**************************//
  //Lead
  ADD_NEW_LEAD:"telecaller/lead",
  GET_LEADS:"telecaller/lead",
  EDIT_LEAD:"telecaller/lead",
  DELETE_LEAD:"telecaller/lead",

  //import Lead
  ADD_IMPORT_LEAD:"telecaller/lead",

  //Call Logs
  ADD_CALL_LOGS:"telecaller/call-log",
  GET_CALL_LOGS:"telecaller/call-log",


  //Questions
  POST_QUESTIONS:"question/create",
  GET_QUESTION:"question/list",
  EDIT_QTN:"question/update",
  DELETE_QTN:"question/delete",

  // follow up report 
  POST_FOLLOWUP:"telecaller/followups",






  //********************Driver Login *********************//
  //Add Customer
  ADD_CUSTOMER:"customers",
  GET_CUSTOMER:"customers",
  EDIT_CUSTOMER:"customers",
  DELETE_CUSTOMER:"customers",

  // Driver returns (GET query: driverId, fromDate, toDate — YYYY-MM-DD)
  GET_RETURNS_LIST:"returns-list",
  POST_DRIVER_RETURNS:"driver-returns",

  GET_VEHICLE_READING:"vehicle-reading",




  //**************************Accounts **********************//
  //Add Vehicle Details 
  ADD_VEHICLE_DETAILS:"vehicles",
  GET_VEHICLES_DATA:"vehicles",
  EDIT_VEHICLE_DETAILS:"vehicles",
  DELETE_VEHICLE_DATA:"vehicles",

  //Assign Route 
  ADD_ROUTE:"routes",
  GET_ASSIGN_ROUTE:"routes",
  GET_ROUTE_BY_ID:"routes",
  EDIT_ASSIGN_ROUTE:"routes",
  DELETE_ASSIGN_ROUTE_DATA:"routes",



  //Add Sales for Driver 
  ADD_SALE_DRIVER:"driver-stock",
  GET_ASSIGN_STOCK:"driver-stock",
  APPROVE_DRIVER_STOCK:"driver-stock/approve",

  // Vehicle odometer readings (driver)
  VEHICLE_READING:"vehicle-reading",




  //Distributor Sales
  ADD_DIS_SALE:"sales",
  GET_DIS_DATA:"sales",

  //Factory sale
  ADD_FACTORY_SALE:"sales",
  GET_FACTORY_SALE:"sales",

  //Distributor Order
  GET_DATA:"orders",

  //expenses
  ACC_EXP:"expense",
  GET_EXP:"expense",
  FILTER_EXP:"expense/filter",

  // production SETUP
CREATE_PRODUCTION_SETUP:"productionSetup",
GET_CATEGORY_PRODUCTION_SETUP:"category",
GET_MATERIAL_CATEGORY:"rawmaterialcategory",
GET_UNITS:"unit",
GET_ALL_PRODUCTION_SETUPS:"productionSetup",
DELETE_PRODUCTION_SETUP:"productionSetup",
UPDATE_PRODUCTION_SETUP:"productionSetup",

// production module

PRODUCTION_CREATE:"production/create",
PRODUCTION_ADD_PRODUCT:"production/add-product",
PRODUCTION_START_BATCH:"production/start-batch",
PRODUCTION_STOP_BATCH:"production/stop-batch",
GET_ALL_PRODUCTIONS:"production",
PRODUCTION_APRROVAL:"/production/approve/1",



  
};