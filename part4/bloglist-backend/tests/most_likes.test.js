const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite', () => {
  const blogs = [
    {
      "title": "Blog 1",
      "author": "One",
      "url": "First blog.",
      "likes": 10
    },
    {
      "title": "Blog 3",
      "author": "Three",
      "url": "Third blog.",
      "likes": 30
    },
    {
      "title": "Blog 2",
      "author": "Two",
      "url": "Second blog.",
      "likes": 20
    }     
  ]

  test('blog in blogs', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      "title": "Blog 3",
      "author": "Three",
      "likes": 30
    })
  })
})