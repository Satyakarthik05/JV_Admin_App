import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../../utils/api';
import {endpoints} from '../../../config/config';

const initialState = {
  loading: false,
  error: null,
  assignedStock: null,
};

export const fetchDriverAssignedStock = createAsyncThunk(
  'driverStock/fetchDriverAssignedStock',
  async (driverId, {rejectWithValue}) => {
    try {
      if (!driverId) {
        return rejectWithValue('Missing driverId');
      }
      const response = await api.get(`${endpoints.GET_ASSIGN_STOCK}/${driverId}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to fetch assigned stock';
      return rejectWithValue(errorMessage);
    }
  },
);

const DriverStockSlice = createSlice({
  name: 'driverStock',
  initialState,
  reducers: {
    clearDriverStockError: state => {
      state.error = null;
    },
    clearAssignedStock: state => {
      state.assignedStock = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDriverAssignedStock.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverAssignedStock.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.assignedStock = action.payload;
      })
      .addCase(fetchDriverAssignedStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearDriverStockError, clearAssignedStock} = DriverStockSlice.actions;
export default DriverStockSlice.reducer;
