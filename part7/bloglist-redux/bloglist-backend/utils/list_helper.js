const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const mostlikes = Math.max(...blogs.map((blog) => blog.likes))
  const favoriteBlog = blogs.find((blog) => blog.likes === mostlikes)
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  }
}

const mostBlogs = (blogs) => {
  const authorCount = _.countBy(blogs, 'author')
  const result = _.maxBy(_.toPairs(authorCount), (value) => value[1])

  return {
    author: result[0],
    blogs: result[1],
  }
}

const mostLikes = (blogs) => {
  const authorCount = _.groupBy(blogs, 'author')
  const totalLikes = _.mapValues(authorCount, (blog) => _.sumBy(blog, 'likes'))
  const result = _.maxBy(_.toPairs(totalLikes), (value) => value[1])

  return {
    author: result[0],
    likes: result[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
