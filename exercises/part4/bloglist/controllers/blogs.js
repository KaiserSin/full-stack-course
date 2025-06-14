
const blogsRouter = require('express').Router()

const jwt = require('jsonwebtoken')
const { request } = require('http')
const Blog = require('../models/blog')
const User = require('../models/user')
const { response } = require('../app')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
        return response.status(400).json({ error: 'UserId missing or not valid' })
    }

    const blog = new Blog({
        ...request.body,
        user: user._id
    })

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const result = await Blog.findByIdAndUpdate(
        request.params.id,
      {title, author, url, likes},
      {
        new: true,              
        runValidators: true,    
        context: 'query'       
      }
    )
    if(result) {
        response.json(result)
    } else {
        response.status(404).end()
    }
})
  

module.exports = blogsRouter