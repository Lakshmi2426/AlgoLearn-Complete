const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const REGEX_REGD_NO = /^[A-Z0-9]{10}$/;

// Helper to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'algolearn_jwt_secret_2026',
    { expiresIn: '7d' }
  );
};

// -------------------------------------------------------------
// POST /api/auth/signup (Student Sign-Up)
// Required fields: Name, Branch, Registration Number, Password
// -------------------------------------------------------------
router.post('/signup', async (req, res) => {
  try {
    const { name, branch, regdNo, password } = req.body;

    // 1. Validate Name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    const cleanName = name.trim();

    // 2. Validate Branch
    if (!branch || typeof branch !== 'string' || !branch.trim()) {
      return res.status(400).json({ error: 'Branch is required (e.g. 3/4-CSD-A).' });
    }
    const cleanBranch = branch.trim();

    // 3. Validate Registration Number
    if (!regdNo || typeof regdNo !== 'string') {
      return res.status(400).json({
        error: 'Registration Number is required and must be exactly 10 characters (uppercase letters and digits).',
      });
    }

    const cleanRegdNo = regdNo.trim().toUpperCase();

    // Reject lowercase, spaces, punctuation, or length != 10
    if (!REGEX_REGD_NO.test(cleanRegdNo) || cleanRegdNo.length !== 10) {
      return res.status(400).json({
        error: 'Registration Number must contain exactly 10 characters consisting only of uppercase letters (A–Z) and digits (0–9).',
      });
    }

    // 4. Validate Password
    // For this requested version, the initial password equals the 10-character registration number
    const submittedPassword = password ? String(password).trim().toUpperCase() : cleanRegdNo;
    if (submittedPassword !== cleanRegdNo) {
      return res.status(400).json({
        error: 'For new registration, the initial password must match your 10-character Registration Number.',
      });
    }

    // 5. Check if Registration Number already exists
    const existingStudent = await Student.findOne({ regdNo: cleanRegdNo });
    if (existingStudent) {
      return res.status(400).json({
        error: 'Registration Number is already registered to another student account.',
      });
    }

    // 6. Securely hash password with bcrypt (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanRegdNo, salt);

    // 7. Store new student record in MongoDB with 0 initial progress & 0 points
    const newStudent = new Student({
      name: cleanName,
      branch: cleanBranch,
      regdNo: cleanRegdNo,
      password: hashedPassword,
      role: 'student',
      xp: 0,
      topicsStarted: 0,
      topicsCompleted: 0,
      overallProgress: 0,
      progress: {},
    });

    await newStudent.save();

    // 8. Generate authentication session token
    const token = generateToken({
      id: newStudent._id.toString(),
      regdNo: newStudent.regdNo,
      name: newStudent.name,
      role: 'student',
    });

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully.',
      token,
      student: {
        id: newStudent._id.toString(),
        name: newStudent.name,
        branch: newStudent.branch,
        regdNo: newStudent.regdNo,
        role: newStudent.role,
        xp: 0,
        topicsStarted: 0,
        topicsCompleted: 0,
        overallProgress: 0,
        progress: {},
      },
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Registration Number is already registered to another student account.',
      });
    }
    return res.status(500).json({
      error: 'An unexpected database error occurred during registration. Please try again.',
    });
  }
});

// Also alias /register to /signup
router.post('/register', async (req, res, next) => {
  req.url = '/signup';
  return router.handle(req, res, next);
});

// -------------------------------------------------------------
// POST /api/auth/login (Student Sign-In)
// Required fields: Registration Number, Password
// CRITICAL REQUIREMENT — NO ACCOUNT, NO LOGIN
// -------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { regdNo, password } = req.body;

    // Validate Registration Number presence & format
    if (!regdNo || typeof regdNo !== 'string') {
      return res.status(400).json({
        error: 'Registration Number is required.',
      });
    }

    const cleanRegdNo = regdNo.trim().toUpperCase();

    if (!REGEX_REGD_NO.test(cleanRegdNo) || cleanRegdNo.length !== 10) {
      return res.status(400).json({
        error: 'Registration Number must be exactly 10 uppercase characters (letters and digits).',
      });
    }

    // Validate Password presence
    if (!password || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({
        error: 'Password is required.',
      });
    }

    // Query MongoDB for student account
    const student = await Student.findOne({ regdNo: cleanRegdNo });

    // CRITICAL: If student does not have an account, reject login
    if (!student) {
      return res.status(404).json({
        error: 'Account not found. Please sign up first.',
        notFound: true,
      });
    }

    // Verify password against stored bcrypt hash
    const isMatch = await bcrypt.compare(password.trim(), student.password);
    if (!isMatch) {
      // Also check case-insensitive match for initial regdNo password convenience
      const isMatchUpper = await bcrypt.compare(password.trim().toUpperCase(), student.password);
      if (!isMatchUpper) {
        return res.status(401).json({
          error: 'Invalid credentials. Please check your password.',
        });
      }
    }

    // Generate authenticated session token
    const token = generateToken({
      id: student._id.toString(),
      regdNo: student.regdNo,
      name: student.name,
      role: student.role || 'student',
    });

    return res.json({
      success: true,
      token,
      student: {
        id: student._id.toString(),
        name: student.name,
        branch: student.branch,
        regdNo: student.regdNo,
        role: student.role || 'student',
        xp: student.xp || 0,
        topicsStarted: student.topicsStarted || 0,
        topicsCompleted: student.topicsCompleted || 0,
        overallProgress: student.overallProgress || 0,
        progress: student.progress || {},
      },
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    return res.status(500).json({
      error: 'An unexpected database error occurred during sign in. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// POST /api/auth/admin-login (Admin Verification)
// Required fields: Name, Admin Code
// -------------------------------------------------------------
router.post('/admin-login', async (req, res) => {
  try {
    const { name, adminCode } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Administrator Name is required.' });
    }

    if (!adminCode || typeof adminCode !== 'string' || !adminCode.trim()) {
      return res.status(400).json({ error: 'Admin Access Code is required.' });
    }

    const cleanName = name.trim();
    const cleanCode = adminCode.trim();

    // Verify against server-side secret configuration
    const configuredCode = (process.env.ADMIN_CODE || 'ADMIN2026').trim();

    if (cleanCode !== configuredCode) {
      return res.status(401).json({
        error: 'Invalid administrator access code. Access denied.',
      });
    }

    // Admin verified! Generate admin session token
    const token = generateToken({
      id: 'admin-' + Date.now(),
      name: cleanName,
      role: 'admin',
    });

    return res.json({
      success: true,
      token,
      user: {
        id: 'admin-' + Date.now(),
        name: cleanName,
        email: `${cleanName.toLowerCase().replace(/\s+/g, '.')}@algolearn.edu`,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      error: 'An unexpected server error occurred during admin authentication.',
    });
  }
});

// -------------------------------------------------------------
// GET /api/auth/me (Current Session Verification)
// -------------------------------------------------------------
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'algolearn_jwt_secret_2026');

    if (decoded.role === 'admin') {
      return res.json({
        authenticated: true,
        user: {
          id: decoded.id,
          name: decoded.name,
          role: 'admin',
        },
      });
    }

    const student = await Student.findById(decoded.id).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student account not found.' });
    }

    return res.json({
      authenticated: true,
      student,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }
});

module.exports = router;
