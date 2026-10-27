import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppSidebarNav } from "./AppSidebarNav";
import getNav from "../_nav";
import { AuthContext } from "../context/AuthContext";

const AppSidebar = () => {
  const dispatch = useDispatch();

  const sidebarShow = useSelector(
    (state) => state.sidebarShow
  );

  const unfoldable = useSelector(
    (state) => state.sidebarUnfoldable ?? false
  );

  const { permissions } = useContext(AuthContext);

  const navItems = getNav(permissions);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-[1030]
          flex
          h-screen
          flex-col
          bg-[#212631]
          text-white
          transition-all
          duration-300
          ease-in-out

          ${
            sidebarShow
              ? unfoldable
                ? "w-[56px]"
                : "w-64"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div
          className={`
            flex
            h-[64px]
            shrink-0
            items-center
            border-b
            border-white/10
            bg-[#2759a2]
            px-4

            ${
              unfoldable
                ? "justify-center"
                : "justify-start"
            }
          `}
        >
          {!unfoldable ? (
            <span
              className="text-[20px] text-white"
              style={{
                fontFamily:
                  '"Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              Trunet Stock
            </span>
          ) : (
            <span className="text-[20px] text-white">
              T
            </span>
          )}
        </div>

        {/* Navigation */}
       <div
  className="
    sidebar-scroll
    min-h-0
    flex-1
    overflow-y-auto
    overflow-x-hidden
  "
>
  <AppSidebarNav
    items={navItems}
    unfoldable={unfoldable}
  />
</div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarShow && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            dispatch({
              type: "set",
              sidebarShow: false,
            })
          }
          className="
            fixed
            inset-0
            z-[1020]
            bg-black/40
            lg:hidden
          "
        />
      )}
    </>
  );
};

export default React.memo(AppSidebar);