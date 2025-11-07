import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Myaccount from "./pages/Myaccount";
import BusRoute from "./pages/Route";
import CreateRoute from "./pages/Createroute";
import BusManagementPage from "./pages/BusManagementPage";
import StudentListPage from "./pages/StudentListPage";
import CheckinPage from "./pages/CheckinPage";
import Notifications from "./pages/Notifications";
import NotificationFormPage from "./pages/NotificationFormPage";
import AccountFormPage from "./pages/AccountFormPage";
import StudentManager from "./pages/StudentManager";
import StudentFormPage from "./pages/StudentFormPage";
import AccountManager from "./pages/AccountManager";
import DriverLayout from "./components/DriverLayout";
import DriverDashboard from "./pages/DriverDashboard";
import ParentLayout from "./components/Parentlayout";
import ParentTracking from "./pages/ParentTracking"; 
import ParentNotification from "./pages/ParentNotification";

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.4 }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Các trang public */}
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />

          {/* Các trang quản trị */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Page><Dashboard /></Page>
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <DriverLayout>
                <Page><DriverDashboard /></Page>
              </DriverLayout>
            }
          />
          <Route
            path="/parent/tracking"
            element={
              <ParentLayout>
                <Page><ParentTracking/></Page>
              </ParentLayout>
            }
          />
          <Route
            path="/parent/notifications"
            element={
              <ParentLayout>
                <Page><ParentNotification/></Page>
              </ParentLayout>
            }
          />
          <Route
            path="/myaccount"
            element={
              <Layout>
                <Page><Myaccount /></Page>
              </Layout>
            }
          />
          <Route
            path="/route"
            element={
              <Layout>
                <Page><BusRoute /></Page>
              </Layout>
            }
          />
          <Route
            path="/createroute"
            element={
              <Layout>
                <Page><CreateRoute /></Page>
              </Layout>
            }
          />
          <Route
            path="/buses"
            element={
              <Layout>
                <Page><BusManagementPage /></Page>
              </Layout>
            }
          />
          
          {/* 2. Thêm Route cho trang danh sách sinh viên */}
          <Route
            path="/buses/:busId/students"
            element={
              <Layout>
                <Page><StudentListPage /></Page>
              </Layout>
            }
          />
          <Route
            path="/buses/:busId/checkin"
            element={
              <Layout>
                <Page><CheckinPage /></Page>
              </Layout>
            }
          />
           <Route
            path="/accounts"
            element={
              <Layout>
                <Page><AccountManager /></Page>
              </Layout>
            }
          />
          <Route
            path="/accounts/create"
            element={
              <Layout>
                <Page><AccountFormPage /></Page>
              </Layout>
            }
          />
          <Route
            path="/accounts/edit/:id"
            element={
              <Layout>
                <Page><AccountFormPage /></Page>
              </Layout>
            }
          />

          {/* Thông báo */}
          <Route
            path="/notifications"
            element={
              <Layout>
                <Page><Notifications /></Page>
              </Layout>
            }
          />
          <Route
            path="/notifications/create"
            element={
              <Layout>
                <Page><NotificationFormPage /></Page>
              </Layout>
            }
          />
          <Route
            path="/notifications/edit/:id"
            element={
              <Layout>
                <Page><NotificationFormPage /></Page>
              </Layout>
            }
          />

          <Route
            path="/students"
            element={
              <Layout>
                <Page><StudentManager /></Page>
              </Layout>
            }
          />
          <Route
            path="/students/create"
            element={
              <Layout>
                <Page><StudentFormPage /></Page>
              </Layout>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <Layout>
                <Page><StudentFormPage /></Page>
              </Layout>
            }
          />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 1000,
          style: {
            background: "#white",
            color: "black",
            borderRadius: "8px",
            fontSize: "16px",
            padding: "10px 20px",
          },
        }}
      />
    </>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

