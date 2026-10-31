import React, { useContext, useState } from 'react'
import { User, LockKeyhole, Mail, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import backgroundImage from '../../../assets/images/background.jpg'
import logo from '../../../assets/images/logo.png'
import axiosInstance from '../../../axiosInstance'
import { AuthContext } from '../../../context/AuthContext'

const isValidJwtFormat = (value) => {
  if (typeof value !== 'string') return false
  const parts = value.trim().split('.')
  return parts.length === 3 && parts.every((part) => part.length > 0)
}

const extractAccessToken = (body) => {
  const candidates = [
    body?.accessToken,
    body?.data?.accessToken,
    body?.data?.data?.accessToken,
    body?.tokens?.accessToken,
    body?.data?.tokens?.accessToken,
    body?.token,
    body?.data?.token,
    body?.data?.data?.token,
  ]

  return candidates.find(isValidJwtFormat)?.trim() || null
}

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState(1)

  const navigate = useNavigate()
  const { refreshPermissions } = useContext(AuthContext)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.username.trim() || (activeTab === 1 && !formData.password)) {
      setError('Please fill in all fields')
      return
    }

    if (activeTab !== 1) {
      setSuccess('OTP login is not implemented yet.')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/login', {
        username: formData.username.trim(),
        password: formData.password,
      })

      const body = response.data

      if (!body?.success) {
        setError(body?.message || 'Login failed')
        return
      }

      const accessToken = extractAccessToken(body)

      // Log response metadata only; never log the token itself.
      console.info('[LOGIN DEBUG]', {
        responseKeys: Object.keys(body || {}),
        dataKeys: Object.keys(body?.data || {}),
        tokenFound: Boolean(accessToken),
        tokenLength: accessToken?.length ?? 0,
        tokenDotCount: accessToken ? (accessToken.match(/\./g) || []).length : 0,
        requiresCenterSelection: Boolean(body?.requiresCenterSelection),
      })

      if (!accessToken) {
        setError('The login API did not return a valid access token. Please contact the backend team.')
        return
      }

      if (body.requiresCenterSelection) {
        localStorage.removeItem('token')
        localStorage.setItem('tempToken', accessToken)

        if (body.data?.user) {
          localStorage.setItem('userTemp', JSON.stringify(body.data.user))
        }

        navigate('/select-center')
        return
      }

      localStorage.setItem('token', accessToken)
      localStorage.removeItem('tempToken')

      if (body.data?.user) {
        localStorage.setItem('user', JSON.stringify(body.data.user))

        if (body.data.user.center) {
          localStorage.setItem('userCenter', JSON.stringify(body.data.user.center))
        } else {
          localStorage.removeItem('userCenter')
        }
      }

      await refreshPermissions()
      navigate('/')
    } catch (requestError) {
      console.error('Login error:', {
        message: requestError?.response?.data?.message || requestError.message,
        status: requestError?.response?.status,
      })

      if (requestError.response?.data) {
        setError(requestError.response.data.message || 'Login failed. Please try again.')
      } else if (requestError.request) {
        setError('No response from server. Please check your connection.')
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const tabClass = (tab) =>
    `flex-1 border-b-[3px] px-3 py-3 text-sm transition-colors focus:outline-none ${
      activeTab === tab
        ? 'border-[#2f5fa7] font-semibold text-[#2f5fa7]'
        : 'border-transparent text-[#555] hover:text-[#2f5fa7]'
    }`

  const inputGroupClass =
    'mb-3 flex min-h-[42px] w-full overflow-hidden rounded-[4px] border border-[#ced4da] bg-white focus-within:border-[#86b7fe] focus-within:ring-2 focus-within:ring-[#0d6efd]/20'

  const iconClass =
    'flex w-[42px] shrink-0 items-center justify-center border-r border-[#ced4da] bg-[#f8f9fa] text-[#495057]'

  const inputClass =
    'min-w-0 flex-1 border-0 bg-white px-3 py-[10px] text-[15px] text-[#212529] outline-none placeholder:text-[#6c757d]'

  const buttonClass =
    'inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[4px] bg-[#2f5fa7] px-4 py-2 text-[15px] font-normal text-white transition-colors hover:bg-[#244c88] disabled:cursor-not-allowed disabled:opacity-65'

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex min-h-screen w-full items-center bg-black/[0.02]">
        <div className="mx-auto flex min-h-screen w-full max-w-[1250px] items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-12 lg:gap-10">
            {/* Left-side branding: kept like the original CoreUI login page */}
            <section className="flex items-center justify-center md:col-span-6">
              <div className="w-full text-center text-white">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="mx-auto mt-1 object-contain"
                />
                {/* <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                  TRUNET
                </h1>
                <p className="mt-2 text-lg">Welcome to our platform</p> */}
              </div>
            </section>

            {/* Login card: original white card, tabs, input groups and blue buttons */}
            <section className="md:col-span-5 md:col-start-8">
              <div className="w-full rounded-[4px] bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.18)] sm:p-6">
                <p className="mb-4 text-center text-[14px] text-[#6c757d]">
                  Sign in to start your session Login
                </p>

                <div className="mb-4 flex border-b border-[#dee2e6]" role="tablist" aria-label="Login method">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 1}
                    onClick={() => {
                      setActiveTab(1)
                      setError('')
                      setSuccess('')
                    }}
                    className={tabClass(1)}
                  >
                    Password Login
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 2}
                    onClick={() => {
                      setActiveTab(2)
                      setError('')
                      setSuccess('')
                    }}
                    className={tabClass(2)}
                  >
                    OTP Login
                  </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {error && (
                    <div
                      role="alert"
                      className="mb-4 rounded-[4px] border border-[#f1aeb5] bg-[#f8d7da] px-4 py-3 text-[14px] text-[#842029]"
                    >
                      {error}
                    </div>
                  )}

                  {success && (
                    <div
                      role="status"
                      className="mb-4 rounded-[4px] border border-[#a3cfbb] bg-[#d1e7dd] px-4 py-3 text-[14px] text-[#0f5132]"
                    >
                      {success}
                    </div>
                  )}

                  {activeTab === 1 ? (
                    <>
                      <label htmlFor="login-username" className="sr-only">
                        Username
                      </label>
                      <div className={inputGroupClass}>
                        <span className={iconClass}>
                          <User size={17} aria-hidden="true" />
                        </span>
                        <input
                          id="login-username"
                          type="text"
                          name="username"
                          placeholder="Username"
                          autoComplete="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          className={inputClass}
                        />
                      </div>

                      <label htmlFor="login-password" className="sr-only">
                        Password
                      </label>
                      <div className={`${inputGroupClass} mb-4`}>
                        <span className={iconClass}>
                          <LockKeyhole size={17} aria-hidden="true" />
                        </span>
                        <input
                          id="login-password"
                          type="password"
                          name="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className={inputClass}
                        />
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button type="submit" disabled={loading} className={buttonClass}>
                          {loading ? (
                            <>
                              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                              Loading...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </button>
                      </div>

                      <div className="mt-2 text-right">
                        <button
                          type="button"
                          onClick={() => setError('Please contact your administrator to reset your password.')}
                          className="border-0 bg-transparent p-0 text-[14px] text-[#2f5fa7] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor="login-email" className="sr-only">
                        Email
                      </label>
                      <div className={`${inputGroupClass} mb-3`}>
                        <span className={iconClass}>
                          <Mail size={17} aria-hidden="true" />
                        </span>
                        <input
                          id="login-email"
                          type="text"
                          name="username"
                          placeholder="Email"
                          autoComplete="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          className={inputClass}
                        />
                      </div>

                      <div className="text-left">
                        <button
                          type="button"
                          onClick={() => setSuccess('OTP login is not implemented yet.')}
                          className={buttonClass}
                        >
                          Generate OTP
                        </button>
                      </div>
                    </>
                  )}

                  <div className="mt-5 border-t border-[#dee2e6] pt-4">
                    <p className="text-center text-[14px] text-[#6c757d]">
                      Design and Developed by{' '}
                      <a
                        href="https://softcrowdtechnologies.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#2f5fa7] hover:underline"
                      >
                        Softcrowd Technologies
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
