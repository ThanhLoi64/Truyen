import { Types } from '../actionTypes/login';
import { client } from '../../helpers/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Login User
export const login = user => dispatch =>
  new Promise(function (resolve, reject) {
    client
      .post(`/user/login`, user)
      .then(async res => {
        if (res) {
          dispatch(getLoginSuccess(res));
          await AsyncStorage.setItem('accessToken', res.accessToken);
          await AsyncStorage.setItem('refreshToken', res.refreshToken)
          await AsyncStorage.setItem('roles', res.roles.join(','))
          await AsyncStorage.setItem('expiredDate', res.expiredDate);
          await AsyncStorage.setItem('refreshTokenExpiredDate', res.refreshTokenExpiredDate)
        }
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });

//Login User
export const logout = () => dispatch =>
  new Promise(function (resolve, reject) {
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('expiredDate');
    AsyncStorage.removeItem('userData');
    AsyncStorage.removeItem('roles',)
    AsyncStorage.removeItem('refreshToken')
    AsyncStorage.removeItem('refreshTokenExpiredDate')
    dispatch(toggleIsLoggedIn(false));
    resolve()
  });

export const setIsLoggedIn = value => dispatch => {
  dispatch(toggleIsLoggedIn(value));
};

const getLoginSuccess = data => ({
  type: Types.LOGIN_SUCCESS,
  payload: data,
});

const toggleIsLoggedIn = value => ({
  type: Types.TOGGLE_LOGIN,
  payload: value,
});