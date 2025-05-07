import {configureStore} from '@reduxjs/toolkit';
import RootReducer from './RootReducer';
// import logger from 'redux-logger';
// import {asyncStorageMiddleware} from './async/asyncStore';

export const store = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
