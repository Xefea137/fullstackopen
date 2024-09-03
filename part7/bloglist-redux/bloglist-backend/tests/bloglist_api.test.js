const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', name: 'nameee', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'User one',
      name: 'Somename one',
      password: 'password1',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    const usernames = userAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'name',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })

  test('creation fails with proper status code and message if username not provided', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: '',
      name: 'name',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Username required'))

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })

  test('creation fails with proper status code and message if password not provided', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'usernameTen',
      name: 'name',
      password: '',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Password required'))

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })

  test('creation fails with proper status code and message if username is not at least 3 characters long', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'us',
      name: 'name',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes(
        'Username needs to be at least 3 characters long',
      ),
    )

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })

  test('creation fails with proper status code and message if password is not at least 3 characters long', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'usernameTen',
      name: 'name',
      password: 'pa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes(
        'Password needs to be at least 3 characters long',
      ),
    )

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtStart.length, userAtEnd.length)
  })
})

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

    const title = response.body.map((b) => b.title)
    assert(title.includes('Blog 1'))
  })

  test('id is id and not _id', async () => {
    const response = await api.get('/api/blogs')

    assert.ok('id' in response.body[0])
  })

  describe('likes', () => {
    test('set likes to 0 if likes is missing', async () => {
      const user = {
        username: 'root',
        password: 'secret',
      }

      const userLogin = await api.post('/api/login').send(user)

      const newBlog = {
        title: 'Blog 3',
        author: 'Three',
        url: 'Third blog.',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
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
      const user = {
        username: 'root',
        password: 'secret',
      }

      const userLogin = await api.post('/api/login').send(user)

      const newBlog = {
        title: 'Blog 3',
        author: 'Three',
        url: 'Third blog.',
        likes: 30,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
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
      const user = {
        username: 'root',
        password: 'secret',
      }

      const userLogin = await api.post('/api/login').send(user)

      const newBlog = {
        author: 'Three',
        url: 'Third blog.',
        likes: 30,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
        .send(newBlog)
        .expect(400)

      const blogAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is missing', async () => {
      const user = {
        username: 'root',
        password: 'secret',
      }

      const userLogin = await api.post('/api/login').send(user)

      const newBlog = {
        title: 'Blog 3',
        author: 'Three',
        likes: 30,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
        .send(newBlog)
        .expect(400)

      const blogAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Blog 3',
        author: 'Three',
        url: 'Third blog.',
        likes: 30,
      }

      const result = await api.post('/api/blogs').send(newBlog).expect(401)

      const blogAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
      assert(result.body.error.includes('Token missing or invalid'))
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const user = {
        username: 'root',
        password: 'secret',
      }

      const userLogin = await api.post('/api/login').send(user)

      const newBlog = {
        title: 'Blog 3',
        author: 'Three',
        url: 'Third blog.',
        likes: 30,
      }

      const blogCreate = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
        .send(newBlog)

      await api
        .delete(`/api/blogs/${blogCreate.body.id}`)
        .set('Authorization', `Bearer ${userLogin.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const titles = blogsAtEnd.map((b) => b.title)
      assert(!titles.includes(blogCreate.body.title))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
