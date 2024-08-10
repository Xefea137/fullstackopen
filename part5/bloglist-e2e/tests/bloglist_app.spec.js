const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'UNAME',
        name: 'NAME',
        password: 'PASSWORD'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'UNAME2',
        name: 'NAME2',
        password: 'PASSWORD2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'UNAME', 'PASSWORD')
      
      await expect(page.getByText('NAME logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'UNAME', 'PASSWORDD')
      
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      //await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByText('NAME logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'UNAME', 'PASSWORD')
      
      await expect(page.getByText('NAME logged in')).toBeVisible()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('Blogs')).toBeVisible()

      await createBlog(page, 'Testing title', 'Testing author', 'Testing url')

      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('A new blog Testing title by Testing author added')

      const beforeViewDiv = await page.locator('.beforeView')
      await expect(beforeViewDiv).toContainText('Testing title Testing author')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Testing title', 'Testing author', 'Testing url')

      await page.getByRole('button', { name: 'View' }).click()

      await page.getByRole('button', { name: 'Like' }).click()

      const likeDiv = await page.getByTestId('like')
      await expect(likeDiv).toContainText('1')
    })

    test('user who added the blog can only delete the blog', async ({ page }) => {
      await createBlog(page, 'Testing title', 'Testing author', 'Testing url')
      await page.getByRole('button', { name: 'View' }).click()

      page.on('dialog', async dialog => await dialog.accept())
      await page.getByRole('button', { name: 'Delete' }).click()

      await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page }) => {
      await createBlog(page, 'Testing title', 'Testing author', 'Testing url')

      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'UNAME2', 'PASSWORD2')
      await page.getByRole('button', { name: 'View' }).click()
      await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
    })

    test('blogs are arranged in the order according to the likes', async ({ page }) => {
      await createBlog(page, 'Testing title 1', 'Testing author 1', 'Testing url 1')
      await page.getByRole('button', { name: 'View' }).click()
      await page.getByRole('button', { name: 'Like' }).click()
      
      await createBlog(page, 'Testing title 2', 'Testing author 2', 'Testing url 2')
      await page.getByRole('button', { name: 'View' }).click()

      const likeButton = await page.getByRole('button', { name: 'Like' }).all()
      await likeButton[1].click()
      await likeButton[1].click()
      await likeButton[1].click()
      await likeButton[1].click()

      await page.waitForTimeout(500) 

      const allBlogs = await page.locator('.blog').allTextContents()
      console.log(allBlogs)
      await expect(allBlogs[0]).toContain('Testing title 2')
    })
  })
})