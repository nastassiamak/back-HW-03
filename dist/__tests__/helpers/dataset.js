"use strict";
//готовые данные для преиспользования в тестах
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataset2 = exports.dataset1 = exports.post2 = exports.post1 = exports.blog6 = exports.blog5 = exports.blog1 = exports.createString = exports.codedAuth = void 0;
const setting_1 = require("../../src/setting");
const admin_middleware_1 = require("../../src/global_middlewares/admin-middleware");
const mongodb_1 = require("mongodb");
exports.codedAuth = (0, admin_middleware_1.fromUTF8ToBase64)(setting_1.SETTINGS.ADMIN);
const createString = (length) => {
    let s = '';
    for (let i = 1; i <= length; i++) {
        s += i % 10;
    }
    return s;
};
exports.createString = createString;
exports.blog1 = {
    id: new mongodb_1.ObjectId().toString(),
    name: 'n11',
    description: 'd11',
    websiteUrl: 'http://example11.com',
    createdAt: new Date().toISOString(),
    isMembership: false
}; // dataset нельзя изменять
exports.blog5 = {
    id: new mongodb_1.ObjectId().toString(),
    name: 'name5',
    description: 'description5',
    websiteUrl: 'http://example5.com',
    createdAt: new Date().toISOString(),
    isMembership: false
}; // dataset нельзя изменять
exports.blog6 = {
    id: new mongodb_1.ObjectId().toString(),
    name: 'name6',
    description: 'description6',
    websiteUrl: 'http://example6.com',
    createdAt: new Date().toISOString(),
    isMembership: false
}; // dataset нельзя изменять
exports.post1 = {
    id: new mongodb_1.ObjectId().toString(),
    title: 't1',
    shortDescription: 's1',
    content: 'c1',
    blogId: exports.blog1.id,
    blogName: exports.blog5.name,
    createdAt: new Date().toISOString()
};
exports.post2 = {
    id: new mongodb_1.ObjectId().toString(),
    title: 't2',
    shortDescription: 's2',
    content: 'c2',
    blogId: exports.blog5.id,
    blogName: exports.blog5.name,
    createdAt: new Date().toISOString()
};
exports.dataset1 = {
    blogs: [exports.blog1],
    posts: []
};
exports.dataset2 = {
    blogs: [exports.blog1, exports.blog5, exports.blog6],
    posts: [exports.post1, exports.post2]
}; //dataset нельзя изменять
