import axios from "axios";


const GET_CART = 'GET_CART'
const UPDATE_CART = 'UPDATE_CART'
const EMPTY_CART = 'EMPTY_CART'

export const getCart = (cart) => ({
  type: GET_CART,
  cart
});

export const updateTheCart = (cart) =>({ // either adding a new item, removing a item, updating the quantity of the item
  type: UPDATE_CART,
  cart,
})

export const emptyTheCart = (cart) =>({ // either adding a new item, removing a item, updating the quantity of the item
  type: EMPTY_CART,
  cart,
})


// thunks
export const fetchCart = () =>{
  return async (dispatch) =>{
    try {
      const token = window.localStorage.getItem('token');

      if (token) {
        const {data} = await axios.get('/api/cart', {
          headers: {
              authorization: token
          }}
        )
        console.log(token)
        await dispatch(getCart(data))
      }
      else {
        const cart = JSON.parse(window.localStorage.getItem('cart'))
        await dispatch(getCart(cart))
      }
    }
    catch (err) {
      console.log(err)
    }
  }

}


export const addToCart = (product, quantity) => {
  return async (dispatch) => {
    const cost = product.price * quantity;
    try {
       const token = window.localStorage.getItem('token');
       if (token){ // logged in user
          const {data} = await axios.post('/api/cart', {
            productId: product.id,
            totalQuantity: quantity,
            totalCost: cost
          },
          {  headers: {
                  authorization: token
              }
          })
          dispatch(updateTheCart(data))
       }  else{ // for a guest or not signed in user
           let cart = JSON.parse(window.localStorage.getItem('cart'))
              ? JSON.parse(window.localStorage.getItem('cart'))
              : {products: [] }

            let newItem = true;
            if (cart.products){
              for (let i = 0; i< cart.products.length; i++){
                if (cart.products[i].orderItems.productId === product.id) {
                  newItem = false;
                  break;
                }
              }
            }
            if (newItem){
              cart.products.push({
                productName: product.productName,
                imageUrl: product.imageUrl,
                price: product.price,
                orderItems: {
                  productId: product.id,
                  totalQuantity: parseInt(quantity),
                  totalCost: cost }
              })}
              // if already in the cart, just updating quantity 
              else{
                for (let i = 0; i< cart.products.length; i++){
                  if (cart.products[i].orderItems.productId === product.id){
                   cart.products[i].orderItems.totalQuantity = cart.products[i].orderItems.totalQuantity + parseInt(quantity);
                   cart.products[i].orderItems.totalCost = cart.products[i].orderItems.totalCost + parseInt(quantity) * cart.products[i].price;
                  }
                }
            }

             window.localStorage.setItem('cart', JSON.stringify(cart));
             dispatch(updateTheCart(cart))

            }

       }
     catch (err) {
      console.log(err)
    }
  }
};

export const removeFromCart = (id) => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem('token');
      if (token) {
        const {data} = await axios.delete(`/api/cart/${id}`, {
          headers: {
            authorization: token,
          }
        });
        dispatch(updateTheCart(data))
      } else{
        const cart = JSON.parse(window.localStorage.getItem('cart'))
        const newProducts= cart.products.filter(product => product.orderItems.productId !== id);
        const newCart = {products: newProducts}
        window.localStorage.setItem('cart', JSON.stringify(newCart))
        dispatch(updateTheCart(newCart))
      }
    } catch (err){
      console.log(err);
    }
  }
};

// // Empty Cart after checkout
// export const emptyCart = (cart) => {
//   return async (dispatch) => {
//     try {
//       const token = window.localStorage.getItem('token') // will always have token 
//       if (cart.id) { // a user who have been logged in the whole time 
//         const {data} = await axios.put(`/api/cart/confirmation`, cart, {
//           headers: {
//             authorization: token,
//           }
//         });
//         dispatch(emptyTheCart(data))
//       } else{  // guest who signed up/ logged in just now 
//         window.localStorage.setItem('cart', JSON.stringify({products: []}))
//         const {data} = await axios.put(`/api/cart/confirmation`, cart,{
//           headers: {
//             authorization: token,
//           }
//         });
//         dispatch(emptyTheCart(data))
//       }
//     } catch (err){
//       console.log(err);
//     }
//   }
// };

// Empty Cart after checkout
export const emptyCart = (cart) => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem('token') 
      if (token){
          if (cart.id) { // a user who have been logged in the whole time 
            const {data} = await axios.put(`/api/cart/confirmation`, cart, {
              headers: {
                authorization: token,
              }
            });
            dispatch(emptyTheCart(data));
          } else{  // guest who  logged in just now 
            window.localStorage.setItem('cart', JSON.stringify({products: []}))
            const {data} = await axios.put(`/api/cart/confirmation`, cart,{
              headers: {
                authorization: token,
              }
            });
            dispatch(emptyTheCart(data));
          }
      } else {
          window.localStorage.setItem('cart', JSON.stringify({products: []}))
          const {data} = await axios.put(`/api/cart/confirmation`, cart,{
            headers: {
              authorization: 'guest',
            }
          });
          dispatch(emptyTheCart(data))
      }
    } catch (err){
      console.log(err);
    }
  }
};


// export const clearCartCount = (cart) => {
//   return async (dispatch) => {
//     try {
//       dispatch(updateTheCart({}))
//     } 
//     catch (err){
//       console.log(err);
//     }
//   }
// }


export const updateQuantity = (item, quantityChange) => {
  return async (dispatch) => {
    try {
       const token = window.localStorage.getItem('token');
       if (token){
          const {data} = await axios.put('/api/cart', {
            itemId: item.id,
            quantityChange: quantityChange,
          }, {
              headers: {
                  authorization: token
              }
          })
          console.log(data)
          dispatch(updateTheCart(data))
       }  else{
           const cart = JSON.parse(window.localStorage.getItem('cart'))
           for (let i = 0; i< cart.products.length; i++){
             if (cart.products[i].orderItems.productId === item.productId){
                if (cart.products[i].orderItems.totalQuantity + quantityChange <= 0) return;
                cart.products[i].orderItems.totalQuantity = cart.products[i].orderItems.totalQuantity +  quantityChange;
                cart.products[i].orderItems.totalCost = cart.products[i].orderItems.totalCost + quantityChange * cart.products[i].price;
             }
           }
           window.localStorage.setItem('cart', JSON.stringify(cart));
           dispatch(updateTheCart(cart))
       }
    } catch (err) {
      console.log(err)
    }
  }
};

  const initialState = {}

  export default function cartReducer(state = initialState, action) {
    switch (action.type) {

      case GET_CART:
        return action.cart;

      case UPDATE_CART:
        return action.cart;

      case EMPTY_CART:
        return {...action.cart, products:[]}


      default:
        return state

    }
  }

