-- MySQL DDL Schema for Digital Visitor Feedback & Experience Management Portal

CREATE DATABASE IF NOT EXISTS `visitor_feedback_db`;
USE `visitor_feedback_db`;

-- Users Table (Visitors, Staff, Admin)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id_code` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Visitor', 'Staff', 'Administrator') NOT NULL DEFAULT 'Visitor',
  `department` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Feedback Tickets Table
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reference_id` VARCHAR(50) UNIQUE NOT NULL,
  `visitor_id` INT DEFAULT NULL,
  `visitor_name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `assigned_staff` VARCHAR(100) DEFAULT 'Unassigned',
  `feedback_type` ENUM('Complaint', 'Suggestion', 'Appreciation') NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  `incident_date` DATE NOT NULL,
  `days_pending` INT DEFAULT 0,
  `status` ENUM('Open', 'In Progress', 'Resolved', 'Declined', 'Escalated to Administrator') NOT NULL DEFAULT 'Open',
  `escalation_status` ENUM('Normal', 'Warning', 'Escalated') NOT NULL DEFAULT 'Normal',
  `decline_reason` TEXT DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`visitor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications Table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- System Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `institution_name` VARCHAR(255) DEFAULT 'Digital Experience & Visitor Portal',
  `support_email` VARCHAR(100) DEFAULT 'support@visitorportal.com',
  `support_phone` VARCHAR(50) DEFAULT '+91-9876543210',
  `escalation_days` INT DEFAULT 10,
  `enable_email_notifications` TINYINT(1) DEFAULT 1,
  `enable_in_app_notifications` TINYINT(1) DEFAULT 1,
  `enable_escalation_alerts` TINYINT(1) DEFAULT 1,
  `theme` VARCHAR(20) DEFAULT 'Light',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
