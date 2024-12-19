import {
	setProducts,
	setLoading,
	setError,
	setPagination,
	setFavorites,
	setFavoritesToggle,
	setProduct,
	productReviewed,
	resetError,
} from '../slices/product';
import axios from 'axios';

const API_URL = 'https://grt1n8bzze.execute-api.us-east-2.amazonaws.com/latest/api'; // Hardcoded API URL
const DEFAULT_ERROR_MESSAGE = 'An unexpected error has occurred. Please try again later.';

// Get Products with Pagination
export const getProducts = (page, perPage = 10) => async (dispatch) => {
	dispatch(setLoading());
	try {
		const { data } = await axios.get(`${API_URL}/products`);
		dispatch(setProducts(data.products || [])); // Assuming response contains products
		dispatch(setPagination({ currentPage: page, lastKey: null }));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
			)
		);
	}
};

// Add Product to Favorites
export const addToFavorites = (id) => async (dispatch, getState) => {
	const {
		product: { favorites },
	} = getState();

	const newFavorites = [...favorites, id];
	localStorage.setItem('favorites', JSON.stringify(newFavorites));
	dispatch(setFavorites(newFavorites));
};

// Remove Product from Favorites
export const removeFromFavorites = (id) => async (dispatch, getState) => {
	const {
		product: { favorites },
	} = getState();

	const newFavorites = favorites.filter((favoriteId) => favoriteId !== id);
	localStorage.setItem('favorites', JSON.stringify(newFavorites));
	dispatch(setFavorites(newFavorites));
};

// Toggle Favorites View
export const toggleFavorites = (toggle) => async (dispatch, getState) => {
	const {
		product: { favorites, products },
	} = getState();

	if (toggle) {
		// Show only favorited products
		const filteredProducts = products.filter((product) => favorites.includes(product._id));
		dispatch(setFavoritesToggle(toggle));
		dispatch(setProducts(filteredProducts));
	} else {
		// Show all products
		dispatch(setFavoritesToggle(false));
		dispatch(getProducts(1));
	}
};

// Get a Single Product by ID
export const getProduct = (id) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const { data } = await axios.get(`${API_URL}/products/${id}`);
		dispatch(setProduct(data));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
			)
		);
	}
};

// Create a Product Review
export const createProductReview = (productId, userId, comment, rating, title) => async (dispatch, getState) => {
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

		await axios.post(`${API_URL}/products/reviews/${productId}`, { comment, userId, rating, title }, config);
		dispatch(productReviewed(true));
	} catch (error) {
		dispatch(
			setError(
				error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE
			)
		);
	}
};

// Reset Product Error State
export const resetProductError = () => async (dispatch) => {
	dispatch(resetError());
};
