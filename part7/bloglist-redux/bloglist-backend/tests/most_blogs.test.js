const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blog', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'One',
      url: 'First blog.',
      likes: 10,
    },
    {
      title: 'Blog 3',
      author: 'Three',
      url: 'Third blog.',
      likes: 30,
    },
    {
      title: 'Blog 2',
      author: 'Three',
      url: 'Second blog.',
      likes: 20,
    },
  ]

  test('by an author', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Three',
      blogs: 2,
    })
  })
})
