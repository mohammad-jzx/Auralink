import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { KidsLearnDashboard } from '../pages/KidsLearnDashboard';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KidsLearnDashboard />} />
        <Route path="/kids-learn" element={<KidsLearnDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};