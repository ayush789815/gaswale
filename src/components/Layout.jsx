import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content - flex-1 ensures it takes remaining space */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
};

export default Layout;

// import React from "react";
// import Footer from "./Footer";
// import Navbar from "./Navbar";
// import Header from "./Header";

// const Layout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <Header />

//       {/* Main Content - flex-1 ensures it takes remaining space */}
//       <main className="flex-1 flex max-w-screen w-full">{children}</main>

//       {/* Footer - Always at bottom */}
//       <Footer />
//     </div>
//   );
// };

// export default Layout;
