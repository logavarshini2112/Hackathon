import React from 'react';
import { UserCheck } from 'lucide-react';
import AuthForm from '../../components/AuthForm';

export default function StaffLogin() {
  return (
    <AuthForm
      roleTitle="Staff Login"
      roleSubtitle="Sign in to manage assigned tickets and department requests."
      icon={UserCheck}
      badgeText="Staff Portal"
      destinationDashboard="/staff/dashboard"
      allowRegister={false}
    />
  );
}
