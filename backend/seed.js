import pool from './config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Idempotent seed script to initialize an Administrator account safely.
 */
async function seedAdmin() {
  try {
    console.log('----------------------------------------------------');
    console.log('[SEED] Checking database for Administrator accounts...');

    // Check if an Administrator user already exists in the database
    const [existingAdmins] = await pool.execute(
      'SELECT id, user_id_code, name, email, role, status FROM users WHERE role = "Administrator"'
    );

    if (existingAdmins.length > 0) {
      const admin = existingAdmins[0];
      console.log('[SEED NOTICE] Administrator account already exists:');
      console.log(`- Email: ${admin.email}`);
      console.log(`- User ID Code: ${admin.user_id_code}`);
      console.log(`- Status: ${admin.status}`);
      console.log('Skipping seed creation. Existing data untouched.');
      console.log('----------------------------------------------------');
      process.exit(0);
    }

    // Seed configuration credentials
    const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@visitorportal.com').trim().toLowerCase();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123456';
    const adminName = 'System Administrator';
    const department = 'Administration';
    const phone = '+91 98765 43210';

    // Hash password with bcryptjs (10 salt rounds)
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Generate ADM-2026-XXXX user ID code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userIdCode = `ADM-2026-${randomSuffix}`;

    // Insert Administrator into users table
    const [result] = await pool.execute(
      'INSERT INTO users (user_id_code, name, email, password, role, department, phone, status) VALUES (?, ?, ?, ?, "Administrator", ?, ?, "Active")',
      [userIdCode, adminName, adminEmail, hashedPassword, department, phone]
    );

    console.log('[SEED SUCCESS] Initial Administrator account created successfully!');
    console.log('----------------------------------------------------');
    console.log(`  Database Record ID : ${result.insertId}`);
    console.log(`  User ID Code       : ${userIdCode}`);
    console.log(`  Name               : ${adminName}`);
    console.log(`  Email Address      : ${adminEmail}`);
    console.log(`  Password           : ${adminPassword}`);
    console.log(`  Role               : Administrator`);
    console.log(`  Status             : Active`);
    console.log('----------------------------------------------------');
    console.log('You can now log in at: http://localhost:5173/admin/login');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed Administrator account:', error.message);
    process.exit(1);
  }
}

seedAdmin();
