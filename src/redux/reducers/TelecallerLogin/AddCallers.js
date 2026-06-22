import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";

const initialState = {
    error: null,
    loading: false,
    message: null,


    //Add New Lead
    PostLead: null,
    GetLeadsData: null,
    EditLeadsData: null,
    deleteLeadsData:null,

    //Import Leads
    LeadsData:null,

    //Call Logs
    PostCallLogs:null,
    GetCallLogsData:null,


    //questions 
    PostQns:null,
    GetQnData:null,
    EditqtnData:null,
    DeleteQtn:null,


    //follow Up report 
    report:null,

}


//Telecaller login Leads
//********************************************Add New Lead  In   Telecaller Login ********************************************//
export const AddNewLead = createAsyncThunk('AddNewLead', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add New Lead -------------------->", payload);
        const response = await api.post(endpoints.ADD_NEW_LEAD, payload);
        // console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_PRODUCT}`);

        console.log("All About Post Call for Add New Lead  thunk  in Telecaller Login  =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add New Lead In Telecaller Login ---------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})
//********************************************Get Leads Data in Telecaller Login  ********************************************//
export const GetLeads = createAsyncThunk('GetLeads', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_LEADS);
        console.log("All About get Call in thunk------------------>Get Leads", response);
        return response.data;
    }
    catch (error) {
        console.log("Add Leads  in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})

//********************************************Edit Lead in Telecaller r ********************************************//
export const EditLeads = createAsyncThunk('EditLeads', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Leadfs  coming from normal UI code ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_LEAD}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Leads------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})
//**************************************Delete Lead**********************************************//
export const DeleteLead = createAsyncThunk('DeleteLead', async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_LEAD}/${id}`);
        console.log("Deleted the Lead Data__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Leads Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})


//Import Leads Excel
//********************************************Add New Lead  In   Telecaller Login ********************************************//
export const ImportLeadsFun = createAsyncThunk('ImportLead', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add New Lead -------------------->", payload);
        const response = await api.post(endpoints.ADD_IMPORT_LEAD, payload);
        // console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_PRODUCT}`);

        console.log("All About Post Call for Import Lead thunk  in Telecaller Login  =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------------------------------Import  Lead In Telecaller Login ---------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})



//Call Logs
//********************************************Add  Call Logs  In   Telecaller Login ********************************************//
export const AddCalllog = createAsyncThunk('AddCalllog', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add Call logs -------------------->", payload);
        const response = await api.post(endpoints.ADD_CALL_LOGS, payload);
        // console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_PRODUCT}`);

        console.log("All About Post Call for Add CAll Logs thunk  in Telecaller Login  =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add Call logs In Telecaller Login ---------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Get Call Logs  Data in Telecaller Login  ********************************************//
export const GetCallLogs = createAsyncThunk('GetCallLogs', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`${endpoints.GET_CALL_LOGS}/${id}`);
        console.log("All About get Call Logs  in thunk------------------>Get Leads", response);
        return response.data;
    }
    catch (error) {
        console.log("Get CAll logs   in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})


//Question And Ans
//********************************************Add New Lead  In   Telecaller Login ********************************************//
export const QuestionsPost = createAsyncThunk('QuestionsPost', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data  Questions  -------------------->", payload);
        const response = await api.post(endpoints.POST_QUESTIONS, payload);
        // console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_PRODUCT}`);

        console.log("All About Post Call for Question And Answeres =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------------------------------Question And Answeres ---------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Get Question Data Telecaller Login  ********************************************//
export const GetCallQuestions = createAsyncThunk('GetCallQuestions', async (_, { rejectWithValue }) => {
    try {
       const response = await api.get(endpoints.GET_QUESTION);
        console.log("All About get Questions in thunk------------------>Telecaller", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Question    in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})


//********************************************Edit Questions in Telecaller r ********************************************//
export const EditQuestions = createAsyncThunk('EditQuestions', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Final URL --->", `${endpoints.EDIT_QTN}/${id}`);
        console.log("Url__________________________>",`${api.defaults.baseURL}${endpoints.EDIT_QTN}/${id}`);
        console.log("Payload data in thunk Edit Question  coming from normal UI code ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_QTN}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk EditQuestion ------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//**************************************Delete Question Data **********************************************//
export const DeleteQuestionData = createAsyncThunk('DeleteQuestionData', async ({id}, { rejectWithValue }) => {
    try {
        console.log("Url__________________________>",`${api.defaults.baseURL}${endpoints.DELETE_QTN}/${id}`);
        const response = await api.delete(`${endpoints.DELETE_QTN}/${id}`);
        console.log("Deleted the Question Data__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Question  Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})





//********************************************Follow-up Report Telecaller Login ********************************************//
export const ReportData = createAsyncThunk('ReportData', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  Follow Up Report -------------------->", payload);
        const response = await api.post(endpoints.POST_FOLLOWUP, payload);
        // console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_PRODUCT}`);

        console.log("All About follow Up Report =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------------------------------Follow Up Report --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})






export const TelecallerSlice = createSlice({
    name: "TelecallerData",
    initialState,
    reducers: {
        clearTelecaller: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            //Add Telecaller Leads 
            //********************************************Add call logs  in  Telecaller  ********************************************//
            .addCase(AddNewLead.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddNewLead.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostLead = action.payload;
                console.log("Payload Data in Add New Lead  Telecaller Login  full filled condition ---------------------->", state.PostLead);

            })
            .addCase(AddNewLead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add New Lead  Telecaller Login ----------------------->", state.error);

            })
            //********************************************Get Leads Data In  Telecaller Login  ********************************************//
            .addCase(GetLeads.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetLeads.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetLeadsData = action.payload.data;
                console.log("Payload Data in Get Leads Data filled condition ---------------------->", state.GetLeadsData);

            })
            .addCase(GetLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Leads Data in Telecaller Login ----------------------->", state.error);
            })
            //********************************************Edit Lead In Telecaller Login ********************************************//
            .addCase(EditLeads.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditLeads.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditLeadsData = action.payload.message;
                console.log("Payload Data for   Edit Lead  In Telecaller Login  call ------------>", state.EditLeadsData);
            })
            .addCase(EditLeads.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit lead  for Telecaller login ------------>", state.error);

            })
            //**************************************Delete  Product Data **********************************************//
            .addCase(DeleteLead.pending, (state) => {
                state.error = null;
                state.loading = true;

            })

            .addCase(DeleteLead.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.GetLeadsData = state.GetLeadsData.filter(
                    lead => lead.id !== action.meta.arg.id
                );
                state.deleteLeadsData = action.payload.message
                console.log("Payload Data Delete Lead  Fullfilled Condition_________________________________", state.deleteLeadsData);
                console.log("Product Data  Deleted Successfully");

            })

            .addCase(DeleteLead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Delete Lead ", state.error);
            })




            //Import  Leads 
            //********************************************Import Lead   in  Telecaller  ********************************************//
            .addCase( ImportLeadsFun.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase( ImportLeadsFun.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.LeadsData= action.payload;
                console.log("Payload Data in import Lead  Telecaller Login  full filled condition ---------------------->", state.LeadsData);

            })
            .addCase( ImportLeadsFun.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in import Lead  Telecaller Login ----------------------->", state.error);

            })







            //Call Logs
            //********************************************Add Call logs   for Telecaller login ********************************************//
            .addCase(AddCalllog.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddCalllog.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostCallLogs= action.payload;
                console.log("Payload Data in Add Call logs  Telecaller Login  full filled condition ---------------------->", state.PostCallLogs);

            })
            .addCase(AddCalllog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add call Logs  Telecaller Login ----------------------->", state.error);

            })

             //********************************************Get Call logs Data In  Telecaller Login  ********************************************//
            .addCase(GetCallLogs.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetCallLogs.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetCallLogsData= action.payload.data;
                console.log("Payload Data in Get Call Logs Data filled condition ---------------------->", state.GetCallLogsData);

            })
            .addCase(GetCallLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Call Logs Data in Telecaller Login ----------------------->", state.error);
            })




            //Questions And Aswers
            //********************************************Post Questions   Telecaller  ********************************************//
            .addCase( QuestionsPost.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase( QuestionsPost.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostQns= action.payload;
                console.log("Payload Data in Question And Answers full filled condition ---------------------->", state.PostQns);

            })
            .addCase( QuestionsPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Question ANd Answers  Telecaller Login ----------------------->", state.error);

            })

             //********************************************Get Questions  Data In  Telecaller Login  ********************************************//
            .addCase(GetCallQuestions.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetCallQuestions.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetQnData= action.payload.data;
                console.log("Payload Data in Get Questions Data filled condition ---------------------->", state.GetQnData);

            })
            .addCase(GetCallQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Questions Data in Telecaller Login ----------------------->", state.error);
            })



            //********************************************Edit Questions In Telecaller Login ********************************************//
            .addCase(EditQuestions.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditQuestions.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditqtnData = action.payload.message;
                console.log("Payload Data for   Edit Question In Telecaller Login  call ------------>", state.EditqtnData);
            })
            .addCase(EditQuestions.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                state.error = action.payload;
                console.log("Payload Error in edit Question  for Telecaller login ------------>", state.error);

            })

            //**************************************Delete  Question Data **********************************************//
            .addCase(DeleteQuestionData.pending, (state) => {
                state.error = null;
                state.loading = true;

            })
            .addCase(DeleteQuestionData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.GetQnData= state.GetQnData.filter(
                    qtn => qtn.id !== action.meta.arg.id
                );
                state.DeleteQtn= action.payload.message
                console.log("Payload Data Delete Question   Fullfilled Condition_________________________________", state.DeleteQtn);
                console.log("Product Data  Deleted Successfully");

            })
            .addCase(DeleteQuestionData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Delete Lead ", state.error);
            })




            //fowllow up report 
            //********************************************Follow Up Report    Telecaller  ********************************************//
            .addCase( ReportData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase( ReportData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.report= action.payload.data;
                console.log("Payload Data For Follow Up Report  full filled condition ---------------------->", state.report.data);

            })
            .addCase( ReportData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error for Follow up Report Telecaller Login ----------------------->", state.error);

            })



    }
})
export const { clearTelecaller } = TelecallerSlice.actions;
export default TelecallerSlice.reducer;