import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/tasks')
    return data // expect [{id, text, completed}]
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to fetch tasks' })
  }
})

export const addTask = createAsyncThunk('tasks/add', async (text, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/tasks', { text })
    return data // {id, text, completed}
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to add task' })
  }
})

export const toggleTask = createAsyncThunk('tasks/toggle', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/tasks/${id}`)
    return data // {id, completed}
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to toggle task' })
  }
})

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err?.response?.data || { message: 'Failed to delete task' })
  }
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload || []
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to fetch tasks'
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx !== -1) state.items[idx].completed = action.payload.completed
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  }
})

export default tasksSlice.reducer
