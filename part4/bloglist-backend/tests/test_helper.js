const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'Blog 1',
    'author': 'One',
    'url': 'First blog.',
    'likes': 10
  },
  {
    'title': 'Blog 2',
    'author': 'Two',
    'url': 'Second blog.',
    'likes': 20
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Will remove this soon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId
}