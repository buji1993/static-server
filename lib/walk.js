/*
 * @Author: buji 
 * @Date: 2017-10-25 20:58:11 
 * @Last Modified by: buji
 * @Last Modified time: 2017-11-02 08:54:37
 */

'use strict'

/**
 *  get all files in the direction
 * 
 * @param {string} filepath 
 * @returns {string[]}
 */
function walk(filepath) {
    const fs = require('fs');
    const files = fs.readdirSync(filepath);

    return files;
}

module.exports = walk;