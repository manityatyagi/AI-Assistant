import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/assistant/query', { input: message })
      return { reply: data?.reply, conversationId }
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: 'Failed to send message' })
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = []
      state.error = null
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        const { message } = action.meta.arg || {}
        if (message) state.messages.push({ role: 'user', content: message })
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const reply = action.payload?.reply
        if (reply) state.messages.push({ role: 'assistant', content: reply })
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Failed to send message'
      })
  }
})

export const { clearChat } = chatSlice.actions
export default chatSlice.reducer
