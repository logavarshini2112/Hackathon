import UserModel from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user (Visitor by default, or specified role)
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function registerVisitor(req, res) {
  try {
    const { name, email, password, phone, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const formattedEmail = email.trim().toLowerCase();

    // Enforce email uniqueness check
    const userExists = await UserModel.findByEmail(formattedEmail);
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user with forced 'Visitor' role for public registration
    const user = await UserModel.createUser({
      name: name.trim(),
      email: formattedEmail,
      password,
      role: 'Visitor',
      department: department || null,
      phone: phone ? phone.trim() : null,
    });

    // Return 201 Created with JWT
    res.status(201).json({
      id: user.id,
      userIdCode: user.user_id_code,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}

/**
 * @desc    Authenticate user & return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginUser(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const formattedEmail = email.trim().toLowerCase();

    // Check user by email
    const user = await UserModel.findByEmail(formattedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    // Role check if specific role requested
    if (role && user.role !== role && user.role !== 'Administrator') {
      return res.status(403).json({ message: `Access denied for role ${role}` });
    }

    // Validate password using bcryptjs compare
    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    // Verify user status is Active
    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'Account disabled. Please contact Administrator.' });
    }

    // Return 200 OK with token
    res.status(200).json({
      id: user.id,
      userIdCode: user.user_id_code,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export async function getUserProfile(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, user missing' });
    }

    const user = await UserModel.findById(req.user.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
