export default function Footer() {
  return (
    <footer className="py-10 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white font-bold mb-2">OrbitView</h4>
          <p className="text-sm">Expand Your Horizon</p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Quick Links</h5>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Community
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Follow Us</h5>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:underline">
              Twitter
            </a>
            <a href="#" className="hover:underline">
              Instagram
            </a>
            <a href="#" className="hover:underline">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} OrbitView Corporation. All rights reserved. |{" "}
        <a href="#" className="hover:underline">
          Privacy
        </a>{" "}
        |{" "}
        <a href="#" className="hover:underline">
          Terms
        </a>
      </div>
    </footer>
  );
}
