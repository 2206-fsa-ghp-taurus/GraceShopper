import React from "react";
import { connect } from "react-redux";
import { fetchProducts } from "../store/products";
import { Link } from "react-router-dom";
import { addToCart } from "../store/cart";

class AllProducts extends React.Component {
  constructor() {
    super();
    this.state = { value: "All" };
    this.handleChange = this.handleChange.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
  }

  componentDidMount() {
    this.props.getProducts();
  }

  handleChange(evt) {
    this.setState({ value: evt.target.value });
  }

  selectCategory() {
    return this.props.products.filter(
      (product) => product.category === this.state.value
    );
  }

  render() {
    //C: unused code? I dont see any drilled props
    //C: I love the use of a filter for your products!
    //C: prices are not displayed as dollars. dont forget to divide by 100 or find some way to deal with this
    //C: image sizes are not the same so Im sure this will be dealt with css but figured Id mention it
    const { products } = this.props;
    return (
      <div>
        <h1 className="">{this.state.value}</h1>
        <label htmlFor="category">Filter By Category:</label>
        <select
          name="category"
          value={this.state.value}
          id="category"
          onChange={this.handleChange}
        >
          <option value="All">All</option>
          <option value="bread">Bread</option>
          <option value="cupcakes">Cupcakes</option>
          <option value="cookies">Cookies</option>
          <option value="pies">Pies</option>
          <option value="pastries">Pastries</option>
          <option value="muffins">Muffins</option>
          <option value="cakes">Cakes</option>
        </select>
        <div className="Container">
          {this.state.value === "All"
            ? this.props.products.map((product) => (
                <div key={product.id}>
                  <Link to={`/products/${product.id}`}>
                    {" "}
                    <img className="productImg" src={product.imageUrl} />
                    <p>Product Name: {product.productName}</p>
                  </Link>
                  <p>Price: {product.price}</p>
                  <button
                    className="button"
                    onClick={() => this.props.addToCart(product, 1)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            : this.selectCategory().map((product) => (
                <div key={product.id}>
                  <Link to={`/products/${product.id}`}>
                    <img className="productImg" src={product.imageUrl} />
                    <p>Product Name: {product.productName}</p>
                  </Link>
                  <p>Price: {product.price}</p>
                  <button
                    className="button"
                    onClick={() => this.props.addToCart(product, 1)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    products: state.products,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProducts: () => dispatch(fetchProducts()),
    addToCart: (product, quantity) => dispatch(addToCart(product, quantity)),
  };
};

export default connect(mapState, mapDispatch)(AllProducts);
