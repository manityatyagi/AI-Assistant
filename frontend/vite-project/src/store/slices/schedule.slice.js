import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchSchedule = createAsyncThunk('schedule/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/schedule')
    return data // [{id,title,date,time,details}]
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to load schedule' })
  }
})

export const addEvent = createAsyncThunk('schedule/add', async (event, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/schedule', event)
    return data // created event
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to add event' })
  }
})

export const deleteEvent = createAsyncThunk('schedule/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/schedule/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to delete event' })
  }
})

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to load schedule'
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.items = state.items.filter(e => e.id !== action.payload)
      })
  }
})

export default scheduleSlice.reducer
