// import React, { Suspense } from "react";
// import {
//   HashRouter,
//   Navigate,
//   Route,
//   Routes,
// } from "react-router-dom";


// import ProtectedRoute from "./utils/ProtectedRoutes";
// import { AlertProvider } from "./context/AlertContext";
// import { AuthProvider } from "./context/AuthContext";

// import CenterSelection from "./views/pages/center-selection/CenterSelection";
// import routes from "./routes";

// const DefaultLayout = React.lazy(
//   () => import("./layout/DefaultLayout"),
// );

// const Login = React.lazy(
//   () => import("./views/pages/login/Login"),
// );

// const Page404 = React.lazy(
//   () => import("./views/pages/page404/Page404"),
// );

// const App = () => {
//   return (
//     <AlertProvider>
//       <AuthProvider>
//         <HashRouter>
//           <Suspense
//             fallback={
//               <div className="flex min-h-screen items-center justify-center">
//                 Loading...
//               </div>
//             }
//           >
//             <Routes>

//               {/* PUBLIC ROUTES */}
//               <Route
//                 path="/login"
//                 element={<Login />}
//               />

//               <Route
//                 path="/select-center"
//                 element={<CenterSelection />}
//               />

//               <Route
//                 path="/404"
//                 element={<Page404 />}
//               />

//               {/* PROTECTED APPLICATION */}
//               <Route
//                 element={
//                   <ProtectedRoute>
//                     <DefaultLayout />
//                   </ProtectedRoute>
//                 }
//               >
//                 {routes.map((route, index) => {
//                   if (!route?.element) {
//                     return null;
//                   }

//                   const Component = route.element;

//                   return (
//                     <Route
//                       key={`${route.path}-${index}`}
//                       path={route.path}
//                       element={<Component />}
//                     />
//                   );
//                 })}

//                 <Route
//                   path="*"
//                   element={
//                     <Navigate
//                       to="/dashboard"
//                       replace
//                     />
//                   }
//                 />
//               </Route>

//             </Routes>
//           </Suspense>
//         </HashRouter>
//       </AuthProvider>
//     </AlertProvider>
//   );
// };

// export default App;

import React, { Suspense } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./utils/ProtectedRoutes";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";

import CenterSelection from "./views/pages/center-selection/CenterSelection";
import routes from "./routes";

const DefaultLayout = React.lazy(
  () => import("./layout/DefaultLayout")
);

const Login = React.lazy(
  () => import("./views/pages/login/Login")
);

const Page404 = React.lazy(
  () => import("./views/pages/page404/Page404")
);

const App = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <HashRouter>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                Loading...
              </div>
            }
          >
            <Routes>

              {/* ================= PUBLIC ROUTES ================= */}

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/select-center"
                element={<CenterSelection />}
              />

              <Route
                path="/404"
                element={<Page404 />}
              />

              {/* ================= PROTECTED ROUTES ================= */}

              <Route element={<ProtectedRoute />}>
                <Route element={<DefaultLayout />}>
                  {routes.map((route, index) => {
                    if (!route?.element) {
                      return null;
                    }

                    const Component = route.element;

                    return (
                      <Route
                        key={`${route.path}-${index}`}
                        path={route.path}
                        element={<Component />}
                      />
                    );
                  })}

                  {/* Fallback for protected routes */}
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/dashboard"
                        replace
                      />
                    }
                  />
                </Route>
              </Route>

              {/* ================= GLOBAL FALLBACK ================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/login"
                    replace
                  />
                }
              />

            </Routes>
          </Suspense>
        </HashRouter>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;