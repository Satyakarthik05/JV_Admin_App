import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";


const initialState = {
    message: null,
    error: null,
    loading: false,
    regestrationdata: null, //post data
    getEmpdata: null, // get Employess Data

    EditEmpData: null,// to edit the registered Emp Data
    DeleteEmpleeData: null,//deleted Employee Data
}

//**********************Post Employess Data(employee Regestration Data)******************************//
// export const Empreg = createAsyncThunk('Empreg', async ({ name, mobileNumber, emailId, gender, roleId, roleName, password, department, joiningDate, dateOfBirth, address, salary,documents }, { rejectWithValue },) => {
//     try {
//         const payload = {
//             // empCode,
//             name,
//             mobileNumber,
//             emailId,
//             gender,
//             roleId,
//             roleName,
//             password,
//             department,
//             joiningDate,
//             dateOfBirth,
//             address,
//             salary,
//             documents,
//         }

//         console.log("Regestration Data In HR Login", payload);
//         // const response=await api.post(endpoints.EMPLOYEE_REG,formateData,{ headers: { "Content-Type": "multipart/form-data", } });
//         const response = await api.post(endpoints.EMPLOYEE_REG, payload,);
//         console.log("response in thunk----->", response);
//         return response.data;
//     }
//     catch (error) {
//         console.log("Data Not received to Backend", error);
//         const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Some Thing Went Wrong";
//         console.log('Employ Regestration', errorMessage, error);
//         return rejectWithValue(errorMessage);

//     }
// });

// changed
// export const Empreg = createAsyncThunk(
//   "Empreg",
//   async (data, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();

//       console.log("Full Data Received In Thunk 👉", data);
//       console.log("Files Received 👉", data.files);

//       formData.append("name", data.name);
//       formData.append("mobileNumber", data.mobileNumber);
//       formData.append("emailId", data.emailId);
//       formData.append("gender", data.gender);
//       formData.append("roleId", data.roleId);
//       formData.append("roleName", data.roleName);
//       formData.append("password", data.password);
//       formData.append("department", data.department);
//       formData.append("joiningDate", data.joiningDate);
//       formData.append("dateOfBirth", data.dateOfBirth);
//       formData.append("address", data.address);
//       formData.append("salary", data.salary);

//       //  Append files
//       data.files.forEach((file, index) => {
//         formData.append("documents", {
//           uri: file.uri,
//           type: file.type,
//           name: file.name,
//         });
//       });

//        console.log("FormData prepared 👉", formData);

//       const response = await api.post(
//         endpoints.EMPLOYEE_REG,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );


export const Empreg = createAsyncThunk(
    "Empreg",
    async (data, { rejectWithValue }) => {
        try {


            //             for (let pair of formData._parts) {
            //     console.log(pair[0] + " => ", pair[1]);
            // }


            console.log("FormData received in thunk", data);

            const response = await api.post(
                endpoints.EMPLOYEE_REG,
                data,

            );

            return response.data;

        } catch (error) {
            console.log("Upload Error 👉", error);
            return rejectWithValue(
                error?.response?.data?.message || error.message
            );
        }
    }
);



// ***********************************Get Employes Regestered Data**********************************************//
export const GetRegesteredData = createAsyncThunk('GetRegesteredData', async (_, { rejectWithValue }) => {
    try {
        console.log("get RegesteredData in thunk one one");
        const response = await api.get(endpoints.GET_EMPLOYEES);
        console.log("regesteredData in thunk", response.data);
        return response.data;
    }
    catch (error) {
        console.log("Error in Roles", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})


//**************************************Patch Call For Edit Employee Regestration Data *************************************//
export const EditEmployeePatchCall = createAsyncThunk('EditEmployeePatchCall', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data  Edit Employee Data  Patch Call   in  thunk", payload);
        console.log("Id here in redux code ---------------------------->", id);


        const response = await api.patch(`${endpoints.PATCH_EDIT_EMPLOYEE}/${id}`, payload);
        console.log("PATCH URL =>", `${api.defaults.baseURL}${endpoints.PATCH_EDIT_EMPLOYEE}/${id}`);
        console.log("Edit Employee Data  in thunk  ------>", response.data);
        return response.data;
    }
    catch (error) {
        console.log("Error---------Edit Employee Data  ------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to fetch The API Data";
        return rejectWithValue(errorMessage);
    }
})

//**************************************Delete  Roles**********************************************//
export const DeletetheEmployeeData = createAsyncThunk('DeletetheEmployeeData', async ({ id }, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_EMPLOYEE_DATA}/${id}`);
        console.log("Deleted the Employeee__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Employee Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})



export const EmpregSlice = createSlice({
    name: 'Empreg',
    initialState,
    reducers: {
        clearerror: (state) => {
            state.error = null;
        },
        resetData: (state) => {
            state.regestrationdata = null;// clear the data
        },
        cleargetempData: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        //**********************Post Employess Data(employee Regestration Data)******************************//
        builder
            .addCase(Empreg.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(Empreg.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.regestrationdata = action.payload;
                console.log("Employess Regestration Data  fullfilled Condition", state.regestrationdata);

            })
            .addCase(Empreg.rejected, (state, action) => {
                state.loading = false;
                state.regestrationdata = null;
                state.error = action.payload;
            })
            // ***********************************Get Employes Regestered Data**********************************************//
            .addCase(GetRegesteredData.pending, (state) => {
                state.error = null;
                state.loading = true;

            })
            .addCase(GetRegesteredData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.getEmpdata = action.payload.data;
                console.log("Fullfilled in getEmpdata............", state.getEmpdata);

            })
            .addCase(GetRegesteredData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in getEmployess Data", state);
            })

            //**************************************Edit Employee Regestered Data *******************************************//
            .addCase(EditEmployeePatchCall.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditEmployeePatchCall.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.EditEmpData = action.payload.message;
                console.log("Payload Data Edit Role  Fullfilled Condition_________________________________", state.EditEmpData);
            })
            .addCase(EditEmployeePatchCall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Patch Call   Edit Role Data ", state.error);
            })

            //**************************************Delete  Employee Data **********************************************//
            .addCase(DeletetheEmployeeData.pending, (state) => {
                state.error = null;
                state.loading = true;

            })

            .addCase(DeletetheEmployeeData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.getEmpdata = state.getEmpdata.filter(
                    Employee => Employee.id !== action.meta.arg.id
                );
                state.DeleteEmpleeData = action.payload.message
                console.log("Payload Data Delete the Employeee Data  Fullfilled Condition_________________________________", state.DeleteEmpleeData);
                console.log("Employeee Data  Deleted Successfully");

            })

            .addCase(DeletetheEmployeeData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Delete The Employee Data ", state.error);
            })


    }
});

export const { clearerror, resetData, cleargetempData } = EmpregSlice.actions;
export default EmpregSlice.reducer;

