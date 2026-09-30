import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import axiosInstance from "../../../axiosInstance";
import backgroundImage from "../../../assets/images/background.jpg";
import logo from "../../../assets/images/logo.png";
import { AuthContext } from "../../../context/AuthContext";

const CenterSelection = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const navigate = useNavigate();
  const { refreshPermissions } =
    useContext(AuthContext);

  // --------------------------------------------------
  // Load centers
  // --------------------------------------------------
  useEffect(() => {
    const tempToken =
      localStorage.getItem("tempToken");

    const regularToken =
      localStorage.getItem("token");

    if (tempToken) {
      setIsSwitching(false);
      loadCentersFromTempToken();
    } else if (regularToken) {
      setIsSwitching(true);
      loadCentersFromRegularToken();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // --------------------------------------------------
  // Load centers during initial login
  // --------------------------------------------------
  const loadCentersFromTempToken = async () => {
    try {
      const userTemp =
        localStorage.getItem("userTemp");

      if (!userTemp) {
        setError(
          "User session expired. Please login again.",
        );

        setTimeout(
          () => navigate("/login"),
          2000,
        );

        return;
      }

      const user = JSON.parse(userTemp);

      setUserInfo(user);

      if (
        Array.isArray(user.accessibleCenters)
      ) {
        setCenters(user.accessibleCenters);

        // Preserve accessible centers
        const existingUser = JSON.parse(
          localStorage.getItem("user") || "{}",
        );

        const mergedUser = {
          ...existingUser,
          ...user,
          accessibleCenters:
            user.accessibleCenters,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(mergedUser),
        );
      }

      // Automatically select if only one center
      if (
        Array.isArray(user.accessibleCenters) &&
        user.accessibleCenters.length === 1
      ) {
        handleCenterSelect(
          user.accessibleCenters[0]._id,
        );
      }
    } catch (error) {
      console.error(
        "Error loading centers:",
        error,
      );

      setError(
        "Error loading centers. Please login again.",
      );

      setTimeout(
        () => navigate("/login"),
        2000,
      );
    }
  };

  // --------------------------------------------------
  // Load centers during center switching
  // --------------------------------------------------
  const loadCentersFromRegularToken =
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response =
          await axiosInstance.get("/auth/me");

        if (response.data?.success) {
          const apiUser =
            response.data.data.user;

          // Get existing user from localStorage
          const storedUser =
            JSON.parse(
              localStorage.getItem("user") ||
                "{}",
            );

          // Preserve accessibleCenters
          const accessibleCenters =
            Array.isArray(
              apiUser?.accessibleCenters,
            )
              ? apiUser.accessibleCenters
              : Array.isArray(
                    storedUser?.accessibleCenters,
                  )
                ? storedUser.accessibleCenters
                : [];

          const mergedUser = {
            ...storedUser,
            ...apiUser,
            accessibleCenters,
          };

          setUserInfo(mergedUser);
          setCenters(accessibleCenters);

          // Save merged user
          localStorage.setItem(
            "user",
            JSON.stringify(mergedUser),
          );

          // Current center
          if (mergedUser.center?._id) {
            setSelectedCenter(
              mergedUser.center._id,
            );

            localStorage.setItem(
              "userCenter",
              JSON.stringify(
                mergedUser.center,
              ),
            );
          }
        }
      } catch (fetchError) {
        console.error(
          "Error loading user info:",
          fetchError,
        );

        if (
          fetchError.response?.status === 401
        ) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        setError(
          "Failed to load centers. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

  // --------------------------------------------------
  // Select / Switch Center
  // --------------------------------------------------
  const handleCenterSelect = async (
    centerId,
  ) => {
    setSelectedCenter(centerId);
    setError("");
    setLoading(true);

    try {
      let token;
      let endpoint;

      if (isSwitching) {
        // Existing logged-in user
        endpoint = "/auth/switch-center";
        token = localStorage.getItem("token");
      } else {
        // First login
        endpoint = "/auth/select-center";
        token =
          localStorage.getItem("tempToken");
      }

      if (!token) {
        setError(
          "Session expired. Please login again.",
        );

        navigate("/login");
        return;
      }

      const response =
        await axiosInstance.post(
          endpoint,
          { centerId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      if (!response.data?.success) {
        setError(
          response.data?.message ||
            "Failed to select center",
        );

        return;
      }

      // ------------------------------------------------
      // Save new token
      // ------------------------------------------------
      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token,
        );
      }

      // ------------------------------------------------
      // Get returned user
      // ------------------------------------------------
      const returnedUser =
        response.data?.data?.user || {};

      // Existing user may contain accessibleCenters
      const storedUser =
        JSON.parse(
          localStorage.getItem("user") ||
            localStorage.getItem("userTemp") ||
            "{}",
        );

      // Preserve accessible centers
      const accessibleCenters =
        Array.isArray(
          returnedUser.accessibleCenters,
        )
          ? returnedUser.accessibleCenters
          : Array.isArray(
                storedUser.accessibleCenters,
              )
            ? storedUser.accessibleCenters
            : Array.isArray(centers)
              ? centers
              : [];

      const mergedUser = {
        ...storedUser,
        ...returnedUser,
        accessibleCenters,
      };

      // ------------------------------------------------
      // Save user
      // ------------------------------------------------
      localStorage.setItem(
        "user",
        JSON.stringify(mergedUser),
      );

      // ------------------------------------------------
      // Save current center
      // ------------------------------------------------
      if (returnedUser.center) {
        localStorage.setItem(
          "userCenter",
          JSON.stringify(
            returnedUser.center,
          ),
        );
      } else {
        const selectedCenterObject =
          centers.find(
            (item) => item._id === centerId,
          );

        if (selectedCenterObject) {
          localStorage.setItem(
            "userCenter",
            JSON.stringify(
              selectedCenterObject,
            ),
          );
        }
      }

      // ------------------------------------------------
      // Initial login cleanup
      // ------------------------------------------------
      if (!isSwitching) {
        localStorage.removeItem(
          "tempToken",
        );

        localStorage.removeItem(
          "userTemp",
        );
      }

      // ------------------------------------------------
      // Notify Header about center change
      // ------------------------------------------------
      window.dispatchEvent(
        new Event("centerChanged"),
      );

      // ------------------------------------------------
      // Refresh permissions
      // ------------------------------------------------
      await refreshPermissions();

      // ------------------------------------------------
      // Go to dashboard
      // ------------------------------------------------
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Center selection error:",
        error,
      );

      if (
        error.response?.status === 401
      ) {
        setError(
          "Session expired. Please login again.",
        );

        localStorage.clear();

        setTimeout(
          () => navigate("/login"),
          2000,
        );
      } else if (
        error.response?.status === 403
      ) {
        setError(
          "You do not have access to this center.",
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Error selecting center. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Back
  // --------------------------------------------------
  const handleBack = () => {
    if (isSwitching) {
      navigate("/dashboard");
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="min-h-screen bg-black/20">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Logo */}
            <div className="flex items-center justify-center lg:col-span-6">
              <div className="text-center">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="mx-auto mt-4 w-full max-w-[450px] object-contain"
                />
              </div>
            </div>

            {/* Center Selection */}
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="rounded-xl bg-white p-5 shadow-2xl sm:p-7">
                <h3 className="mb-5 text-center text-2xl font-semibold text-gray-800">
                  {isSwitching
                    ? "Switch Center"
                    : "Select Center"}
                </h3>

                {/* User Info */}
                {userInfo && (
                  <div className="mb-5 text-center text-gray-700">
                    {isSwitching ? (
                      <>
                        <p className="text-base">
                          Hello{" "}
                          <strong className="font-semibold">
                            {userInfo.fullName}
                          </strong>
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Currently in{" "}
                          <strong className="font-medium text-gray-700">
                            {userInfo.center
                              ?.centerName ||
                              "Unknown"}
                          </strong>
                        </p>
                      </>
                    ) : (
                      <p className="text-base">
                        Welcome{" "}
                        <strong className="font-semibold">
                          {userInfo.fullName}
                        </strong>
                      </p>
                    )}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Information */}
                <p className="mb-5 text-center text-sm text-gray-600">
                  {isSwitching ? (
                    <>
                      You can switch between{" "}
                      <strong>
                        {centers.length}
                      </strong>{" "}
                      accessible center(s).
                    </>
                  ) : (
                    <>
                      You have access to{" "}
                      <strong>
                        {centers.length}
                      </strong>{" "}
                      center(s). Please select one
                      to continue.
                    </>
                  )}
                </p>

                {/* Centers */}
                <div className="space-y-3">
                  {centers.map((center) => {
                    const isCurrentCenter =
                      isSwitching &&
                      userInfo?.center?._id ===
                        center._id;

                    const isSelected =
                      selectedCenter ===
                      center._id;

                    return (
                      <div
                        key={center._id}
                        onClick={() =>
                          !isCurrentCenter &&
                          !loading &&
                          setSelectedCenter(
                            center._id,
                          )
                        }
                        className={`rounded-lg border-2 p-4 transition-all ${
                          isCurrentCenter
                            ? "cursor-default border-green-600 bg-green-50"
                            : isSelected
                              ? "cursor-pointer border-blue-600 bg-blue-50"
                              : "cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h5 className="truncate text-base font-semibold text-gray-800">
                                {center.centerName}
                              </h5>

                              {isCurrentCenter && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                  <CheckCircle2
                                    size={13}
                                  />
                                  Current
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {!isCurrentCenter ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCenterSelect(
                                    center._id,
                                  );
                                }}
                                disabled={loading}
                                className="inline-flex min-w-[90px] items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {loading &&
                                selectedCenter ===
                                  center._id ? (
                                  <>
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                    {isSwitching
                                      ? "Switching..."
                                      : "Selecting..."}
                                  </>
                                ) : isSwitching ? (
                                  "Switch"
                                ) : (
                                  "Select"
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="inline-flex min-w-[90px] items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500"
                              >
                                Current
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Back */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <ArrowLeft size={16} />
                    {isSwitching
                      ? "Back to Dashboard"
                      : "Back to Login"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterSelection;