
const blogsRouter = require('express').Router()

const { request } = require('http')
const Blog = require('../models/blog')
const { response } = require('../app')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const user = await request.user
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
    const user = request.user
    blogId = request.params.id
    const blog = await Blog.findById(blogId)
    if(blog.user.toString() === user._id.toString()){
        const result = await Blog.findByIdAndDelete(blogId)
        response.status(204).end()
    } else {
        return response.status(400).json({ error: 'User can not delete other users blogs' })
    }
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