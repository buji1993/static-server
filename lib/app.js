'use strict'

const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const util = require('util');

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    const realPath = "assets" + pathname;
    const isExsit = fs.existsSync(realPath);

    if (!isExsit) {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });
        res.write("Not Found");
        res.end();
    } else {
        const stat = fs.statSync(realPath);
        if (stat.isDirectory()) {
            const files = walk(realPath);

            if (realPath.substr(realPath.length - 1, 1) !== '/') {
                realPath = realPath + '/';
            }
            let html = "<ul>";
            for (let i = 0, len = files.length; i < len; i++) {
                html += '<li><a href="' + pathname + files[i] + '">' + files[i] + '</a></li>'
            }
            html += "</ul>";

            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.write(html);
            res.end();
        } else {
            const readFile = util.promisify(fs.readFile);
            readFile(realPath).then(data => {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(data, 'binary');
                res.end();
            }).catch(error => {
                res.writeHead(500, {
                    'Content-Type': 'text/html'
                });
                res.end(error);
            });
        }


    }
});

/**
 * 
 * 
 * @param {string} filepath 
 * @returns 
 */
function walk(filepath) {
    const files = fs.readdirSync(filepath);

    let fileList = [];
    for (let i = 0, len = files.length; i < len; i++) {
        let item = files[i];
        let itemArr = item.split("\.");

        let itemMime = (itemArr.length > 1) ? itemArr[itemArr.length - 1] : "undefined";

        fileList.push(files[i]);
    }

    return fileList;
}


server.listen(8001, () => {
    console.log("This node static server is listening at 8001");
})