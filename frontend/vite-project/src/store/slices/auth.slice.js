 import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
 import api from '../../services/api';

 const initialState = {
     user: null,
     token: localStorage.getItem('token'),
     status: 'idle',
     error: null
 };

 export const loginUser = createAsyncThunk('auth/login',
   async (credentials, { rejectWithValue }) => {
     try {
       const { data } = await api.post('/auth/login', credentials);
       return data; // expect { user, token }
     } catch (err) {
       const message = err?.response?.data || { message: 'Login failed' };
       return rejectWithValue(message);
     }
   }
 );

 export const registerUser = createAsyncThunk('auth/register',
   async (userData, { rejectWithValue }) => {
     try {
       const { data } = await api.post('/auth/register', userData);
       return data; // could be { message } or { user, token }
     } catch (err) {
       const message = err?.response?.data || { message: 'Registration failed' };
       return rejectWithValue(message);
     }
   }
 );

 const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
     logout: (state) => {
       state.user = null;
       state.token = null;
       localStorage.removeItem('token');
     },
     setCredentials: (state, action) => {
       state.token = action.payload;
       if (action.payload) localStorage.setItem('token', action.payload);
     }
   },
   extraReducers: (builder) => {
     builder
       .addCase(loginUser.pending, (state) => {
         state.status = 'loading';
         state.error = null;
       })
       .addCase(loginUser.fulfilled, (state, action) => {
         state.status = 'succeeded';
         state.user = action.payload.user || null;
         state.token = action.payload.token || null;
         if (state.token) localStorage.setItem('token', state.token);
       })
       .addCase(loginUser.rejected, (state, action) => {
         state.status = 'failed';
         state.error = action.payload?.message || 'Login failed';
       })
       .addCase(registerUser.pending, (state) => {
         state.status = 'loading';
         state.error = null;
       })
       .addCase(registerUser.fulfilled, (state, action) => {
         state.status = 'succeeded';
         // If backend returns token on register, store it
         if (action.payload?.token) {
           state.token = action.payload.token;
           localStorage.setItem('token', state.token);
         }
         if (action.payload?.user) state.user = action.payload.user;
       })
       .addCase(registerUser.rejected, (state, action) => {
         state.status = 'failed';
         state.error = action.payload?.message || 'Registration failed';
       });
   }
 });

 export const { logout, setCredentials } = authSlice.actions;
 export default authSlice.reducer;

