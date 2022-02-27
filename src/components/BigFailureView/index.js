import BigFailureImg from './big-failure-img.png'
import './index.css'

const BigFailureView = props => {
  const {retryMethod} = props

  return (
    <div className="big-failure-view-container">
      <div className="big-failure-contents-wrapper">
        <img
          alt="failure view"
          src={BigFailureImg}
          className="big-failure-img animate__animated animate__shakeX"
        />
        <p className="big-failure-text">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="retry-btn"
          onClick={() => retryMethod()}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default BigFailureView
