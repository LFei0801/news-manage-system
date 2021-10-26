import { CHANGE_LOADING } from "../const";

const defaultState = { isLoading: true };

const LoadingReducer = (prevState = defaultState, action) => {
  const { type, isLoading } = action;
  switch (type) {
    case CHANGE_LOADING: {
      return { ...prevState, isLoading };
    }
    default: {
      return prevState;
    }
  }
};

export default LoadingReducer;
