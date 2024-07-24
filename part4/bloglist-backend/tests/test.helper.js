const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "Blog 1",
    "author": "One",
    "url": "First blog.",
    "likes": 10
  },
  {
    "title": "Blog 2",
    "author": "Two",
    "url": "Second blog.",
    "likes": 20
  },
  {
    "title": "Blog 3",
    "author": "Three",
    "url": "Third blog.",
    "likes": 30
  }
]

const blogInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogInDb
}