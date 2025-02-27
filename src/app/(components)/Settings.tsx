"use client"
import React from 'react';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-16">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="text-gray-500 mt-2 mb-12">Manage your account settings and preferences</p>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-gray-500 mt-2">Set your account details</p>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                      placeholder="Enter your name"
                      defaultValue="Karishma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Surname</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                      placeholder="Enter your surname"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <Image
                    src="/avatars/profile.jpg"
                    alt="Profile"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                  <div className="flex gap-2 mt-4 justify-center">
                    <button className="text-sm text-gray-600 flex items-center gap-1">
                      <Pencil size={16} /> Edit photo
                    </button>
                    <button className="text-sm text-red-500 flex items-center gap-1">
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 w-full"></div>

        {/* Timezone Section */}
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="text-xl font-semibold">Timezone & preferences</h2>
            <p className="text-gray-500 mt-2">Let us know the time zone and format</p>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                      defaultValue="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none">
                      <option>UTC/GTM -4 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date & Time format</label>
                    <select className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none">
                      <option>dd/mm/yyyy 00:00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 w-full"></div>

        {/* Work Section */}
        <div className="flex gap-16">
          <div className="w-1/4">
            <h2 className="text-xl font-semibold">Your Work</h2>
            <p className="text-gray-500 mt-2">Add information about your position</p>
          </div>
          
          <div className="flex-1">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Function</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                    defaultValue="Management"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title</label>
                  <select className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none">
                    <option>Managing Director</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Responsibilities</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md border-gray-300 focus:border-[#073320] focus:ring-1 focus:ring-[#073320] outline-none"
                  defaultValue="Overseeing operations, making strategic decisions, and ensuring business growth."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-[#073320] text-white rounded-md hover:bg-[#052616] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;