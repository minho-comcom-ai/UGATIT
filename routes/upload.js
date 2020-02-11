const express = require('express');
const multer = require('multer');
const rootDir = "/workspace/"; 
const router = express.Router();
const nanoid = require('nanoid')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const {option} = req.query;
        let destinationDir = option === 'anime2person' ? 'testB' : 'testA';
        console.log(option, destinationDir);
        cb(null, `${rootDir}dataset/selfie2anime/${destinationDir}`)
    },
    filename: (req, file, cb) => {
        const type = file.originalname.split(".").pop();
        cb(null, `${nanoid(5)}.${type}`)
    }
})
const upload = multer({ storage: storage });


router.post('/', upload.single('file'), (req, res) => {
    const { file } = req;
    if (!file) { res.json({ "status": false }); }
    else { res.json({ "status": true, "filename": file.filename }); }
});

module.exports = router;
