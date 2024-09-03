import { useState } from 'react'

const Blog = ({ blog, addLikes, removeBlog, user }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showSomeDetails = { display: blogVisible ? 'none' : '' }
  const showAllDetails = { display: blogVisible ? '' : 'none' }

  const handleBlogView = () => {
    setBlogVisible(!blogVisible)
  }

  const handleLike = () => {
    const blogObject = {
      ...blog,
      likes: blog.likes + 1,
    }
    addLikes(blog.id, blogObject)
  }

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    )
    if (confirmDelete) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div style={showSomeDetails} className="beforeView">
        {blog.title} {blog.author}{' '}
        <button onClick={handleBlogView}>View</button>
      </div>
      <div style={showAllDetails} data-testid="afterView">
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={handleBlogView}>Hide</button>
        </div>
        <div>{blog.url}</div>
        <div data-testid="like">
          {blog.likes} <button onClick={handleLike}>Like</button>
        </div>
        <div>{blog.user.name}</div>
        {user.username === blog.user.username && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  )
}

export default Blog
