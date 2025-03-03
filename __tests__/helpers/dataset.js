"use strict";
//готовые данные для преиспользования в тестах
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataset2 = exports.dataset1 = exports.post1 = exports.blog5 = exports.blog1 = exports.createString = exports.codedAuth = void 0;
const setting_1 = require("../../src/setting");
const admin_middleware_1 = require("../../src/global_middlewares/admin-middleware");
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
    id: new Date().toISOString() + Math.random(),
    name: 'n1',
    description: 'd1',
    websiteUrl: 'http://example1.com',
}; // dataset нельзя изменять
exports.blog5 = {
    id: new Date().toISOString() + Math.random(),
    name: 'name5',
    description: 'description5',
    websiteUrl: 'http://example5.com',
}; // dataset нельзя изменять
exports.post1 = {
    id: new Date().toISOString() + Math.random(),
    title: 't1',
    shortDescription: 's1',
    content: 'c1',
    blogId: exports.blog1.id,
    blogName: 'n1'
};
exports.dataset1 = {
    blogs: [exports.blog1],
    posts: []
};
exports.dataset2 = {
    blogs: [exports.blog1, exports.blog5],
    posts: [exports.post1]
}; //dataset нельзя изменять
