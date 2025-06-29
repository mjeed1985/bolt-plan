import React from 'react';
import AdminDashboardPage from './AdminDashboardPage'; // Re-use the component for user management

const AdminUsersPage = () => {
  // This page can be a wrapper or directly use AdminDashboardPage's user table logic
  // For now, we'll just render the main dashboard component which includes user management.
  // If more specific user management features are needed, this component can be expanded.
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4 text-indigo-700">إدارة المستخدمين</h1> */}
      {/* This is a simplified approach. In a more complex app, you might have a dedicated user management table component */}
      <AdminDashboardPage />
    </div>
  );
};

export default AdminUsersPage;