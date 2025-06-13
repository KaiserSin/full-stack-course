const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('assert')

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
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 5,
        __v: 0
      }
]

beforeEach(async () =>{
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('return the correct amount of blog posts in the JSON format', async () =>{
    const resultBlogs = await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(resultBlogs.body.length, initialBlogs.length)
})

test('unique identifier property of blog posts is named id', async () =>{
    const resultBlogs = await api
        .get("/api/blogs")
        .expect(200)
        .expect('Content-Type', /application\/json/)
    resultBlogs.body.forEach(blog =>{
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test('create a new blog post and verify that the total number of blogs in the system is increased by one', async () => {
    const newBlog = {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    }
    const initialResponse = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const initialCount = initialResponse.body.length
    const postResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const finalResponse = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const finalCount = finalResponse.body.length
    assert.strictEqual(finalCount, initialCount + 1)
    
    const content = finalResponse.body.map(val => val.id)
    assert(content.includes(newBlog._id))
})

test('if the likes property is missing from the request, it will default to the value 0', async () =>{
    const newBlog = {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        __v: 0
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(result.body.likes, 0)
    
}) 

test('fails with status code 400 when title is missing', async () => {
    const newBlog = {
        _id: "5a422b891b54a676234d17fa",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
  
test('fails with status code 400 when url is missing', async () => {
    const newBlog = {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

test('delete a blog reduces the total count by one', async () => {
    const blogToDelete = initialBlogs[0]
    await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .expect(204)

    const allAfter = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(allAfter.body.length, initialBlogs.length - 1)

    const titles = allAfter.body.map(b => b.title)
    assert.ok(!titles.includes(blogToDelete.title))
})

test('update a blog updates fields without changing the total count', async () => {
    const blogToUpdate = initialBlogs[0]
    const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    const putRes = await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(putRes.body.likes, updatedData.likes)

    const allAfter = await api
        .get('/api/blogs')
        .expect(200)
    assert.strictEqual(allAfter.body.length, initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
  })