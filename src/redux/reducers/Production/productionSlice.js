import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../../utils/api';
import {endpoints} from '../../../config/config'; // Update path

export const createProductionSetup = createAsyncThunk(
  'production/createSetup',
  async (payload, {rejectWithValue}) => {
    try {
      console.log(payload, 'payload to setup a product');
      const response = await api.post(
        endpoints.CREATE_PRODUCTION_SETUP,
        payload,
      );
      console.log(response, 'response from the product setup');
      return response.data;
    } catch (error) {
      console.log('AXIOS ERROR FULL:', error);
      console.log('SERVER RESPONSE DATA:', error.response?.data);
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'production/fetchCategories',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get(endpoints.GET_CATEGORY_PRODUCTION_SETUP);
      return response.data.data; // Assuming response structure { status: 200, data: [...] }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchProductsByCategory = createAsyncThunk(
  'production/fetchProductsByCategory',
  async (categoryId, {rejectWithValue}) => {
    try {
      // Replace the hardcoded '1' with the dynamic categoryId
      const endpoint = `productsByCategory/${categoryId}`;
      const response = await api.get(endpoint);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchMaterialCategories = createAsyncThunk(
  'production/fetchMaterialCategories',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get(endpoints.GET_MATERIAL_CATEGORY);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchRawMaterialsByCategory = createAsyncThunk(
  'production/fetchRawMaterialsByCategory',
  async (categoryId, {rejectWithValue}) => {
    try {
      // FIX: Added the "/" before the categoryId
      console.log(categoryId, '++++++++_____________________');
      const endpoint = `raw-materials/${categoryId}`;
      const response = await api.get(endpoint);
      console.log(response, '+++++++++++++++++++++++product set up drop down valueeeee');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Error fetching materials',
      );
    }
  },
);

export const fetchUnits = createAsyncThunk(
  'production/fetchUnits',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get(endpoints.GET_UNITS);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching units');
    }
  },
);

export const fetchAllProductionSetups = createAsyncThunk(
  'production/fetchAllSetups',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get(endpoints.GET_ALL_PRODUCTION_SETUPS);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  },
);

export const deleteProductionSetup = createAsyncThunk(
  'production/deleteProductionSetup',
  async (id, { rejectWithValue }) => {
    try {
      console.log(id,"to delect productio setup")
      // FIX: Move the variable outside the literal string quotes
      const response = await api.delete(
        `${endpoints.DELETE_PRODUCTION_SETUP}/${id}`
      );
      console.log(response,"delete production setup")
      // Return the ID so you can filter it out of your state in the slice
      return { id, message: response.data.message };
    } catch (error) {
      // Optional: Add optional chaining to prevent crashing if error.response is undefined
      return rejectWithValue(error.response?.data || 'Delete failed');
    }
  }
);

export const updateProductionSetup = createAsyncThunk(
  'production/updateSetup',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      console.log(id,payload,"to update product set up")
      const response = await api.patch(
        `${endpoints.UPDATE_PRODUCTION_SETUP}/${id}`,
        payload
      );

      console.log(response,"from the updated product set up ")
      return response.data;
    } catch (error) { 
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

const productionSlice = createSlice({
  name: 'production',
  initialState: {
    loading: false,
    success: false,
    error: null,
    categories: [],
    products: [],
    materialCategories: [],
    currentRawMaterial: null,
    units: [],
  },
  reducers: {
    resetState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearProducts: state => {
      state.products = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createProductionSetup.pending, state => {
        state.loading = true;
      })
      .addCase(createProductionSetup.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProductionSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCategories.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Accumulate products from different categories instead of replacing
        // Avoid duplicates by filtering out products that already exist
        const newProducts = action.payload || [];
        const existingIds = new Set(state.products.map(p => p.id));
        const productsToAdd = newProducts.filter(p => !existingIds.has(p.id));
        state.products = [...state.products, ...productsToAdd];
      })
      .addCase(fetchProductsByCategory.rejected, state => {
        state.loading = false;
      })
      .addCase(fetchMaterialCategories.fulfilled, (state, action) => {
        state.materialCategories = action.payload;
      })

      .addCase(fetchRawMaterialsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Note: Your API response returns a single object containing a products array or
        // you might need to handle it based on if it's a list or single item.
        // Based on your JSON, it returns one main raw material object.
        state.currentRawMaterial = action.payload;
      })

      // Add to extraReducers
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.units = action.payload;
      })

      // In your extraReducers, add:
      .addCase(fetchAllProductionSetups.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllProductionSetups.fulfilled, (state, action) => {
        state.loading = false;
        state.allSetups = action.payload;
      })
      .addCase(fetchAllProductionSetups.rejected, state => {
        state.loading = false;
      })

      .addCase(deleteProductionSetup.fulfilled, (state, action) => {
        state.loading = false;
        state.allSetups = state.allSetups.filter(
          item => item.id !== action.payload.id,
        );
      })

      .addCase(updateProductionSetup.pending, (state) => {
  state.loading = true;
})
.addCase(updateProductionSetup.fulfilled, (state) => {
  state.loading = false;
  state.success = true;
})
.addCase(updateProductionSetup.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export const {resetState, clearProducts} = productionSlice.actions;
export default productionSlice.reducer;
