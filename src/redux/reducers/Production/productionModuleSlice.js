

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../../utils/api';
import {endpoints} from '../../../config/config';   // ← adjust path if needed

export const createProduction = createAsyncThunk(
  'productionmodule/createProduction',
  async (payload, { rejectWithValue }) => {
    try {

        console.log(payload,"to create productionnnnn")
      const response = await api.post(
        endpoints.PRODUCTION_CREATE,
        payload
      );

      console.log(response,"from teh create productionnnnnnnn")
      return response.data; // { status: 200, productionId: 3 }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create production'
      );
    }
  }
);

export const addProductToProduction = createAsyncThunk(
  'productionmodule/addProduct',
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload, 'payload to add product to production');
      const response = await api.post(
        endpoints.PRODUCTION_ADD_PRODUCT,
        payload
      );
      console.log(response, 'response from add product');
      return response.data; // { status: 200, productionProductId: 1 }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add product'
      );
    }
  }
);

export const startBatch = createAsyncThunk(
  'productionmodule/startBatch',
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload, 'payload to start batch');
      const response = await api.post(
        endpoints.PRODUCTION_START_BATCH,
        payload
      );
      console.log(response, 'response from start batch');
      return response.data; // { status: 200, batchId: 1 }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to start batch'
      );
    }
  }
);
export const stopBatch = createAsyncThunk(
  'productionmodule/stopBatch',
  async (payload, { rejectWithValue }) => {
    try {
        console.log(payload,"to end batchhh payloadddd")
      const response = await api.post(endpoints.PRODUCTION_STOP_BATCH, payload);
      console.log(response,"to end batchhh response")
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to stop batch'
      );
    }
  }
);

export const fetchAllProductions = createAsyncThunk(
  'productionmodule/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.GET_ALL_PRODUCTIONS);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch productions');
    }
  }
);

export const approveProduction = createAsyncThunk(
  'productionmodule/approve',
  async (productionId, { rejectWithValue }) => {
    try {
      // Assuming your endpoint is "production/approve" 
      // and we append the ID dynamically
      const response = await api.put(`production/approve/${productionId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve production'
      );
    }
  }
);

export const approveDriverStock = createAsyncThunk(
  'productionmodule/approveDriverStock',
  async (stockId, { rejectWithValue }) => {
    try {
      console.log(stockId, 'stockId to approve driver stock');
      const response = await api.put(`${endpoints.APPROVE_DRIVER_STOCK}/${stockId}`);
      console.log(response, 'response from approve driver stock');
      return response.data; // { status: 200, message: "stock Approved by Incharge" }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve driver stock'
      );
    }
  }
);

const productionModuleSlice = createSlice({
  name: 'productionmodule',
  initialState: {
    productionId: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Call this after successful Submit Production (or when you want to reset)
    resetProduction: (state) => {
      state.productionId = null;
      state.error = null;
    },
    // Manual override if needed
    setProductionId: (state, action) => {
      state.productionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.productionId = action.payload.productionId;
      })
      .addCase(createProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addProductToProduction.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToProduction.fulfilled, (state) => {
        state.loading = false;
        // You can store productionProductId in state if needed
      })
      .addCase(addProductToProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(startBatch.pending, (state) => {
    state.loading = true;
  })
  .addCase(startBatch.fulfilled, (state, action) => {
    state.loading = false;
    // batchId is returned here, we'll use it in the unwrap() in UI
  })
  .addCase(startBatch.rejected, (state, action) => {
  state.loading = false;
  // FIX: Ensure you are saving a STRING, not the whole action.payload object
  state.error = typeof action.payload === 'string' 
    ? action.payload 
    : (action.payload?.message || 'Failed to start batch');
})

.addCase(stopBatch.pending, (state) => {
  state.loading = true;
})
.addCase(stopBatch.fulfilled, (state) => {
  state.loading = false;
})
.addCase(stopBatch.rejected, (state, action) => {
    state.loading = false;
    // FIX: Guard against non-string errors
    state.error = typeof action.payload === 'string' ? action.payload : 'Stop batch failed';
  })
  .addCase(fetchAllProductions.fulfilled, (state, action) => {
   state.allProductions = action.payload;
   state.loading = false;
})

.addCase(approveProduction.pending, (state) => {
    state.loading = true;
  })
  .addCase(approveProduction.fulfilled, (state) => {
    state.loading = false;
  })
  .addCase(approveProduction.rejected, (state, action) => {
    state.loading = false;
    state.error = typeof action.payload === 'string' ? action.payload : 'Approval failed';
  })
  
  .addCase(approveDriverStock.pending, (state) => {
    state.loading = true;
  })
  .addCase(approveDriverStock.fulfilled, (state) => {
    state.loading = false;
  })
  .addCase(approveDriverStock.rejected, (state, action) => {
    state.loading = false;
    state.error = typeof action.payload === 'string' ? action.payload : 'Driver stock approval failed';
  });
  },
});

export const { resetProduction, setProductionId } = productionModuleSlice.actions;
export default productionModuleSlice.reducer;