const { describe, test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 5,
    __v: 0
  }
]

const initialUsers = [
    {
        username: 'lol', 
        name: 'Superuser', 
        password: 'salainen'
    },
    {
        username: 'Rauta', 
        name: 'Superauta', 
        password: 'power'
    }    
]

describe('First tests', () => {
    let token

    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})
  
      const testUser = {
        username: 'lol',
        name: 'Superuser',
        password: 'salainen'
      }
      await api
        .post('/api/users')
        .send(testUser)
        .expect(201)
  
      const loginRes = await api
        .post('/api/login')
        .send({ username: 'lol', password: 'salainen' })
        .expect(200)
      token = loginRes.body.token
  
      for (const b of initialBlogs) {
        const blogToSend = {
          title: b.title,
          author: b.author,
          url: b.url,
          likes: b.likes
        }
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(blogToSend)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      }
    })

  test('return the correct amount of blog posts in the JSON format', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.length, initialBlogs.length)
  })

  test('unique identifier property of blog posts is named id', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    res.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('create a new blog post increases the total count by one', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'lol',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10
    }

    const initialRes = await api.get('/api/blogs')
    const initialCount = initialRes.body.length

    const postRes = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const id  = postRes.body
    assert.ok(id)

    const finalRes = await api.get('/api/blogs')
    assert.strictEqual(finalRes.body.length, initialCount + 1)
    const titles = finalRes.body.map(b => b.title)
    assert.ok(titles.includes(newBlog.title))
  })

  test('likes default to 0 if missing', async () => {
    const newBlog = {
      title: 'No likes blog',
      author: 'lol',
      url: 'http://example.com/no-likes'
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.likes, 0)
  })

  test('fails with 400 if title is missing', async () => {
    const newBlog = {
      author: 'lol',
      url: 'http://example.com/no-title'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, initialBlogs.length)
  })

  test('fails with 400 if url is missing', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'lol'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, initialBlogs.length)
  })

  test('delete a blog reduces the total count by one', async () => {
    const allBefore = await api.get('/api/blogs')
    const initialCount = allBefore.body.length
    const blogToDelete = allBefore.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const allAfter = await api.get('/api/blogs')
    assert.strictEqual(allAfter.body.length, initialCount - 1)
    const titles = allAfter.body.map(b => b.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  test('update a blog updates fields without changing the total count', async () => {
    const allBefore = await api.get('/api/blogs')
    const initialCount = allBefore.body.length
    const blogToUpdate = allBefore.body[0]
    const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const putRes = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(putRes.body.likes, updatedData.likes)

    const allAfter = await api.get('/api/blogs')
    assert.strictEqual(allAfter.body.length, initialCount)
  })
})

describe('User tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(initialUsers)
      })

    test('username is null', async () => {
        const newUser = {
            username: null, name: 'Superuser', password: 'salainen' 
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        assert.strictEqual(result.body.error,'User validation failed: username: invalid username')
        const after = await api.get('/api/users')
        assert.strictEqual(after.body.length, 2)
    })

    test('username is less than 3', async () => {
        const newUser = {
            username: 'er', name: 'Superuser', password: 'salainen' 
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        assert.strictEqual(result.body.error,'User validation failed: username: invalid username')
        const after = await api.get('/api/users')
        assert.strictEqual(after.body.length, 2)
    })

    test('password is null', async () => {
        const newUser = {
            username: 'normal', name: 'Superuser', password: null
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        assert.strictEqual(result.body.error,'invalid password')
        const after = await api.get('/api/users')
        assert.strictEqual(after.body.length, 2)
    })

    test('password is less than 3', async () => {
        const newUser = {
            username: 'normal', name: 'Superuser', password: 'nu'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        assert.strictEqual(result.body.error,'invalid password')
        const after = await api.get('/api/users')
        assert.strictEqual(after.body.length, 2)
    })
})

after(async () => {
    await mongoose.connection.close()
  })
