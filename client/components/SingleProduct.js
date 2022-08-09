import React, { Component } from 'react'
import { connect } from "react-redux";
import {fetchSingleProduct} from '../store/singleProduct'
import {addToCart} from '../store/cart'


class SingleProduct extends Component {
    constructor(){
      super()
      this.state = {
        totalQuantity: 1
      }
      this.handleAdd = this.handleAdd.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        this.props.getSingleProduct(this.props.match.params.id);
      }

    handleSelect(evt){
      this.setState ({totalQuantity: evt.target.value});
    }

    handleAdd() {
      this.props.addToCart(this.props.product, this.state.totalQuantity);
      // alert('item added to cart')
    }

    render() {
        const product = this.props.product
        return (
        <div className="card mb-3 singleProductContainer">
          <div class="row g-0">
            <img className="responsive rounded center" alt="..."src = {product.imageUrl} ></img>
            <div className='card-body .col-8 singleProduct'>
              <div className={"singleHeader"} >
                <p className="card-header rounded"> {product.productName} </p>
              </div>
            <p> {product.description}</p>
            <p>${(product.price / 100).toFixed(2)}</p>

            <select className={'quantity'} name="quantity" id="quantity" onChange = {this.handleSelect} >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
            </select>
              <button
                  className={'addToCartButton'}
                  onClick={() => this.handleAdd()}>
                      Add to Cart
              </button>
              </div>
            </div>
        </div>
        )
  }
}

const mapState = (state) => ({
    product: state.singleProduct
  });

  const mapDispatch = (dispatch) => ({
    getSingleProduct: (id) => dispatch (fetchSingleProduct(id)),
    addToCart: (product, quantity) => dispatch (addToCart(product, quantity)),
  });

  export default connect(mapState, mapDispatch)(SingleProduct);
