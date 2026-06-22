import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";



const initialState={
    message:null,
    loading:false,
    error:null,
    roleId:null,
    data:null,   
}

export const requestLogin=createAsyncThunk('requestLogin',async({mobileNumber,password},{rejectWithValue})=>{
    try{
        const data={mobileNumber,password}
        console.log( "Login details phoneno,password",data);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.LOGIN}`);
        const response=await api.post(endpoints.LOGIN,data);
        console.log("Login response in thunk------>",response);

        //new for alert
        if (response.data.status !== 200) {
        return rejectWithValue(response.data.message);
        }//new

        return response.data;

        
    }
    catch(error){
        console.log("Error----------Login------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
});


export const AuthSlice=createSlice({
    name:'authslice',
    initialState,
    reducers:{
        actionLogOut:(state)=>{
            state.error=null;
            state.message=null;
            state.roleId=null;
        },
        clearloginError:(state)=>{
            state.error=null;// here redux error will be removed
        }
    },
    extraReducers:(builder)=>{
        builder
           .addCase(requestLogin.pending,(state)=>{
            //console.log("_______________________Pending State_________________");
            state.loading=true;
            state.error=null;
            state.message=null;
            })
            .addCase(requestLogin.fulfilled,(state,action)=>{
            console.log("_____________________Fullfilled Condtion in Login_____________________");
            state.loading=false;
            state.error=null;
            state.message=action.payload.message;
            console.log("Payload Message=======>",state.message);
            
            state.roleId=action.payload.data.roleId;
            console.log("Payload in Fullfilled Condition",action.payload.data.roleId);
            state.data=action.payload.data
            console.log("payload Data in Login reduc code ------------------------------------------>",state.data);    
            })
            .addCase(requestLogin.rejected,(state,action)=>{
                console.log("+++++++++++++++++++Rejected+++++++++++++");
                state.loading=false;
                state.message=null;
                state.error = action.payload;
                console.log("Error---------------------->",state.error);
            })
    }
})

export const {actionLogOut,clearloginError}=AuthSlice.actions;
export default AuthSlice.reducer