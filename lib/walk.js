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