const express = require('express');
const multer = require('multer');
const {PythonShell} = require("python-shell");
var fs=require("fs");
const nanoid = require('nanoid')
const { exec } = require("child_process");
const FileType = require('file-type');
var isRun=false;
// https://stackoverflow.com/questions/1880198/how-to-execute-shell-command-in-javascript
let router = express.Router();

function runPython() {
    return new Promise((resolve, reject) => {
        PythonShell.run(
            "/workspace/main.py",
            null,
            async (err, result) => {
                if (err) {
                    if (err.traceback === undefined) {
                        console.log(err.message);
                    } else {
                        console.log(err.traceback);
                    }
                }
                const predict = await result[result.length - 1];
                console.log(predict);
                resolve(predict);
            }
        );
    });
}
/* GET home page. */
// router.get('/', async (req, res, next) => {
//     console.log(1);
//     const result = await runPython();
//     exec("rm -f /workspace/dataset/selfie2anime/testA/* ./dataset/selfie2anime/testB/* ", (error,stdout,stderr)=> {
//         if (error){
//             console.log(`error:${error.message}`);
//             return;
//         }
//         if (stderr){
//             console.log(`stderr:${stderr}`);
//             return;
//         }
//     })
//     res.json({"result" : result}); 
// });
const rootDir = "/workspace/";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const {option} = req.query;
        let destinationDir = option === 'anime2person' ? 'testB' : 'testA' 
        cb(null, `${rootDir}dataset/selfie2anime/${destinationDir}`)
    },
    filename: (req, file, cb) => {
        const type = file.originalname.split(".").pop();
        cb(null, `${nanoid(5)}.${type}`)
    }
})
const fileFilter = (_, file, cb) => {
    const type = file.originalname.split(".").pop().toLowerCase();
    if (type === "png" || type === "jpg" || type === "jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage, fileFilter });

router.post('/uploadAndEval', upload.single('files'), async (req, res) => { 
    const { option } = req.query;
    const { file } = req;
    // <->
    if (isRun){
        res.status(429).send("Please Retry later..")
        return ;
    }
    if (!file) {
        res.json({ "status": false, "result": null });
    }
    else {
        isRun = true;
        try{
        const result = await runPython();
        const jpgOutput=`/workspace/results/UGATIT_selfie2anime_lsgan_4resblock_6dis_1_1_10_10_1000_sn_smoothing/${file.filename}`;
        res.download(jpgOutput);
        }
        catch (e) {
            res.status(400).json({ "status": false, "result": null });
        } finally {
            isRun = false;
            }     
    }
});
module.exports = router;