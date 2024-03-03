const express = require("express");
const { createBlog, getBlog, updateBlog, deleteBlog, deleteBlogDocument } = require("../controllers/blog");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const route = express.Router();

route.post("/createblog",isAuthenticated,createBlog)
route.get("/getblog",isAuthenticated,getBlog);
route.put("/updateblog/:blogId",isAuthenticated,authorizeRoles("admin"),updateBlog);
route.post("/deleteblog/:blogId",isAuthenticated,authorizeRoles("admin"),deleteBlog);
route.delete("/deleteDocument",isAuthenticated,authorizeRoles("admin"),deleteBlogDocument);


module.exports = route;

