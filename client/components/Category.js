import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCategory } from '../store/category';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cart';

class Category extends Component {
  componentDidMount() {
    this.props.getCategory(this.props.match.params.category);
  }

  handleAdd(product, quantity) {
    this.props.addToCart(product, quantity);
    // alert('item added to cart');
  }

  render() {
    return (
      <div className='row col-12 col-4-sm product'>
        {this.props.category.length > 0 ? (
          this.props.category.map((product) => (
            <div key={product.id} className='card product-card shadow-lg'>
              <div className='card-body'>
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    className='productImg rounded'
                  ></img>
                  <p className='card-title product-name'>
                    {product.productName}
                  </p>
                </Link>
                <p className='card-text baseline'>
                  Price: ${(product.price / 100).toFixed(2)}
                </p>
                <button
                  className='btn btn-primary baseline'
                  onClick={() => this.handleAdd(product, 1)}
                >
                  {' '}
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <>
            <h1 className='align-items-center'> Still Loading </h1>
            <img
              src={
                'https://i.pinimg.com/originals/da/08/2c/da082c176aea0f8e5ab294ff7a0f90d1.gif'
              }
            />
          </>
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
