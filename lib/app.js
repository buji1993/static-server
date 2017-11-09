/*
 * @Author: buji 
 * @Date: 2017-10-25 20:57:58 
 * @Last Modified by: buji
 * @Last Modified time: 2017-11-09 19:52:11
 */
'use strict'

const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const util = require('util');
const walk = require('./walk');
const mime = require('./mime');
const config = require('./config');

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
            _readDirection(pathname, req, res);
        } else {
            _readFile(realPath, res);
        }
    }
});



/**
 * 
 * 
 * @param {string} filepath 
 * @param {object} res 
 */
function _readFile(filepath, req, res) {
    let ext = path.extname(filepath);
    ext = ext ? ext.slice(1) : 'unknown';
    if (ext.match(config.Expires.fileMatch)) {
        const expires = new Date();
        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
        res.setHeader("Expires", expires.toUTCString());
        res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
    }

    const stat = fs.statSync(realPath);
    const lastModified = stat.mtime.toUTCString;
    res.setHeader("Last-Modified", lastModified);

    if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
        res.writeHead(304, "Not Modified");
        res.end();
        return;
    }

    const contentType = mime[ext] || "text/plain";
    const readFile = util.promisify(fs.readFile);
    readFile(filepath).then(data => {
        res.writeHead(200, {
            'Content-Type': contentType
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

/**
 * 
 * 
 * @param {string} filepath 
 * @param {object} res 
 */
function _readDirection(pathname, res) {
    const filepath = 'assets' + pathname;
    const files = walk(filepath);

    if (filepath.substr(filepath.length - 1, 1) !== '/') {
        filepath = filepath + '/';
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
}

server.listen(8001, () => {
    console.log("This node static server is listening at 8001");
})