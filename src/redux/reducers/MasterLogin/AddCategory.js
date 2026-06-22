import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";


const initialState={
    error:null,
    loading:false,
    message:null,
    ProductAddCategory:null,
    getProductCategory:null,
    editCategory:null,
    deleteCategory:null,


    //raw Category
    RawAddCategory:null,
    GetRawCategory:null,
    deleteRawCategory:null,
    editRawCat:null,

    //Accessory MAster Category
    AddAcccategory:null,
    GetAccCategory:null,
    deleteAccCategory:null,
    editAccCat:null,

    //Raw Material Units
    AddUnit:null,
    UnitsData:null,
    DeleteUnit:null,
    EditUnit:null,


    //password for delete product 
    getpasswordata:null,
    Editpsw:null,

}


//********************************************Add Category  for Prodcut Master ********************************************//
export const AddCategoryInProductMaster=createAsyncThunk('AddCategoryInProductMaster',async(categoryName,{rejectWithValue})=>{
    try{
        console.log("Category data-------------------->",categoryName);
        const response=await api.post(endpoints.ADDCATEGORY_PRODUCTMASTER,{ categoryName: categoryName });
        console.log("All About Add Category in Product Master thunk =======================>",response);
        return response.data;
    }
    catch(error){
        console.log("Error-----------------------------------Add category in Product Master---------------------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
        
    }
})
//********************************************Get  Category  for Prodcut Master ********************************************//
export const GetCategories=createAsyncThunk('GetCategories',async(_,{rejectWithValue})=>{
    try{
        const response=await api.get(endpoints.GET_ALL_PRODUCT_CAT);
        console.log("response in thunk for Get Categories in Raw Category ------------------>",response.data);
        return response.data;
        
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})
//********************************************Patch   Category  for Prodcut Master ********************************************//
export const PatchCategories=createAsyncThunk('PatchCategories',async({id,payload},{rejectWithValue})=>{
    try{
        const response=await api.patch(`${endpoints.edit_cat_PM}/${id}`,payload);
        console.log("respons in thunk for edit category in Product master------------------->",response);
        return response.data;
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})

//********************************************Delete   Category  for Prodcut Master ********************************************//
export const DeleteCategory=createAsyncThunk('DeleteCategory',async(id,{rejectWithValue})=>{
    try{
        const response=await api.delete(`${endpoints.DEL_CAT_PM}/${id}`);
        console.log("Url---->",`${api.defaults.baseURL}${endpoints.DEL_CAT_PM}/${id}`);
        // console.log("PATCH URL =>", `${api.defaults.baseURL}${endpoints.PATCH_EDIT_EMPLOYEE}/${id}`);
        
        console.log("response in thunk for Delete category in Product Master----------------->",response);
        return response.data;
        
    }
    catch(error){
        console.log("Error-----------------in thunk delete-------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);

    }
})




//Raw Material  Category 

//********************************************Add Category  for Raw Material  Master ********************************************//
export const AddCategoryRawMaster=createAsyncThunk('AddCategoryRawMaster',async(categoryName,{rejectWithValue})=>{
    try{
        console.log("Category data-------------------->",categoryName);
        const response=await api.post(endpoints.ADDCATEGORY_RAWMASTER,{ categoryName: categoryName });
        console.log("All About Add Category in Raw Material  Master thunk =======================>",response);
        return response.data;
    }
    catch(error){
        console.log("Error-----------------------------------Add category in Raw Material  Master---------------------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
        
    }
})
//********************************************Get  Category  for Prodcut Master ********************************************//
export const GetRawCategories=createAsyncThunk('GetRawCategories',async(_,{rejectWithValue})=>{
    try{
        const response=await api.get(endpoints.GET_ALL_RAW_CAT);
        console.log("response in thunk for Get Categories in Raw Category ------------------>",response.data);
        return response.data;
        
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})

//********************************************Delete   Category  for Prodcut Master ********************************************//
export const DeleteRawCategories=createAsyncThunk('DeleteRawCategories',async(id,{rejectWithValue})=>{
    try{
        const response=await api.delete(`${endpoints.DEL_CAT_RAW}/${id}`);
        console.log("Url---->",`${api.defaults.baseURL}${endpoints.DEL_CAT_RAW}/${id}`);
        // console.log("PATCH URL =>", `${api.defaults.baseURL}${endpoints.PATCH_EDIT_EMPLOYEE}/${id}`);
        
        console.log("response in thunk for Delete category in Product Master----------------->",response);
        return response.data;
        
    }
    catch(error){
        console.log("Error-----------------in thunk delete-------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);

    }
})
//********************************************Patch   Call  for Raw Material Category ********************************************//
export const PatchRawCategory=createAsyncThunk('PatchRawCategory',async({id,payload},{rejectWithValue})=>{
    try{
        const response=await api.patch(`${endpoints.EDIT_RAW_MATERIAL_CAT}/${id}`,payload);
        console.log("respons in thunk for edit category in Raw Material Category------------------->",response);
        return response.data;
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})



//Accessory Master Category
//********************************************Add Category  Accessory Master  ********************************************//
export const AddAccessoryCategory=createAsyncThunk('AddAccessoryCategory',async(accessoryType,{rejectWithValue})=>{
    try{
        console.log("Category data-------------------->",accessoryType);
        const response=await api.post(endpoints.ADDCATEGORY_ACCESSORY_MASTER,{ accessoryType: accessoryType});
        console.log("All About Add Category in Accessory Master thunk =======================>",response);
        return response.data;
    }
    catch(error){
        console.log("Error-----------------------------------Add category in Accessory Master --------------------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
        
    }
})
//********************************************Get  Category  for Prodcut Master ********************************************//
export const GetAccessoryCategoryData=createAsyncThunk('GetAccessoryCategoryData',async(_,{rejectWithValue})=>{
    try{
        const response=await api.get(endpoints.GET_ALL_ACCESSORY_CAT);
        console.log("response in thunk for Get Categories in Accessory Category ------------------>",response.data);
        return response.data;
        
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})
//********************************************Patch   Category  for Accessory Master  ********************************************//
export const EditAccessoryType=createAsyncThunk('EditAccessoryType',async({id,payload},{rejectWithValue})=>{
    try{
        const response=await api.patch(`${endpoints.EDIT_ACC_CAT}/${id}`,payload);
        console.log("respons in thunk for edit Accessory Category Data in Accessory Master ------------------->",response);
        return response.data;
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})

//********************************************Delete   Category  for Accessory Master  ********************************************//
export const DeleteAccessoryCategory=createAsyncThunk('DeleteAccessoryCategory',async(id,{rejectWithValue})=>{
    try{
        const response=await api.delete(`${endpoints.DEL_ACC_CAT}/${id}`);
        console.log("Url---->",`${api.defaults.baseURL}${endpoints.DEL_ACC_CAT}/${id}`);
        // console.log("PATCH URL =>", `${api.defaults.baseURL}${endpoints.PATCH_EDIT_EMPLOYEE}/${id}`);
        
        console.log("response in thunk for Delete category in Accessory Master ---------------->",response);
        return response.data;
        
    }
    catch(error){
        console.log("Error-----------------in thunk delete-------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);

    }
})





//********************************************Add Unit in Raw Material  ********************************************//
export const AddUnitsData=createAsyncThunk('AddUnitsData',async(unitName,{rejectWithValue})=>{
    try{
        console.log("Units Payload Data-------------------->",unitName);
        const response=await api.post(endpoints.ADD_UNIT,{unitName:unitName});
        console.log("All About Add Units In Raw Materail  thunk =======================>",response);
        return response.data;
    }
    catch(error){
        console.log("Error-----------------------------------Add Unit in Raw Material---------------------->",error);
        const errorMessage=error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
        
    }
})
//********************************************Get  Unit in Raw Material  * ********************************************//
export const GetUnitsData=createAsyncThunk('GetUnitsData',async(_,{rejectWithValue})=>{
    try{
        const response=await api.get(endpoints.GET_UNIT);
        console.log("response in thunk for Get Units Data Raw Material Transfer------------------>",response.data);
        return response.data;
        
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})
//********************************************Patch Unit in Raw Material  *********************************************//
export const PatchUnitsData=createAsyncThunk('PatchUnitsData',async({id,payload},{rejectWithValue})=>{
    try{
        const response=await api.patch(`${endpoints.EDIT_UNIT}/${id}`,payload);
        console.log("respons in thunk for Patch Units Data ------------------->",response);
        return response.data;
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})

//********************************************Delete  Unit in Raw Material  *********************************************//
export const DeleteUnitsData=createAsyncThunk('DeleteUnitsData',async(id,{rejectWithValue})=>{
    try{
        const response=await api.delete(`${endpoints.DEL_UNIT}/${id}`);
        console.log("Url---->",`${api.defaults.baseURL}${endpoints.DEL_UNIT}/${id}`);
        // console.log("PATCH URL =>", `${api.defaults.baseURL}${endpoints.PATCH_EDIT_EMPLOYEE}/${id}`);
        
        console.log("response in thunk for Delete Units Data---------------->",response);
        return response.data;
        
    }
    catch(error){
        console.log("Error-----------------in thunk delete-------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);

    }
})






//****************************************************Get Passwords Data *****************************************//
export const GetPasswordsData=createAsyncThunk('GetPasswordsData',async(_,{rejectWithValue})=>{
    try{
        const response=await api.get(endpoints.GET_PASSWORD);
        console.log("response in thunk for Get passwords---------------->",response.data);
        return response.data;
        
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})

//********************************************Patch   Call  password ********************************************//
export const patchPassword=createAsyncThunk('patchPassword',async({id,payload},{rejectWithValue})=>{
    try{
        const response=await api.patch(`${endpoints.EDIT_PSW}/${id}`,payload);
        console.log("respons in thunk for edit password Data ----------------->",response);
        return response.data;
    }
    catch(error){
        console.log("Error in thunk------------->",error);
        const errorMessage=error?.response?.data?.message || error?.response?.data?.error || error.message || "Failed To fetch The Api Data";
        return rejectWithValue(errorMessage);
    }
})












export const  AddCategorySlice=createSlice({
    name:"addCategory",
    initialState,
    reducers:{
        clearAddCategory:(state)=>{
            state.error=null;
        },
    },



    extraReducers:(builder)=>{

        //Product Master
        //***********************************Add category For Product Master ****************************************************//
        builder
        .addCase(AddCategoryInProductMaster.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(AddCategoryInProductMaster.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.ProductAddCategory=action.payload;
            console.log("Payload Data in Add Category for Product Master---------------------->",state.ProductAddCategory);
            
        })
        .addCase(AddCategoryInProductMaster.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Add Category for Product Master----------------------->",state.error);
            
        })
        //***********************************Get category For Product Master ****************************************************//
        .addCase(GetCategories.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(GetCategories.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.getProductCategory=action.payload.data;
            console.log("Payload Data in Get Categories In Product Master------------>",state.getProductCategory);
        })
        .addCase(GetCategories.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Get Categories for Product Master------------>",state.error);
            
        })
        //********************************************Patch   Category  for Prodcut Master ********************************************//
        .addCase(PatchCategories.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(PatchCategories.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.editCategory=action.payload.message;
            console.log("Payload Data in  Categories In Product Master patch call ------------>",state.editCategory);
        })
        .addCase(PatchCategories.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in edit Categories for Product Master------------>",state.error);
            
        })
        //********************************************Delete   Category  for Prodcut Master ********************************************//
        .addCase(DeleteCategory.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(DeleteCategory.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.getProductCategory=state.getProductCategory.filter(
                category=>category.id!==action.meta.arg.id
            );
            state.deleteCategory=action.payload.message;
            console.log("Payload Data in  Categories In Product Master Delete call ------------>",state.editCategory);
        })
        .addCase(DeleteCategory.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Delete  Categories for Product Master------------>",state.error);
            
        })





        //Raw Material Master
        //***********************************Add category For Raw Material Master ****************************************************//
        .addCase(AddCategoryRawMaster.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(AddCategoryRawMaster.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.RawAddCategory=action.payload;
            console.log("Payload Data in Add Category for Raw Material Category Master---------------------->",state.RawAddCategory);
            
        })
        .addCase(AddCategoryRawMaster.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Add Category for Raw Material Category Master----------------------->",state.error);
            
        })

        //***********************************Get category For Raw Matrial ****************************************************//
        .addCase(GetRawCategories.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(GetRawCategories.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.GetRawCategory=action.payload.data;
            console.log("Payload Data in Get Categories In Raw Category------------>",state. GetRawCategory);
        })
        .addCase(GetRawCategories.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Get Categories for Raw Category ------------>",state.error);
            
        })
         //********************************************Delete   Category  for Prodcut Master ********************************************//
        .addCase(DeleteRawCategories.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(DeleteRawCategories.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.GetRawCategory=state.GetRawCategory.filter(
                category=>category.id!==action.meta.arg.id
            );
            state.deleteRawCategory=action.payload.message;
            console.log("Payload Data in  Categories In Raw Category Delete call ------------>",state.deleteRawCategory);
        })
        .addCase(DeleteRawCategories.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Delete  Categories for Raw Category------------>",state.error);
            
        })
        //********************************************Patch   Call  for Raw MAterial Category ********************************************//
        .addCase(PatchRawCategory.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(PatchRawCategory.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.editRawCat=action.payload.message;
            console.log("Payload Data In Raw Material Categories patch call ------------>",state.editRawCat);
        })
        .addCase(PatchRawCategory.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in edit  Raw Material Categories------------>",state.error);
            
        })



         //Accessory Category  ----->In Accessory Master 
        //***********************************Add category For Accessory Master Master ****************************************************//
        .addCase(AddAccessoryCategory.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(AddAccessoryCategory.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.AddAcccategory=action.payload;
            console.log("Payload Data in Add Category for Accessory Master  Category Master---------------------->",state.AddAcccategory);
            
        })
        .addCase(AddAccessoryCategory.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Add Category for Accessory Master Category----------------------->",state.error);
            
        })

        //***********************************Get category For Accessory Master ****************************************************//
        .addCase(GetAccessoryCategoryData.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(GetAccessoryCategoryData.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.GetAccCategory=action.payload.data;
            console.log("Payload Data in Get Categories In Accessory Master------------>",state.GetAccCategory);
        })
        .addCase(GetAccessoryCategoryData.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Get Categories for Accessory Master  ------------>",state.error);
            
        })
         //********************************************Delete   Category  for Accessory Master  ********************************************//
        .addCase(DeleteAccessoryCategory.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(DeleteAccessoryCategory.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.GetAccCategory=state.GetAccCategory.filter(
                category=>category.id!==action.meta.arg.id
            );
            state.deleteAccCategory=action.payload.message;
            console.log("Payload Data in  Categories for Accessory  Category Delete call ------------>",state.deleteAccCategory);
        })
        .addCase(DeleteAccessoryCategory.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Delete  Categories for Raw Category------------>",state.error);
            
        })
        //********************************************Patch   Call  for Accessoery Category ********************************************//
        .addCase(EditAccessoryType.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(EditAccessoryType.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.editAccCat=action.payload.message;
            console.log("Payload Data In Raw Material Categories patch call ------------>",state.editAccCat);
        })
        .addCase(EditAccessoryType.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in edit  Raw Material Categories------------>",state.error);
            
        })



        //Raw Masterila Units
        //***********************************Add Units For Raw Material Master ****************************************************//
        .addCase(AddUnitsData.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(AddUnitsData.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.AddUnit=action.payload;
            console.log("Payload Data in Add Unit In Raw Material ---------------------->",state.AddUnit);
            
        })
        .addCase(AddUnitsData.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            console.log("Payload error in Add Unit  for Raw Material Master----------------------->",state.error);
            
        })

        //***********************************Get Units For Raw Matrial ****************************************************//
        .addCase(GetUnitsData.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(GetUnitsData.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.UnitsData=action.payload.data;
            console.log("Payload Data in Get Unit In Raw Materail------------>",state.UnitsData);
        })
        .addCase(GetUnitsData.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Get Units for Raw Material ------------>",state.error);
            
        })
         //********************************************Delete  Units for Raw Material  ********************************************//
        .addCase(DeleteUnitsData.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(DeleteUnitsData.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.UnitsData=state.UnitsData.filter(
                unit=>unit.id!==action.meta.arg.id
            );
            state.DeleteUnit=action.payload.message;
            console.log("Payload Data in  Categories In Raw Category Delete call ------------>",state.DeleteUnit);
        })
        .addCase(DeleteUnitsData.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Delete  Categories for Raw Category------------>",state.error);
            
        })
        //********************************************Patch   Call  for Raw Material ********************************************//
        .addCase(PatchUnitsData.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(PatchUnitsData.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.EditUnit=action.payload.message;
            console.log("Payload Data In Raw Material Categories patch call ------------>",state.EditUnit);
        })
        .addCase(PatchUnitsData.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in edit  Raw Material Categories------------>",state.error);
            
        })












        //***************************************Get Passwords Data ********************************************//
        .addCase(GetPasswordsData.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(GetPasswordsData.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.getpasswordata=action.payload.data;
            console.log("Payload Data in Get password Data ----------->",state.getpasswordata);
        })
        .addCase(GetPasswordsData.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in Get password Data ----------->",state.error);
            
        })

        //**************************************Edit Password Data**************************//
        .addCase(patchPassword.pending,(state)=>{
            state.error=null;
            state.loading=true;
        })
        .addCase(patchPassword.fulfilled,(state,action)=>{
            state.error=null;
            state.loading=false;
            state.Editpsw=action.payload.message;
            console.log("Payload Data In password Data patch call ------------>",state.Editpsw);
        })
        .addCase(patchPassword.rejected,(state,action)=>{
            state.error=null;
            state.loading=false,
            state.error=action.payload;
            console.log("Payload Error in password Data ------------>",state.error);
            
        })


    }
})

export const {clearAddCategory}=AddCategorySlice.actions;
export default AddCategorySlice.reducer;

