import { Types } from '../actionTypes/register';
import { client } from '../../helpers/api';

export const register = userData => dispatch =>
  new Promise((resolve, reject) => {
    client
      .post('/user/register', userData)
      .then(res => {
        if (res) {
          dispatch(getRegisterSuccess(res));
        }
        resolve(res);
      })
      .catch(err => {
        dispatch(getRegisterFailure(err));
        reject(err);
      });
  });

const getRegisterSuccess = data => ({
  type: Types.REGISTER_SUCCESS,
  payload: data,
});

const getRegisterFailure = error => ({
  type: Types.REGISTER_FAILURE,
  payload: error,
});
