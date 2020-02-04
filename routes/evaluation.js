let express = require('express');
const {PythonShell} = require("python-shell");

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
router.get('/', async (req, res, next) => {
    console.log(11);
    const result = await runPython();
    res.json({"result" : result}); 
});

module.exports = router;