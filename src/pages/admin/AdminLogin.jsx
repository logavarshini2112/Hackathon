import React from 'react';
import { ShieldCheck } from 'lucide-react';
import AuthForm from '../../components/AuthForm';

export default function AdminLogin() {
  return (
    <AuthForm
      roleTitle="Administrator Login"
      roleSubtitle="Administrative control panel and system governance."
      icon={ShieldCheck}
      badgeText="Admin Controls"
      destinationDashboard="/admin/dashboard"
      allowRegister={false}
    />
  );
}
