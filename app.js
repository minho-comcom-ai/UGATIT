const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { exec } = require("child_process");
const cron = require("node-cron");
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const evaluationRouter = require('./routes/evaluation');
var cors = require("cors");

const app = express();

cron.schedule('*/5 * * * *', () => {
    exec("find /workspace/results/UGATIT_selfie2anime_lsgan_4resblock_6dis_1_1_10_10_1000_sn_smoothing/* -mmin +7 -exec rm -f {} \\;", (error,stdout,stderr)=> {
        if (error){
            console.log(`error:${error.message}`);
            return;
        }
        if (stderr){
            console.log(`stderr:${stderr}`);
            return;
        }
    })
  });

cron.schedule('*/1 * * * * ', () => {
  exec("find /workspace/dataset/selfie2anime/testA/* -mmin +1 -exec rm -f {} \\;", (error,stdout,stderr)=> {
      if (error){
          console.log(`error:${error.message}`);
          return;
      }
      if (stderr){
          console.log(`stderr:${stderr}`);
          return;
      }
  })
});
cron.schedule('*/1 * * * *', () => {
  exec("find /workspace/dataset/selfie2anime/testB/* -mmin +1 -exec rm -f {} \\;", (error,stdout,stderr)=> {
      if (error){
          console.log(`error:${error.message}`);
          return;
      }
      if (stderr){
          console.log(`stderr:${stderr}`);
          return;
      }
  })
});

console.log(path.join(__dirname, 'public'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: 'https://ainize.ai',
  }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use("/results", express.static(path.join(__dirname, './results/UGATIT_selfie2anime_lsgan_4resblock_6dis_1_1_10_10_1000_sn_smoothing')));
app.use('/', indexRouter);
// app.use('/upload', uploadRouter);
app.use('/eval', evaluationRouter);

const server = app.listen(80, () => {
});

module.exports = app;
