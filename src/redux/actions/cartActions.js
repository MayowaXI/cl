import axios from 'axios';
import { setError, setLoading, setShippingCosts, cartItemAdd, cartItemRemoval, clearCart } from '../slices/cart';

// Get the base URL from environment variables
const API_URL =  'https://grt1n8bzze.execute-api.us-east-2.amazonaws.com/latest/api';;

export const addCartItem = (id, qty) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data } = await axios.get(`${API_URL}/products/${id}`); // Updated with full API base URL
        const itemToAdd = {
            id: data._id,
            name: data.name,
            subtitle: data.subtitle,
            image: data.images[0],
            price: data.price,
            stock: data.stock,
            brand: data.brand,
            qty,
            stripeId: data.stripeId,
        };

        dispatch(cartItemAdd(itemToAdd));
    } catch (error) {
        dispatch(
            setError(
                error.response?.data?.message || error.message || 'An unexpected error has occurred. Please try again later.'
            )
        );
    }
};

export const removeCartItem = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(cartItemRemoval(id));
};

export const setShipping = (value) => async (dispatch) => {
    dispatch(setShippingCosts(value));
};

export const resetCart = () => (dispatch) => {
    dispatch(clearCart());
};
