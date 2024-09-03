const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
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
    },
    {
      'title': 'Blog 3',
      'author': 'Three',
      'url': 'Third blog.',
      'likes': 30
    }
  ]

  test('of empty list is zero', () => {
    const blogs = []
    assert.strictEqual(listHelper.totalLikes(blogs), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(listWithMultipleBlogs), 60)
  })
})