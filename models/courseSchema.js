const mongoose = require("mongoose");

const HighlightSchema = new mongoose.Schema({
  label: String,
  icon: String,
});

const ScheduleSchema = new mongoose.Schema({
  date: String,
  time: String,
  topic: String,
});

const CurriculumSchema = new mongoose.Schema({
  module: String,
  lessons: [String],
});

const InstructorSchema = new mongoose.Schema({
  name: String,
  image: String,
  experience: String,
  bio: String,
});

const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const ReviewSchema = new mongoose.Schema({
  student: String,
  rating: Number,
  feedback: String,
});

const CTASchema = new mongoose.Schema({
  text: String,
  buttonText: String,
});

const CourseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  batch: String,
  imageSrc: String,
  seatsRemaining: Number,
  daysRemaining: Number,
  overview: String,
  highlights: [HighlightSchema],
  features: [String],
  schedule: [ScheduleSchema],
  curriculum: [CurriculumSchema],
  instructor: InstructorSchema,
  projects: [String],
  tools: [String],
  outcomes: [String],
  faqs: [FAQSchema],
  reviews: [ReviewSchema],
  cta: CTASchema,
});

module.exports = mongoose.model("Course", CourseSchema);
