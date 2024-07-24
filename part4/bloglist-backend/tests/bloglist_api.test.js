const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs returned in json format', async () => {
  await api
    .get('/api/blogs')
    .expect(200) 
    .expect('Content-Type', /application\/json/)
})

test('all blogs returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('id is id and not _id', async () => {
  const response = await api.get('/api/blogs')

  assert.ok('id' in response.body[0])
})

test('successful blog creation', async () => {
  const newBlog = {
    "title": "Blog 3",
    "author": "Three",
    "url": "Third blog.",
    "likes": 30
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogAtEnd = await helper.blogInDb()
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)

  const latestBlog = blogAtEnd[blogAtEnd.length -1]
  assert(latestBlog.title.includes('Blog 3'))
  assert(latestBlog.author.includes('Three'))
  
})

after(async () => {
  await mongoose.connection.close()
})