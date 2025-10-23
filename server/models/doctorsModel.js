import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  availableDays: {
    type: [String],
    required: false
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('DoctorNew', doctorSchema);