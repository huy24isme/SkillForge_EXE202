import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CustomPlanPage } from './pages/CustomPlanPage';
import { API_PUBLIC_BASE } from './config/api';

function TrafficTracker() {
  useEffect(() => {
    const sessionTracked = sessionStorage.getItem('sf_traffic_tracked');
    if (sessionTracked) return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const utmSource = searchParams.get('utm_source') || '';
      const utmMedium = searchParams.get('utm_medium') || '';
      const utmCampaign = searchParams.get('utm_campaign') || '';
      const fbclid = searchParams.get('fbclid') || '';
      const ttclid = searchParams.get('ttclid') || '';
      const referrer = document.referrer || '';

      let source = 'direct';
      if (fbclid || utmSource.includes('facebook') || referrer.includes('facebook.com')) {
        source = 'facebook';
      } else if (ttclid || utmSource.includes('tiktok') || referrer.includes('tiktok.com')) {
        source = 'tiktok';
      } else if (utmSource.includes('linkedin') || referrer.includes('linkedin.com')) {
        source = 'linkedin';
      } else if (utmSource) {
        source = utmSource;
      }

      fetch(`${API_PUBLIC_BASE}/analytics/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          utmSource,
          utmMedium,
          utmCampaign,
          referrer,
        }),
      }).then(() => {
        sessionStorage.setItem('sf_traffic_tracked', 'true');
      }).catch(() => {
        // ignore background errors
      });
    } catch {
      // ignore
    }
  }, []);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <TrafficTracker />
      <Routes>
        {/* Standalone Landing Page */}
        <Route path="/" element={<LandingPage />} />
        {/* Dedicated Registration & Checkout Page */}
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Custom Enterprise Plan Consultation Page */}
        <Route path="/custom-plan" element={<CustomPlanPage />} />
        {/* Catch-all redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
