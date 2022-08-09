import React from 'react'
import {connect} from 'react-redux'
import {authenticateSignUp} from '../store'
import {authenticateLogin} from '../store'
import {Link} from 'react-router-dom'
import {Redirect} from 'react-router-dom';

/**
 * COMPONENT
 */
const AuthFormSignUp_CheckOut = props => {

  const {name, displayName, handleSubmit, error} = props

  return (
    <div>
      <form onSubmit={handleSubmit} name={name}>
        <div>
          <p>SIGN UP</p>
          <label htmlFor="firstName">
            <small>First Name</small>
          </label>
          <input name="firstName" type="text" required />
          <label htmlFor="lastName">
            <small>Last Name</small>
          </label>
          <input name="lastName" type="text" required  />
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" required />
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" required/>
        </div>
        <div>
          <label htmlFor="address">
            <small>Address</small>
          </label>
          <input name="address" type="text" required />
        </div>
        <div>
          <button type="submit">
           {displayName}
          </button>
        </div>
        {/* {error && error.response && <div> {error.response.data} </div>} */}
      </form>
    </div>
  )
}
const AuthFormLogIn_CheckOut = props => {
  const {name, displayName, handleSubmit, error} = props

 
  return (
    <div>
      <form onSubmit={handleSubmit} name={name}>
        <div>
          <p>Welcome back! Sign In For Fast Checkout!</p>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" required/>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" required/>
        </div>
        <div>
          <button type="submit">{displayName}
          </button>
        </div>
        {/* {error && error.response && <div> {error.response.data} </div>} */}
        
      </form> 
      
    </div>)
    
  }


/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Checkout',
    error: state.auth.error,
    
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Checkout',
    error: state.auth.error,
  }
}


const mapDispatchforLogIn = dispatch => {
    return {
      handleSubmit(evt) {
        evt.preventDefault()
        const formName = evt.target.name
        const email = evt.target.email.value
        const password = evt.target.password.value
        dispatch(authenticateLogin(email, password, formName))
      },
  }
}
  
  const mapDispatchforSignUp = dispatch => {
    return {
      handleSubmit(evt) {
        evt.preventDefault()
        const formName = evt.target.name
        const email = evt.target.email.value
        const password = evt.target.password.value
        const firstName = evt.target.firstName.value
        const lastName =evt.target.lastName.value
        const address = evt.target.address.value
        dispatch(authenticateSignUp(email, password, formName, firstName, lastName, address))
      },
      
      }
  }
  

export const Login_CheckOut = connect(mapLogin, mapDispatchforLogIn)(AuthFormLogIn_CheckOut)
export const Signup_CheckOut = connect(mapSignup, mapDispatchforSignUp)(AuthFormSignUp_CheckOut)
