import {configureStore} from '@reduxjs/toolkit';
import RootReducer from './RootReducer';
import logger from 'redux-logger';
import {asyncStorageMiddleware} from './async/asyncStore';

export const Store = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger, asyncStorageMiddleware),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
