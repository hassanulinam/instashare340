/* eslint-disable camelcase */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {BsHeart, BsHeartFill} from 'react-icons/bs'
import {BiShareAlt} from 'react-icons/bi'
import {FaRegComment} from 'react-icons/fa'

import './index.css'

class PostCard extends Component {
  state = {isLiked: false}

  toggleLike = async () => {
    await this.setState(prev => ({isLiked: !prev.isLiked}))
    const {data} = this.props
    const {post_id} = data
    const {isLiked} = this.state
    const requestBody = {
      like_status: isLiked,
    }
    const accessToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    }
    const URL = `https://apis.ccbp.in/insta-share/posts/${post_id}/like`
    const response = await fetch(URL, options)
    const responseData = await response.json()
    console.log('Like-api status: \n', responseData)
  }

  render() {
    const {data} = this.props
    const {
      user_id,
      user_name,
      profile_pic,
      post_details,
      likes_count,
      comments,
      created_at,
    } = data

    const {isLiked} = this.state

    return (
      <li className="post-card-container animate__animated animate__fadeIn">
        <Link to={`/users/${user_id}`} className="decoration-none">
          <div className="post-card-profile-row">
            <div className="profile-pic-bgcontainer">
              <img
                alt="post author profile"
                src={profile_pic}
                className="post-card-profile-pic"
              />
            </div>
            <p className="text-bold">{user_name}</p>
          </div>
        </Link>
        <img
          alt="post"
          src={post_details.image_url}
          className="post-card-image"
        />
        <div className="post-card-text-container">
          <div className="like-comment-share-row">
            {!isLiked && (
              <button
                type="button"
                className="transparent-btn"
                onClick={this.toggleLike}
                testid="likeIcon"
              >
                <BsHeart size={20} color="#262626" />
              </button>
            )}
            {isLiked && (
              <button
                type="button"
                className="transparent-btn"
                onClick={this.toggleLike}
                testid="unLikeIcon"
              >
                <BsHeartFill size={20} color="red" />
              </button>
            )}
            <button type="button" className="transparent-btn">
              <FaRegComment size={20} color="#475569" />
            </button>
            <button type="button" className="transparent-btn">
              <BiShareAlt size={20} color="#475569" />
            </button>
          </div>
          <p className="text-bold">
            {isLiked ? likes_count + 1 : likes_count} likes
          </p>
          <p className="post-card-text">{post_details.caption}</p>
          {comments.map(item => (
            <p className="post-card-text" key={item.user_id}>
              <span className="text-bold">{item.user_name} </span>
              {item.comment}
            </p>
          ))}
          <p className="post-card-gray-text">{created_at}</p>
        </div>
      </li>
    )
  }
}

export default PostCard
