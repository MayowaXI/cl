import axios from 'axios';
import {
  setUserOrders,
  setError,
  setLoading,
  setServerResponseStatus,
  setServerResponseMsg,
  userLogin,
  userLogout,
  verificationEmail,
  stateReset,
} from '../slices/user';

import { clearCart } from '../slices/cart';

// API Base URL
const API_URL = 'https://a24n94un1c.execute-api.us-east-2.amazonaws.com/prod';

// User Login
export const login = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const { data } = await axios.post(`${API_URL}/login`, { email, password }, config);

    dispatch(userLogin(data));
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Login failed. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// User Logout
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems');
  dispatch(clearCart());
  dispatch(userLogout());
};

// User Registration
export const register = (fullName, email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const { data } = await axios.post(
      `${API_URL}/users/register`,
      { fullName, email, password },
      config
    );

	console.log('Registration response:', data);

    dispatch(setServerResponseMsg(data.message || 'Registration successful! Please verify your email.'));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Registration failed. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Verify Email
export const verifyEmail = (token) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    await axios.get(`${API_URL}/users/verify-email`, config);

    dispatch(verificationEmail());

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      userInfo.active = true;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Email verification failed. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Send Password Reset Email
export const sendResetEmail = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const { data, status } = await axios.post(
      `${API_URL}/users/password-reset-request`,
      { email },
      config
    );

    dispatch(setServerResponseMsg(data.message || 'Password reset email sent successfully.'));
    dispatch(setServerResponseStatus(status));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to send password reset email. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Reset Password
export const resetPassword = (password, token) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data, status } = await axios.post(
      `${API_URL}/users/password-reset`,
      { password },
      config
    );

    dispatch(setServerResponseMsg(data.message || 'Password reset successfully.'));
    dispatch(setServerResponseStatus(status));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Password reset failed. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Reset Redux State
export const resetState = () => (dispatch) => {
  dispatch(stateReset());
};

// Get User Orders
export const getUserOrders = () => async (dispatch, getState) => {
  dispatch(setLoading(true));

  const {
    user: { userInfo },
  } = getState();

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.get(`${API_URL}/users/${userInfo._id}`, config);
    dispatch(setUserOrders(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch user orders. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};
