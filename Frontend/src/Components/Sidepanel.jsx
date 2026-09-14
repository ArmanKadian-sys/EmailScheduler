const Sidepanel = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Menu
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="#"
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Chats
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          Settings
        </a>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left">
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidepanel;

