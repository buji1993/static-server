/*
 * @Author: buji 
 * @Date: 2017-10-25 20:57:58 
 * @Last Modified by:   buji 
 * @Last Modified time: 2017-10-25 20:57:58 
 */
'use strict'

const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const util = require('util');
const walk = require('./walk');

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

            let html = '';
            files.forEach((file) => {
                html += '<li><a href="' + pathname + file + '">' + file + '</a></li>';
            });
            html = "<ul>" + html + "</ul>";


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

server.listen(8001, () => {
    console.log("This node static server is listening at 8001");
})