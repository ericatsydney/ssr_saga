import { applyMiddleware, combineReducers, createStore } from 'redux';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

// actions.js
const FETCH_STARTED = 'WEATHER/FETCH_STARTED';
const FETCH_SUCCESS = 'WEATHER/FETCH_SUCCESS';
const FETCH_FAILURE = 'WEATHER/FETCH_FAILURE';

export const fetchWeatherStarted = () => ({
  type: FETCH_STARTED
});

export const fetchWeatherSuccess = (repos) => ({
  type: FETCH_SUCCESS,
  repos
})

export const fetchWeatherFailure = (error) => ({
  type: FETCH_FAILURE,
  error
})

export const fetchWeather = () => async dispatch => {
  try {
    console.log('started');
    dispatch(fetchWeatherStarted());
    const url = `https://api.github.com/users/ericatsydney/repos?sort=updated`;
    const response = await fetch(url);
    const responseBody = await response.json();
    console.log('success');
    dispatch(fetchWeatherSuccess(responseBody));
  } catch (error) {
    console.log(error);
    dispatch(fetchWeatherFailure('error'));
  }
};

// reducers.js
export const response = (state = { status: 'loading' }, action) => {
  switch (action.type) {
    case FETCH_STARTED: {
      console.log('return loading')
      return { status: 'loading', repos: [] };
    }
    case FETCH_SUCCESS: {
      console.log(action)
      return { status: 'success', repos: action.repos };
    }
    case FETCH_FAILURE: {
      return { status: 'failure', repos: [] };
    }
    default: {
      return { status: 'loading', repos: [] };
    }
  }
};

export const reducers = combineReducers({ response });

// store.js
export function configureStore(initialState = {}) {
  const store = createStore(reducers, initialState, applyMiddleware(thunk));
  return store;
}

export const store = configureStore();

