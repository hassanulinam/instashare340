import {Link} from 'react-router-dom'
import notFoundImg from './not-found.png'

import './index.css'

const NotFound = () => (
  <div className="not-found-wrapper">
    <div className="not-found-card">
      <img
        src={notFoundImg}
        alt="page not found"
        className="not-found-img animate__animated animate__wobble"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-text">
        we are sorry, the page you requested could not be found. Please go back
        to the homepage.
      </p>
      <Link to="/">
        <button type="button" className="home-page-btn">
          Home Page
        </button>
      </Link>
    </div>
  </div>
)

export default NotFound
