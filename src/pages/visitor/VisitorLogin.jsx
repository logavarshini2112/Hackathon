import React from 'react';
import { User } from 'lucide-react';
import AuthForm from '../../components/AuthForm';

export default function VisitorLogin() {
  return (
    <AuthForm
      roleTitle="Visitor Login"
      roleSubtitle="Access your visitor feedback portal and ticket status."
      icon={User}
      badgeText="Visitor Portal"
      destinationDashboard="/visitor/dashboard"
    />
  );
}
