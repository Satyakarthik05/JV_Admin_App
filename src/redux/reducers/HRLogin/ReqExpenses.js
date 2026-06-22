import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";




const initialState={
    error:null,
    loading:false,
    message:null,

    postreqExp:null, // post data for reqExpense
    getreqexpdata:null, // get data for reqExpense id Wise
    AllEmployeesReqExpenses:null,// get All Employees Data
    PatchReqExpense:null,//Patch Call For ReqExp

    postapplyLeave:null, // post call for Apply Leave
    getAppliedLeaves:null,//Get call Fro Applied Leaves id wise
    AllEmployeesLeaves:null,// All Members Leave
    SuccessmsgEditLeave:null,//Patch CallFro Edit Att

    PunchInAttendance:null,//Punch IN Att
    PunchOutAttendance:null,//Punch Out Att
    //AttendanceBasedOnDatesfilters:null,//Attendace Based On dates 

    AllEmployesAttenceData:[], 
    SingleEmployeeAttendanceData:[],
    Successmsg:null,//patch Call For Edit Atteance
    
    

    GetRolesWiseDepartmentsData:null,// for monthly report,attendance

    
    


}




   // Reqest Expense //
//**************************************Post Call For Request Expense Data **********************************************//
export const ReqExpense=createAsyncThunk('ReqExpense',async(payload,{rejectWithValue})=>{
    try{
        console.log("payload data -------------->",payload);
        console.log( "Request Expense Submitted Data in thunk ",payload);
        const response=await api.post(endpoints.REQ_EXPENSE,payload);
        console.log("Request Expense Submitted Data in thunk  fullfilled------>",response);
        return response.data;
    }
    catch(error){
        console.log("Error----------ReqExp------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})
//**************************************Get Call For Request Expense Data ID wise **********************************************//
export const GetReqExpense=createAsyncThunk('GetReqExpense',async(id,{rejectWithValue})=>{
    try{
        const  response=await api.get(`${endpoints.GET_REQEXPENSE}/${id}`);
        console.log("GetCall for Request Expense___________________________________________",response.data);
        return response.data
    }
    catch(error){
        console.log("Error in Get ReqExpense",error);
        const errorMessage=error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})
//**************************************Get Call All Emp  Request Expense Data **********************************************//
export const GetAllEmpReqExpenses=createAsyncThunk('GetAllEmpReqExpense',async(_,{rejectWithValue})=>{
    const url = `${api.defaults.baseURL}${endpoints.GET_ALL_EMP_REQEXPENSE}?requestType=ADVANCE`;
    console.log("Full API URL ----------------------->", url);
    try{
        // const  response=await api.get(endpoints.GET_ALL_EMP_REQEXPENSE);
        //const response = await api.get(endpoints.GET_ALL_EMP_REQEXPENSE,{ params: { requestType: "ADVANCE" } });
        const  response=await api.get(`${endpoints.GET_ALL_EMP_REQEXPENSE}?requestType=ADVANCE`);
        console.log("GetCall for All Emp  Request Expense___________________________________________",response.data);
        return response.data
    }
    catch(error){
        console.log("Error in  All Emp Get ReqExpense",error);
        const errorMessage=error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})

//****************************************Patch Call For Req Expense ************************************//
export const EditReqExpenseData=createAsyncThunk('EditReqExpenseData',async({id,payload},{rejectWithValue})=>{
    try{
        console.log("Payload data  Edit Req Expense  Patch Call   in  thunk",payload);
        
        // const response=await api.patch(`${endpoints.PATCH_EDIT_REQEXPENSE}/${id}`,payload);
        const response=await api.patch(`${endpoints.PATCH_EDIT_REQEXPENSE}/${id}`,payload);
        console.log("Edit Req Expense in thunk  ------>",response);
        return response.data;
    }
    catch(error){
        console.log("Error---------Edit Req Expense ------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})













//Apply Leaves//
//**************************************Post Call For Apply Leave **********************************************//
export const ApplyLeaves=createAsyncThunk('ApplyLeave',async({employeeId,empCode,leaveType,fromDate,toDate,totalDays,reason},{rejectWithValue})=>{
    try{
        const data={employeeId,empCode,leaveType,fromDate,toDate,totalDays,reason}
        console.log( "Apply Leave Submitted Data in thunk ",data);
        const response=await api.post(endpoints.POST_APPLYLEAVE,data);
        console.log("Apply Leave Submitted Data in thunk  fullfilled------>",response);
        return response.data;
    }
    catch(error){
        console.log("Error----------ApplyLeave------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})

//**************************************Get Call For Applied Leave (It Will Show Applied Leaves) ID wise **********************************************//
export const GetAppliedLeaves=createAsyncThunk('GetAppliedLeaves',async(id,{rejectWithValue})=>{
    try{
        const  response=await api.get(`${endpoints.GET_APPLIEDLEAVES}/${id}`);
        console.log("GetCall for Applied Leaves ID Wise___________________________________________",response.data);
        return response.data
    }
    catch(error){
        console.log("Error in Get Applied Leaves",error);
        const errorMessage=error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})

//*************************************************************Get Call For All Employees Leaves *****************************************************************************//
export const AllLeaves=createAsyncThunk('AllLeaves',async(_,{rejectWithValue})=>{
    try{
        const response=await api.get(endpoints.GET_ALL_LEAVES);
        console.log("Get All Employees Leaves in Thunk--------------------------------->",response.data);
        return response.data
    }
    catch(error){
        console.log("Error in Get All Leaves",error);
        const errorMessage=error?.response?.data?.error || error?.response?.data?.message || error?.data?.message || "failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
        
    }
})

//***********************************************Patch  Call For Edit Leave  ***********************************//
export const EditLeavesPatchCall=createAsyncThunk('EditLeavesPatchCall',async({id,payload},{rejectWithValue})=>{
    try{
        console.log("Payload data  Edit Leave Patch Call   in  thunk",payload);
        
        const response=await api.patch(`${endpoints.PATCH_EDIT_LEAVES}/${id}`,payload);
        console.log("Edit Leave in thunk  ------>",response);
        return response.data;
    }
    catch(error){
        console.log("Error---------Edit Leave ------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})




  //Attendance//

//**************************************Post Call For Punch In Attendance Leave **********************************************//
export const PunchInAtt=createAsyncThunk('PunchInAtt',async(payload,{rejectWithValue})=>{
    try{
        console.log("Payload data  from add Attendance Screen to post punch In Att thunk",payload);
        
        const response=await api.post(endpoints.POST_PUNCH_IN_ATTENDANCE,payload);
        console.log("Punch In Attendance  Submitted Data in thunk  ------>",response);
        return response.data;
    }
    catch(error){
        console.log("Error----------Punch In ------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})




//*****************************Patch Call For  posting PunchOut Attendance  ***********************************//
export const PunchOutAtt=createAsyncThunk('PunchOutAtt',async({id,payloadOut},{rejectWithValue})=>{
    try{
        console.log("Payload data  from add Attendance Screen to post the  punch out Att thunk",payloadOut);
        
        const response=await api.patch(`${endpoints.POST_PUNCH_OUT_ATTENDANCE}/${id}`,payloadOut);
        console.log("Punch Out  Attendance  Submitted Data in thunk  ------>",response);
        return response.data;
    }
    catch(error){
        console.log("Error----------Punch Out Attendance ------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})


//***********************************************Post Call For Get Attendance  for  All emp and dased on from date and todate ***********************************//
export const AttendanceBasedOnDates=createAsyncThunk('AttendanceBasedOnDates',async(payload,{rejectWithValue})=>{
    try{
        console.log("Payload data  post Call Get Attendance  for  All emp and dased on from date and todate thunk",payload);
        
        
        const response=await api.post(endpoints.POST_BASED_ON_DATES,payload);
        
        console.log("All Employes Attendance Data   in thunk and based On from date and to date   ------>",response);
        return response.data;
       
    }
    catch(error){
        console.log("Error----------ApplyLeave------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})


//***********************************************Patch  Call For Attendance  for  All emp ***********************************//
export const EditAttendancePatchCall=createAsyncThunk('EditAttendancePatchCall',async({id,payload},{rejectWithValue})=>{
    try{
        console.log("Payload data  Edit Attendance  in  thunk",payload);
        
        const response=await api.patch(`${endpoints.PATCH_EDIT_ATTENDANCE}/${id}`,payload);
        console.log("Edit Attendance in thunk  ------>",response);
        return response.data;
    }
    catch(error){
        console.log("Error---------Edit Attendance ------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})



//**************************************Get Call All Emp  Request Expense Data **********************************************//
export const GetRoleByDepartment=createAsyncThunk('GetRoleByDepartment',async(_,{rejectWithValue})=>{
    try{
        const  response=await api.get(endpoints.GET_ROLE_DEPARTMENT);
        console.log("GetRoleByDepartment___________________________________________",response.data);
        return response.data
    }
    catch(error){
        console.log("Error in  GetRoleByDepartment",error);
        const errorMessage=error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})






export const ReqExpenseSlice=createSlice({
    name:"reqexpense",
    initialState,
    reducers:{
      clearPostReqExpense:(state)=>{
        state.error=null;
      },
      clearGetReqExpense:(state)=>{
        state.error=null;
      },
      clearGetAllEmpReqExpense:(state)=>{
        state.error=null;
      },
      clearpostApplyLeave:(state)=>{
        state.error=null;
      },
      cleargetIDwiseLeave:(state)=>{
        state.error=null;
      },
      cleargetAllEmpLeave:(state)=>{
        state.error=null;
      },
      clearpuchIn:(state)=>{
        state.error=null;
      },
      clearPatchEditAtt:(state)=>{
        state.error=null;
      }
    },

    extraReducers:(builder)=>{
        //**************************************Post Call For Request Expense Data **********************************************//
        builder
        .addCase(ReqExpense.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(ReqExpense.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.postreqExp=action.payload;
            console.log("Payload Data In Request Expense Fullfilled COndition_________________________________",state.postreqExp);
        })
        .addCase(ReqExpense.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in ReqExpensePost Call",state.error);
        })
        //**************************************Get Call For Request Expense Data  ID Wise**********************************************//
        .addCase(GetReqExpense.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(GetReqExpense.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.getreqexpdata=action.payload.data;
            console.log("Payload Data  Get call In  Request Expense Fullfilled COndition_________________________________",state.getreqexpdata);

        })
        .addCase(GetReqExpense.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in ReqExpenseGet Call",state.error);
        })

        //*************************************************************Get Call For All Employees Req Expense *****************************************************************************//
        .addCase(GetAllEmpReqExpenses.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(GetAllEmpReqExpenses.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.AllEmployeesReqExpenses=action.payload.data;
            console.log("Payload Data  Get All Employees ReqExpense Fullfilled COndition_________________________________",state.AllEmployeesReqExpenses);

        })
        .addCase(GetAllEmpReqExpenses.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in  Get All Employees Req Expense ",state.error);
        })

        //*************************************************************Patch Call For Req Expense *****************************************************************************//
         .addCase(EditReqExpenseData.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(EditReqExpenseData.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.PatchReqExpense=action.payload.message
            console.log("Payload Data Edit Req Expense   Fullfilled Condition_________________________________",state.PatchReqExpense);
        })
        .addCase(EditReqExpenseData.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Patch Call   Edit ReqExpense  Data ",state.error);
        })






        //****************************************Post Call For Apply Leave******************************************************//
        .addCase(ApplyLeaves.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(ApplyLeaves.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.postapplyLeave=action.payload;
            console.log("Payload Data Apply leave  Fullfilled COndition_________________________________",state.postapplyLeave);
        })
        .addCase(ApplyLeaves.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in ApplyLeave Post Call",state.error);
        })

        //**************************************Get Call For Applied Leaves  ID Wise**********************************************//
        .addCase(GetAppliedLeaves.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(GetAppliedLeaves.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.getAppliedLeaves=action.payload.data;
            console.log("Payload Data  Get call In  AppliedLeaves Fullfilled COndition_________________________________",state.getAppliedLeaves);

        })
        .addCase(GetAppliedLeaves.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Applied Leaves",state.error);
        })
        //*************************************************************Get Call For All Employees Leaves *****************************************************************************//
        .addCase(AllLeaves.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(AllLeaves.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.AllEmployeesLeaves=action.payload.data;
            console.log("Payload Data  Get All Employees Leaves Fullfilled COndition_________________________________",state.AllEmployeesLeaves);

        })
        .addCase(AllLeaves.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in  Get All Employees Leaves ",state.error);
        })

        //*****************************************Edit Leaves Patch Call***************************************************//
        .addCase(EditLeavesPatchCall.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(EditLeavesPatchCall.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.SuccessmsgEditLeave=action.payload.message
            console.log("Payload Data Edit Attendance  Fullfilled Condition_________________________________",state.SuccessmsgEditLeave);
        })
        .addCase(EditLeavesPatchCall.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Patch Call   Edit Attendance Data ",state.error);
        })





        //****************************************Post Data For Punch In Attendance******************************************************//
        .addCase(PunchInAtt.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(PunchInAtt.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.PunchInAttendance=action.payload;
            console.log("Payload Data For Punch In Attendance  Fullfilled Condition_________________________________",state.PunchInAttendance);
        })
        .addCase(PunchInAtt.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in punch In  Post Call",state.error);
        })

        //************************************Patch Call For Punch Out Attendance*******************************************************//

        .addCase(PunchOutAtt.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(PunchOutAtt.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.PunchOutAttendance=action.payload;
            console.log("Payload Data For Punch Out  Attendance  Fullfilled Condition_________________________________",state.PunchOutAttendance);
        })
        .addCase(PunchOutAtt.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in PuchnOut  Post Call",state.error);
        })

        //****************************************Post Data For Attendance  Based  On  Dates filters******************************************************//
        .addCase(AttendanceBasedOnDates.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(AttendanceBasedOnDates.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;


            const payload=action.meta.arg;

            if(payload.employeeId){
                // This is MyAttendance screen
                state.SingleEmployeeAttendanceData=action.payload.data;
                console.log("Single Employee data In FullFilled Condition ____________________________________________________>",state.SingleEmployeeAttendanceData);
                
            }
            else{
                //This is EmployeeAttendance screen
                state.AllEmployesAttenceData=action.payload.data;
                console.log("AllEmployees Attendance Data fullfilled Condition---------------------------------------->",state.AllEmployesAttenceData);
                
            }
            //attendanceDate for allemp
            // state.AttendanceBasedOnDatesfilters=action.payload.data;
            //console.log("Payload Data For Attendace Based On Dates   Fullfilled Condition_________________________________",state.AttendanceBasedOnDatesfilters);
            console.log("*******************************Success************************************************");
            
        })
        .addCase(AttendanceBasedOnDates.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Attendance Based On Dates filtersPost Call",state.error);
        })



        //*****************************************Edit Atteance Patch Call***************************************************//
        .addCase(EditAttendancePatchCall.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(EditAttendancePatchCall.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.Successmsg=action.payload.message
            console.log("Payload Data Edit Attendance  Fullfilled Condition_________________________________",state.Successmsg);
        })
        .addCase(EditAttendancePatchCall.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Patch Call   Edit Attendance Data ",state.error);
        })




        //***************************************Get Roles By Department data************************************//
        .addCase(GetRoleByDepartment.pending,(state)=>{
            state.error=null;
            state.loading=true;
           
        })
        .addCase(GetRoleByDepartment.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.GetRolesWiseDepartmentsData=action.payload.data;
            console.log("Payload Data  Get Roles By Department Data Fullfilled COndition_________________________________",state.GetRolesWiseDepartmentsData);

        })
        .addCase(GetRoleByDepartment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in  Get Roles By Department Data ",state.error);
        })

        
    }


})

export const  {clearPostReqExpense,clearGetReqExpense,clearGetAllEmpReqExpense,clearpostApplyLeave,cleargetIDwiseLeave,cleargetAllEmpLeave,clearpuchIn,clearPatchEditAtt}=ReqExpenseSlice.actions;
export default ReqExpenseSlice.reducer;