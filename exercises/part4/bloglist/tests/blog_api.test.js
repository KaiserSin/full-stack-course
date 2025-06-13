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

after(async () => {
    await mongoose.connection.close()
  })