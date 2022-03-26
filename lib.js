import fs from 'fs';
import path from 'path';
import MultiStream from 'multistream'
import {slice} from 'stream-slice'


const getFilesInDir = (dir) =>{
    const state = fs.lstatSync(dir)
    let result
    if(state.isDirectory()){
        result = fs.readdirSync(dir).map(fileName => {
            const fileState = fs.lstatSync(dir + path.sep + fileName)
            if(fileState.isFile()){
                return dir + path.sep + fileName
            }
          })
    }
    return result
}

export const getFileOrDividedFiles = (pathName) =>{
    if(fs.existsSync(pathName)){
        if(fs.lstatSync(pathName).isFile()){
            return [pathName]
        }else{
            return []
        }
    }else {
        const dir = path.dirname(pathName)
        const files =  getFilesInDir(dir).map(f=>{
            return (f && f.startsWith(pathName))?f:null
        })
        return files.filter(f => f!=null)
    }
}

// pathName is file, return the size of the file
// pathName can't find, find the all the name startwith ${pathName}, return the total size of all files
export const getFileOrDividedFilesSize = (pathName) =>{
    const files = getFileOrDividedFiles(pathName).map(f=>{
        return fs.lstatSync(f).size
    })
    const result =  files.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue
      }, 0)
    return result
}

const getStream = (pathName,start,videoSize,size) =>{
    const end = getEnd(start,size,videoSize);
    const files = getFileOrDividedFiles(pathName).map(f=>fs.createReadStream(f))
    return new MultiStream(files).pipe(slice(start, end + 1))
}

const getEnd =(start,videoSize,size)=>{
    const CHUNK_SIZE = size || 10 ** 6; // 1MB
    return Math.min(start + CHUNK_SIZE, videoSize - 1);
}

const getHeaders = (start,videoSize,size)=>{
    const end = getEnd(start,videoSize,size);
    // Create headers
    const contentLength = end - start + 1;
    return {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
}

export function FileServer(filePath,req,res){
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const start = Number(range.replace(/\D/g, ""));
    const videoSize = getFileOrDividedFilesSize(filePath)
    const headers = getHeaders(start,videoSize)
    res.writeHead(206, headers);
    getStream(filePath,start,videoSize).pipe(res)
  }