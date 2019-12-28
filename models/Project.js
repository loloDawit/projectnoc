const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: [true, 'Please provide a project title']
  },
  description: {
    type: String,
    require: [true, 'Please provde a project description'],
    maxlength: [500, 'Discription can not be more than 500 characters']
  },
  weeks: {
    type: String,
    required: [true, 'Please add a number of weeks']
  },
  budget: {
    type: Number,
    required: [true, 'Please add project budget']
  },
  skills: {
    type: String,
    require: [true, 'Please add your skills'],
    enum: ['Nodejs', 'Java', 'Javascript', 'Python', 'C#', 'GO', 'C++']
  },
  opensource: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: true
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
