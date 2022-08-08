import React, { Component } from "react";
import { connect } from "react-redux";
import { emptyCart } from "../store/cart";

//C: doesnt look like this is hooked up yet

class Confirmation extends Component {
  componentDidMount() {
    this.props.emptyCart(this.props.cart);
  }

  render() {
    // console.log('confirmation page, this is my cart', this.props.cart)

    return (
      <div>
        <h3>Thank you for your order!</h3>
        <h4>Confirmation #{this.props.cart.id}</h4>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
  };
};

const mapDispatch = (dispatch) => ({
  emptyCart: (cart) => dispatch(emptyCart(cart)),
});

export default connect(mapState, mapDispatch)(Confirmation);
