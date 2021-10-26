import { CHANGE_COLLAPSED } from "../const";

const defaultState = { isCollapsed: false };

const CollApsedReducer = (prevState = defaultState, action) => {
  const { type, isCollapsed } = action;
  switch (type) {
    case CHANGE_COLLAPSED:
      return { ...prevState, isCollapsed };
    default:
      return prevState;
  }
};

export default CollApsedReducer;
