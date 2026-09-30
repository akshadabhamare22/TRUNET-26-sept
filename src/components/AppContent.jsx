// import React from "react";
// import { Outlet } from "react-router-dom";
// import AppBreadcrumb from "./AppBreadcrumb";

// const AppContent = () => {
//   return (
//     <div className="w-full px-4 lg:px-6">
//       <AppBreadcrumb />

//       <Outlet />
//     </div>
//   );
// };

// export default AppContent;


import React from "react";
import { Outlet } from "react-router-dom";
import AppBreadcrumb from "./AppBreadcrumb";

const AppContent = () => {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-4">
      <AppBreadcrumb />

      <Outlet />
    </div>
  );
};

export default AppContent;