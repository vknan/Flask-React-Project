import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./Components/NavBar";
import Home from "./Components/Home";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import Dashboard from "./Authentication/Dashboard";
import About from "./Components/About";
import Blogs from "./Components/Blogs";
import Blog from "./Components/Blog"; 
import Modules from "./Components/Modules";
import Lessons from "./Components/Lessons";
import Search from "./Components/Search";
import NotFound from "./Components/NotFound";
import TextGenerator from "./Components/TextGenerator";
import ProtectedRoute from "./Authentication/ProtectedRoute";
import { Analytics } from "@vercel/analytics/react"
import Courses from "./Components/Courses";
// import CourseDashboard from "./Components/CourseDashboard";
// import LessonView from "./Components/LessonView_1";
import EnrolledCourses from "./Components/EnrolledCourses";
import { useSelector } from "react-redux";
import Logout from "./Authentication/Logout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WhatsAppChat from "./Components/WhatsAppChat";
import Sitemap from "./Components/sitemap";
import Terms from "./Components/Terms";
import PrivacyPolicy from "./Components/Privacy";
import { HelmetProvider } from 'react-helmet-async';
import ChatBot from "./Components/ChatBot";


function AppLayout() {
  const { isDarkMode } = useSelector((store) => store.ThemeSlice);

  return (
    <div className={`${isDarkMode ? 'bg-black' : 'bg-gray-50 brightness-105'}`}>
      <Navbar />
      <Outlet />
      <WhatsAppChat />
      <Analytics />
    </div>
  );
}

export const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "home",
            element: <EnrolledCourses />,
          },
          {
            path: "modules/:id",
            element: (
              <ProtectedRoute>
                <Modules />
              </ProtectedRoute>
            ),
          },
          {
            path: "lessons/:id",
            element: (
              <ProtectedRoute>
                <Lessons />
              </ProtectedRoute>
            ),
          },
          // {
          //   path: "lesson/:lessonId",
          //   element: (
          //     <ProtectedRoute>
          //       <LessonView />
          //     </ProtectedRoute>
          //   ),
          // },
          // {
          //   path: "courses",
          //   element: (
          //     <ProtectedRoute>
          //       <Courses />
          //     </ProtectedRoute>
          //   ),
          // },
          {
            path: "search/:keyword",
            element: (
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/chat",
        element: <ChatBot />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blogs/:id",
        element: <Blog />,
      },
      {
        path: "/terms",
        element: <Terms />
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />
      },
      // {
      //   path: "/sitemap",
      //   element: <Sitemap />,
      // },
      {
        path: '*',
        element: <NotFound />
      }
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={appRoutes} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
       />
    </HelmetProvider>
  );
}