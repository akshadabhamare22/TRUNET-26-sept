import React from 'react'
import { Search } from 'lucide-react'

const Page404 = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl px-6">
        <div className="clearfix">
          <div className="flex items-start gap-5">
            <h1 className="text-7xl font-bold leading-none text-gray-800">
              404
            </h1>

            <div className="pt-2">
              <h4 className="text-xl font-semibold text-gray-800">
                Oops! You&apos;re lost.
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                The page you are looking for was not found.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <div className="flex w-11 shrink-0 items-center justify-center border-r border-gray-300 bg-gray-50 text-gray-500">
            <Search size={18} />
          </div>

          <input
            type="text"
            placeholder="What are you looking for?"
            className="min-w-0 flex-1 border-0 px-3 py-2.5 text-sm text-gray-800 outline-none"
          />

          <button
            type="button"
            className="bg-cyan-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-600"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page404