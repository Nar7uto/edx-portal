import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import courseOutline from './courseOutline';
import dashboardAnalytics from './dashboardAnalytics';
import portalConfiguration from './portalConfiguration';
import table from './table';
import csv from './csv';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

const rootReducer = combineReducers({
  authentication: identityReducer,
  routerReducer,
  courseOutline,
  dashboardAnalytics,
  portalConfiguration,
  table,
  csv,
});

export default rootReducer;
