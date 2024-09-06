import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleUserBlogs = () => {
  const allUsers = useSelector(state => state.allUsers)
  const id = useParams().id
  const user = allUsers.find(u => u.id === String(id))

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

export default SingleUserBlogs