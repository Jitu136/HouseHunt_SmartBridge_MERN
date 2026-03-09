import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              HouseHunt
            </span>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} HouseHunt Inc. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6 md:mt-0 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
