import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('content before view button is clicked', () => {
  const blog = {
    title: 'Testing before view clicked',
    author: 'Me',
    url: 'https://fullstackopen.com',
    likes: 123,
    user: {
      name: 'Name',
      username: 'Username',
    },
  }

  const user = {
    username: 'Username',
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  //screen.debug()

  const div = container.querySelector('.beforeView')
  expect(div).toHaveTextContent('Testing before view clicked')
  expect(div).toHaveTextContent('Me')
  expect(div).not.toHaveTextContent('https://fullstackopen.com')
  expect(div).not.toHaveTextContent('123')
})

test('content after view button is clicked', () => {
  const blog = {
    title: 'Testing after view clicked',
    author: 'Me',
    url: 'https://fullstackopen.com',
    likes: 123,
    user: {
      name: 'Name',
      username: 'Username',
    },
  }

  const user = {
    username: 'Username',
  }

  const { getByTestId } = render(<Blog blog={blog} user={user} />)

  const div = getByTestId('afterView')
  expect(div).toHaveTextContent('Testing after view clicked')
  expect(div).toHaveTextContent('Me')
  expect(div).toHaveTextContent('https://fullstackopen.com')
  expect(div).toHaveTextContent('123')
})

test('like button clicked twice', async () => {
  const blog = {
    title: 'Two likes',
    author: 'Me',
    url: 'https://fullstackopen.com',
    likes: 123,
    user: {
      name: 'Name',
      username: 'Username',
    },
  }

  const user = {
    username: 'Username',
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} addLikes={mockHandler} />)

  const userClick = userEvent.setup()
  const button = screen.getByText('Like')
  await userClick.click(button)
  await userClick.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
