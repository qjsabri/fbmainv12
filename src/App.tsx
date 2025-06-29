import React, { Suspense, lazy } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Spinner from "@/components/ui/Spinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ROUTES } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/ThemeProvider";
import { loadCriticalResources } from "@/utils/performance";

// Lazy-loaded pages for better performance
const Auth = lazy(() => import("./pages/Auth"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Friends = lazy(() => import("./pages/Friends"));
const Messages = lazy(() => import("./pages/Messages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Watch = lazy(() => import("./pages/Watch"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Groups = lazy(() => import("./pages/Groups"));
const Events = lazy(() => import("./pages/Events"));
const Saved = lazy(() => import("./pages/Saved"));
const Memories = lazy(() => import("./pages/Memories"));
const Recent = lazy(() => import("./pages/Recent"));
const Pages = lazy(() => import("./pages/Pages"));
const Settings = lazy(() => import("./pages/Settings"));
const Search = lazy(() => import("./pages/Search"));
const Gaming = lazy(() => import("./pages/Gaming"));
const Reels = lazy(() => import("./pages/Reels"));
const Weather = lazy(() => import("./pages/Weather"));
const Dating = lazy(() => import("./pages/Dating"));
const Jobs = lazy(() => import("./pages/Jobs"));
const BusinessManager = lazy(() => import("./pages/BusinessManager"));
const VideoWatch = lazy(() => import("./pages/VideoWatch"));
const ReelsWatch = lazy(() => import("./pages/ReelsWatch"));
const PageDetail = lazy(() => import("./pages/PageDetail"));
const GroupDetail = lazy(() => import("./pages/GroupDetail"));
const LiveStream = lazy(() => import("./pages/LiveStream"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center flex flex-col items-center">
      <Spinner size="lg" color="blue" />
      <p className="mt-3 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  React.useEffect(() => {
    // Load critical resources for performance
    loadCriticalResources();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <QueryProvider>
              <ThemeProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Auth route - no layout */}
                    <Route path={ROUTES.AUTH} element={<Auth />} />
                    
                    {/* Main routes with layout */}
                    <Route path={ROUTES.HOME} element={
                      <AppLayout>
                        <ErrorBoundary>
                          <Home />
                        </ErrorBoundary>
                      </AppLayout>
                    } />
                    <Route path={ROUTES.PROFILE} element={
                      <AppLayout>
                        <Profile />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.GROUPS} element={
                      <AppLayout>
                        <Groups />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.FRIENDS} element={
                      <AppLayout>
                        <Friends />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.MESSAGES} element={
                      <AppLayout>
                        <Messages />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.NOTIFICATIONS} element={
                      <AppLayout>
                        <Notifications />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.WATCH} element={
                      <AppLayout>
                        <Watch />
                      </AppLayout>
                    } />
                    
                    {/* Video watch page */}
                    <Route path="/watch/:videoId" element={
                      <AppLayout>
                        <VideoWatch />
                      </AppLayout>
                    } />
                    
                    <Route path={ROUTES.MARKETPLACE} element={
                      <AppLayout>
                        <Marketplace />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.EVENTS} element={
                      <AppLayout>
                        <Events />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.SAVED} element={
                      <AppLayout>
                        <Saved />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.MEMORIES} element={
                      <AppLayout>
                        <Memories />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.SETTINGS} element={
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    } />
                    
                    {/* Pages routes */}
                    <Route path="/pages" element={
                      <AppLayout>
                        <Pages />
                      </AppLayout>
                    } />
                    <Route path="/pages/:pageId" element={
                      <AppLayout>
                        <PageDetail />
                      </AppLayout>
                    } />
                    
                    {/* Groups routes */}
                    <Route path="/groups/:groupId" element={
                      <AppLayout>
                        <GroupDetail />
                      </AppLayout>
                    } />
                    
                    {/* Other routes */}
                    <Route path="/search" element={
                      <AppLayout>
                        <Search />
                      </AppLayout>
                    } />
                    <Route path="/gaming" element={
                      <AppLayout>
                        <Gaming />
                      </AppLayout>
                    } />
                    <Route path="/reels" element={
                      <AppLayout>
                        <Reels />
                      </AppLayout>
                    } />
                    <Route path="/reels/:reelId" element={<ReelsWatch />} />
                    <Route path="/recent" element={
                      <AppLayout>
                        <Recent />
                      </AppLayout>
                    } />
                    <Route path="/weather" element={
                      <AppLayout>
                        <Weather />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.DATING} element={
                      <AppLayout>
                        <Dating />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.JOBS} element={
                      <AppLayout>
                        <Jobs />
                      </AppLayout>
                    } />
                    <Route path={ROUTES.BUSINESS} element={
                      <AppLayout>
                        <BusinessManager />
                      </AppLayout>
                    } />
                    <Route path="/live" element={
                      <AppLayout>
                        <LiveStream />
                      </AppLayout>
                    } />
                    
                    {/* 404 route */}
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/not-found" replace />} />
                  </Routes>
                </Suspense>
                <Toaster 
                  position="top-right" 
                  closeButton 
                  richColors 
                  expand={false}
                  visibleToasts={3}
                />
              </ThemeProvider>
            </QueryProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;