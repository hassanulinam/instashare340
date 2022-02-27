import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {MdMenu} from 'react-icons/md'
import {AiFillCloseCircle} from 'react-icons/ai'

import websiteLogoImg from './website-logo.png'
import './index.css'

class Header extends Component {
  state = {
    searchInput: '',
    expandHambMenu: false,
    showSmSearchBar: false,
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = event => {
    event.preventDefault()
    const {activeLinkText} = this.props
    if (activeLinkText === 'Home') {
      const {searchInput} = this.state
      const {onTriggerSearch} = this.props
      onTriggerSearch(searchInput)
    } else {
      console.log('Please Navigate to Home to search posts....')
    }
  }

  onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  toggleExpandedHamburger = () => {
    this.setState(prev => ({expandHambMenu: !prev.expandHambMenu}))
  }

  closeHamburgerExpandedView = () => {
    this.setState({expandHambMenu: false})
  }

  toggleShowSmSearchBar = () => {
    this.setState(prev => ({
      showSmSearchBar: !prev.showSmSearchBar,
      expandHambMenu: false,
    }))
  }

  render() {
    const {activeLinkText} = this.props
    const {expandHambMenu, showSmSearchBar} = this.state
    const homeLinkClassName =
      activeLinkText === 'Home' ? 'active-link-text' : 'inactive-link-text'
    const profileLinkClassName =
      activeLinkText === 'my-profile'
        ? 'active-link-text'
        : 'inactive-link-text'

    const smSearchBarClassName = showSmSearchBar
      ? 'active-link-text'
      : 'inactive-link-text'

    return (
      <nav className="header-responsive-container">
        <ul className="header-nav-bar-container">
          <li>
            <Link to="/" className="website-logo-container">
              <img
                src={websiteLogoImg}
                alt="website logo"
                className="website-logo-img"
              />
              <h1 className="website-logo-text">Insta Share</h1>
            </Link>
          </li>
          <li className="d-none d-md-inline">
            <ul className="nav-bar-items-container">
              <li>
                <form
                  className="search-bar-container"
                  onSubmit={this.onSubmitSearchInput}
                >
                  <input
                    type="search"
                    placeholder="Search Caption"
                    className="search-input-box"
                    onChange={this.onChangeSearchInput}
                  />
                  <button
                    type="submit"
                    className="search-btn"
                    onClick={this.onSubmitSearchInput}
                  >
                    <FaSearch size={10} testid="searchIcon" />
                  </button>
                </form>
              </li>
              <li>
                <Link to="/" className="decoration-none">
                  <p className={homeLinkClassName}>Home</p>
                </Link>
              </li>
              <li>
                <Link to="/my-profile" className="decoration-none">
                  <p className={profileLinkClassName}>Profile</p>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={this.onLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </li>
          <li className="d-md-none">
            <button
              type="button"
              className="transparent-btn"
              onClick={this.toggleExpandedHamburger}
            >
              <MdMenu size={30} className="hamburger-menu-icon" />
            </button>
          </li>
        </ul>
        {expandHambMenu && (
          <div className="header-sm-nav-links-container d-md-none">
            <ul className="sm-nav-links-wrapper animate__animated animate__fadeIn animate__fast">
              <li>
                <Link to="/" className="decoration-none">
                  <p className={homeLinkClassName}>Home</p>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={`transparent-btn ${smSearchBarClassName}`}
                  onClick={this.toggleShowSmSearchBar}
                >
                  Search
                </button>
              </li>
              <li>
                <Link to="/my-profile" className="decoration-none">
                  <p className={profileLinkClassName}>Profile</p>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={this.onLogout}
                >
                  Logout
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="transparent-btn"
                  onClick={this.closeHamburgerExpandedView}
                >
                  <AiFillCloseCircle size={25} />
                </button>
              </li>
            </ul>
          </div>
        )}
        {showSmSearchBar && (
          <div className="header-sm-nav-links-container d-md-none ">
            <ul className="sm-nav-links-wrapper animate__animated animate__fadeIn animate__fast">
              <li>
                <form
                  className="search-bar-container"
                  onSubmit={this.onSubmitSearchInput}
                >
                  <input
                    type="search"
                    placeholder="Search Caption"
                    className="search-input-box"
                    onChange={this.onChangeSearchInput}
                  />
                  <button
                    type="submit"
                    className="search-btn"
                    onClick={this.onSubmitSearchInput}
                  >
                    <FaSearch size={10} testid="searchIcon" />
                  </button>
                </form>
              </li>
            </ul>
          </div>
        )}
      </nav>
    )
  }
}

export default withRouter(Header)
