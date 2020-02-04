const express = require('express');
const multer = require('multer');
const rootDir = "/workspace/";
const router = express.Router();
const storageB = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${rootDir}dataset/selfie2anime/testB`)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const storageA = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${rootDir}dataset/selfie2anime/testA`)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const uploadB = multer({ storage: storageB });
const uploadA = multer({ storage: storageA });
router.post('/testB', uploadB.single('file'), (req, res) => {
    const { file } = req;
    if (!file) { res.json({ "status": false }); }
    else { res.json({ "status": true }); }
});
router.post('/testA', uploadA.single('file'), (req, res) => {
    const { file } = req;
    if (!file) { res.json({ "status": false }); }
    else { res.json({ "status": true }); }
});
module.exports = router;
