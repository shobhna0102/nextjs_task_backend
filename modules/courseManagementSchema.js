
const Joi = require('joi');
const mongoose = require('mongoose');

const topic = new mongoose.Schema({
    topicName: { type: String, min: 3, max: 255 },
    videoUrl: { type: String},
    topicDescription: { type: String, min: 3, max: 255 },
    resourse: { type:String }
})
const authors =new mongoose.Schema({ 
     authorName: { type: String, min: 3, max: 255 }
     })

const course = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId },
    courseName: { type: String, min: 3, max: 255 },
    courseDescription: { type: String, min: 3, max: 255 },
    price: { type: Number },
    images: { type:String},
   author: authors,
  // topics: [topic]
}, { timestamps: true });
const courseModel = mongoose.model('courses', course);


function validateCourseDetail(course) {
    const schema = Joi.object({
        categoryId:Joi.string(),
        courseName: Joi.string().min(3).max(255).required(),
        courseDescription: Joi.string(),
        price: Joi.number(),
        images: Joi.string(),
        author:Joi.object(),
        //topics: Joi.array()

    });
    return schema.validate(course);
}
module.exports = { courseModel, validateCourseDetail }