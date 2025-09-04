import { Types } from '../actionTypes/register';

const initialState = {
    user: {},
    isRegistered: false,
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case Types.REGISTER_SUCCESS:
            return {
                ...state,
                isRegistered: true,
                user: action.payload,
                error: null,
            };
        case Types.REGISTER_FAILURE:
            return {
                ...state,
                isRegistered: false,
                error: action.payload,
            };
        default:
            return state;
    }
}
