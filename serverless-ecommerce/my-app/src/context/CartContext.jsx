import { createContext, useContext, useReducer } from 'react';

export const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  count: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      // Use productId as the unique identifier
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        // Update quantity if product already exists
        const newItems = state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return { items: newItems, total, count };
      }
      
      // Add new item to cart - store only necessary fields
      const cartItem = {
        productId: action.payload.productId,
        name: action.payload.name,
        description: action.payload.description,
        price: action.payload.price,
        stock: action.payload.stock,
        category: action.payload.category,
        image: action.payload.image,
        quantity: action.payload.quantity || 1,
      };
      
      const newItems = [...state.items, cartItem];
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, count };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter(item => item.productId !== action.payload.productId);
        const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return { items: newItems, total, count };
      }

      const newItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, count };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const count = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, count };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0,
        count: 0,
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity },
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId,
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total: state.total,
        count: state.count,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}



