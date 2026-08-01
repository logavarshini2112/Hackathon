import React from 'react';
import { UserPlus } from 'lucide-react';
import AuthForm from '../../components/AuthForm';

export default function VisitorRegister() {
  return (
    <AuthForm
      initialMode="register"
      roleTitle="Visitor Registration"
      roleSubtitle="Create your visitor account to submit and track feedback."
      icon={UserPlus}
      badgeText="Visitor Portal"
      destinationDashboard="/visitor/dashboard"
    />
  );
}
