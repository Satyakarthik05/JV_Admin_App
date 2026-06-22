import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";



const initialState = {
    error: null,
    loading: false,
    message: null,
    AllEmpAtt: null,
    MonthReportDateWise:null,
    TotalAttData:null,
}

//********************************************Dates and Role Anme wise Attendace*************************************//
export const AllEmpAttDates = createAsyncThunk('AllEmpAttDates', async (payload, { rejectWithValue }) => {
    try {
        console.log("Payload Data in Thunk which was coming from UI ----------------->", payload);
        const response = await api.post(endpoints.EMP_ATT_DATES, payload);
        console.log("All Employee Att data based on Dates  in thunk  fullfilled------>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------Employee Att Based On Dates ------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})

//**********************************************Monthly report****************************************************//
export const MonthlyReportData = createAsyncThunk('MonthlyReport', async (payload, { rejectWithValue }) => {
    try {
        console.log("Payload Data in Thunk which was coming from UI ----------------->", payload);
        const response = await api.post(endpoints. MONTH_REPORT, payload);
        console.log("All Employee Monthly Report  in thunk  fullfilled------>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------Employee Monthly Report Based On Dates ------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})

//**********************************************Total Attendace Data****************************************************//
export const AttendanceData = createAsyncThunk('AttendanceData', async (_, { rejectWithValue }) => {
    try {
        
        const response = await api.get(endpoints.ATTENDANCE_DATA,);
        console.log("All Employee Attendace Data thunk  fullfilled------>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------Employee Attendance Data ------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})

export const AddAttDatesSlice = createSlice({
    name: "EmpAttDates",
    initialState,
    reducers: {
        clearAtt: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
        //********************************************Dates and Role Anme wise Attendace*************************************//
            .addCase(AllEmpAttDates.pending, (state) => {
                state.error = null;
                state.loading = true;

            })
            .addCase(AllEmpAttDates.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.AllEmpAtt= action.payload.data;
                console.log("Payload Data In Employee Att Date Wise Fullfilled COndition_________________________________", state.AllEmpAtt);
            })
            .addCase(AllEmpAttDates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error Payload Data In Employee Att Date Wise ", state.error);
            })
            //**********************************************Monthly report****************************************************//
             .addCase(MonthlyReportData.pending, (state) => {
                state.error = null;
                state.loading = true;

            })
            .addCase(MonthlyReportData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.MonthReportDateWise= action.payload.data;
                console.log("Payload Data In Monthly Report Date Wise Fullfilled COndition_________________________________", state.MonthReportDateWise);
            })
            .addCase(MonthlyReportData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error Payload Data In Monthly Report  Date Wise ", state.error);
            })

            //**********************************************Total Attendace Data ****************************************************//
             .addCase(AttendanceData.pending, (state) => {
                state.error = null;
                state.loading = true;

            })
            .addCase(AttendanceData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.TotalAttData= action.payload.data;
                console.log("Payload Data In Monthly Report Date Wise Fullfilled COndition_________________________________", state.TotalAttData);
            })
            .addCase(AttendanceData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error Payload Data In Monthly Report  Date Wise ", state.error);
            })

    }

   
})
export const {clearAtt}=AddAttDatesSlice.actions;
export default AddAttDatesSlice.reducer;
