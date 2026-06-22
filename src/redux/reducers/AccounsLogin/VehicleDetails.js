import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"
import { endpoints } from "../../../config/config";

const initialState = {
    error: null,
    loading: false,
    message: null,

    //Add Vehicle details
    AddVehicleDetailsData: null,
    GetVehiclesDetails: null,
    EditVehicleData: null,
    Deletevehicledata: null,


    //Assign Route
    AddRouteToCustomer: null,
    GetAssignRouteData:null,
    GetRouteBYID:null,// get routes By ID
    EditAssignData:null,
    Deleteroutedata:null,

    //AddSales TO Driver(assign stock )
    postSalestoDriver:null,
    StockData:null,


    //Distributor Sales 
    postDistributorSale:null,
    GetDistributorData:null,

    //factory sales 
    PostFactorySalesData:null,
    factorysalesData:null,

    //Distributor Orders
    GetDistributorOrdersData:null,

    //Expenses 
    postExpenses:null,
    ExpensesData:null,
    filterexpensesData:null,

}


//************************************************Vehicle Details **************************************//
//Add Vehicle details
export const AddVehicleDetailsPostCall = createAsyncThunk('AddVehicleDetails', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add Vehicle Details ------------------->", payload);
        const response = await api.post(endpoints.ADD_VEHICLE_DETAILS, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_VEHICLE_DETAILS}`);

        console.log("All About Post Call for Add vehicle details   thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  vehicle details --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//Get Vehicle details
//********************************************Get Purchase Data  ********************************************//
export const GetVehiclesData = createAsyncThunk('GetVehiclesData', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_VEHICLES_DATA);
        console.log("All About get Call in thunk------------------>Get All vehicles details  Data", response);
        return response.data;
    }
    catch (error) {
        console.log("Get vehicles  thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})

//********************************************Edit Vehicle details Data  ********************************************//
export const EditVehicledetails = createAsyncThunk('EditVehicledetails', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Vehicle details coming from normal UI code ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_VEHICLE_DETAILS}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Vehicle details ---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }
})


//**************************************Delete  Vehicle Data **********************************************//
export const DeleteVehicleData = createAsyncThunk('DeleteVehicleData', async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_VEHICLE_DATA}/${id}`);
        console.log("Deleted the Vehicle Data __________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Vehicle Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})


//****************************************************Assign Route Module **********************************************//
//Add Route 1st 
export const AddRoute = createAsyncThunk('AddRoute', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add Route for A Customer  ------------------->", payload);
        const response = await api.post(endpoints.ADD_ROUTE, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_ROUTE}`);
        console.log("All About Post Call for Add Route For A Customer   thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------  Add Route For A Customer --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//************Get Assigned Customer in A Route in Assign Route module  *********************//

export const GetAssignedCustomers = createAsyncThunk('GetAssignedCustomers', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_ASSIGN_ROUTE);
        console.log("All About Get Assigned Customer in A Route in Assign Route module ------------------------>", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Assign Route customer  thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})

//*****************Sub Items  Assigned Route Customer Data By ID**********************//
export const GetAssignedCustomersByID = createAsyncThunk('GetAssignedCustomersByID', async ({ id }, { rejectWithValue }) => {
    try {
        console.log("Payload data  id coming to payload for get call by id------------------->", id);
        const response = await api.get(`${endpoints.GET_ROUTE_BY_ID}/${id}`,id);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Get Routes Data by ID payload and id in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})



//**************Edit Assigned Route Customer Data  ********************//
export const EditAssignRoutecustomer = createAsyncThunk('EditAssignRoutecustomer', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Assign Route Customer payload and id in thunk ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_ASSIGN_ROUTE}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Assign Route Customer payload and id in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********Delete  Assigned Route  Data ****************************//
export const DeleteAssignRouteData = createAsyncThunk('DeleteAssignRouteData', async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_ASSIGN_ROUTE_DATA}/${id}`);
        console.log("Deleted the Delete  Assigned Route  Data __________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Assigned Route  Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})





//************************************************Add Sales to Driver(Assign stock) **************************************//
//Add Sales to Driver  post call
export const AddSaleForDirver = createAsyncThunk('AddSaleForDirver', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add Sale For Dirver------------------->", payload);
        const response = await api.post(endpoints.ADD_SALE_DRIVER, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_SALE_DRIVER}`);

        console.log("All About Post Call for Add Sales for  Driver   thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add Sales for driver --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//get call for Assign Stock
export const GetAssignStock = createAsyncThunk('GetAssignStock', async (_, { rejectWithValue }) => {
    try {
       
        const response = await api.get(endpoints.GET_ASSIGN_STOCK);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Get Routes Data by ID payload and id in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})






//**************************************************Distributor Sale*********************************************************//
//Post Call for Distributor Sale
export const AddDistributorSale = createAsyncThunk('AddDistributorSale', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  Add Distributor Sale ------------------->", payload);
        const response = await api.post(endpoints.ADD_DIS_SALE, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_DIS_SALE}`);

        console.log("All About Post Call for Distributor Sales thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add Distributor Sales --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//Get Distributor Sales Data
export const GetDistributorSaleData = createAsyncThunk('GetDistributorSaleData', async (saleType, { rejectWithValue }) => {
    console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.GET_DIS_DATA}/${saleType}`);
    try {
        const response = await api.get(`${endpoints.GET_DIS_DATA}/${saleType}`);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Get Distributor Sales Date  in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})


//**************************************************Factory Sale ************************************************//
//Post Call for Factory Sales
export const AddFactorySaleData = createAsyncThunk('AddFactorySaleData', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  Add factory Sale ------------------->", payload);
        const response = await api.post(endpoints.ADD_FACTORY_SALE, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_DIS_SALE}`);

        console.log("All About Post Call for  Add Factory  sales data thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  factory Sales --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//Get Distributor Sales Data
export const GetFactorySaleData = createAsyncThunk('GetFactorySaleData', async (saleType, { rejectWithValue }) => {
    console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.GET_FACTORY_SALE}/${saleType}`);
    try {
        const response = await api.get(`${endpoints.GET_FACTORY_SALE}/${saleType}`);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Get Factory Sales Date  in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }
})





//***********************************************************Distributor Orders*********************************************************//
export const GetData = createAsyncThunk('GetData', async (_, { rejectWithValue }) => {
    try {
       
        const response = await api.get(endpoints.GET_DATA);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Get Data for distributro orders in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})



//*************************************************Accounts Expenses****************************************//
export const AddAccountsExpenses = createAsyncThunk('AddAccountsExpenses', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Payload for Add Expenses for accounts ------------------->", payload);
        const response = await api.post(endpoints.ACC_EXP,payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ACC_EXP}`);
        console.log("All About Post Call for Add Expenses for Accounts   thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  expenses for Accounts --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//Get Expenses Data
export const GetExpensesData = createAsyncThunk('GetExpensesData', async (_, { rejectWithValue }) => {
    try {
       
        // const response = await api.get(endpoints.GET_EXP);
         const  response=await api.get(`${endpoints.GET_EXP}?requestType=EXPENSE`);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Get Data for distributro orders in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})


//Filter Data for Expeses
export const FilterExpenses = createAsyncThunk('FilterExpenses', async (payload, { rejectWithValue }) => {
    console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.FILTER_EXP}`);
    try {
        console.log("Post  data   in Payload for filter  Expenses for accounts ------------------->", payload);
        const response = await api.post(endpoints.FILTER_EXP,payload);
        console.log("All About Post Call for filter  Expenses for Accounts   thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------filter  expenses for Accounts --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})






export const VehicleFormsSlice = createSlice({
    name: "addcustomersData",
    initialState,
    reducers: {
        clearvehicledata: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            //********************************************Add Vehicles Details  *******************************************//
            .addCase(AddVehicleDetailsPostCall.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddVehicleDetailsPostCall.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AddVehicleDetailsData = action.payload;
                console.log("Payload Data in Add Vehicle Details   filled condition ---------------------->", state.AddVehicleDetailsData);

            })
            .addCase(AddVehicleDetailsPostCall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Vehicle Details---------------------->", state.error);

            })


            //*******************************************Get Vehicles Data  ********************************************//
            .addCase(GetVehiclesData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetVehiclesData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetVehiclesDetails = action.payload.data;
                console.log("Payload Data in  Get Vehicles Data  full filled condition ---------------------->", state.GetVehiclesDetails);

            })
            .addCase(GetVehiclesData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Vehicles Data  ----------------------->", state.error);
            })

            //********************************************Edit Vehicle Details Data *****************************************//
            .addCase(EditVehicledetails.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditVehicledetails.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditVehicleData = action.payload.message;
                console.log("Payload Data for   Edit Vehicle Details Data   patch call ------------>", state.EditVehicleData);
            })
            .addCase(EditVehicledetails.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit  vehicle details Data ----------->", state.error);

            })


            //********************************************Delete  Vehicle Details Data ********************************************//
            .addCase(DeleteVehicleData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(DeleteVehicleData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetVehiclesDetails = state.GetVehiclesDetails.filter(
                    vehicle => vehicle.id !== action.meta.arg.id
                );
                state.Deletevehicledata = action.payload.message;
                console.log("Payload Data in  Delete Vehicle Data   Delete call ------------>", state.Deletevehicledata);
            })
            .addCase(DeleteVehicleData.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in Delete Vehicle Data ----------->", state.error);

            })



            //**********************************************************Assign Route Module**************************************************//
            //Add Route 
            .addCase(AddRoute.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddRoute.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AddRouteToCustomer= action.payload;
                console.log("Payload Data in Add Route (Assign Route) filled condition ---------------------->", state.AddRouteToCustomer);

            })
            .addCase(AddRoute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Route (Assign Route) ---------------------->", state.error);

            })

            //********************Get Assigned Route Customer  in Assign Route Module **********************//
            .addCase(GetAssignedCustomers.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAssignedCustomers.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetAssignRouteData= action.payload.data;
                console.log("Payload Data in Get Assigned Customer in A Route in Assign Route module  full filled condition ---------------------->", state.GetAssignRouteData);

            })
            .addCase(GetAssignedCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Assigned Customer in A Route in Assign Route module ----------------------->", state.error);
            })


            //***********Get Assigned Route  By ID  in Assign Route Module **************//
            .addCase(GetAssignedCustomersByID.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAssignedCustomersByID.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetRouteBYID= action.payload.data;
                console.log("Payload Data in Get Assigned Customer By IDddddddddd in A Route in Assign Route module  full filled condition ---------------------->", state.GetRouteBYID);
            })
            .addCase(GetAssignedCustomersByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Assigned Custome  By IDdddddddd in A Route in Assign Route module ----------------------->", state.error);
            })



            //*********************Edit Assign Route Customer Data ********************//
            .addCase(EditAssignRoutecustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditAssignRoutecustomer.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditAssignData = action.payload.message;
                console.log("Payload Data for Edit Assign Route Customer Data ----------->", state.EditAssignData);
            })
            .addCase(EditAssignRoutecustomer.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                state.error = action.payload;
                console.log("Payload Error in Edit Assign Route Customer Data ---------->", state.error);

            })

            //*************Delete Assign Route Data ****************//
            .addCase(DeleteAssignRouteData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(DeleteAssignRouteData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetAssignRouteData = state.GetAssignRouteData.filter(
                    route => route.id !== action.meta.arg.id
                );
                state.Deleteroutedata = action.payload.message;
                console.log("Payload Data in  Delete Assign Route Data Delete call ------------>", state.Deleteroutedata);
            })
            .addCase(DeleteAssignRouteData.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                state.error = action.payload;
                console.log("Payload Error in  Delete Assign Route Data---------->", state.error);

            })






             //********************************************Add Sales to Driver(Assign stock)  ******************************************//
             //post sales to driver 
            .addCase(AddSaleForDirver.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddSaleForDirver.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.postSalestoDriver= action.payload;
                console.log("Payload Data in Add Sale for Driver ---------------------->", state.postSalestoDriver);

            })
            .addCase(AddSaleForDirver.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Sales for Driver --------------------->", state.error);

            })

            //*******************************Get Stock ******************//
             .addCase(GetAssignStock.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAssignStock.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.StockData = action.payload.data;
                console.log("Payload Data in  Get Assigned Stoack  full filled condition ---------------------->", state.StockData);

            })
            .addCase(GetAssignStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Assigned Stoack  Data ----------------------->", state.error);
            })



            //***************************************************Distributor Sales *********************************************//
            //Add Distributor Sales 
            .addCase(AddDistributorSale.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddDistributorSale.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.postDistributorSale= action.payload;
                console.log("Payload Data in Add Sale  for Distributor Sales ---------------------->", state.postDistributorSale);
            })
            .addCase(AddDistributorSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in  Add Sale  for Distributor Sales --------------------->", state.error);
            })

            //Get Distributor Sales Data
            .addCase(GetDistributorSaleData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetDistributorSaleData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetDistributorData = action.payload.data;
                console.log("Payload Data in  Get Distributor  full filled condition ---------------------->", state.GetDistributorData);

            })
            .addCase(GetDistributorSaleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Distributor Data ----------------------->", state.error);
            })


            //***********************************************Factory Sales **************************************//
             //Add Sale for factory 
            .addCase(AddFactorySaleData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddFactorySaleData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostFactorySalesData= action.payload;
                console.log("Payload Data in Add Sale  for  factory ---------------------->", state.PostFactorySalesData);
            })
            .addCase(AddFactorySaleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in  Add Sale  for factory --------------------->", state.error);
            })


            //Get Factory Sales 
            .addCase(GetFactorySaleData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetFactorySaleData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.factorysalesData = action.payload.data;
                console.log("Payload Data in  Get  factory sales  full filled condition ---------------------->", state.factorysalesData);

            })
            .addCase(GetFactorySaleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get factory sale Data ----------------------->", state.error);
            })


            //*************************************Get Distributor Order Data*************************************************//
            //Get Factory Sales 
            .addCase(GetData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetDistributorOrdersData = action.payload.data;
                console.log("Payload Data in  Get Distributor Orders Data   full filled condition ---------------------->", state.GetDistributorOrdersData);

            })
            .addCase(GetData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get factory sale Data ----------------------->", state.error);
            })




            //********************************************Add Expesnes Fro Accounts *******************************************//
            .addCase(AddAccountsExpenses.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddAccountsExpenses.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.postExpenses = action.payload;
                console.log("Payload Data in Add Expenses for Accounts   filled condition ---------------------->", state.postExpenses);

            })
            .addCase(AddAccountsExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Expense for Accounts --------------------->", state.error);

            })


            //get Expenses Data
            .addCase(GetExpensesData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetExpensesData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.ExpensesData= action.payload.data;
                console.log("Payload Data in  GetExpenses Data  full filled condition ---------------------->", state.ExpensesData);

            })
            .addCase(GetExpensesData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Expeses Data  ----------------------->", state.error);
            })



            //filter expenses 
            .addCase(FilterExpenses.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(FilterExpenses.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.filterexpensesData = action.payload.data;
                console.log("Payload Data in filter expenses   filled condition ---------------------->", state.filterexpensesData);

            })
            .addCase(FilterExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in filter expenses Details---------------------->", state.error);

            })



    }

})

export const { clearvehicledata } = VehicleFormsSlice.actions;
export default VehicleFormsSlice.reducer;
