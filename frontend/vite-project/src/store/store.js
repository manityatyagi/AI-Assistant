import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import chatReducer from './slices/chat.slice';
import tasksReducer from './slices/tasks.slice';
import scheduleReducer from './slices/schedule.slice';
import financeReducer from './slices/finance.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    tasks: tasksReducer,
    schedule: scheduleReducer,
    finance: financeReducer,
  }
});

export default store;