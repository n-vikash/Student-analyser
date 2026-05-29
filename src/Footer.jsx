export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="text-lg font-bold">Future AI</span>
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            Empowering students with AI-driven intelligence to map their future careers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 font-mono text-xs uppercase tracking-widest text-gray-500">
          <div className="flex flex-col gap-4">
            <span className="text-gray-400">Platform</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Analytics</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Career Prep</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-gray-400">Company</span>
            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-gray-400">Legal</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600 font-mono">
        &copy; {new Date().getFullYear()} Future AI Intelligence Corp. All rights reserved.
      </div>
    </footer>
  );
}
