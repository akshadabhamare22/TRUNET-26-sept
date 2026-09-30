import React, {
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  ShoppingCart,
} from 'lucide-react'

import axiosInstance from '../../axiosInstance'

const IndentCard = () => {
  const [centerCount, setCenterCount] =
    useState(0)

  const [indentSummary, setIndentSummary] =
    useState({
      totalRequests: 0,
      completed: 0,
      incomplete: 0,
    })

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const centerRes =
          await axiosInstance.get(
            '/centers',
          )

        if (centerRes.data.success) {
          setCenterCount(
            centerRes.data.pagination
              .totalItems,
          )
        }

        const indentRes =
          await axiosInstance.get(
            '/stockrequest/indent-count',
          )

        if (indentRes.data.success) {
          setIndentSummary({
            totalRequests:
              indentRes.data
                .totalRequests || 0,

            completed:
              indentRes.data.completed ||
              0,

            incomplete:
              indentRes.data.incomplete ||
              0,
          })
        }
      } catch (error) {
        console.error(
          'Error fetching dashboard data:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="transition-all duration-300">
      {/* Heading */}
      <h2
        className="
          mb-3
          text-2xl
          font-light
          text-[#333333]
        "
      >
        Dashboard
      </h2>

      {/* Cards */}
      <div className="flex flex-wrap gap-4">
        {/* Centers Card */}
        <div
          className="
            flex
            w-[18.5rem]
            overflow-hidden
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              bg-[#00c0ef]
              p-7
            "
          >
            <Users
              size={40}
              strokeWidth={2}
              className="text-white"
            />
          </div>

          <div
            className="
              flex
              flex-col
              justify-center
              bg-white
              py-1
              pl-3
            "
          >
            <Link
              to="/center-list"
              className="
                text-sm
                text-[#3C8DBC]
                no-underline
                transition-colors
                duration-200
                hover:text-[#72AFDB]
              "
            >
              CENTERS
            </Link>

            <div
              className="
                text-lg
                font-bold
                text-[#333333]
              "
            >
              {loading
                ? 'Loading...'
                : centerCount}
            </div>
          </div>
        </div>

        {/* Total Indent Card */}
        <div
          className="
            flex
            w-[18.5rem]
            overflow-hidden
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              bg-[#00A65A]
              p-7
            "
          >
            <ShoppingCart
              size={40}
              strokeWidth={2}
              className="text-white"
            />
          </div>

          <div
            className="
              flex
              flex-col
              justify-center
              bg-white
              py-1
              pl-3
            "
          >
            <Link
              to="/order/index/indent"
              className="
                text-sm
                text-[#3C8DBC]
                no-underline
                transition-colors
                duration-200
                hover:text-[#72AFDB]
              "
            >
              TOTAL INDENT
            </Link>

            <div
              className="
                text-lg
                font-bold
                text-[#333333]
              "
            >
              {loading
                ? 'Loading...'
                : `${indentSummary.totalRequests}/${indentSummary.completed}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndentCard