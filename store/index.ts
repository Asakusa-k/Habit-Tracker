import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from './habitsSlice';

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    // Add theme reducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;