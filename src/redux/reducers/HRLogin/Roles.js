import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";



const initialState = {
    error: null,
    loading: null,
    message: null,
    rolesData: null,//rolesName in dropdown
    addroles: null,//AddrolesScreen Data

    deletedRole: null,//deletedrole
    editRole: null,
}

// ***********************get call to toshow addes rolesName in dropdown********************************//
export const Roles = createAsyncThunk('Roles', async (_, { rejectWithValue }) => {
    try {
        console.log("Roles in thunk one one");
        const response = await api.get(endpoints.ROLES);
        console.log("Roles in thunk", response.data);
        return response.data;
    }
    catch (error) {
        console.log("Error in Roles", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})

//**************************** Post for AddRoles Screen ******************************//
export const Addroles = createAsyncThunk('Addroles', async ({ roleName, noOfLeaves }, { rejectWithValue }) => {
    try {
        const data = { roleName, noOfLeaves }
        console.log("Addes Roles Data ", data);
        const response = await api.post(endpoints.ADDROLES, data);
        console.log("Addes Roles  response in thunk------>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------Login------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})

//**************************************Delete  Roles**********************************************//
export const DeletetheRole = createAsyncThunk('DeletetheRole', async ({ id }, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_ROLE}/${id}`);
        console.log("Deleted the Role__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  All Emp Get ReqExpense", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})


//***********************************************Patch  Call For Edit Roles  ***********************************//
export const EditRolePatchCall = createAsyncThunk('EditRolePatchCall', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data  Edit Role Patch Call   in  thunk", payload);

        const response = await api.patch(`${endpoints.PATCH_EDIT_ROLE}/${id}`, payload);
        console.log("Edit Role in thunk  ------>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error---------Edit role ------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})


// ***********************get call to toshow addes rolesName in dropdown********************************//
export const RolesSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        clearroles: (state) => {
            state.error = null;
        },
        clearaddroles: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(Roles.pending, (state) => {
                state.error = null;
                state.loading = true;
                //state.rolesData=null;
            })
            .addCase(Roles.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.rolesData = action.payload.data;
                console.log("Fullfilled in Roles............", state.rolesData);

            })
            .addCase(Roles.rejected, (state, action) => {
                state.loading = false;
                // state.rolesData=null;
                state.error = action.payload;
                console.log("Payload error in Roles", state);
            })
            //**************************** Post for AddRoles Screen ******************************//
            .addCase(Addroles.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(Addroles.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.addroles = action.payload.data;
                console.log("Fullfilled in AddRoles............", state.addroles);

            })
            .addCase(Addroles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in AddRoles", state);
            })
            //**************************************Delete  Roles**********************************************//
            .addCase(DeletetheRole.pending, (state) => {
                state.error = null;
                state.loading = true;

            })

            .addCase(DeletetheRole.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.rolesData = state.rolesData.filter(
                    role => role.id !== action.meta.arg.id
                );
                state.deletedRole = action.payload.message
                console.log("Payload Data Delete the Role Fullfilled Condition_________________________________", state.deletedRole);
                console.log("Role Deleted Successfully");

            })

            .addCase(DeletetheRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Delete The Role ", state.error);
            })

            //**************************************Edit Role*******************************************//
            .addCase(EditRolePatchCall.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditRolePatchCall.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.editRole = action.payload.message;
                console.log("Payload Data Edit Role  Fullfilled Condition_________________________________", state.editRole);
            })
            .addCase(EditRolePatchCall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Patch Call   Edit Role Data ", state.error);
            })
    }
})




export const { clearroles, clearaddroles } = RolesSlice.actions;
export default RolesSlice.reducer;