import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import SchedulePage from '@/pages/SchedulePage';
import WaitingSchedulePage from '@/pages/WaitingSchedulePage';
import SupervisionSchedulePage from '@/pages/SupervisionSchedulePage';
import LetterPage from '@/pages/LetterPage';
import PerformanceEvidencePage from '@/pages/PerformanceEvidencePage';
import PerformanceEvidenceSectionPage from '@/pages/PerformanceEvidenceSectionPage.jsx';
import SurveyPage from '@/pages/SurveyPage';
import ViewSurveyResultsPage from '@/pages/ViewSurveyResultsPage';
import RespondToSurveyPage from '@/pages/RespondToSurveyPage';
import OperationalPlansDashboardPage from '@/pages/OperationalPlansDashboardPage';
import CreateOperationalPlanPage from '@/pages/CreateOperationalPlanPage';
import PlanSummaryDashboardPage from '@/pages/PlanSummaryDashboardPage';
import SchoolRecordsHubPage from '@/pages/SchoolRecordsHubPage';
import ViewSharedLetterPage from '@/pages/ViewSharedLetterPage';
import ViewAcknowledgementsPage from '@/pages/ViewAcknowledgementsPage';
import ViewSharedPlanPage from '@/pages/ViewSharedPlanPage';

import MeetingsLogDashboardPage from '@/pages/meetings-log/MeetingsLogDashboardPage';
import CommitteesMeetingsPage from '@/pages/meetings-log/CommitteesMeetingsPage';
import SpecializationsMeetingsPage from '@/pages/meetings-log/SpecializationsMeetingsPage';
import IndividualMeetingsPage from '@/pages/meetings-log/IndividualMeetingsPage';
import MeetingsArchivePage from '@/pages/meetings-log/MeetingsArchivePage';
import ViewMeetingDetailsPage from '@/pages/meetings-log/ViewMeetingDetailsPage';

import ClassVisitsDashboardPage from '@/pages/class-visits/ClassVisitsDashboardPage.jsx';
import CreateClassVisitPlanPage from '@/pages/class-visits/CreateClassVisitPlanPage.jsx';
import ArchivedClassVisitPlansPage from '@/pages/class-visits/ArchivedClassVisitPlansPage.jsx';
import ViewClassVisitPlanPage from '@/pages/class-visits/ViewClassVisitPlanPage.jsx';

import ParentCommunicationDashboardPage from '@/pages/parent-communication/ParentCommunicationDashboardPage.jsx';
import CreateParentMessagePage from '@/pages/parent-communication/CreateParentMessagePage.jsx';
import ParentCommunicationLogPage from '@/pages/parent-communication/ParentCommunicationLogPage.jsx';
import ParentCommunicationReportsPage from '@/pages/parent-communication/ParentCommunicationReportsPage.jsx';

// Admin imports
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import { useTheme } from '@/contexts/ThemeProvider';

function App() {
  const { theme } = useTheme();
  return (
    <div className={`${theme} min-h-screen bg-background text-foreground font-cairo`} dir="rtl">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/announcement/view/:token" element={<ViewSharedLetterPage />} />
        <Route path="/operational-plans/view/:planId" element={<ViewSharedPlanPage />} />
        
        {/* User Authenticated Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/waiting-schedule" element={<WaitingSchedulePage />} />
        <Route path="/supervision-schedule" element={<SupervisionSchedulePage />} />
        <Route path="/letters/external" element={<LetterPage type="external" title="الخطابات الخارجية" />} />
        <Route path="/letters/bulletins" element={<LetterPage type="bulletin" title="النشرات الداخلية" />} />
        <Route path="/letters/notifications" element={<LetterPage type="notification" title="التبليغات الإدارية" />} />
        <Route path="/announcement/admin/:id" element={<ViewAcknowledgementsPage />} />

        <Route path="/performance-evidence" element={<PerformanceEvidencePage />} />
        <Route path="/performance-evidence/:sectionId" element={<PerformanceEvidenceSectionPage />} />
        <Route path="/surveys" element={<SurveyPage />} />
        <Route path="/surveys/:surveyId/results" element={<ViewSurveyResultsPage />} />
        <Route path="/survey/:surveyId" element={<RespondToSurveyPage />} />
        <Route path="/operational-plans" element={<OperationalPlansDashboardPage />} />
        <Route path="/operational-plans/new" element={<CreateOperationalPlanPage />} />
        <Route path="/operational-plans/edit/:planId" element={<CreateOperationalPlanPage />} />
        <Route path="/operational-plans/summary/:planId" element={<PlanSummaryDashboardPage />} />
        <Route path="/school-records-hub" element={<SchoolRecordsHubPage />} />
                        
        <Route path="/meetings-log" element={<MeetingsLogDashboardPage />} />
        <Route path="/meetings-log/committees" element={<CommitteesMeetingsPage />} />
        <Route path="/meetings-log/specializations" element={<SpecializationsMeetingsPage />} />
        <Route path="/meetings-log/individual" element={<IndividualMeetingsPage />} />
        <Route path="/meetings-log/archive" element={<MeetingsArchivePage />} />
        <Route path="/meetings-log/view/:meetingId" element={<ViewMeetingDetailsPage />} />

        <Route path="/class-visits" element={<ClassVisitsDashboardPage />} />
        <Route path="/class-visits/new" element={<CreateClassVisitPlanPage />} />
        <Route path="/class-visits/edit/:planId" element={<CreateClassVisitPlanPage />} />
        <Route path="/class-visits/archive" element={<ArchivedClassVisitPlansPage />} />
        <Route path="/class-visits/view/:planId" element={<ViewClassVisitPlanPage />} />

        <Route path="/parent-communication" element={<ParentCommunicationDashboardPage />} />
        <Route path="/parent-communication/new" element={<CreateParentMessagePage />} />
        <Route path="/parent-communication/log" element={<ParentCommunicationLogPage />} />
        <Route path="/parent-communication/reports" element={<ParentCommunicationReportsPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

      </Routes>
      <Toaster />
    </div>
  );
}

export default App;