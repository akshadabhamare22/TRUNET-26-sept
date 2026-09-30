import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  X,
  Search,
  RotateCcw,
} from "lucide-react";
import axiosInstance from "../../axiosInstance";

const SearchStockModel = ({
  visible,
  onClose,
  onSearch,
  products = [],
  centers = [],
}) => {
  const [searchData, setSearchData] = useState({
    keyword: "",
    center: "",
    outlet: "",
    status: "",
    startDate: "",
    endDate: "",
    indentStartDate: "",
    indentEndDate: "",
    product: "",
  });

  const [productOptions, setProductOptions] =
    useState(products);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  // --------------------------------------------------
  // Fetch products
  // --------------------------------------------------
  useEffect(() => {
    if (!visible) {
      setSearchData({
        keyword: "",
        center: "",
        outlet: "",
        status: "",
        startDate: "",
        endDate: "",
        indentStartDate: "",
        indentEndDate: "",
        product: "",
      });
      return;
    }

    if (products.length > 0) {
      setProductOptions(products);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await axiosInstance.get(
          "/products/all",
        );

        if (response.data?.success) {
          setProductOptions(
            response.data.data || [],
          );
        } else {
          setProductOptions([]);
        }
      } catch (error) {
        console.error(
          "Error fetching products:",
          error,
        );
        setProductOptions([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [visible, products]);

  // --------------------------------------------------
  // Input change
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const handleReset = () => {
    const resetData = {
      keyword: "",
      center: "",
      outlet: "",
      status: "",
      startDate: "",
      endDate: "",
      indentStartDate: "",
      indentEndDate: "",
      product: "",
    };

    setSearchData(resetData);
    onSearch(resetData);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* ------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------ */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ------------------------------------------------ */}
        {/* Body */}
        {/* ------------------------------------------------ */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Keyword */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Keyword
              </label>

              <input
                id="keyword"
                name="keyword"
                type="text"
                value={searchData.keyword}
                onChange={handleChange}
                placeholder="Enter keyword"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Center */}
            <div>
              <label
                htmlFor="center"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Center
              </label>

              <select
                id="center"
                name="center"
                value={searchData.center}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  All Centers
                </option>

                {centers.map((center) => (
                  <option
                    key={center._id}
                    value={center._id}
                  >
                    {center.centerName ||
                      center.name ||
                      center.businessName ||
                      center.centerCode ||
                      "Unnamed Center"}
                  </option>
                ))}
              </select>
            </div>

            {/* Outlet */}
            <div>
              <label
                htmlFor="outlet"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Outlet
              </label>

              <select
                id="outlet"
                name="outlet"
                value={searchData.outlet}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  All Outlets
                </option>

                {centers.map((center) => (
                  <option
                    key={center._id}
                    value={center._id}
                  >
                    {center.centerName ||
                      center.name ||
                      center.businessName ||
                      center.centerCode ||
                      "Unnamed Outlet"}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={searchData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  All Status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="Closed">
                  Closed
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            {/* Product */}
            <div className="md:col-span-2">
              <label
                htmlFor="product"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Product
              </label>

              <select
                id="product"
                name="product"
                value={searchData.product}
                onChange={handleChange}
                disabled={loadingProducts}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">
                  {loadingProducts
                    ? "Loading products..."
                    : "All Products"}
                </option>

                {productOptions.map((product) => (
                  <option
                    key={product._id}
                    value={product._id}
                  >
                    {product.productTitle ||
                      product.productName ||
                      product.name ||
                      product.productCode ||
                      "Unnamed Product"}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={searchData.startDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                End Date
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={searchData.endDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Indent Start Date */}
            <div>
              <label
                htmlFor="indentStartDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Indent Start Date
              </label>

              <input
                id="indentStartDate"
                name="indentStartDate"
                type="date"
                value={
                  searchData.indentStartDate
                }
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Indent End Date */}
            <div>
              <label
                htmlFor="indentEndDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Indent End Date
              </label>

              <input
                id="indentEndDate"
                name="indentEndDate"
                type="date"
                value={
                  searchData.indentEndDate
                }
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Footer */}
        {/* ------------------------------------------------ */}
        <div className="flex items-center justify-end gap-2 border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

SearchStockModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  products: PropTypes.array,
  centers: PropTypes.array,
};

export default SearchStockModel;