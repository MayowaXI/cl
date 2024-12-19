import axios from 'axios';
import { setProducts, setProductUpdateFlag, setReviewRemovalFlag } from '../slices/product';
import {
	setDeliveredFlag,
	setError,
	setLoading,
	resetError,
	getOrders,
	getUsers,
	userDelete,
	orderDelete,
} from '../slices/admin';

const API_URL = 'https://grt1n8bzze.execute-api.us-east-2.amazonaws.com/latest/api';;


export const getAllUsers = () => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.get(`${API_URL}/users`, config);
		dispatch(getUsers(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const deleteUser = (id) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.get(`${API_URL}/users`, config);
		dispatch(userDelete(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const getAllOrders = () => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.get(`${API_URL}/orders`, config);
		dispatch(getOrders(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const deleteOrder = (id) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.delete(`${API_URL}/orders/${id}`, config);
		dispatch(orderDelete(data));
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const setDelivered = (id) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		await axios.put(`${API_URL}/orders/${id}`, {}, config);
		dispatch(setDeliveredFlag());
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const resetErrorAndRemoval = () => async (dispatch) => {
	dispatch(resetError());
};

export const updateProduct =
	(brand, name, category, stock, price, id, productIsNew, description, subtitle, stripeId, imageOne, imageTwo) =>
	async (dispatch, getState) => {
		setLoading();
		const {
			user: { userInfo },
		} = getState();

		const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

		try {
			const { data } = await axios.put(
				`${API_URL}/products`, // Corrected to include the full API base URL
				{ brand, name, category, stock, price, id, productIsNew, description, subtitle, stripeId, imageOne, imageTwo },
				config
			);
			dispatch(setProducts(data));
			dispatch(setProductUpdateFlag());
		} catch (error) {
			dispatch(
				setError(
					error.response?.data?.message || error.message || 'An expected error has occurred. Please try again later.'
				)
			);
		}
		
	};

export const deleteProduct = (id) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.delete(
			`${API_URL}/products/${id}`, // Corrected to include the full API base URL
			config
		);
		dispatch(setProducts(data));
		dispatch(setProductUpdateFlag());
		dispatch(resetError());
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}	
};

export const uploadProduct = (newProduct) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

	try {
		const { data } = await axios.post(
			`${API_URL}/products`, // Corrected to include the full API base URL
			newProduct,
			config
		);
		dispatch(setProducts(data));
		dispatch(setProductUpdateFlag());
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}
	
};

export const removeReview = (productId, reviewId) => async (dispatch, getState) => {
	setLoading();
	const {
		user: { userInfo },
	} = getState();

	const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };
	console.log('asdfdsaf');
	try {
		const { data } = await axios.put(
			`${API_URL}/products/${productId}/${reviewId}`, // Corrected to include the full API base URL
			{},
			config
		);
		dispatch(setProducts(data));
		dispatch(setReviewRemovalFlag());
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
			)
		);
	}
	
};
