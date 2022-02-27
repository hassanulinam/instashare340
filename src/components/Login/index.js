import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'
import logoImg from './insta-login-logo.png'
import landingImg from './insta-landing.png'

class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    errorMsg: '',
  }

  onchangeUsernameInput = event => {
    this.setState({usernameInput: event.target.value})
  }

  onchangePasswordInput = event => {
    this.setState({passwordInput: event.target.value})
  }

  saveAccessTokenAndGoToHomeRoute = token => {
    Cookies.set('jwt_token', token, {expires: 5})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const URL = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(URL, options)
    const data = await response.json()
    if (response.ok) this.saveAccessTokenAndGoToHomeRoute(data.jwt_token)
    else this.setState({errorMsg: data.error_msg})
  }

  render() {
    const {usernameInput, passwordInput, errorMsg} = this.state
    const accessToken = Cookies.get('jwt_token')
    if (accessToken !== undefined) return <Redirect to="/" />

    return (
      <div className="login-responsive-container">
        <img
          className="insta-landing-img animate__animated animate__slideInLeft"
          src={landingImg}
          alt="website login"
        />
        <form className="login-form" onSubmit={this.onSubmitLoginForm}>
          <div className="insta-logo-container">
            <img
              className="login-insta-logo-img animate__animated animate__zoomIn"
              src={logoImg}
              alt="website logo"
            />
            <h1 className="login-logo-heading">Insta Share</h1>
          </div>
          <label className="login-input-label" htmlFor="nameInput">
            USERNAME
          </label>
          <input
            className="login-card-input"
            type="text"
            id="nameInput"
            value={usernameInput}
            onChange={this.onchangeUsernameInput}
          />
          <label className="login-input-label" htmlFor="passwordInput">
            PASSWORD
          </label>
          <input
            className="login-card-input"
            type="password"
            id="passwordInput"
            value={passwordInput}
            onChange={this.onchangePasswordInput}
          />
          <p className="login-err-msg">{errorMsg}</p>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
