const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(b => b.title)
    assert(title.includes('Blog 1'))
  })

  test('id is id and not _id', async () => {
    const response = await api.get('/api/blogs')

    assert.ok('id' in response.body[0])
  })

  describe('likes', () => {
    test('set likes to 0 if likes is missing', async () => {
      const newBlog = {
        'title': 'Blog 3',
        'author': 'Three',
        'url': 'Third blog.'
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('update number of likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updateBlog = { ...blogToUpdate, likes: 100 }

      await api
        .put(`/api/blogs/${updateBlog.id}`)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogAtEnd = await helper.blogsInDb()
      const updatedBlog = blogAtEnd[0]

      assert.strictEqual(updateBlog.likes, updatedBlog.likes)
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const result = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(result.body, blogToView)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        'title': 'Blog 3',
        'author': 'Three',
        'url': 'Third blog.',
        'likes': 30
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)

      const latestBlog = blogAtEnd[blogAtEnd.length - 1]
      assert(latestBlog.title.includes('Blog 3'))
      assert(latestBlog.author.includes('Three'))
    })

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        'author': 'Three',
        'url': 'Third blog.',
        'likes': 30
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        'title': 'Blog 3',
        'author': 'Three',
        'likes': 30
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})