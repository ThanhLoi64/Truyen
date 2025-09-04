import {Types} from '../actionTypes/login';

const initialState = {
  user: {},
  isLoggedIn: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case Types.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case Types.TOGGLE_LOGIN:
      if(action.payload == true){
        return {
          ...state,
          isLoggedIn: action.payload,
        };
      } else {
        return {
          ...state,
          isLoggedIn: action.payload,
          user: {}
        };
      }
      

    default:
      return state;
  }
}
