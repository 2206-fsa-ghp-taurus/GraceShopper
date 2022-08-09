import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * COMPONENT
 */
export const Home = (props) => {
  const { firstName } = props;

  return (
    <div id='content'>
      <img src='' />
      <div>
        <h3>Our Story</h3>
        <p>
          Since 2022, Taurus Bakery has been one of America’s most-cherished
          bakeshops and set the standard for tried-and-true desserts and baked
          goods. Come visit us in person, or order from our online store to
          experience the taste behind neighborhood get to delicious success.
        </p>
      </div>
      <div>
        <Link to='/products/category/bread'>Bread </Link>
        <Link to='/products/category/cupcakes'>Cupcakes </Link>
        <Link to='/products/category/cookies'>Cookies </Link>
        <Link to='/products/category/pies'>Pies </Link>
        <Link to='/products/category/pastries'>Pastries </Link>
        <Link to='/products/category/muffins'>Muffins </Link>
        <Link to='/products/category/cakes'>Cakes </Link>
      </div>
      <footer>Established in 2022.</footer>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    firstName: state.auth.firstName,
  };
};

export default connect(mapState)(Home);
