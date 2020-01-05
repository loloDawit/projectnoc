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
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});
/**
 * *    Middleware to calculate average project cost
 */
ProjectSchema.statics.getAverageProjectCost = async function(storeId) {
  const objectId = await this.aggregate([
    //create pipelines
    {
      $match: { store: storeId }
    },
    {
      $group: {
        _id: '$store',
        averageCost: { $avg: '$budget' }
      }
    }
  ]);
  try {
    await this.model('Store').findByIdAndUpdate(storeId, {
      averageCost: Math.ceil(objectId[0].averageCost / 10) * 10
    });
  } catch (error) {
    console.error(error);
  }
};
/**
 * TODO Calculate project cost
 * ! After saving data
 */
ProjectSchema.post('save', function() {
  this.constructor.getAverageProjectCost(this.store);
});
/**
 * TODO Calculate project cost
 * ! Before removing data
 */
ProjectSchema.pre('save', function() {
  this.constructor.getAverageProjectCost(this.store);
});
module.exports = mongoose.model('Project', ProjectSchema);
