const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most liked', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Three',
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
      author: 'Two',
      url: 'Second blog.',
      likes: 20,
    },
  ]

  test('author', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'Three',
      likes: 40,
    })
  })
})
