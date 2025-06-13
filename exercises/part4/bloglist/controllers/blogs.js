
const blogsRouter = require('express').Router()

const { request } = require('http')
const Blog = require('../models/blog')
const { response } = require('../app')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
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