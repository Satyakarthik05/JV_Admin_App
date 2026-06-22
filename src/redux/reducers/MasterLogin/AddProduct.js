import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { endpoints } from "../../../config/config";

const initialState = {
    error: null,
    loading: false,
    message: null,
    AddProduct: null,
    GetProductData: null,
    EditProduct: null,
    deleteProduct: null,
    stockData:null,

    //Raw Material Master
    AddRawMaterial: null,
    GetRawMaterialData: null,
    EditMaterial: null,
    DeleteRawData:null,

    //purchase
    PostPurchase: null,
    GetPurchase: null,
    EditPurchaseCall: null,
    DeletePurchaseCall: null,

    //Supplier Information 
    postSupplierInfo:null,//post supplier info
    SupplierInfoData:null,// get Sup info
    EditSupInfo:null,// edit sup info
    DeletesupInfo:null,// deltye sup

    //copackers
    postcopackerdetails:null,//post copacker
    copackersData:null,//get copacker
    Editcopackersdetails:null,//edit copacker
    delcopackersDetails:null,//del copacker



    //Raw material Transfer
    PostRawTransfer:null,
    TakenProducts:null,
    GetTransferData:null,
    PostDataGetData:null,//post phno,name get Given Data
    PostDataGetTakenData:null,//Taken Data
    EditGivenDataTransfer:null,//edit Given Data In rw Material Transfer



    //Accessory Master
    AddAccessoryData:null,
    GetAccessoryData:null,
    EditAccessoryData:null,
    deleteAccessories:null,
    AccessoriesStock:null,

    //Inventory 
    AddAccessoryInventory:null,
    AccInventoryData:null,
    EditAccessotyInv:null,
    DeleteAccInvData:null,
}

//********************************************Add Product   for Prodcut Master ********************************************//
export const AddProductsInMaster = createAsyncThunk('AddProductsInMaster', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Product Master -------------------->", payload);
        const response = await api.post(endpoints.ADD_PRODUCT, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_PRODUCT}`);

        console.log("All About Post Call for Add Product  thunk  in Product Master =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  Product in Product Master---------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Get Products In  Prodcut Master ********************************************//
export const GetProductsInMaster = createAsyncThunk('GetProductsInMaster', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_PRODUCTS);
        console.log("All About get Call in thunk------------------>Add Product", response);
        return response.data;
    }
    catch (error) {
        console.log("Add Product in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})
//********************************************Edit  Products In  Prodcut Master ********************************************//
export const EditProductInMaster = createAsyncThunk('EditProductInMaster', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Product   coming from normal UI code ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_PRODUCT}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Product------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})


//**************************************Delete  Products **********************************************//
export const DeleteProductData = createAsyncThunk('DeleteProductData', async ({ id }, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_PRODUCT}/${id}`);
        console.log("Deleted the Product__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Employee Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})


//********************************************Get Stock By Product ID ********************************************//
export const GetStock = createAsyncThunk('GetStock', async (id, { rejectWithValue }) => {
    try {
        console.log("id------------>",id);
        const response = await api.get(`${endpoints.GET_STOCK}/${id}`);
        console.log("All About get Call in thunk------------------>Get Stock", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Stock thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})




//Raw Material Master

//********************************Add raw Material Master*********************************************//
export const AddRawMaterialsData = createAsyncThunk('AddRawMaterialsData', async (payload, { rejectWithValue }) => {


    try {
        console.log("Payload data coming to redux code ---------->", payload);
        const response = await api.post(endpoints.ADD_RAW_MATERIAL, payload);
        console.log("All About Post Call for Add Raw Material Master   thunk  in Raw Material=======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Add Raw Material------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }
})

//********************************************Get Raw Material  Data  ********************************************//
export const GetAllRawMaterialData = createAsyncThunk('GetAllRawMaterialData', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_RAW_MATERIAL);
        console.log("All About get Call in thunk------------------>Get Raw Materail Data", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Raw Materail Data in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})
//********************************************Edit Raw Material  In Raw Matewrial Master ********************************************//
export const EditRawMaterialss = createAsyncThunk('EditRawMaterialss', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Raw Material  coming from normal UI code ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_RAW_MATERIAL}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Raw Material------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})
//**************************************Delete   raw Material**********************************************//
export const DeleteRawMaterial = createAsyncThunk('DeleteRawMaterial ', async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_RAW_MATERIAL}/${id}`);
        console.log("Deleted the raw Material__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Raw material  Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})





//purchase
//********************************************Add Purchase for Prodcut Master ********************************************//
export const AddPurchase = createAsyncThunk('AddPurchase', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Add Purchase -------------------->", payload);
        const response = await api.post(endpoints.ADD_PURCHASE, payload);

        console.log("All About Post Call for Add Purchase  thunk  in Raw Material Master =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  Purchase in Raw Material Master---------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Get Purchase Data  ********************************************//
export const GetAllPurchaseData = createAsyncThunk('GetAllPurchaseData', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_PURCHASE_DATA);
        console.log("All About get Call in thunk------------------>Get All Purchase  Data", response);
        return response.data;
    }
    catch (error) {
        console.log("Get purchase Datain thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})

//********************************************Edit  Purchase  In  Prodcut Master ********************************************//
export const EditPurchase = createAsyncThunk('EditPurchase', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit EditPurchase coming from normal UI code ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_PURCHASE}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Purchase------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//**************************************Delete  Purchase Data**********************************************//
export const DeletePurchase = createAsyncThunk('DeletePurchase', async (id , { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_PURCHASE}/${id}`);
        console.log("Deleted the Purchase Data__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Purchase Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})



//Raw Material Transfer 
//*****************************************Post Raw Material Transfer ************************************************//
export const AddRawTransfer = createAsyncThunk('AddRawTransfer', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  redux code -------------------->",payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.POST_RAW_MATERIAL_TRANSFER}`);
        const response = await api.post(endpoints.POST_RAW_MATERIAL_TRANSFER,payload);
       

        console.log("All About Post Call for Add Raw MAterial Tramsfer Data in thunk======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------RAw Material Transfer Data --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})


//*****************************************Post Take Products Data Taken Data  ************************************************//
export const TakeProductsData = createAsyncThunk('TakeProductsData', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  redux code -------------------->", payload);
        const response = await api.post(endpoints.POST_TAKE_PRODUCT, payload);

        console.log("All About Post Data  Redux code Taken Product in thunk======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error----------------------------------Take Product --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Get Raw Material Data home Screen Summary   ********************************************//
export const GetRawMaterialTransferData = createAsyncThunk('GetRawMaterialTransferData', async (_, { rejectWithValue }) => {
    try {
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.GET_SUMMARY}`);
        const response = await api.post(endpoints.GET_SUMMARY);
        console.log("All About get Call in thunk------------------>Get All Raw Material  Data", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Raw Material  thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})


//*****************************************Given Data post name,phno get Data  ************************************************//
export const GivenData = createAsyncThunk('GivenData', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  redux code -------------------->", payload);
        const response = await api.post(endpoints.POST_GIVEN, payload);

        console.log("All About Post Data  Redux code Given Data  in thunk======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error---------------------------------Given  Data --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})


//*****************************************Given Data post name,phno get Data  ************************************************//
export const TakenData = createAsyncThunk('TakenData', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  redux code -------------------->", payload);
        const response = await api.post(endpoints.POST_TAKEN, payload);

        console.log("All About Post Data  Taken Data name,contact no from ui Code Redux code Given Data  in thunk======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error---------------------------------Taken   Data --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Edit  Given Data Raw Material Transfer ********************************************//
export const EditGivenAllData = createAsyncThunk('EditGivenAllData', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Edit Given Data coming from normal UI code ------------------------>", payload, id);
         console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.EDIT_GIVEN_DATA}/${id}`);
        const response = await api.patch(`${endpoints.EDIT_GIVEN_DATA}/${id}`, payload);
        console.log("All About Thunk response  Edit Raw Material Transfer Data in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Given Data ------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})



//Accessory Master 

//Add Accessory post call
//********************************************Add Accessory in Accessory Master ********************************************//
export const PostAccessory = createAsyncThunk('PostAccessory', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in  Add Accessory in Accessory Master -------------------->", payload);
        const response = await api.post(endpoints.ADD_ACCESSORY, payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_ACCESSORY}`);

        console.log("All About Post Call for Add Accessory  thunk  in Accessory Master  =======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  Accessory  in Accessory  Master---------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Get Accessories Data in   Accessories Master ********************************************//
export const GetAccessoriesInAcc = createAsyncThunk('GetAccessoriesInAcc', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_ACCESSORIES);
        console.log("All About get Call in thunk------------------>Add Product", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Accessories in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})

//********************************************Edit  Accessories In  Accessories  Master ********************************************//
export const EditAccessoriesCall = createAsyncThunk('EditAccessoriesCall', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Accessories    coming from normal UI code ------------------------>", payload, id);
        const response = await api.patch(`${endpoints.EDIT_ACCESSORIES}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Product------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//**************************************Delete  Purchase Data**********************************************//
export const DeleteAccessoriesCall = createAsyncThunk('DeleteAccessoriesCall', async (id , { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_ACCESSORIES}/${id}`);
        console.log("Deleted the Accessories Data__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Accessories  Data", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})


//********************************************Get Stock By Product ID ********************************************//
export const GetAccessoriesStockData = createAsyncThunk(' GetAccessoriesStockData', async (id, { rejectWithValue }) => {
    try {
        console.log("id------------>",id);
        const response = await api.get(`${endpoints.GET_ACC_STOCK}/${id}`);
        console.log("All About get Call in thunk------------------>Get Stock", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Stock thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})



//Accessori Inventory
//********************************************Add Accessori  Inventory  ********************************************//
export const PostAccessoriInventoryData = createAsyncThunk('PostAccessoriInventoryData', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data   in Post Accessori Inventory Data -------------------->", payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_ACC_INVENTORY}`);
        const response = await api.post(endpoints.ADD_ACC_INVENTORY,payload);
        // console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_ACC_INVENTORY}`);
        console.log("All About Post Call for Add Accessory Inventory  thunk  in Accessori Inventory=======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  Accessori Inventory --------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})

//********************************************Get Accessories Data in   Accessories Master ********************************************//
export const GetAccessoriInventoryData= createAsyncThunk('GetAccessoriInventoryData', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_ACCESSORIES_INVENTORY);
        console.log("All About get Call in thunk------------------Get Accessori Inventory", response);
        return response.data;
    }
    catch (error) {
        console.log("Get Accessories Inventory in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})


//********************************************Edit Accessory Inventory Data********************************************//
export const EditAccessoryInventoryData = createAsyncThunk('EditAccessoryInventoryData', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Accessory Inventory    coming from normal UI code ------------------------>", payload, id);
         console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.EDIT_ACC_INV}/${id}`);
        const response = await api.put(`${endpoints.EDIT_ACC_INV}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Accessory inventory ------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage); 

    }
})

//**************************************Delete  Purchase Data**********************************************//
export const DeleteAccInvCall = createAsyncThunk('DeleteAccInvCall ', async (id , { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DEL_ACC_INV}/${id}`);
        console.log("Deleted the Accessories Inv Data __________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Accessories  Inventory ", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})



//********************************************Supplier Information  ********************************************//
//Add Supplier Information
export const AddSupplierInfo = createAsyncThunk('AddSupplierInfo', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post  data  Supplier Information --------------->", payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_SUP_INFO}`);
        const response = await api.post(endpoints.ADD_SUP_INFO,payload);
        console.log("All About Post Call for Add Supplier information ====================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add  Supplier Info-------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})


//Get Supplier Information Data
export const GetSupplierInformationData= createAsyncThunk('GetSupplierInformationData', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_SUP_INFORMATION);
        console.log("All About get Call in thunk------------------Get supplier information", response);
        return response.data;
    }
    catch (error) {
        console.log("Get supplier information in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})


//Edit Supplier Information 
export const  EditSupplierInformation= createAsyncThunk('EditSupplierInformation', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Supplier Information from normal UI code ------------------------>", payload, id);
         console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.EDIT_SUP_INFO}/${id}`);
        const response = await api.patch(`${endpoints.EDIT_SUP_INFO}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit Supplier Information------------------>", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage); 

    }
})


//Delete Supplier information 
export const DeleteSupplierInfo = createAsyncThunk('DeleteSupplierInfo', async (id , { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_SUP_INFO}/${id}`);
        console.log("Deleted the Supplier Information __________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Supplier Information ", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})




//*************************************************** Copackers ***********************************************//
//Add Copacker
export const AddCoPacker = createAsyncThunk('AddCoPacker', async (payload, { rejectWithValue }) => {
    try {
        console.log("Post co packers Data -------------->", payload);
        console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.ADD_COPACKER}`);
        const response = await api.post(endpoints.ADD_COPACKER,payload);
        console.log("All About Post Call for Add copacker ====================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error-----------------------------------Add copacker------------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);

    }
})


//GetCopackers Data
export const GetCopackers= createAsyncThunk('GetCopackers', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(endpoints.GET_COPACKERS);
        console.log("All About get Call in thunk------------------Get copackers Data ", response);
        return response.data;
    }
    catch (error) {
        console.log("Get supplier information in thunk error---------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage);
    }

})


//Edit CopackersData
export const  EditCoPackerData= createAsyncThunk('EditCoPackerData', async ({ id, payload }, { rejectWithValue }) => {
    try {
        console.log("Payload data in thunk Edit Copackers from normal UI code ------------------------>", payload, id);
         console.log("Url__________________________>", `${api.defaults.baseURL}${endpoints.EDIT_COPACKER}/${id}`);
        const response = await api.patch(`${endpoints.EDIT_COPACKER}/${id}`, payload);
        console.log("All About Thunk response in redux ======================>", response);
        return response.data;
    }
    catch (error) {
        console.log("Error in Thunk Edit copackers----------------->", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed To fetch The Api Data ";
        return rejectWithValue(errorMessage); 

    }
})


//Delete co packersData
export const DeleteCopacker = createAsyncThunk('DeleteCopacker', async (id , { rejectWithValue }) => {
    try {
        const response = await api.delete(`${endpoints.DELETE_COPACKERS}/${id}`);
        console.log("Deleted the Copackers__________________________________________", response.data);
        return response.data
    }
    catch (error) {
        console.log("Error in  Delete Copackers data ", error);
        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to fetch The API Data ";
        return rejectWithValue(errorMessage);
    }
})











export const AddProductsInProductMasterSlice = createSlice({
    name: "addProductsData",
    initialState,
    reducers: {
        clearAddProduct: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            //********************************************Add Product   for Prodcut Master ********************************************//
            .addCase(AddProductsInMaster.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddProductsInMaster.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AddProduct = action.payload;
                console.log("Payload Data in Add Product  for Product Master full filled condition ---------------------->", state.AddProduct);

            })
            .addCase(AddProductsInMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Product for Product Master----------------------->", state.error);

            })
            //********************************************Get Products In  Prodcut Master ********************************************//
            .addCase(GetProductsInMaster.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetProductsInMaster.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetProductData = action.payload.data;
                console.log("Payload Data in Get Products  for Product Master full filled condition ---------------------->", state.GetProductData);

            })
            .addCase(GetProductsInMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  Products for Product Master----------------------->", state.error);
            })
            //********************************************Patch   product  for Prodcut Master ********************************************//
            .addCase(EditProductInMaster.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditProductInMaster.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditProduct = action.payload.message;
                console.log("Payload Data for   Edit Product  In Product Master patch call ------------>", state.EditProduct);
            })
            .addCase(EditProductInMaster.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit Product  for Product Master------------>", state.error);

            })

            //**************************************Delete  Product Data **********************************************//
            .addCase(DeleteProductData.pending, (state) => {
                state.error = null;
                state.loading = true;

            })

            .addCase(DeleteProductData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.GetProductData = state.GetProductData.filter(
                    product => product.id !== action.meta.arg.id
                );
                state.deleteProduct = action.payload.message
                console.log("Payload Data Delete Product  Fullfilled Condition_________________________________", state.deleteProduct);
                console.log("Product Data  Deleted Successfully");

            })

            .addCase(DeleteProductData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Delete The Employee Data ", state.error);
            })

            //********************************************Get Stock By  Prodcut ********************************************//
            .addCase(GetStock.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetStock.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.stockData = action.payload.data;
                console.log("Payload Data in Get Stock By Each Product  full filled condition ---------------------->", state.stockData);

            })
            .addCase(GetStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  Stock By  each Product----------------------->", state.error);
            })




            //Raw Material Master
            //********************************************Add Raw Material Master  ********************************************//
            .addCase(AddRawMaterialsData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddRawMaterialsData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AddRawMaterial = action.payload;
                console.log("Payload Data in Add Raw material Master full filled condition ---------------------->", state.AddRawMaterial);

            })
            .addCase(AddRawMaterialsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Raw Material Master----------------------->", state.error);

            })

            //********************************************Get All raw Materials ********************************************//
            .addCase(GetAllRawMaterialData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAllRawMaterialData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetRawMaterialData = action.payload.data;
                console.log("Payload Data in Get Raw Material  Data  filled condition ---------------------->", state.GetRawMaterialData);

            })
            .addCase(GetAllRawMaterialData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Raw Material Data in Raw Material Master---------------------->", state.error);
            })

            //********************************************Patch  Raw Material  ********************************************//
            .addCase(EditRawMaterialss.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditRawMaterialss.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditMaterial = action.payload.message;
                console.log("Payload Data for   Edit Raw Materail  In Raw Master patch call ------------>", state.EditMaterial);
            })
            .addCase(EditRawMaterialss.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit Raw Material  for Raw Material Master------------>", state.error);

            })
            //********************************************Delete   Raw Material ********************************************//
            .addCase(DeleteRawMaterial.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(DeleteRawMaterial.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetRawMaterialData= state.GetRawMaterialData.filter(
                    raw => raw.id !== action.meta.arg.id
                );
                state.DeleteRawData= action.payload.message;
                console.log("Payload Data in  Delete Raw Material Data   In Raw Material Master-------------->", state.DeleteRawData);
            })
            .addCase(DeleteRawMaterial.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                state.error = action.payload;
                console.log("Payload Error in Delete Raw Material Data for Raw Material Master ------------>", state.error);

            })





            //Raw Material ---->Purchase
            //********************************************Add  Purchase Raw Material Master  ********************************************//
            .addCase(AddPurchase.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddPurchase.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostPurchase = action.payload;
                console.log("Payload Data in  Raw material Master full filled condition  Add Purchase---------------------->", state.PostPurchase);

            })
            .addCase(AddPurchase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Raw Material Master Add Purchase----------------------->", state.error);

            })
            //********************************************Get Purchase Data  In  Raw Material Master ********************************************//
            .addCase(GetAllPurchaseData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAllPurchaseData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetPurchase = action.payload.data;
                console.log("Payload Data in Get Purchase Data  for Product Master full filled condition ---------------------->", state.GetPurchase);

            })
            .addCase(GetAllPurchaseData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  Purchase Data for Purchase ----------------------->", state.error);
            })

            //********************************************Patch Purchase Data  for Prodcut Master ********************************************//
            .addCase(EditPurchase.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditPurchase.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditPurchaseCall = action.payload.message;
                console.log("Payload Data for   Edit Purchase In Raw Material Master  patch call ------------>", state.EditProduct);
            })
            .addCase(EditPurchase.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit Purchase  in Raw Material Master Patch Call----------->", state.error);

            })

            //********************************************Delete  Purchase Data in  RAw Material Master ********************************************//
            .addCase(DeletePurchase.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(DeletePurchase.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetPurchase= state.GetPurchase.filter(
                    purchase => purchase.id !== action.meta.arg.id
                );
                state.DeletePurchaseCall= action.payload.message;
                console.log("Payload Data in  Delete Purchase  In Raw Material MAster-->Purchase  Delete call ------------>", state.DeletePurchaseCall);
            })
            .addCase(DeletePurchase.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                state.error = action.payload;
                console.log("Payload Error in Delete Purchase Data for Purchase Data ------------>", state.error);

            })



            // Raw material Transfer Data 
            //********************************************Add Raw Material Transfer Data  ********************************************//
            .addCase(AddRawTransfer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddRawTransfer.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostRawTransfer=action.payload;
                console.log("Payload Data in Add Raw Material Transfer Data  full filled condition ---------------------->", state.PostRawTransfer);

            })
            .addCase(AddRawTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Data in Add Raw Material Transfer Data  ----------------------->", state.error);

            })


           //********************************************Taken Products Post Call********************************************//
            .addCase(TakeProductsData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(TakeProductsData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.TakenProducts=action.payload;
                console.log("Payload Data in post Taken Products   full filled condition ---------------------->", state.TakenProducts);

            })
            .addCase(TakeProductsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Post Taken Products rejected   ----------------------->", state.error);

            })


            //********************************************Get Raw Materila Transfer Data ********************************************//
            .addCase(GetRawMaterialTransferData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetRawMaterialTransferData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetTransferData = action.payload.data;
                console.log("Payload Data in Get Raw Material Transfer Data  full filled condition ---------------------->", state.GetTransferData);
            })
            .addCase(GetRawMaterialTransferData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get raw Material transfer for Purchase ----------------------->", state.error);
            })


            //**********************************Post Data Get Given Data vendor name,phno get Given Data ********************************** //
            .addCase(GivenData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GivenData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostDataGetData = action.payload.data;
                console.log("Payload Data in  Get Given Data through Post Call---------------------->", state.PostDataGetData);

            })
            .addCase(GivenData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get Given Data through Post Call----------------------->", state.error);

            })


             //**********************************Post Data Get Taken Data vendor name,phno get Given Data ********************************** //
            .addCase(TakenData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(TakenData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.PostDataGetTakenData = action.payload.data;
                console.log("Payload Data in  Get Taken Data through Post Call---------------------->", state.PostDataGetTakenData);

            })
            .addCase(TakenData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get TAken Data through Post Call----------------------->", state.error);

            })

            //****************************************Edit Given Data raw Material Transfer Data *******************************//
            .addCase(EditGivenAllData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditGivenAllData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditGivenDataTransfer = action.payload.message;
                console.log("Payload Data for  Edit Given Raw Materail Transfer ------------>", state.EditGivenDataTransfer);
            })
            .addCase(EditGivenAllData.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit Given Raw Material Tansfer Data ----------->", state.error);

            })


            

            




            //Add Accessory in Accessory Master 
            //********************************************Add Accessory   in  Accessory  Master ********************************************//
            .addCase(PostAccessory.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(PostAccessory.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AddAccessoryData = action.payload;
                console.log("Payload Data in Add Accesssory  In Accessory Master  full filled condition ---------------------->", state.AddAccessoryData);

            })
            .addCase(PostAccessory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Accessory  in Accessory Master ---------------------->", state.error);

            })

            //********************************************Get Accessories  In  Accesories  Master ********************************************//
            .addCase(GetAccessoriesInAcc.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAccessoriesInAcc.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.GetAccessoryData = action.payload.data;
                console.log("Payload Data in Get Accessories In   Accessories  Master full filled condition ---------------------->", state.GetAccessoryData);

            })
            .addCase(GetAccessoriesInAcc.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  Accessoreis in Accessories Master ----------------------->", state.error);
            })
             //********************************************Edit  Accessories  for Accessories  Master ********************************************//
            .addCase(EditAccessoriesCall.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditAccessoriesCall.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditAccessoryData = action.payload.message;
                console.log("Payload Data for   Edit Accessories  In Accessories Master  patch call ------------>", state.EditAccessoryData);
            })
            .addCase(EditAccessoriesCall.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in edit Accessories  in  Accessories  Master------------>", state.error);

            })

            //**************************************Delete  Product Data **********************************************//
            .addCase(DeleteAccessoriesCall.pending, (state) => {
                state.error = null;
                state.loading = true;

            })

            .addCase(DeleteAccessoriesCall.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.GetAccessoryData = state.GetAccessoryData.filter(
                   Accessrious => Accessrious.id !== action.meta.arg.id
                );
                state.deleteAccessories = action.payload.message
                console.log("Payload Data Delete Accessories   Fullfilled Condition_________________________________", state.deleteAccessories);
                console.log("Accessories  Data  Deleted Successfully");

            })

            .addCase(DeleteAccessoriesCall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Delete The Accessories  ", state.error);
            })




             //********************************************Get Stock By  Accessories ********************************************//
            .addCase(GetAccessoriesStockData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAccessoriesStockData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AccessoriesStock= action.payload.data;
                console.log("Payload Data in Get Stock By Each Accessories  full filled condition ---------------------->", state.AccessoriesStock);

            })
            .addCase(GetAccessoriesStockData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  Stock By  each Accessories ----------------------->", state.error);
            })



            //Inventory
            //***************************************Add Accessori Inventory Data**********************************************//
             .addCase(PostAccessoriInventoryData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(PostAccessoriInventoryData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AddAccessoryInventory= action.payload;
                console.log("Payload Data in Add Accessori Inventory Post Call filled condition ---------------------->", state.AddAccessoryInventory);

            })
            .addCase(PostAccessoriInventoryData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Accessori Inventory Post Call filled----------------------->", state.error);

            })

            //********************************************Get Accessories Data In Accessories Inventoery ********************************************//
            .addCase(GetAccessoriInventoryData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetAccessoriInventoryData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.AccInventoryData= action.payload.data;
                console.log("Payload Data in Get Accessories Inventory Data  full filled condition ---------------------->", state.AccInventoryData);

            })
            .addCase(GetAccessoriInventoryData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  Accessories Inventory Data ----------------------->", state.error);
            })


            //********************************************Edit Accessory Inventory  for Accessory Master  ********************************************//
            .addCase(EditAccessoryInventoryData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditAccessoryInventoryData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditAccessotyInv= action.payload.message;
                console.log("Payload Data for   Edit Accessory Inventory ------------>", state.EditAccessotyInv);
            })
            .addCase(EditAccessoryInventoryData.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                    state.error = action.payload;
                console.log("Payload Error in Edit Accessory Inventory ------------>", state.error);

            })


             //**************************************Delete  Accessory Inventory Data **********************************************//
            .addCase(DeleteAccInvCall.pending, (state) => {
                state.error = null;
                state.loading = true;

            })

            .addCase(DeleteAccInvCall.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.AccInventoryData = state.AccInventoryData.filter(
                    Inv => Inv.id !== action.meta.arg.id
                );
                state.DeleteAccInvData= action.payload.message
                console.log("Payload Data Delete Accessory Inv  Fullfilled Condition_________________________________", state.DeleteAccInvData);
                console.log("Product Data  Deleted Successfully");

            })

            .addCase(DeleteAccInvCall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Delete The Employee Data ", state.error);
            })





            //**********************************************Supplier Information ****************************************************//
            //Add Supplier Inforamtion 
             .addCase(AddSupplierInfo.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddSupplierInfo.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.postSupplierInfo= action.payload;
                console.log("Payload Data in Add Supplier Inforamtion filled condition ---------------------->", state.postSupplierInfo);

            })
            .addCase(AddSupplierInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add Supplier Inforamtion  Post Call filled----------------------->", state.error);

            })

            //Get Supplier Information 
            .addCase(GetSupplierInformationData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetSupplierInformationData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.SupplierInfoData= action.payload.data;
                console.log("Payload Data in Get Supplier Information Data  full filled condition ---------------------->", state.SupplierInfoData);
            })
            .addCase(GetSupplierInformationData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get  Supplier Information Data  ----------------------->", state.error);
            })


            //Edit Supplier information 
            .addCase(EditSupplierInformation.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditSupplierInformation.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.EditSupInfo= action.payload.message;
                console.log("Payload Data for  Edit Supplier Information ------------>", state.EditSupInfo);
            })
            .addCase(EditSupplierInformation.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                state.error = action.payload;
                console.log("Payload Error in Edit Supplier Information ------------>", state.error);
            })

            //Delete Supplier Information 
             .addCase(DeleteSupplierInfo.pending, (state) => {
                state.error = null;
                state.loading = true;

            })
            .addCase(DeleteSupplierInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.SupplierInfoData = state.SupplierInfoData.filter(
                    sup => sup.id !== action.meta.arg.id
                );
                state.DeletesupInfo= action.payload.message
                console.log("Payload Data Delete Supplier Information Fullfilled Condition_________________________________", state.DeletesupInfo);
                console.log("Product Data  Deleted Successfully");
            })
            .addCase(DeleteSupplierInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in  Supplier Information ", state.error);
            })




            //*********************************************Copackers module****************************************************************//
            //Add Copacker
             .addCase(AddCoPacker.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AddCoPacker.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.postcopackerdetails= action.payload;
                console.log("Payload Data in Add copacker details filled condition ---------------------->", state.postcopackerdetails);

            })
            .addCase(AddCoPacker.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Add copacker details Post Call filled----------------------->", state.error);
            })

            //Get Supplier Information 
            .addCase(GetCopackers.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(GetCopackers.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.copackersData= action.payload.data;
                console.log("Payload Data in Get  copackers Data full filled condition ---------------------->", state.copackersData);
            })
            .addCase(GetCopackers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in Get copackers  Data  ----------------------->", state.error);
            })


            //Edit Supplier information 
            .addCase(EditCoPackerData.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(EditCoPackerData.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.Editcopackersdetails= action.payload.message;
                console.log("Payload Data for  Edit Copackers details------------>", state.Editcopackersdetails);
            })
            .addCase(EditCoPackerData.rejected, (state, action) => {
                state.error = null;
                state.loading = false,
                state.error = action.payload;
                console.log("Payload Error in Edit copackers details ------------>", state.error);
            })


            //Delete Supplier Information 
             .addCase(DeleteCopacker.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(DeleteCopacker.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.copackersData = state.copackersData.filter(
                    copacker => copacker.id !== action.meta.arg.id
                );
                state.delcopackersDetails= action.payload.message
                console.log("Payload Data Delete copackers details fullfilled condition_________________________________", state.delcopackersDetails);
                console.log("Product Data  Deleted Successfully");
            })
            .addCase(DeleteCopacker.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.log("Payload error in  copackers data ", state.error);
            })








            




    }
})

export const { clearAddProduct } = AddProductsInProductMasterSlice.actions;
export default AddProductsInProductMasterSlice.reducer;