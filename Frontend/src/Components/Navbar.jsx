const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="text-xl font-bold text-gray-900">
            MyApp
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Services
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Login Button */}
          <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Login
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

