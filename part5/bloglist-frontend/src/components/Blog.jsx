import { useState } from "react"

const Blog = ({ blog }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showSomeDetails = { display: blogVisible ? 'none' : '' }
  const showAllDetails = { display: blogVisible ? '' : 'none' }

  const handleBlogView = () => {
    setBlogVisible(!blogVisible)
  }

  return (
    <div style={blogStyle}>
      <div style={showSomeDetails}>
        {blog.title} {blog.author} <button onClick={handleBlogView}>View</button>
      </div>
      <div style={showAllDetails}>
        <div>{blog.title} {blog.author} <button onClick={handleBlogView}>Hide</button></div>
        <div>{blog.url}</div>
        <div>{blog.likes} <button>Like</button></div>
        <div>{blog.user.name}</div>
      </div>      
    </div>  
  )
}

export default Blog