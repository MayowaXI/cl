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
const API_URL = 'https://grt1n8bzze.execute-api.us-east-2.amazonaws.com/latest/api';

// User Login
export const login = (email, password) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { 'Content-Type': 'application/json' } };

		const { data } = await axios.post(`${API_URL}/users/login`, { email, password }, config);

		dispatch(userLogin(data));
		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
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
export const register = (name, email, password) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { 'Content-Type': 'application/json' } };

		const { data } = await axios.post(`${API_URL}/users/register`, { name, email, password }, config);

		dispatch(userLogin(data));
		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}
};

// Verify Email
export const verifyEmail = (token) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

		await axios.get(`${API_URL}/users/verify-email`, config);

		dispatch(verificationEmail());
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));
		if (userInfo) {
			userInfo.active = true;
			localStorage.setItem('userInfo', JSON.stringify(userInfo));
		}
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}
};

// Send Reset Email
export const sendResetEmail = (email) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { 'Content-Type': 'application/json' } };

		const { data, status } = await axios.post(`${API_URL}/users/password-reset-request`, { email }, config);

		dispatch(setServerResponseMsg(data));
		dispatch(setServerResponseStatus(status));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}
};

// Reset Password
export const resetPassword = (password, token) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

		const { data, status } = await axios.post(`${API_URL}/users/password-reset`, { password }, config);

		dispatch(setServerResponseMsg(data));
		dispatch(setServerResponseStatus(status));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}
};

// Reset Redux State
export const resetState = () => async (dispatch) => {
	dispatch(stateReset());
};

// Get User Orders
export const getUserOrders = () => async (dispatch, getState) => {
	dispatch(setLoading(true));

	const {
		user: { userInfo },
	} = getState();

	try {
		const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

		const { data } = await axios.get(`${API_URL}/users/${userInfo._id}`, config);
		dispatch(setUserOrders(data));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}
};
