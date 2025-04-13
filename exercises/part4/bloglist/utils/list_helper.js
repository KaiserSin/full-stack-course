const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, val) => acc + val.likes, 0)

const favoriteBlog = (blogs) => blogs.reduce((prev, curr) => curr.likes > prev.likes ? curr : prev)

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')
  const counted = _.map(grouped, (posts, author) => ({
    author,
    blogs: posts.length
  }))

  return _.maxBy(counted, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')
  const counted = _.map(grouped, (posts, author) => ({
    author,
    likes: totalLikes(posts)
  }))

  return _.maxBy(counted, 'likes')
}

  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}