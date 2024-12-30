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
  
  const API_URL = 'https://a24n94un1c.execute-api.us-east-2.amazonaws.com/prod/';
  const DEFAULT_ERROR_MESSAGE = 'An unexpected error has occurred. Please try again later.';
  
  // Fetch Products with Pagination
  export const getProducts = (page, perPage = 10) => async (dispatch) => {
	dispatch(setLoading());
	try {
	  const { data } = await axios.get(`${API_URL}/products`, {
		params: { page, perPage },
	  });
  
	  console.log('Raw API Response:', data);
  
	  // Parse the stringified JSON in the 'body' field, if necessary
	  const parsedData = data.body ? JSON.parse(data.body) : data;
	  console.log('Parsed Products:', parsedData.product_item_arr);
  
	  // Dispatch the parsed product data to Redux state
	  dispatch(setProducts(parsedData.product_item_arr || []));
	  dispatch(
		setPagination({
		  currentPage: page,
		  lastKey: parsedData.lastKey || null,
		})
	  );
	} catch (error) {
	  console.error('Error fetching products:', error);
	  dispatch(setError(error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE));
	}
  };
  
  // Add Product to Favorites
  export const addToFavorites = (id) => (dispatch, getState) => {
	const {
	  product: { favorites },
	} = getState();
  
	const updatedFavorites = [...favorites, id];
  
	// Persist favorites in localStorage and update Redux state
	localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
	dispatch(setFavorites(updatedFavorites));
  };
  
  // Remove Product from Favorites
  export const removeFromFavorites = (id) => (dispatch, getState) => {
	const {
	  product: { favorites },
	} = getState();
  
	const updatedFavorites = favorites.filter((favoriteId) => favoriteId !== id);
  
	// Persist updated favorites in localStorage and update Redux state
	localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
	dispatch(setFavorites(updatedFavorites));
  };
  
  // Toggle Favorites View (Show only favorited products or all products)
  export const toggleFavorites = (isToggled) => (dispatch, getState) => {
	const {
	  product: { favorites, products },
	} = getState();
  
	if (isToggled) {
	  const filteredProducts = products.filter((product) => favorites.includes(product._id));
	  dispatch(setFavoritesToggle(true));
	  dispatch(setProducts(filteredProducts));
	} else {
	  dispatch(setFavoritesToggle(false));
	  dispatch(getProducts(1)); // Reset to the first page of products
	}
  };
  
  // Fetch a Single Product by ID
  export const getProduct = (id) => async (dispatch) => {
	dispatch(setLoading()); // Indicate that the request is in progress
	try {
	  // Make the GET request to fetch the product
	  const { data } = await axios.get(`${API_URL}/products/${id}`);
  
	  console.log('Raw API Response:', data);
  
	  // Parse the response body if necessary
	  const productData = data.body ? JSON.parse(data.body) : data;
  
	  console.log('Parsed Product Data:', productData);
  
	  // Dispatch the product data to Redux state
	  dispatch(setProduct(productData));
	} catch (error) {
	  console.error('Error fetching product:', error);
  
	  // Dispatch error details to Redux state
	  dispatch(setError(error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE));
	}
  };
  
  // Create a Product Review
  export const createProductReview =
	(productId, userId, comment, rating, title) => async (dispatch, getState) => {
	  const {
		user: { userInfo },
	  } = getState();
  
	  const config = {
		headers: {
		  Authorization: `Bearer ${userInfo.token}`,
		  'Content-Type': 'application/json',
		},
	  };
  
	  try {
		await axios.post(
		  `${API_URL}/products/reviews/${productId}`,
		  { comment, userId, rating, title },
		  config
		);
  
		console.log('Review successfully created.');
  
		dispatch(productReviewed(true));
	  } catch (error) {
		console.error('Error creating review:', error);
		dispatch(setError(error.response?.data?.message || error.message || DEFAULT_ERROR_MESSAGE));
	  }
	};
  
  // Reset Product Error State
  export const resetProductError = () => (dispatch) => {
	dispatch(resetError());
  };
  