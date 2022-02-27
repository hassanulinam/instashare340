/* eslint-disable camelcase */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import PostCard from '../PostCard'
import BigFailureView from '../BigFailureView'
import searchResultsNotFoundImg from './search-not-found.png'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

class Home extends Component {
  state = {
    storiesApiStatus: apiStatusConstants.initial,
    postsApiStatus: apiStatusConstants.initial,
    searchApiStatus: apiStatusConstants.initial,
    userStoriesData: [],
    postsData: [],
    searchInput: '',
    searchResults: [],
    triggerSearch: false,
  }

  componentDidMount() {
    this.getUserStoriesData()
    this.getPostsData()
  }

  getFetchOptions = () => {
    const accessToken = Cookies.get('jwt_token')
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  }

  onSubmitSearchInput = async searchInput => {
    if (searchInput.length > 0)
      await this.setState({triggerSearch: true, searchInput})
    else await this.setState({triggerSearch: false, searchInput: ''})
    await this.getSearchResults()
  }

  getSearchResults = async () => {
    this.setState({searchApiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state
    const URL = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = this.getFetchOptions()
    const response = await fetch(URL, options)
    const data = await response.json()
    if (response.ok)
      this.setState({
        searchResults: data.posts,
        searchApiStatus: apiStatusConstants.success,
      })
    else this.setState({searchApiStatus: apiStatusConstants.failure})
    console.log('fetched search results: ', data.posts)
  }

  getPostsData = async () => {
    this.setState({postsApiStatus: apiStatusConstants.inProgress})
    const options = this.getFetchOptions()
    const postsUrl = 'https://apis.ccbp.in/insta-share/posts'
    const response = await fetch(postsUrl, options)
    const data = await response.json()
    if (response.ok)
      this.setState({
        postsData: data.posts,
        postsApiStatus: apiStatusConstants.success,
      })
    else this.setState({postsApiStatus: apiStatusConstants.failure})
  }

  getUserStoriesData = async () => {
    this.setState({storiesApiStatus: apiStatusConstants.inProgress})
    const options = this.getFetchOptions()
    const userStoriesUrl = 'https://apis.ccbp.in/insta-share/stories'
    const response = await fetch(userStoriesUrl, options)
    const data = await response.json()
    if (response.ok)
      await this.setState({
        userStoriesData: data.users_stories,
        storiesApiStatus: apiStatusConstants.success,
      })
    else this.setState({storiesApiStatus: apiStatusConstants.failure})
  }

  renderSearchResults = () => {
    const {searchResults} = this.state
    if (searchResults.length > 0)
      return (
        <>
          <h1 className="search-results-heading">Search Results</h1>
          <ul className="posts-view-container">
            {searchResults.map(item => (
              <PostCard key={item.post_id} data={item} />
            ))}
          </ul>
        </>
      )
    return (
      <div className="search-results-not-found-container mt-70px">
        <img
          src={searchResultsNotFoundImg}
          className="search-not-found-img animate__animated animate__shakeX"
          alt="search not found"
        />
        <h1 className="search-not-found-heading">Search Not Found</h1>
        <p className="search-not-found-text">
          Try different keyword or search again
        </p>
      </div>
    )
  }

  renderLoaderView = size => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={size} width={size} />
    </div>
  )

  renderUserStories = () => {
    const {userStoriesData} = this.state
    const settings = {
      dots: false,
      infinite: false,
      slidesToShow: 9,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1300,
          settings: {
            slidesToShow: 8,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 7,
          },
        },
        {
          breakpoint: 1100,
          settings: {
            slidesToShow: 6,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 5,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 512,
          settings: {
            slidesToShow: 3,
          },
        },
      ],
    }
    return (
      <div className="user-stories-container">
        <ul className="slider-container">
          <Slider {...settings}>
            {userStoriesData.map(item => {
              const {user_id, user_name, story_url} = item
              return (
                <li className="user-story-card" key={user_id}>
                  <img
                    src={story_url}
                    alt="user story"
                    className="user-story-img animate__animated animate__zoomIn"
                  />
                  <p className="user-story-name">{user_name}</p>
                </li>
              )
            })}
          </Slider>
        </ul>
      </div>
    )
  }

  renderPosts = () => {
    const {postsData} = this.state
    return (
      <ul className="posts-view-container">
        {postsData.map(item => (
          <PostCard key={item.post_id} data={item} />
        ))}
      </ul>
    )
  }

  renderUserStoriesViewBasedOnApiStatus = () => {
    const {postsApiStatus} = this.state

    switch (postsApiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="user-stories-loader mt-70px">
            {this.renderLoaderView(30)}
          </div>
        )
      case apiStatusConstants.success:
        return this.renderUserStories()
      case apiStatusConstants.failure:
        return <BigFailureView retryMethod={() => this.getUserStoriesData()} />
      default:
        return null
    }
  }

  renderPostsViewBasedOnApiStatus = () => {
    const {storiesApiStatus} = this.state

    switch (storiesApiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="home-posts-prefetch-wrapper">
            {this.renderLoaderView(70)}
          </div>
        )
      case apiStatusConstants.success:
        return this.renderPosts()
      case apiStatusConstants.failure:
        return (
          <div className="home-posts-prefetch-wrapper">
            <BigFailureView retryMethod={() => this.getPostsData()} />
          </div>
        )
      default:
        return null
    }
  }

  renderSearchResultsBasedOnApiStatus = () => {
    const {searchApiStatus} = this.state

    switch (searchApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView(50)
      case apiStatusConstants.success:
        return this.renderSearchResults()
      case apiStatusConstants.failure:
        return <BigFailureView retryMethod={() => this.getSearchResults()} />
      default:
        return null
    }
  }

  render() {
    const {triggerSearch} = this.state

    return (
      <div className="home-route-responsive-container">
        <Header
          activeLinkText="Home"
          onTriggerSearch={this.onSubmitSearchInput}
        />
        {!triggerSearch ? (
          <div className="home-contents-wrapper">
            {this.renderUserStoriesViewBasedOnApiStatus()}
            {this.renderPostsViewBasedOnApiStatus()}
          </div>
        ) : (
          <div className="home-contents-wrapper mt-70px">
            {this.renderSearchResultsBasedOnApiStatus()}
          </div>
        )}
      </div>
    )
  }
}

export default Home
