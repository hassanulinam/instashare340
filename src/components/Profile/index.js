/* eslint-disable camelcase */
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import BigFailureView from '../BigFailureView'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

class Profile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userDetails: null,
  }

  componentDidMount() {
    this.getUserDetails()
  }

  getUserDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const accessToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const URL = `https://apis.ccbp.in/insta-share/users/${id}`
    const response = await fetch(URL, options)
    const data = await response.json()
    console.log(data)

    if (response.ok)
      this.setState({
        userDetails: data.user_details,
        apiStatus: apiStatusConstants.success,
      })
    else this.setState({apiStatus: apiStatusConstants.failure})
  }

  renderUserProfile = () => {
    const {userDetails} = this.state
    const {
      user_name,
      user_id,
      profile_pic,
      followers_count,
      following_count,
      user_bio,
      posts_count,
      posts,
      stories,
    } = userDetails

    return (
      <div className="user-profile-contents-wrapper mt-70px animate__animated animate__fadeIn">
        <div className="user-profile-intro-container">
          <img
            src={profile_pic}
            alt="user profile"
            className="user-profile-dp-img d-none d-md-inline"
          />
          <div className="user-profile-intro-text-container">
            <h1 className="user-profile-name">{user_name}</h1>
            <div className="user-intro-stats">
              <img
                src={profile_pic}
                alt="user profile"
                className="user-profile-dp-img d-md-none d-block"
              />
              <p className="user-intro-text">
                <span className="bold-text">{posts_count}</span> posts
              </p>
              <p className="user-intro-text">
                <span className="bold-text">{followers_count}</span> followers
              </p>
              <p className="user-intro-text">
                <span className="bold-text">{following_count}</span> following
              </p>
            </div>
            <p className="bold-text">{user_id}</p>
            <p>{user_bio}</p>
          </div>
        </div>

        <ul className="user-profile-stories-container">
          {stories.map(item => (
            <li key={item.id}>
              <img
                src={item.image}
                alt="user story"
                className="user-profile-story-img animate__animated animate__zoomIn"
              />
            </li>
          ))}
        </ul>
        <hr className="w-100" />
        <div className="user-profile-posts-heading-row">
          <BsGrid3X3 size={17} />
          <h1 className="user-posts-heading">Posts</h1>
        </div>
        <ul className="user-profile-posts-gallery-container">
          {posts.length > 0 ? (
            posts.map(item => (
              <li key={item.id} className="user-post-container">
                <img
                  className="user-profile-gallery-post w-100  animate__animated animate__zoomIn"
                  src={item.image}
                  alt="user post"
                />
              </li>
            ))
          ) : (
            <div className="user-profile-no-posts-container">
              <div className="no-posts-camera-icon">
                <BiCamera size={30} color="#262626" />
              </div>
              <h1 className="no-posts-heading">No Posts Yet</h1>
            </div>
          )}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container  mt-70px" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={100} />
    </div>
  )

  renderFailureView = () => <BigFailureView retryMethod={this.getUserDetails} />

  renderBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderUserProfile()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="user-profile-route-container">
        <Header activeLinkText="user-profile" />
        {this.renderBasedOnApiStatus()}
      </div>
    )
  }
}

export default Profile

// the same code is used in MyProfile component
