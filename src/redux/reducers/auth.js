// // src/redux/reducers/auth.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../utils/api';
// import { endpoints } from '../../config/config';

// const initialState = {
//   message: null,
//   loading: false,
//   token: null,
//   userRole: 1,
//   userId: null,
//   isNewUser: false,
//   otpRequestSuccess: false,
// };

// // ─────────────────────────────────────────────
// // 1. Request Login OTP
// // ─────────────────────────────────────────────
// export const requestLoginOtp = createAsyncThunk(
//   'auth/requestLoginOtp',
//   async (mobileNumber, { rejectWithValue }) => {
//     try {
//       const response = await api.post(endpoints.REQUEST_LOGIN_OTP, {
//         mobile: mobileNumber,
//       });
//       return response.data; // { status, message, user_ind }
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message || err.message || 'Network Error';
//       return rejectWithValue(msg);
//     }
//   }
// );

// // ─────────────────────────────────────────────
// // 2. Register New User
// // ─────────────────────────────────────────────
// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await api.post(endpoints.USER_REGISTRATION, userData);
//       return response.data; // { status, message, user_id }
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message || err.message || 'Registration Failed';
//       return rejectWithValue(msg);
//     }
//   }
// );

// // ─────────────────────────────────────────────
// // 3. Verify Login OTP
// // ─────────────────────────────────────────────
// export const verifyLoginOtp = createAsyncThunk(
//   'auth/verifyLoginOtp',
//   async ({ mobile, otp }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(endpoints.USER_VERIFICATION, {
//         mobile,
//         otp,
//       });
//       // Expect something like: { status: 200, message, user_id, token? }
//       return response.data;
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message || err.message || 'Verification Failed';
//       return rejectWithValue(msg);
//     }
//   }
// );

// // ─────────────────────────────────────────────
// // Slice
// // ─────────────────────────────────────────────
// const AuthSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     actionLogout: (state) => {
//       state.token = null;
//       state.userId = null;
//       state.isNewUser = false;
//       state.otpRequestSuccess = false;
//       state.message = null;
//     },
//     resetOtpState: (state) => {
//       state.isNewUser = false;
//       state.otpRequestSuccess = false;
//       state.message = null;
//       state.loading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Request OTP
//       .addCase(requestLoginOtp.pending, (state) => {
//         state.loading = true;
//         state.message = null;
//       })
//       .addCase(requestLoginOtp.fulfilled, (state, action) => {
//   state.loading = false;
//   state.message = action.payload?.message || null;

//   const userInd = Number(action.payload?.user_ind);

//   // These flags help decide: show registration form OR just ask for OTP
//   state.isNewUser = userInd !== 1;     // true → existing user → skip registration
//   state.otpRequestSuccess = true;      // OTP was sent successfully

//   console.log('OTP Requested → user_ind:', userInd, '→ isNewUser:', state.isNewUser);
// })
//       .addCase(requestLoginOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.message = action.payload || 'Network Error';
//       })

//       // Registration
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.message = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//           console.log('Registration Success - user_id:', action.payload?.user_id);
//         state.loading = false;
//         state.message = action.payload?.message || null;
//         // from your example: { status: 200, message: "...", user_id: 10 }
//         state.userId = action.payload?.user_id ?? null;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.message = action.payload || 'Registration Failed';
//       })

//       // Verify OTP
//       .addCase(verifyLoginOtp.pending, (state) => {
//         state.loading = true;
//         state.message = null;
//       })
//       .addCase(verifyLoginOtp.fulfilled, (state, action) => {
//   state.loading = false;
//   state.message = action.payload?.message || 'Login successful';

//   // Always store user_id when login is successful
//   state.userId = action.payload?.user_id ?? null;

//   // Also store token if returned (add it later in backend if not already)
//   state.token = action.payload?.token ?? state.token;

//   // Optional: You can update user_ind logic here if needed
//   const userInd = Number(action.payload?.user_ind);

//   // Reset flags properly on successful login
//   state.isNewUser = false;        // After OTP verify, user is logged in → no longer "new"
//   state.otpRequestSuccess = false; // This flag was only for OTP request step

//   // Critical: Log for debugging
//   console.log('LOGIN SUCCESS → user_id:', action.payload?.user_id);
//   console.log('Redux Auth State Updated:', {
//     userId: state.userId,
//     token: state.token,
//     isNewUser: state.isNewUser
//   });
// })
//       .addCase(verifyLoginOtp.rejected, (state, action) => {
//         state.loading = false;
//         state.message = action.payload || 'Invalid OTP';
//       });
//   },
// });

// // ─────────────────────────────────────────────
// // Exports
// // ─────────────────────────────────────────────
// export const { actionLogout, resetOtpState } = AuthSlice.actions;
// export default AuthSlice.reducer;
// src/redux/reducers/auth.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { endpoints } from '../../config/config';

const initialState = {
  message: null,
  loading: false,
  token: null,
  userRole: 1,
  userId: null,
  isNewUser: false,        // ← Will be TRUE only if user is NEW (not registered)
  otpRequestSuccess: false,
  profile: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,

  coupons: [],
  couponsLoading: false,
  couponsError: null,

  trendingCoupons: [],
  trendingLoading: false,
  trendingError: null,

  vendorCoupons: [],
  vendorCouponsLoading: false,
  vendorCouponsError: null,
  vendorInfo: null,


  couponHistory: [],
  couponHistoryLoading: false,
  couponHistoryError: null,
};



// ─────────────────────────────────────────────
// 1. Request Login OTP
// ─────────────────────────────────────────────
export const requestLoginOtp = createAsyncThunk(
  'auth/requestLoginOtp',
  async (mobileNumber, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.REQUEST_LOGIN_OTP, {
        mobile: mobileNumber,
      });
      return response.data; // { status, message, user_ind }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || 'Network Error';
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────
// 2. Register New User
// ─────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.USER_REGISTRATION, userData);
      return response.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || 'Registration Failed';
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────────────
// 3. Verify Login OTP
// ─────────────────────────────────────────────
export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyLoginOtp',
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.USER_VERIFICATION, {
        mobile,
        otp,
      });
      return response.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || 'Verification Failed';
      return rejectWithValue(msg);
    }
  }
);
// ADD THIS THUNK
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${endpoints.GET_USER_PROFILE}/${userId}`);
      return response.data; // { status, message, data: { ...user details } }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to fetch profile';
      return rejectWithValue(msg);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${endpoints.GET_USER_PROFILE}/${userId}`, profileData);
      return response.data; // { status: 200, message: "User Updated Successfully", user_id: "11" }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Update failed';
      return rejectWithValue(msg);
    }
  }
);
export const fetchCategoriesWithVendors = createAsyncThunk(
  'home/fetchCategoriesWithVendors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.GET_CATEGORIES_WITH_VENDORS);
      return response.data; // { status, message, data: [...] }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load categories';
      return rejectWithValue(msg);
    }
  }
);

// Add this inside your slice file (after fetchCategoriesWithVendors)
export const fetchAllCoupons = createAsyncThunk(
  'home/fetchAllCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.GET_COUPONS);
      return response.data.data; // returns the array of coupons
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load coupons';
      return rejectWithValue(msg);
    }
  }
);
export const fetchTrendingCoupons = createAsyncThunk(
  'home/fetchTrendingCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.GET_TRENDING_COUPONS);
      return response.data.data; // array of trending coupons
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load trending offers';
      return rejectWithValue(msg);
    }
  }
)
export const fetchVendorCoupons = createAsyncThunk(
  'vendor/fetchVendorCoupons',
  async ({ userId, vendorId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`vendorcoupons`, {
        userId,
        vendorId,
      });

      console.log('Vendor Coupons Response:', response.data);

      const coupons = response.data?.data || [];

      // Extract vendor info from first coupon (if exists)
      if (coupons.length > 0) {
        const first = coupons[0];
        return {
          coupons,
          vendorInfo: {
            vendorName: first.vendorName,
            vendorLogo: first.vendorLogo,
            imageUrl: first.imageUrl || first.categoryImage,
          },
        };
      }

      return { coupons: [], vendorInfo: null };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load coupons';
      return rejectWithValue(msg);
    }
  }
);


export const fetchCouponHistory = createAsyncThunk(
  'auth/fetchCouponHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`couponhistory/${userId}`);
      const rawData = response.data?.data;

      if (rawData) {
        return Array.isArray(rawData) ? rawData : [rawData];
      }
      return [];
    } catch (err) {
      return rejectWithValue('Failed to load history');
    }
  }
);

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────
const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    actionLogout: (state) => {
      state.token = null;
      state.userId = null;
      state.isNewUser = false;
      state.otpRequestSuccess = false;
      state.message = null;
    },
    resetOtpState: (state) => {
      state.isNewUser = false;
      state.otpRequestSuccess = false;
      state.message = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ────────────────────── Request OTP ──────────────────────
      .addCase(requestLoginOtp.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(requestLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'OTP sent';
        state.otpRequestSuccess = true;

        const userInd = Number(action.payload?.user_ind);

        // CORRECTED: user_ind === 0 means NEW USER
        state.isNewUser = userInd === 0;

        console.log('OTP Request → user_ind:', userInd, '→ isNewUser:', state.isNewUser);
      })
      .addCase(requestLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload || 'Failed to send OTP';
        state.otpRequestSuccess = false;
      })

      // ────────────────────── Registration ──────────────────────
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Registered successfully';
        state.userId = action.payload?.user_id ?? null;
        console.log('Registration → user_id:', state.userId);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload || 'Registration failed';
      })

      // ────────────────────── Verify OTP (Login) ──────────────────────
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Login successful';

        // Save login data
        state.userId = action.payload?.user_id ?? null;
        state.token = action.payload?.token ?? state.token;

        // Reset flow flags after successful login
        state.isNewUser = false;
        state.otpRequestSuccess = false;

        console.log('LOGIN SUCCESS → user_id:', state.userId);
        console.log('Redux Auth State →', {
          userId: state.userId,
          token: state.token,
          isLoggedIn: !!state.userId,
        });
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload || 'Invalid or expired OTP';
      })
      // ────────────────────── FETCH USER PROFILE ──────────────────────
      // FETCH USER PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Profile loaded';

        // THIS LINE IS CRITICAL — saves data so Profile.js can read it
        state.profile = action.payload.data;

        console.log('Profile saved in Redux →', state.profile);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload || 'Failed to load profile';
        state.profile = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || 'Profile updated';
        // Optionally refetch fresh data
        state.profile = null; // Force refetch on next screen open
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload || 'Failed to update profile';
      })
      .addCase(fetchCategoriesWithVendors.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesWithVendors.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(fetchCategoriesWithVendors.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
        state.categories = [];
      })
      .addCase(fetchAllCoupons.pending, (state) => {
        state.couponsLoading = true;
        state.couponsError = null;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.couponsLoading = false;
        state.coupons = action.payload || [];
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.couponsLoading = false;
        state.couponsError = action.payload;
        state.coupons = [];
      })
      .addCase(fetchTrendingCoupons.pending, (state) => {
        state.trendingLoading = true;
        state.trendingError = null;
      })
      .addCase(fetchTrendingCoupons.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trendingCoupons = action.payload || [];
      })
      .addCase(fetchTrendingCoupons.rejected, (state, action) => {
        state.trendingLoading = false;
        state.trendingError = action.payload;
        state.trendingCoupons = [];
      })
      .addCase(fetchVendorCoupons.pending, (state) => {
        state.vendorCouponsLoading = true;
        state.vendorCouponsError = null;
      })
      .addCase(fetchVendorCoupons.fulfilled, (state, action) => {
        state.vendorCouponsLoading = false;
        state.vendorCoupons = action.payload.coupons || [];
        state.vendorInfo = action.payload.vendorInfo;
      })
      .addCase(fetchVendorCoupons.rejected, (state, action) => {
        state.vendorCouponsLoading = false;
        state.vendorCouponsError = action.payload;
        state.vendorCoupons = [];
        state.vendorInfo = null;
      })
      .addCase(fetchCouponHistory.pending, (state) => {
        state.couponHistoryLoading = true;
        state.couponHistoryError = null;
      })
      .addCase(fetchCouponHistory.fulfilled, (state, action) => {
        state.couponHistoryLoading = false;
        state.couponHistory = action.payload || [];
      })
      .addCase(fetchCouponHistory.rejected, (state, action) => {
        state.couponHistoryLoading = false;
        state.couponHistoryError = action.payload;
        state.couponHistory = [];
      })
  },
});

export const { actionLogout, resetOtpState } = AuthSlice.actions;
export default AuthSlice.reducer;