const mongoose = require('mongoose');
const studentStore = require('../services/studentStore');

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    regdNo: {
      type: String,
      required: [true, 'Registration Number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Z0-9]{10}$/.test(v);
        },
        message: 'Registration Number must be exactly 10 characters and contain only uppercase letters and digits.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    xp: {
      type: Number,
      default: 0,
    },
    topicsStarted: {
      type: Number,
      default: 0,
    },
    topicsCompleted: {
      type: Number,
      default: 0,
    },
    overallProgress: {
      type: Number,
      default: 0,
    },
    progress: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Disable buffering so unhandled Mongoose operations fail fast rather than hanging 10s
mongoose.set('bufferCommands', false);

const MongooseStudent = mongoose.models.Student || mongoose.model('Student', StudentSchema);

function Student(data) {
  if (mongoose.connection.readyState === 1) {
    return new MongooseStudent(data);
  }
  return studentStore.newStudent(data);
}

Student.schema = StudentSchema;

Student.findOne = function (filter) {
  if (mongoose.connection.readyState === 1) {
    return MongooseStudent.findOne(filter);
  }
  return studentStore.findOne(filter);
};

Student.findById = function (id) {
  if (mongoose.connection.readyState === 1) {
    return MongooseStudent.findById(id);
  }
  return studentStore.findById(id);
};

Student.find = function (filter, projection) {
  if (mongoose.connection.readyState === 1) {
    return MongooseStudent.find(filter, projection);
  }
  return studentStore.find(filter, projection);
};

Student.create = async function (data) {
  if (mongoose.connection.readyState === 1) {
    return MongooseStudent.create(data);
  }
  return studentStore.create(data);
};

module.exports = Student;
