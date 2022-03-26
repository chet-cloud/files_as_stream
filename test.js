import test from 'ava';
import {getFileOrDividedFilesSize,getFileOrDividedFiles} from './lib.js'


test('test_getFileOrDividedFilesSize', t => {
    t.assert(getFileOrDividedFilesSize("./public/mp4") === 0)
    t.assert(getFileOrDividedFilesSize("./public/2.mp4") === 5485935)
});

test("getFileOrDividedFiles", t=>{
    t.assert(getFileOrDividedFiles("./public/mp4").length === 0 )
    t.assert(getFileOrDividedFiles("./public/2.mp4")[0] === "./public/2.mp4")
    t.assert(getFileOrDividedFiles("./public/mp4/2.mp4")[0] === "./public/mp4/2.mp4.sf-part1")
})