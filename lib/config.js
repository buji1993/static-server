/*
 * @Author: buji 
 * @Date: 2017-11-09 19:37:32 
 * @Last Modified by: buji
 * @Last Modified time: 2017-11-09 19:40:26
 */
'use strict'

const Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 60 * 60 * 24 * 365
}

module.exports = {
    Expires
}