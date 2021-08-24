const Blog = require('../models/blogModel')
const path = require('path')
const superagent = require('superagent')

// @route       /api/v1/post/all
// @dec         Get all blogs
// @method      GET
// @access      PRIVATE
const getAllBlog = async (req, res) => {
    try {
        const blogs = await Blog.find()

        if(!blogs) {
            return res.status(404).json({
                message: 'Blog not found'
            })
        }

        return res.status(200).json({
            message: 'Success',
            blogs
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// @route       /api/v1/post/limit
// @dec         Get last six blogs
// @method      GET
// @access      PRIVATE
const getLimitBlog = async (req, res) => {
    try {
        const blogs = await Blog.find().limit(6).sort({$natural: -1})

        if(!blogs){
            return res.status(404).json({
                message: 'Blog not found'
            })
        }

        return res.status(200).json({
            message: 'Success',
            blogs
        })
    } catch(err) {
        res.status(500).json({
            message: 'error',
            error: err.message
        })
    }
}

// @route       /api/v1/post/add
// @dec         Add new posts
// @method      POST
// @access      PRIVATE
const addNewPost = async (req, res) => {
    try{
        const {
            title,
            content
        } = req.body

        if(!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                message: 'file not found'
            })
        }

        let sampleFile = req.files.image
        let uploadPath = path.join(__dirname, '..', 'public/uploads/' + sampleFile.name)

        sampleFile.mv(uploadPath, function(err){
            if(err) {
                console.log(err)
            }
        })

        function convertSlugText(text){
            return text.toLowerCase().
            replace(/ /g,'-')
            .replace(/[^\w-]+/g,'')
        }

        const newBlog = await Blog.create({
            title,
            image: sampleFile.name,
            content,
            slugUrl: convertSlugText(title)
        })

        return res.status(201).json({
            message: 'Success',
            blogs: newBlog
        })
    } catch(err) {
        res.status(500).json({
            message: 'error',
            error: err.message
        })
    }
}

// @route       /api/v1/post/blogpost
// @dec         Get one blog
// @method      Get
// @access      PRIVATE
const getFindSlugUrlPost = async (req, res) => {
    try {
        let slugUrl = req.query.post

        const blog = await Blog.findOne({slugUrl})

        if(!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            })
        }

        async function updateVistedCount() {
            let url = `https://api.countapi.xyz/hit/youngproger/${slugUrl}`
            const resp = await superagent.get(url)
            return resp.body.value++
        }

        return res.status(200).json({
            message: 'Success',
            blog,
            count: await updateVistedCount()
        })
    } catch(err) {
        res.status(500).json({
            message: 'error',
            error: err.message
        })
    }
}

// @route       /api/v1/post/edit?post=slugUrl
// @dec         Edit post
// @method      EDIT
// @access      PRIVATE
const editBlog = async (req, res) => {
    try {
        const slugUrl = req.query.post
        const blog = await Blog.findOne({slugUrl})

        if(!blog) {
            return res.json({
                message: 'Blog not found'
            })
        }

        const editedBlog = await Blog.findByIdAndUpdate(blog._id, req.body)

        return res.status(200).json({
            message: 'Successfully edited blog',
            blogs: editedBlog
        })

    } catch(err) {
        res.status(500).json({
            message: 'error',
            error: err.message
        })
    }
}

// @route       /api/v1/post/blogpost?post=slugUrl
// @dec         Delete post
// @method      DELETE
// @access      PRIVATE
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({slugUrl: req.query.post})
        
        if(!blog) {
            return res.json({
                message: 'Blog not found'
            })
        }

        const deleteBlog = await Blog.findByIdAndDelete(blog._id)

        return res.status(200).json({
            message: 'Success post delete'
        })
    } catch(err) {
        res.status(500).json({
            message: 'error',
            error: err.message
        })
    }
}

module.exports = {
    getAllBlog,
    addNewPost,
    getFindSlugUrlPost,
    deleteBlog,
    editBlog,
    getLimitBlog
}