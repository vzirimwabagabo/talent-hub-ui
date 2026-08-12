// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RootRedirect from "./components/RootRedirect"; // 👈 NEW
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Opportunities from "./pages/Opportunities";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ManageUsers from "./pages/admin/ManageUsers";
import Talent from "./pages/Talent";
import Volunteer from "./pages/Volunteer";
import { LanguageProvider } from "./contexts/LanguageContext";
import Language from "./pages/Language";
import About from "./pages/About";
import Analytics from "./pages/ParticipantAnalytics";
import Bookmarks from "./pages/Bookmarks";
import Donations from "./pages/Donations";
import Events from "./pages/Events";
import Messaging from "./pages/Messaging";
import Notifications from "./pages/Notifications";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import MatchRequests from "@/pages/MatchRequest";
import CreateOpportunity from "./pages/admin/CreateOpportunity";
import ManageJobs from "./pages/admin/ManageJobs";
import ReviewApplications from "./pages/admin/ReviewApplications";
import OpportunityDetail from "./pages/opportunityDetails";
import EditOpportunity from "./pages/EditOpportunity";
import CreateEvent from "./pages/CreateEvent";
import MyAnalytics from '@/pages/MyAnalytics'
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* ✅ Conditional root redirect */}
              <Route path="/" element={<RootRedirect />} />

              {/* Other public routes remain accessible to all */}
              <Route path="/about" element={<About />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/talent" element={<Talent />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/language" element={<Language />} />

              {/* Auth pages — guests only */}
              <Route
                path="/login"
                element={
                  <PublicRoute 
                  redirectPath="/dashboard">
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/admin/login"
                element={
                  <PublicRoute redirectPath="/admin">
                    <AdminLogin />
                  </PublicRoute>
                }
              />

              {/* <Route
                path="/testing"
                element={
                  <PublicRoute redirectPath="/dashboard">
                    <AdminDashboard1 />
                  </PublicRoute>
                }
              /> */}


              <Route
  path="/match-requests"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <MatchRequests />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
              <Route
                path="/register"
                element={
                  <PublicRoute redirectPath="/dashboard">
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <PublicRoute redirectPath="/dashboard">
                    <ForgotPassword />
                  </PublicRoute>
                }
              />

              <Route
                path="/reset-password/:token"
                element={
                  <PublicRoute redirectPath="/dashboard">
                    <ResetPassword />
                  </PublicRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                       <Profile />
                   </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <DashboardLayout> 
                      <Portfolio />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-analytics"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <MyAnalytics />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

               <Route
                path="/opportunities/:id"
                element={
                  <ProtectedRoute>
                    <OpportunityDetail/>
                    
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/create"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CreateEvent />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/opportunities/:id/edit"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardLayout>
                      <EditOpportunity />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
                <Route
                path="/admin/create-opportunity"
                element={
                  <ProtectedRoute>
                    <DashboardLayout> 
                      <CreateOpportunity />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedRoute requiredRole="admin" unauthorizedPath="/dashboard">
                      <DashboardLayout>
                        <ManageJobs />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                   <DashboardLayout>  <Bookmarks /> </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/review"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardLayout>
                      <Reviews />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/review-applications"
                element={
                  <ProtectedRoute requiredRole="admin" unauthorizedPath="/dashboard">
                    <DashboardLayout>
                      <ReviewApplications />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <DashboardLayout> <Events /> </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donations"
                element={
                  <ProtectedRoute>
                    <DashboardLayout> <Donations /> </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messaging"
                element={
                  <ProtectedRoute>
                    <DashboardLayout> <Messaging /> </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <DashboardLayout> <Notifications /> </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute requiredRole="admin" unauthorizedPath="/dashboard">
                   <DashboardLayout> <Analytics /> </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin-only */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin" unauthorizedPath="/dashboard">
                    <DashboardLayout> <ManageUsers /> </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;