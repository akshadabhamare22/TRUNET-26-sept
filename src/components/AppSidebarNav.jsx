import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const getBadgeClass = (color) => {
  const badgeClasses = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-600 text-white",
    success: "bg-green-600 text-white",
    danger: "bg-red-600 text-white",
    warning: "bg-yellow-400 text-gray-900",
    info: "bg-cyan-600 text-white",
    light: "bg-gray-100 text-gray-900",
    dark: "bg-gray-800 text-white",
  };

  return badgeClasses[color] || badgeClasses.primary;
};

export const AppSidebarNav = ({
  items,
  unfoldable = false,
}) => {
  const navLink = (
    name,
    icon,
    badge,
    indent = false
  ) => {
    return (
      <>
        {icon ? (
          <span
            className="
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center
              text-[17px]
            "
          >
            {icon}
          </span>
        ) : (
          indent &&
          !unfoldable && (
            <span className="flex w-5 shrink-0 items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            </span>
          )
        )}

        {!unfoldable && name && (
          <span className="min-w-0 flex-1 truncate">
            {name}
          </span>
        )}

        {!unfoldable && badge && (
          <span
            className={`
              ml-auto
              inline-flex
              items-center
              rounded-full
              px-2
              py-0.5
              text-xs
              font-medium
              ${getBadgeClass(badge.color)}
            `}
          >
            {badge.text}
          </span>
        )}
      </>
    );
  };

  const navItem = (
    item,
    index,
    indent = false
  ) => {
    const {
      name,
      icon,
      badge,
      to,
      href,
      target,
      end,
    } = item;

    if (href) {
      return (
        <a
          key={`${name || "external"}-${index}`}
          href={href}
          target={target}
          rel={
            target === "_blank"
              ? "noopener noreferrer"
              : undefined
          }
          title={unfoldable ? name : undefined}
          className={`
            flex
            h-[40px]
            w-full
            items-center
            gap-3
            px-4
            text-[14px]
            font-normal
            text-white/85
            transition-colors
            duration-150
            hover:bg-white/5
            hover:text-white

            ${unfoldable ? "justify-center px-0" : ""}
            ${indent && !unfoldable ? "pl-10" : ""}
          `}
        >
          {navLink(
            name,
            icon,
            badge,
            indent
          )}
        </a>
      );
    }

    if (to) {
      return (
        <NavLink
          key={`${to}-${index}`}
          to={to}
          end={end}
          title={unfoldable ? name : undefined}
          className={({ isActive }) => `
            flex
            h-[40px]
            w-full
            items-center
            gap-3
            px-4
            text-[14px]
            font-normal
            transition-colors
            duration-150

            ${
              isActive
                ? "bg-[#0d6efd] text-white"
                : "text-white/85 hover:bg-white/5 hover:text-white"
            }

            ${unfoldable ? "justify-center px-0" : ""}
            ${indent && !unfoldable ? "pl-10" : ""}
          `}
        >
          {navLink(
            name,
            icon,
            badge,
            indent
          )}
        </NavLink>
      );
    }

    return (
      <div
        key={`${name || "item"}-${index}`}
        title={unfoldable ? name : undefined}
        className={`
          flex
          h-[40px]
          w-full
          items-center
          gap-3
          px-4
          text-[14px]
          font-normal
          text-white/85

          ${unfoldable ? "justify-center px-0" : ""}
          ${indent && !unfoldable ? "pl-10" : ""}
        `}
      >
        {navLink(
          name,
          icon,
          badge,
          indent
        )}
      </div>
    );
  };

  const navGroup = (item, index) => {
    const {
      name,
      icon,
      items: children = [],
    } = item;

    if (unfoldable) {
      return (
        <div
          key={`${name || "group"}-${index}`}
          className="
            flex
            h-[40px]
            w-full
            items-center
            justify-center
            text-white/85
          "
          title={name}
        >
          {icon && (
            <span
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                text-[17px]
              "
            >
              {icon}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        key={`${name || "group"}-${index}`}
        className="w-full"
      >
        <details className="group">
          <summary
            className="
              flex
              h-[40px]
              cursor-pointer
              list-none
              items-center
              gap-3
              px-4
              text-[14px]
              font-semibold
              text-white/85
              transition-colors
              duration-150
              hover:bg-white/5
              hover:text-white
              [&::-webkit-details-marker]:hidden
            "
          >
            {icon && (
              <span
                className="
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  text-[17px]
                "
              >
                {icon}
              </span>
            )}

            {name && (
              <span className="min-w-0 flex-1 truncate">
                {name}
              </span>
            )}

            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                text-base
                transition-transform
                duration-200
                group-open:rotate-90
              "
            >
              ›
            </span>
          </summary>

          <div className="pb-0">
            {children.map(
              (child, childIndex) =>
                child?.items
                  ? navGroup(
                      child,
                      childIndex
                    )
                  : navItem(
                      child,
                      childIndex,
                      true
                    )
            )}
          </div>
        </details>
      </div>
    );
  };

  return (
    <nav className="w-full py-1">
      {items?.map((item, index) =>
        item?.items
          ? navGroup(item, index)
          : navItem(item, index)
      )}
    </nav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,

  unfoldable: PropTypes.bool,
};

export default AppSidebarNav;