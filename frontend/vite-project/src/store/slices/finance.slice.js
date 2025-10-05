import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchExpenses = createAsyncThunk('finance/fetchExpenses', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/expenses')
    return data 
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to load expenses' })
  }
})

export const addExpense = createAsyncThunk('finance/addExpense', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/expenses', payload)
    return data 
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to add expense' })
  }
})

export const deleteExpense = createAsyncThunk('finance/deleteExpense', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/expenses/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to delete expense' })
  }
})

export const fetchSummary = createAsyncThunk('finance/fetchSummary', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/expenses/summary', { params })
    return data
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to load summary' })
  }
})

const financeSlice = createSlice({
  name: 'finance',
  initialState: { items: [], summary: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.status = 'loading' })
      .addCase(fetchExpenses.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload || [] })
      .addCase(fetchExpenses.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload?.message || 'Failed to load expenses' })

      .addCase(addExpense.fulfilled, (state, action) => { state.items.unshift(action.payload) })
      .addCase(deleteExpense.fulfilled, (state, action) => { state.items = state.items.filter(e => e.id !== action.payload) })

      .addCase(fetchSummary.fulfilled, (state, action) => { state.summary = action.payload })
  }
})

export default financeSlice.reducer
