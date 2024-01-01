const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
 title: {
  type: String,
  required: [true, 'Please enter a title'],
 },
 description: String,
 due_date: {
  type: Date,
   default: Date.now,
   validate: {
     validator: function (value) {
       // Custom validation for due_date
       return value >= Date.now();
     },
     message: 'Please enter a valid date',
   },
 },
 priority: {
  type: Number,
   enum: [1, 2, 3],
   default: 1
 },
 status: {
  type: String,
  default: 'incomplete'
  },
  categories: {
    type: [String],
    default: ['uncategorized'], // Set default categories as needed
  },
  category: {
    type: String,
    default: 'uncategorized',
  },
})

taskSchema.post('save', function (doc, next) {
  console.log('new task was created & saved', doc);
  next();
})


taskSchema.statics.sortByHighestPriority= async function () {
   return this.find({}).sort({ priority: 1 });
}
 
taskSchema.statics.sortByLowestPriority = async function () {
  return this.find({}).sort({ priority: -1 });
}
taskSchema.statics.sortByEarliestDue = async function (){
  return this.find({}).sort({ due_date: 1 });
 }
taskSchema.statics.sortByLatestDue = async function (){
  return this.find({}).sort({ due_date: -1 });
}
taskSchema.statics.getCategories = async function () {
  const res = await this.findOne({}, { categories: 1 }).exec();
  console.log("res", res);
  const categoriesArray = res ? res.categories : [];
  console.log("categoriesArray", categoriesArray);
  return categoriesArray;
}

const Task = mongoose.model('task', taskSchema);
module.exports = Task;