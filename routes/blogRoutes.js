const { Router } = require('express')
const { 
    getAllBlog,
    addNewPost,
    getFindSlugUrlPost,
    deleteBlog,
    editBlog,
    getLimitBlog
} = require('../controllers/blogControllers')
 
const router = Router()

router.get('/limit', getLimitBlog)
router.get('/all', getAllBlog)
router.post('/add', addNewPost)
router.get('/blogpost', getFindSlugUrlPost)
router.put('/edit', editBlog)
router.delete('/delete', deleteBlog)

module.exports = router