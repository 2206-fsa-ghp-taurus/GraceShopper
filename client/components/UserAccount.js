import React from "react";
import { connect } from "react-redux";
import { fetchUser, updateUser } from '../store/userAccount'
import OrderHistory from './OrderHistory'

export class UserAccount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      address: ""
    }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  handleSubmit(evt) {
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const addressInput = document.getElementById('address');
    evt.preventDefault();
      this.props.updateUser({ ...this.props.user, ...this.state })

    firstNameInput.value = ""
    lastNameInput.value = ""
    addressInput.value = ""
  }

  componentDidMount() {
    this.props.getUser();
  }

  render() {
    return (
      <div className='my-4'>
        <h4>Welcome {this.props.user.firstName}!</h4>
        <form className='my-4' onSubmit={this.handleSubmit}>
          <label>Edit First Name: </label>
          <input id="firstName" name='firstName' type='text' onChange={this.handleChange} value={this.firstName} />
          <button className='btn btn-primary mx-2' type='submit'>Submit</button>

          <label>Edit Last Name: </label>
          <input id="lastName" name='lastName' type='text' onChange={this.handleChange} value={this.lastName} />
          <button className='btn btn-primary mx-2' type='submit'>Submit</button>

          <label>Edit Address: </label>
          <input id="address" name='address' type='text' onChange={this.handleChange} value={this.address} />

          <button className='btn btn-primary mx-2' type='submit'>Submit</button>
        </form>

        <div className="Container">
          <OrderHistory />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(fetchUser()),
  updateUser: (user) => dispatch(updateUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount)
