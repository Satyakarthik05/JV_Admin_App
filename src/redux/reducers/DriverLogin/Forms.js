import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"
import { endpoints } from "../../../config/config";

const initialState = {
    error: null,
    loading: false,
    message: null,

    //Add Customer
    AddCustomersData: null,
    CustomersDataGetCall: null,
    EditCustomersDataaa: null,
    data: null,

    //vehicle reading get data
    vehicleReadingData: null,
}

export const AddCustomer = createAsyncThunk('AddCustomer', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add Customer ------------------->", payload);
        const response = await api.post(endpoints.ADD_CUSTOMER, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_CUSTOMER}`);

        console.log("All About Post Call for Add Customer  thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  Customer --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//Get Customer Data 
//********************************************Get Customers  Data  ********************************************//
export const GetCustomerData = createAsyncThunk('GetCustomerData', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_CUSTOMER);
        console.log("All About get Call in thunk------------------>Get All Customers Data", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Customer   thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})

//**************Edit  Customer Data  ********************//
export const EditCustomer = createAsyncThunk('EditCustomer', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit  Customer payload and id in thunk ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_CUSTOMER}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit  Customer payload and id in thunk---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********Delete  Customer   Data ****************************//
export const DeleteCustomer = createAsyncThunk('DeleteData', async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_CUSTOMER}/${id}`);
        console.log("Deleted the Delete Customer  Data __________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Customer  Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})


//*************************************Get Vehicle Reading Data *************************************//
export const GetVehicleDetailsData = createAsyncThunk('GetVehicleDetailsData', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  get vehicle details Data ------------------->", payload);
        const response = await api.get(endpoints.GET_VEHICLE_READING, {
            params: {
                driverId: payload.driverId,
                fromDate: payload.fromDate,
                toDate: payload.toDate,
            }
        }, payload);
        //console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_CUSTOMER}`);

        console.log("All About Get vehcile details data   thunk  ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Get vehcile details data ------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})




export const DriverFormsSlice = createSlice({
    name: "addcustomersData",
    initialState,
    reducers: {
        clearAddCustomer: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            //********************************************Add Customer *******************************************//
            .addCase(AddCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddCustomer.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AddCustomersData = action.payload;
                console.log("Payload Data in Add Customer   filled condition ---------------------->", state.AddCustomersData);

            })
            .addCase(AddCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Customer ---------------------->", state.error);

            })

            //*******************************************Get Customer  Data  ********************************************//
            .addCase(GetCustomerData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetCustomerData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.CustomersDataGetCall = action.payload.data;
                console.log("Payload Data in  Get Customer Data  full filled condition ---------------------->", state.CustomersDataGetCall);

            })
            .addCase(GetCustomerData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Customer  Data  ----------------------->", state.error);
            })

            //********************************************Edit Customer Data *****************************************//
            .addCase(EditCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditCustomer.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditCustomersDataaa = action.payload.message;
                console.log("Payload Data for   Edit Customer Data   patch call ------------>", state.EditCustomersDataaa);
            })
            .addCase(EditCustomer.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit  Customer  Data ----------->", state.error);

            })

            //**********Delete  Customer Data****************//
            .addCase(DeleteCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(DeleteCustomer.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.CustomersDataGetCall = state.CustomersDataGetCall.filter(
                    customer => customer.id !== action.meta.arg.id
                );
                state.data = action.payload.message;
                console.log("Payload Data in  Delete customer Data  Delete call ------------>", state.data);
            })
            .addCase(DeleteCustomer.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in Delete customer Data ----------->", state.error);

            })



            //*******************************************Get Customer  Data  ********************************************//
            .addCase(GetVehicleDetailsData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetVehicleDetailsData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.vehicleReadingData = action.payload.data;
                console.log("Payload Data in  Get Vehicle Details Data  full filled condition ---------------------->", state.vehicleReadingData);

            })
            .addCase(GetVehicleDetailsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  vehicle details Data  ----------------------->", state.error);
            })

    }

})

export const { clearAddCustomer } = DriverFormsSlice.actions;
export default DriverFormsSlice.reducer;
