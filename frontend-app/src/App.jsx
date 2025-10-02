import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Các trang public không dùng layout */}
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />

        {/* Các trang quản trị: bọc bằng Layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Page><Dashboard /></Page>
            </Layout>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
