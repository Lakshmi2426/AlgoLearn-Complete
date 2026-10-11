const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// -------------------------------------------------------------
// GET /api/students - List all registered students (passwords omitted)
// -------------------------------------------------------------
router.get('/', async (_req, res) => {
  try {
    const students = await Student.find({}, '-password').sort({ createdAt: -1 });
    const formatted = students.map((s) => ({
      id: s._id.toString(),
      name: s.name,
      branch: s.branch,
      regdNo: s.regdNo,
      email: `${s.regdNo.toLowerCase()}@algolearn.edu`,
      avatar: '',
      role: s.role || 'student',
      xp: s.xp || 0,
      topicsStarted: s.topicsStarted || 0,
      topicsCompleted: s.topicsCompleted || 0,
      overallProgress: s.overallProgress || 0,
      progress: s.progress || {},
      streak: 1,
      lastActive: 'Active recently',
      currentStage: s.overallProgress > 50 ? 'Phase 2: Data Structures' : 'Phase 1: Foundations',
      createdAt: s.createdAt,
    }));
    return res.json({ students: formatted });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ error: 'Failed to retrieve student records.' });
  }
});

// -------------------------------------------------------------
// GET /api/students/:regdNo - Get single student by registration number
// -------------------------------------------------------------
router.get('/:regdNo', async (req, res) => {
  try {
    const cleanRegdNo = req.params.regdNo.trim().toUpperCase();
    const student = await Student.findOne({ regdNo: cleanRegdNo }).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    return res.json({ student });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching student record.' });
  }
});

// -------------------------------------------------------------
// PUT /api/students/:regdNo/progress - Update student progress and XP
// -------------------------------------------------------------
router.put('/:regdNo/progress', async (req, res) => {
  try {
    const cleanRegdNo = req.params.regdNo.trim().toUpperCase();
    const { xp, progress, topicsStarted, topicsCompleted, overallProgress } = req.body;

    const student = await Student.findOne({ regdNo: cleanRegdNo });
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    if (xp !== undefined) student.xp = xp;
    if (progress !== undefined) student.progress = progress;
    if (topicsStarted !== undefined) student.topicsStarted = topicsStarted;
    if (topicsCompleted !== undefined) student.topicsCompleted = topicsCompleted;
    if (overallProgress !== undefined) student.overallProgress = overallProgress;

    await student.save();
    return res.json({ success: true, student: { regdNo: student.regdNo, xp: student.xp, progress: student.progress } });
  } catch (error) {
    console.error('Error saving progress:', error);
    return res.status(500).json({ error: 'Error saving student progress to database.' });
  }
});

module.exports = router;
