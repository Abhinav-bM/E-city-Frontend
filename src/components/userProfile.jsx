import React from "react";

const AccountSettings = () => {
  return (
    <div className="flex w-full my-10  custom-padding">
      {/* Left sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-[600px]">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900">Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account info.
          </p>
        </div>

        <nav className="mt-2">
          <div className="px-3 py-2 mx-3 bg-gray-200 rounded-md flex items-center">
            <svg
              className="w-5 h-5 text-gray-700 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Profile</span>
          </div>

          <div className="px-3 py-2 mx-3 mt-1 flex items-center hover:bg-gray-200 rounded-md cursor-pointer">
            <svg
              className="w-5 h-5 text-gray-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-500">Security</span>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Profile details</h2>
          <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Profile section */}
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Profile</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <span className="ml-4 text-sm font-medium text-gray-900">
                Jaylon Dias
              </span>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Edit profile
            </button>
          </div>
        </div>

        {/* Email addresses section */}
        <div className="mt-8">
          <div className="text-sm font-medium text-gray-700 mb-4">
            Email addresses
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">example@clerk.dev</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                Primary
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                example@personal.com
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">email@work.io</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 pt-1 cursor-pointer">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add email address
            </div>
          </div>
        </div>

        {/* Phone number section */}
        <div className="mt-8">
          <div className="text-sm font-medium text-gray-700 mb-4">
            Phone number
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
              Primary
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-3 cursor-pointer">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add phone number
          </div>
        </div>

        {/* Connected accounts section */}
        <div className="mt-8">
          <div className="text-sm font-medium text-gray-700 mb-4">
            Connected accounts
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-600 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm text-gray-600 mr-2">Google</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400 ml-2">
              example@email.com
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-3 cursor-pointer">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Connect account
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
