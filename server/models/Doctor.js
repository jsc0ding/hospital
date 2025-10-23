import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: false
  },
  department: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  workingHours: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: 5.0,
    min: 0,
    max: 5
  },
  phone: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || v.match(/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/) || v.match(/^\d{9}$/);
      },
      message: props => `${props.value} telefon raqami noto'g'ri formatda! Iltimos, +998 XX XXX XX XX yoki 9 raqamli formatdan foydalaning.`
    }
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Doctor', doctorSchema);