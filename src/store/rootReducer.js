import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/user';
import settingsReducer from './slices/settings';
import { persistReducer } from 'redux-persist';
import auth from './slices/auth';
import notificationsReducer from './slices/notifications';
import officesReducer from './slices/settings/offices';
import departmentsReducer from './slices/settings/departments';
import servedCountriesReducer from './slices/settings/servedCountries';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  keyPrefix: 'admin-',
  whitelist: ['settings']
};

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  keyPrefix: 'admin-',
  whitelist: [
    'user',
    'isAuthenticated',
    'currentRolePermissions',
    'permissionList',
    'isSuperAdmin'
  ]
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  keyPrefix: 'admin-',
  whitelist: ['user', 'userProfile']
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  offices: officesReducer,
  departments: departmentsReducer,
  servedCountries: servedCountriesReducer,
  settings: settingsReducer,
  notifications: notificationsReducer,
  auth: persistReducer(authPersistConfig, auth)
});

export { rootPersistConfig, rootReducer };
