export const combineReducers = (reducers, rootReducer, initialState) => {
  // First get an array with all the keys of the reducers (the reducer names)
  const reducerKeys = Object.keys(reducers);

  return function combination(state = initialState, action) {
    // Running rootReducer on initialState.
    const nextState = rootReducer(state, action);

    // Loop through all the reducer keys
    for (let i = 0; i < reducerKeys.length; i++) {
      // Get the current key name
      const key = reducerKeys[i];
      // Get the current reducer
      const reducer = reducers[key];
      // Get the the previous state
      const previousStateForKey = state[key];
      // Get the next state by running the reducer
      const nextStateForKey = reducer(previousStateForKey, action);
      // Update the new state for the current reducer
      nextState[key] = nextStateForKey;
    }

    return nextState;
  };
};
