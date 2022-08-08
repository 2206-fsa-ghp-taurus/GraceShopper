import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCategory } from "../store/category";
import { Link } from "react-router-dom";
import { addToCart } from "../store/cart";

//C: very possible that I am blind but I could not find how this component is being used in the code

class Category extends Component {
  componentDidMount() {
    this.props.getCategory(this.props.match.params.category);
  }

  handleAdd(product, quantity) {
    this.props.addToCart(product, quantity);
    alert("item added to cart");
  }

  render() {
    return (
      <div>
        {this.props.category.length > 0 ? (
          this.props.category.map((product) => (
            <div key={product.id}>
              <Link to={`/products/${product.id}`}>
                <img src={product.imageUrl}></img>
                <h1> Product Name: {product.productName}</h1>
              </Link>
              <h1> Price: {product.price}</h1>
              <button
                className="button"
                onClick={() => this.handleAdd(product, 1)}
              >
                {" "}
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <h1> Still Loading </h1>
        )}
      </div>
    );
  }
}

const mapState = (state) => ({
  category: state.category,
});

const mapDispatch = (dispatch) => ({
  getCategory: (category) => dispatch(fetchCategory(category)),
  addToCart: (product, quantity) => dispatch(addToCart(product, quantity)),
});

export default connect(mapState, mapDispatch)(Category);
