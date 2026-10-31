import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Minus,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axiosInstance from "../../../axiosInstance";
import { AuthContext } from "../../../context/AuthContext";

// ==================================================
// Permission Configuration
// ==================================================

const permissionModules = [
  {
    module: "Adjustment",
    permissions: [
      {
        label:
          "View stock Adjustment for own center",
        name: "view_stock_adjustment_own_center",
        description:
          "View stock Adjustment for own center",
      },
      {
        label:
          "View stock Adjustment for all center",
        name: "view_stock_adjustment_all_center",
        description:
          "View stock Adjustment for all center",
      },
      {
        label:
          "Manage stock Adjustment for own center",
        name: "manage_stock_adjustment_own_center",
        description:
          "Manage stock Adjustment for own center",
      },
      {
        label:
          "Manage stock Adjustment for all center",
        name: "manage_stock_adjustment_all_center",
        description:
          "Manage stock Adjustment for all center",
      },
    ],
  },

  {
    module: "Admin",
    permissions: [
      {
        label: "Is Admin",
        name: "is_admin",
        description: "Is Admin",
      },
    ],
  },

  {
    module: "Available Stock",
    permissions: [
      {
        label:
          "View available stock of own center",
        name: "available_stock_own_center",
        description:
          "View available stock of own center",
      },
      {
        label:
          "View available stock of all center",
        name: "available_stock_all_center",
        description:
          "View available stock of all center",
      },
    ],
  },

  {
    module: "Center",
    permissions: [
      {
        label: "View own center",
        name: "view_own_center",
        description: "View own center",
      },
      {
        label: "View all center",
        name: "view_all_center",
        description: "View all center",
      },
      {
        label: "Manage own center",
        name: "manage_own_center",
        description: "Manage own center",
      },
      {
        label: "Manage all center",
        name: "manage_all_center",
        description: "Manage all center",
      },
    ],
  },

  {
    module: "Closing",
    permissions: [
      {
        label:
          "View closing stock of own center",
        name: "view_closing_stock_own_center",
        description:
          "View closing stock of own center",
      },
      {
        label:
          "View closing stock of all center",
        name: "view_closing_stock_all_center",
        description:
          "View closing stock of all center",
      },
      {
        label:
          "Manage closing stock of own center",
        name: "manage_closing_stock_own_center",
        description:
          "Manage closing stock of own center",
      },
      {
        label:
          "Manage closing stock of all center",
        name: "manage_closing_stock_all_center",
        description:
          "Manage closing stock of all center",
      },
      {
        label:
          "Can change closing stock qty",
        name: "change_closing_qty",
        description:
          "Can change closing stock qty",
      },
    ],
  },

  {
    module: "Customer",
    permissions: [
      {
        label:
          "View customer of own center",
        name: "view_customer_own_center",
        description:
          "View customer of own center",
      },
      {
        label:
          "View customer of all center",
        name: "view_customer_all_center",
        description:
          "View customer of all center",
      },
      {
        label:
          "Manage customer of all center",
        name: "manage_customer_all_center",
        description:
          "Manage customer of all center",
      },
      {
        label:
          "Manage customer of own center",
        name: "manage_customer_own_center",
        description:
          "Manage customer of own center",
      },
    ],
  },

  {
    module: "Indent",
    permissions: [
      {
        label:
          "View indent for own center",
        name: "indent_own_center",
        description:
          "View indent for own center",
      },
      {
        label:
          " View indent for all center",
        name: "indent_all_center",
        description:
          " View indent for all center",
      },
      {
        label: "Manage indent",
        name: "manage_indent",
        description: "Manage indent",
      },
      {
        label: "Complete Indent",
        name: "complete_indent",
        description: "Complete Indent",
      },
      {
        label:
          "Stock Transfer Approve from Outlet",
        name: "stock_transfer_approve_from_outlet",
        description:
          "Stock Transfer Approve from Outlet",
      },
      {
        label:
          "Delete indent for own center",
        name: "delete_indent_own_center",
        description:
          "Delete indent for own center",
      },
      {
        label:
          "Delete indent for all center",
        name: "delete_indent_all_center",
        description:
          "Delete indent for all center",
      },
    ],
  },

  {
    module: "Payment",
    permissions: [
      {
        label:
          "View payment of own center",
        name: "view_payment_own_center",
        description:
          "View payment of own center",
      },
      {
        label:
          "View payment of all center",
        name: "view_payment_all_center",
        description:
          "View payment of all center",
      },
      {
        label:
          "Manage payment of own center",
        name: "manage_payment_own_center",
        description:
          "Manage payment of own center",
      },
      {
        label:
          "Can approve received payments",
        name: "approve_received_payments",
        description:
          "Can approve received payments",
      },
    ],
  },

  {
    module: "Purchase",
    permissions: [
      {
        label: "Add Purchase stock",
        name: "add_purchase_stock",
        description: "Add Purchase stock",
      },
      {
        label:
          "View own purchase stock",
        name: "view_own_purchase_stock",
        description:
          "View own purchase stock",
      },
      {
        label:
          "View all purchase stock",
        name: "view_all_purchase_stock",
        description:
          "View all purchase stock",
      },
    ],
  },

  {
    module: "Report",
    permissions: [
      {
        label: "View Own Report",
        name: "view_own_report",
        description: "View Own Report",
      },
      {
        label: "View All Report",
        name: "view_all_report",
        description: "View All Report",
      },
      {
        label: "View Outlet Stock",
        name: "view_outlet_stock",
        description:
          "View Outlet Stock",
      },
    ],
  },

  {
    module: "Sales",
    permissions: [
      {
        label:
          "View sales of own center",
        name: "view_sales_own_center",
        description:
          "View sales of own center",
      },
      {
        label:
          "View sales of all center",
        name: "view_sales_all_center",
        description:
          "View sales of all center",
      },
      {
        label:
          "Manage sales of own center",
        name: "manage_sales_own_center",
        description:
          "Manage sales of own center",
      },
    ],
  },

  {
    module: "Settings",
    permissions: [
      {
        label: "Manage user",
        name: "manage_user",
        description: "Manage user",
      },
      {
        label: "Manage masters data",
        name: "manage_masters_data",
        description:
          "Manage masters data",
      },
      {
        label: "Manage vendors",
        name: "manage_vendors",
        description:
          "Manage vendors",
      },
      {
        label:
          "View Building Own Center",
        name: "view_building_own_center",
        description:
          "View Building Own Center",
      },
      {
        label:
          "View Building All Center",
        name: "view_building_all_center",
        description:
          "View Building All Center",
      },
      {
        label:
          "Manage Building All Center",
        name: "manage_building_all_center",
        description:
          "Manage Building All Center",
      },
      {
        label:
          "Manage Building Own Center",
        name: "manage_building_own_center",
        description:
          "Manage Building Own Center",
      },
      {
        label:
          "View Control Room Own Center",
        name: "view_control_room_own_center",
        description:
          "View Control Room Own Center",
      },
      {
        label:
          "View Control Room All Center",
        name: "view_control_room_all_center",
        description:
          "View Control Room All Center",
      },
      {
        label:
          "Manage Control Room Own Center",
        name: "manage_control_room_own_center",
        description:
          "Manage Control Room Own Center",
      },
      {
        label:
          "Manage Control Room All Center",
        name: "manage_control_room_all_center",
        description:
          "Manage Control Room All Center",
      },
    ],
  },

  {
    module: "Shifting",
    permissions: [
      {
        label:
          "View Shifting Own Center",
        name: "view_shifting_own_center",
        description:
          "View Shifting Own Center",
      },
      {
        label:
          "View Shifting All Center",
        name: "view_shifting_all_center",
        description:
          "View Shifting All Center",
      },
      {
        label:
          "Manage Shifting Own Center",
        name: "manage_shifting_own_center",
        description:
          "Manage Shifting Own Center",
      },
      {
        label:
          "Manage Shifting All Center",
        name: "manage_shifting_all_center",
        description:
          "Manage Shifting All Center",
      },
      {
        label:
          "Accept Shifting All Center",
        name: "accept_shifting_all_center",
        description:
          "Accept Shifting All Center",
      },
      {
        label:
          "Accept Shifting Own Center",
        name: "accept_shifting_own_center",
        description:
          "Accept Shifting Own Center",
      },
    ],
  },

  {
    module: "Transfer",
    permissions: [
      {
        label:
          "View stock transfer for own center",
        name: "stock_transfer_own_center",
        description:
          "View stock transfer for own center",
      },
      {
        label:
          "View stock transfer for all center",
        name: "stock_transfer_all_center",
        description:
          "View stock transfer for all center",
      },
      {
        label:
          "Manage stock transfer for own center",
        name: "manage_stock_transfer_own_center",
        description:
          "Manage stock transfer for own center",
      },
      {
        label:
          "Manage stock transfer for all center",
        name: "manage_stock_transfer_all_center",
        description:
          "Manage stock transfer for all center",
      },
      {
        label:
          "Approval of transfer to center",
        name: "approval_transfer_center",
        description:
          "Approval of transfer to center",
      },
      {
        label:
          "Delete transfer for own center",
        name: "delete_transfer_own_center",
        description:
          "Delete transfer for own center",
      },
      {
        label:
          "Delete transfer for all center",
        name: "delete_transfer_all_center",
        description:
          "Delete transfer for all center",
      },
    ],
  },

  {
    module: "Usage",
    permissions: [
      {
        label:
          "View internal Usage of own center",
        name: "view_usage_own_center",
        description:
          "View internal usage of own center",
      },
      {
        label:
          "View internal Usage of all center",
        name: "view_usage_all_center",
        description:
          "View internal usage of all center",
      },
      {
        label:
          "Manage usage of own center",
        name: "manage_usage_own_center",
        description:
          "Manage usage of own center",
      },
      {
        label:
          "Manage usage of all center",
        name: "manage_usage_all_center",
        description:
          "Manage usage of all center",
      },
      {
        label:
          "Accept damage return",
        name: "accept_damage_return",
        description:
          "Accept damage return",
      },
      {
        label:
          "Manage import usage",
        name: "manage_import_usage",
        description:
          "Manage import usage",
      },
      {
        label: " Allow Edit Usage",
        name: "allow_edit_usage",
        description:
          "Alllow Edit Usage",
      },
    ],
  },

  {
    module: "Testing Material",
    permissions: [
      {
        label:
          "Create Testing Request",
        name: "create_testing_request",
        description:
          "Create Testing Request",
      },
      {
        label:
          "View Testing Request",
        name: "view_testing_request",
        description:
          "View Testing Request",
      },
      {
        label:
          "Accept Testing Request",
        name: "accept_testing_request",
        description:
          "Accept Testing Request",
      },
    ],
  },

  {
    module: "Audit Logs",
    permissions: [
      {
        label:
          "View all audit logs",
        name: "view_audit_logs_all",
        description:
          "View all audit logs",
      },
      {
        label:
          "View audit logs own center",
        name: "view_audit_logs_own_center",
        description:
          "View audit logs own center",
      },
      {
        label:
          "View own audit logs",
        name: "view_audit_logs_own",
        description:
          "View own audit logs",
      },
    ],
  },
];

// ==================================================
// Add Role Component
// ==================================================

const AddRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] =
    useState({
      roleTitle: "",
      permissions: [],
    });

  const [errors, setErrors] =
    useState({});

  const [alert, setAlert] =
    useState({
      type: "",
      message: "",
    });

  const {
    refreshPermissions,
  } = useContext(AuthContext);

  const selectAllRef = useRef(null);

  // --------------------------------------------------
  // Fetch Role
  // --------------------------------------------------
  useEffect(() => {
    if (id) {
      fetchRole(id);
    }
  }, [id]);

  const fetchRole = async (
    itemId,
  ) => {
    try {
      const res =
        await axiosInstance.get(
          `/role/${itemId}`,
        );

      const data = res.data.data;

      const selectedPermissions =
        data.permissions?.flatMap(
          (modulePerm) =>
            modulePerm.permissions ||
            [],
        ) || [];

      setFormData({
        roleTitle:
          data.roleTitle || "",
        permissions:
          selectedPermissions,
      });
    } catch (error) {
      console.error(
        "Error fetching role data:",
        error,
      );

      setAlert({
        type: "danger",
        message:
          error.response?.data
            ?.message ||
          "Failed to fetch role data.",
      });
    }
  };

  // --------------------------------------------------
  // Role Title Change
  // --------------------------------------------------
  const handleRoleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // --------------------------------------------------
  // Toggle Individual Permission
  // --------------------------------------------------
  const togglePermission = (
    permName,
  ) => {
    setFormData((prev) => {
      const newPermissions =
        prev.permissions.includes(
          permName,
        )
          ? prev.permissions.filter(
              (permission) =>
                permission !==
                permName,
            )
          : [
              ...prev.permissions,
              permName,
            ];

      return {
        ...prev,
        permissions:
          newPermissions,
      };
    });
  };

  // --------------------------------------------------
  // Toggle All Permissions in Module
  // --------------------------------------------------
  const toggleModuleAll = (
    module,
  ) => {
    const modulePermissions =
      module.permissions.map(
        (permission) =>
          permission.name,
      );

    const allSelected =
      modulePermissions.every(
        (permission) =>
          formData.permissions.includes(
            permission,
          ),
      );

    setFormData((prev) => {
      let updatedPermissions;

      if (allSelected) {
        updatedPermissions =
          prev.permissions.filter(
            (permission) =>
              !modulePermissions.includes(
                permission,
              ),
          );
      } else {
        updatedPermissions =
          Array.from(
            new Set([
              ...prev.permissions,
              ...modulePermissions,
            ]),
          );
      }

      return {
        ...prev,
        permissions:
          updatedPermissions,
      };
    });
  };

  // --------------------------------------------------
  // All Permissions
  // --------------------------------------------------
  const getAllPermissions =
    () =>
      permissionModules.flatMap(
        (module) =>
          module.permissions.map(
            (permission) =>
              permission.name,
          ),
      );

  const allPermissions =
    getAllPermissions();

  const isAllSelected =
    allPermissions.length > 0 &&
    allPermissions.every(
      (permission) =>
        formData.permissions.includes(
          permission,
        ),
    );

  const isSomeSelected =
    formData.permissions.length >
      0 && !isAllSelected;

  // --------------------------------------------------
  // Select / Deselect All
  // --------------------------------------------------
  const toggleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: isAllSelected
        ? []
        : allPermissions,
    }));
  };

  // Keep checkbox indeterminate state
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        isSomeSelected;
    }
  }, [isSomeSelected]);

  // --------------------------------------------------
  // Module Selected State
  // --------------------------------------------------
  const isModuleSelected = (
    module,
  ) => {
    const modulePermissions =
      module.permissions.map(
        (permission) =>
          permission.name,
      );

    return (
      modulePermissions.length >
        0 &&
      modulePermissions.every(
        (permission) =>
          formData.permissions.includes(
            permission,
          ),
      )
    );
  };

  // --------------------------------------------------
  // Transform API Payload
  // --------------------------------------------------
  const transformFormDataForAPI =
    (data) => {
      const permissionsByModule =
        permissionModules
          .map((module) => {
            const modulePermissions =
              module.permissions
                .filter(
                  (permission) =>
                    data.permissions.includes(
                      permission.name,
                    ),
                )
                .map(
                  (permission) =>
                    permission.name,
                );

            return {
              module: module.module,
              permissions:
                modulePermissions,
            };
          })
          .filter(
            (module) =>
              module.permissions
                .length > 0,
          );

      return {
        roleTitle:
          data.roleTitle,
        permissions:
          permissionsByModule,
      };
    };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  const handleSubmit = async (
    e,
  ) => {
    e.preventDefault();

    const newErrors = {};

    if (
      !formData.roleTitle.trim()
    ) {
      newErrors.roleTitle =
        "This is a required field";
    }

    if (
      Object.keys(newErrors)
        .length
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      const apiData =
        transformFormDataForAPI(
          formData,
        );

      if (id) {
        await axiosInstance.put(
          `/role/${id}`,
          apiData,
        );

        await refreshPermissions();

        setAlert({
          type: "success",
          message:
            "Role updated successfully!",
        });
      } else {
        await axiosInstance.post(
          "/role",
          apiData,
        );

        setAlert({
          type: "success",
          message:
            "Role added successfully!",
        });
      }

      setTimeout(() => {
        navigate("/role-list");
      }, 1500);
    } catch (error) {
      console.error(
        "Error saving Data:",
        error,
      );

      let message =
        "Failed to save Data. Please try again!";

      if (error.response) {
        message =
          error.response.data
            ?.message ||
          error.response.data
            ?.error ||
          message;
      } else if (error.request) {
        message =
          "No response from server. Please check your connection.";
      } else {
        message =
          error.message ||
          message;
      }

      setAlert({
        type: "danger",
        message,
      });
    }
  };

  // --------------------------------------------------
  // Back
  // --------------------------------------------------
  const handleBack = () => {
    navigate("/role-list");
  };

  // --------------------------------------------------
  // UI
  return (
    <div className="w-full bg-[#f4f5f7] px-4 py-2 md:px-2">
      {/* Page Title */}
<div className="mb-4 text-[24px] font-[450] leading-tight text-[#212529]">       
        {/* <button
          type="button"
          onClick={handleBack}
          className="
            inline-flex
            h-[36px]
            items-center
            gap-[4px]
            rounded-[4px]
            bg-[#2f64ad]
            px-[10px]
            text-[15px]
            font-medium
            text-white
            transition-all
            duration-200
            hover:bg-[#245494]
            focus:outline-none
          "
        >
          <ArrowLeft size={17} strokeWidth={2} />
          Back
        </button> */}

        <span>{id ? "Edit Role" : "Add Role"}</span>
      </div>

      {/* Main Card */}
      <div
        className="
          overflow-hidden
          rounded-[2px]
          border
          border-[#e0e4e8]
          bg-white
          shadow-[0_2px_6px_rgba(0,0,0,0.08)]
        "
      >
        {/* Blue top border */}
        <div className="h-[4px] w-full bg-[#2f64ad]" />

        <div className="p-[21px]">
          {/* Alert */}
          {alert.message && (
            <div
              className={`mb-[18px] flex items-start justify-between rounded-[3px] border px-[13px] py-[10px] text-[14px] ${
                alert.type === "success"
                  ? "border-[#b7dfc5] bg-[#effaf2] text-[#176b35]"
                  : "border-[#f0b8b8] bg-[#fff1f1] text-[#b42318]"
              }`}
            >
              <span>{alert.message}</span>

              <button
                type="button"
                onClick={() =>
                  setAlert({
                    type: "",
                    message: "",
                  })
                }
                className="ml-4 text-[18px] leading-none opacity-60 transition hover:opacity-100"
                aria-label="Close alert"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Title */}
            <div className="mb-[22px] w-full">
              <label
                htmlFor="roleTitle"
                className={`mb-[8px] block text-[16px] font-semibold ${
                  errors.roleTitle
                    ? "text-red-600"
                    : "text-[#202124]"
                }`}
              >
                Role Title
                <span className="ml-[3px] text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                id="roleTitle"
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleRoleChange}
                className={`
                  h-[40px]
                  w-full
                  rounded-[2px]
                  border
                  bg-white
                  px-[11px]
                  text-[15px]
                  text-[#222]
                  outline-none
                  transition
                  ${
                    errors.roleTitle
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#d8dadd] focus:border-[#2f64ad]"
                  }
                `}
              />

              {errors.roleTitle && (
                <p className="mt-[5px] text-[12px] text-red-600">
                  {errors.roleTitle}
                </p>
              )}
            </div>

            {/* Permission Table */}
            <div
              className="
                overflow-hidden
                rounded-[3px]
                border
                border-[#d5d8dc]
                bg-white
              "
            >
              <div
                className="
                  max-h-[540px]
                  overflow-y-auto
                  overflow-x-hidden
                  scrollbar-thin
                  scrollbar-track-[#f1f1f1]
                  scrollbar-thumb-[#a5a5a5]
                "
              >
                <table className="w-full table-fixed border-collapse text-[15px]">
                  {/* Header */}
                  <thead className="sticky top-0 z-30 bg-[#f7f7f7]">
                    <tr>
                      <th
                        className="
                          w-[5%]
                          border-b
                          border-r
                          border-[#d5d8dc]
                          px-[9px]
                          py-[11px]
                          text-center
                        "
                      >
                        <input
                          ref={selectAllRef}
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={toggleSelectAll}
                          title="Select All Permissions"
                          className="
                            h-[17px]
                            w-[17px]
                            cursor-pointer
                            rounded-[2px]
                            border-[#999]
                            accent-[#2f64ad]
                          "
                        />
                      </th>

                      <th
                        className="
                          w-[30%]
                          border-b
                          border-r
                          border-[#d5d8dc]
                          px-[11px]
                          py-[11px]
                          text-left
                          text-[16px]
                          font-bold
                          text-[#151515]
                        "
                      >
                        Permission
                      </th>

                      <th
                        className="
                          w-[30%]
                          border-b
                          border-r
                          border-[#d5d8dc]
                          px-[11px]
                          py-[11px]
                          text-left
                          text-[16px]
                          font-bold
                          text-[#151515]
                        "
                      >
                        Machine Name
                      </th>

                      <th
                        className="
                          w-[35%]
                          border-b
                          border-[#d5d8dc]
                          px-[11px]
                          py-[11px]
                          text-left
                          text-[16px]
                          font-bold
                          text-[#151515]
                        "
                      >
                        Description
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {permissionModules.map(
                      (module, moduleIndex) => {
                        const moduleSelected =
                          isModuleSelected(module);

                        return (
                          <React.Fragment
                            key={moduleIndex}
                          >
                            {/* Module Header */}
                            <tr>
                              <td
                                colSpan={4}
                                className="
                                  border-b
                                  border-[#e0d6ad]
                                  bg-[#fff8dc]
                                  px-[11px]
                                  py-[10px]
                                "
                              >
                                <label
                                  className="
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-[8px]
                                    text-[16px]
                                    font-bold
                                    text-[#171717]
                                  "
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      moduleSelected
                                    }
                                    onChange={() =>
                                      toggleModuleAll(
                                        module,
                                      )
                                    }
                                    className="
                                      h-[17px]
                                      w-[17px]
                                      cursor-pointer
                                      rounded-[2px]
                                      border-[#999]
                                      accent-[#2f64ad]
                                    "
                                  />

                                  {module.module}
                                </label>
                              </td>
                            </tr>

                            {/* Permissions */}
                            {module.permissions.map(
                              (
                                permission,
                                permissionIndex,
                              ) => {
                                const checked =
                                  formData.permissions.includes(
                                    permission.name,
                                  );

                                return (
                                  <tr
                                    key={
                                      permissionIndex
                                    }
                                    className="
                                      bg-white
                                      transition-colors
                                      hover:bg-[#f4f8fc]
                                    "
                                  >
                                    {/* Checkbox */}
                                    <td
                                      className="
                                        border-b
                                        border-r
                                        border-[#d9dce0]
                                        px-[9px]
                                        py-[9px]
                                        text-center
                                        align-middle
                                      "
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                          togglePermission(
                                            permission.name,
                                          )
                                        }
                                        className="
                                          h-[17px]
                                          w-[17px]
                                          cursor-pointer
                                          rounded-[2px]
                                          border-[#999]
                                          accent-[#2f64ad]
                                        "
                                      />
                                    </td>

                                    {/* Permission */}
                                    <td
                                      className="
                                        border-b
                                        border-r
                                        border-[#d9dce0]
                                        px-[10px]
                                        py-[9px]
                                        align-middle
                                        text-[15px]
                                        leading-[21px]
                                        text-[#111]
                                      "
                                    >
                                      {permission.label}
                                    </td>

                                    {/* Machine Name */}
                                    <td
                                      className="
                                        border-b
                                        border-r
                                        border-[#d9dce0]
                                        px-[10px]
                                        py-[9px]
                                        align-middle
                                        font-mono
                                        text-[13px]
                                        leading-[20px]
                                        text-[#222]
                                        break-words
                                      "
                                    >
                                      {permission.name}
                                    </td>

                                    {/* Description */}
                                    <td
                                      className="
                                        border-b
                                        border-[#d9dce0]
                                        px-[10px]
                                        py-[9px]
                                        align-middle
                                        text-[15px]
                                        leading-[21px]
                                        text-[#111]
                                      "
                                    >
                                      {permission.description}
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                          </React.Fragment>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div
              className="
                mt-[18px]
                flex
                justify-end
                border-t
                border-[#e2e2e2]
                pt-[18px]
              "
            >
              <button
                type="submit"
                className="
                  inline-flex
                  h-[40px]
                  items-center
                  gap-[7px]
                  rounded-[4px]
                  bg-[#b52b27]
                  px-[20px]
                  text-[15px]
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#98231f]
                  focus:outline-none
                "
              >
                <Check
                  size={17}
                  strokeWidth={2}
                />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddRole;
