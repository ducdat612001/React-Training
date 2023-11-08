import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  Home,
  Analytics,
  Invoice,
  Schedule,
  Calendar,
  Messages,
  Notification,
  Settings,
} from "@pages";

const Routers = ({onShowToast}) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/analytics" />} />
      <Route path="/" element={<Home />} />
      <Route path="/analytics" element={<Analytics onShowToast={onShowToast} />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default Routers;
