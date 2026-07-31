import UserModel from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginUser(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    if (role && user.role !== role && user.role !== 'Administrator') {
      return res.status(403).json({ message: `Access denied for role ${role}` });
    }

    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'Account disabled. Please contact Administrator.' });
    }

    res.json({
      id: user.id,
      userIdCode: user.user_id_code,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @desc    Register a new Visitor
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function registerVisitor(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await UserModel.createUser({
      name,
      email,
      password,
      role: 'Visitor',
      phone,
    });

    res.status(201).json({
      id: user.id,
      userIdCode: user.user_id_code,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export async function getUserProfile(req, res) {
  try {
    const user = await UserModel.findById(req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
