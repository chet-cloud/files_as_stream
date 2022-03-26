'use strict';

import express from 'express'
import { createServer } from 'http'
import { FileServer } from './lib.js'


const app = express();
app.use(express.static('./public'));
app.use(express.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
});

const server = createServer(app);


app.get("/video/mp4/:name", function (req, res) {
  const name = req.params['name']
  FileServer("./public/mp4/" + name, req, res)
})

app.get("/video/:name", function (req, res) {
  const name = req.params['name']
  FileServer("./public/" + name, req, res)
})


// https://github.com/thesmartcoder7/video_streaming_server/blob/main/index.js
// app.get("/video/:name", function (req, res) {
//   // Ensure there is a range given for the video
//   const range = req.headers.range;
//   if (!range) {
//       res.status(400).send("Requires Range header");
//   }

//   const videoPath = "./public/2.mp4";
//   const videoSize = fs.statSync("./public/2.mp4").size;

//   const CHUNK_SIZE = 10 ** 6; // 1MB
//   const start = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//   // Create headers
//   const contentLength = end - start + 1;
//   const headers = {
//       "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": contentLength,
//       "Content-Type": "video/mp4",
//   };

//   // HTTP Status 206 for Partial Content
//   res.writeHead(206, headers);

//   // create video read stream for this particular chunk
//   //fs.createReadStream(videoPath, { start, end }).pipe(res);

// });



server.listen(8080, function () {
  console.log(`Listening on http://localhost:8080`);
});
