import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-8 py-6 text-center text-gray-500">
      <p>© {new Date().getFullYear()} StarkCart. All rights reserved.</p>
    </footer>
  );
};

export default Footer;