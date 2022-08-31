const express = require('express');
const router = express.Router();
const multer = require('multer');
const _ = require("lodash");
const mongoose = require("mongoose");
const {courseModel,validateCourseDetail}=require('../modules/courseManagementSchema');


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, res, callback) {
      callback(null, "uploads");
    },
    filename: function (req, file, callback) {

      var filetype = '';
      if (file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if (file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if (file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      if (file.mimetype === 'image/pdf') {
        filetype = 'pdf';
      }
      callback(null, 'image-' + "-" + Date.now() + '.' + filetype);
    },
  }),
}).single("images");


router.post("/courseAdd", upload, async (req, res) => {

  try {
    
    const { error } = validateCourseDetail(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
   

    console.log("REQ>FILE", req.file)
    console.log("author",req.body);
    console.log("topics",req.body.topics)
    const courseData = new courseModel(
      {
        categoryId:req.body.categoryId,
        courseName: req.body.courseName,
        courseDescription: req.body.courseDescription,
        price: req.body.price,
        images: req.file.path,  //update this
        author: req.body.author,
        topics:req.body.topics,
      });
    
    await courseData.save();
    res.send(
      _.pick(courseData, [
        "categoryId",
        "courseName",
        "courseDescription",
        "price",
        "images",
        "author",
        "topics"
      ])

    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetchCourse", async (req, res) => {
  try {
    const course = await courseModel.find();
    if (!course) {
      return res.status(400).send("course does not exists");
    } else {
      res.status(200).json(course);
    }

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put("/updateCourse", upload, async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
    let id = mongoose.Types.ObjectId(req.query.id);
    console.log(id);
    const update = await courseModel.findByIdAndUpdate(id,
      {
        categoryId:req.body.categoryId,
        courseName: req.body.courseName,
        categoryDescription: req.body.categoryDescription,
        price: req.body.price,
        images: req.file.filename,  //update this
        author: req.body.author,
        topics:req.body.topics,
      })

    if (!update) {
      return res.status(400).send("Course id does not exists");
    } else {
      res.send({ message: "Course updated successfully." });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


router.delete("/coueseDelete", async (req, res) => {
  try {
    let deleteCourse = await courseModel.findByIdAndRemove(req.query.id)
    if (!deleteCourse) {
      return res.status(400).send("Course id does not exists");
    } else {
      res.send({
        message: "course deleted successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})




module.exports = router;
