import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async() => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('add title here')
  const authorInput = screen.getByPlaceholderText('add author here')
  const urlInput = screen.getByPlaceholderText('add url here')
  const sendButton = screen.getByText('Create')

  await user.type(titleInput,'Some title')
  await user.type(authorInput,'Some author')
  await user.type(urlInput,'some Url')
  await user.click(sendButton)

  //console.log(createBlog.mock.calls[0][0].title)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Some title')
  expect(createBlog.mock.calls[0][0].author).toBe('Some author')
  expect(createBlog.mock.calls[0][0].url).toBe('some Url')
})