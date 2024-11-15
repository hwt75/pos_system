import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/userSlice";
import deviceReducer from "./reducer/deviceSlice";
import recordReducer from "./reducer/recordSlice";
import scheduleReducer from "./reducer/scheduleSlice";
import diagnosisReducer from "./reducer/diagnosisSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    device: deviceReducer,
    record: recordReducer,
    schedule: scheduleReducer,
    diagnosis: diagnosisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
