import { createStore, combineReducers } from "redux";
import CollApsedReducer from "./reducers/CollApsedReducer";
import LoadingReducer from "./reducers/LoadingReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["LoadingReducer"], // navigation will not be persisted
};

const reducers = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
