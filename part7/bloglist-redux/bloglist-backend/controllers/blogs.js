const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comments')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { comment: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  if (!body.title) {
    return response.status(400).json({ error: 'Title missing' })
  }

  if (!body.author) {
    return response.status(400).json(({ error: 'Author missing' }))
  }

  if (!body.url) {
    return response.status(400).json({ error: 'Url missing' })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    name: 1,
    username: 1,
  })
  response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user._id.toString()) {
    await Comment.deleteMany({ blog: blog._id })    
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Unauthorized to delete blog' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { name: 1, username: 1 })

  response.json(updatedBlog)
})

blogRouter.get('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('comments')
  response.json(blog.comments)
})

blogRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body
  console.log('request.body')
  const blog = await Blog.findById(request.params.id)

  if (!comment) {
    return response.status(400).json({ error: 'Empty comment' })
  }

  const newComment = new Comment({
    comment: comment,
    blog: blog._id
  })

  const savedComment = await newComment.save()
  blog.comments = blog.comments.concat(savedComment)
  await blog.save()
  
  response.status(201).json(savedComment)
})

module.exports = blogRouter