import axios from "axios";

const GET_USER = "GET_USER";
const UPDATE_USER = "UPDATE_USER";

export const getUser = (user) => ({
  type: GET_USER,
  user,
});

export const editUser = (user) => ({
  type: UPDATE_USER,
  user,
});

export const fetchUser = () => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem("token");
      if (token) {
        const { data } = await axios.get(`/api/users/account`, {
          headers: {
            authorization: token,
          },
        });
        await dispatch(getUser(data));
      } else {
        console.log("no token");
      }
    } catch (err) {
      console.error("Uh oh, trouble finding user!");
    }
  };
};

export const updateUser = () => {
  return async (dispatch) => {
    try {
      const token = window.localStorage.getItem("token");
      if (token) {
        const { data } = await axios.put(`/api/users/account`, {
          headers: {
            authorization: token,
          },
        });
        await dispatch(editUser(data));
      } else {
        console.log("no token");
      }
    } catch (err) {
      console.error("Uh oh, trouble finding user!");
    }
  };
};

const userAccountReducer = (state = [], action) => {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case UPDATE_USER:
      return action.user;
    default:
      return state;
  }
};

export default userAccountReducer;

//C: there is already an auth reducer that grabs a user for you. is this necessary?
