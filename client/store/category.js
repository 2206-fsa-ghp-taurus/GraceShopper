import axios from "axios";
// action types
const SET_CATEGORY = "SET_CATEGORY";

// action creators
export const setCategory = (category) => ({
  type: SET_CATEGORY,
  category,
});

// thunk creators
export const fetchCategory = (category) => async (dispatch) => {
  const { data } = await axios.get(`/api/products/category/${category}`);
  dispatch(setCategory(data));
};

const initialState = [];

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORY:
      return action.category;
    default:
      return state;
  }
};

export default categoryReducer;

//C: if Category component is not being used, is this necessary?
