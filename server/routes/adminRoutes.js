import express from 'express';
import Doctor from '../models/doctorsModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// POST /api/admin/add-doctor - Add a new doctor
router.post('/add-doctor', protect, requireAdmin, async (req, res) => {
  try {
    const { name, specialization, phone, availableDays, image } = req.body;
    
    const newDoctor = new Doctor({
      name,
      specialization,
      phone,
      availableDays: availableDays || [],
      image
    });
    
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Server error while adding doctor', error: error.message });
  }
});

// GET /api/admin/doctors - Get all doctors
router.get('/doctors', protect, requireAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors', error: error.message });
  }
});

// DELETE /api/admin/doctors/:id - Delete a doctor
router.delete('/doctors/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    
    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({ message: 'Doctor deleted successfully', deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error while deleting doctor', error: error.message });
  }
});

export default router;