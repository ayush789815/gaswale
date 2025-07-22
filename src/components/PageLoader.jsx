import React from "react";
import { Oval } from "react-loader-spinner";

// Main Page Loading Component
const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

// Loading Component for Content Areas
const ContentLoader = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 mt-4">
      <Oval
        visible={true}
        height="60"
        width="60"
        color="#4fa94d"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
        strokeWidth={3}
      />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};

// Small Loading Component for Buttons
const ButtonLoader = () => {
  return (
    <Oval
      visible={true}
      height="35"
      width="35"
      color="#ffffff"
      ariaLabel="button-loading"
      wrapperStyle={{}}
      wrapperClass=""
      strokeWidth={5}
    />
  );
};

// Small Loading Component for Buttons
const IconLoader = () => {
  return (
    <Oval
      visible={true}
      height="24"
      width="24"
      color="#4fa94d"
      ariaLabel="button-loading"
      wrapperStyle={{}}
      wrapperClass=""
      strokeWidth={5}
    />
  );
};

// // Usage Examples
// const LoadingExamples = () => {
//   const [pageLoading, setPageLoading] = React.useState(false);
//   const [contentLoading, setContentLoading] = React.useState(false);
//   const [buttonLoading, setButtonLoading] = React.useState(false);

//   const showPageLoader = () => {
//     setPageLoading(true);
//     setTimeout(() => setPageLoading(false), 3000);
//   };

//   const showContentLoader = () => {
//     setContentLoading(true);
//     setTimeout(() => setContentLoading(false), 2000);
//   };

//   const showButtonLoader = () => {
//     setButtonLoading(true);
//     setTimeout(() => setButtonLoading(false), 2000);
//   };

//   return (
//     <div className="p-8 space-y-6">
//       <h1 className="text-2xl font-bold mb-6">Loading Components Demo</h1>

//       {/* Demo Buttons */}
//       <div className="space-x-4">
//         <button
//           onClick={showPageLoader}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Show Page Loader
//         </button>

//         <button
//           onClick={showContentLoader}
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Show Content Loader
//         </button>

//         <button
//           onClick={showButtonLoader}
//           disabled={buttonLoading}
//           className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-2 rounded flex items-center space-x-2"
//         >
//           {buttonLoading ? (
//             <>
//               <ButtonLoader />
//               <span>Loading...</span>
//             </>
//           ) : (
//             <span>Show Button Loader</span>
//           )}
//         </button>
//       </div>

//       {/* Content Area */}
//       <div className="border border-gray-200 rounded-lg p-6 min-h-[300px]">
//         <h2 className="text-xl font-semibold mb-4">Content Area</h2>
//         {contentLoading ? (
//           <ContentLoader message="Fetching data..." />
//         ) : (
//           <div>
//             <p className="text-gray-600">This is some sample content that would be loaded.</p>
//             <p className="text-gray-600 mt-2">Click "Show Content Loader" to see the loading state.</p>
//           </div>
//         )}
//       </div>

//       {/* Page Loader */}
//       {pageLoading && <PageLoader message="Loading page..." />}
//     </div>
//   );
// };

// export default LoadingExamples;
export { PageLoader, ContentLoader, ButtonLoader, IconLoader };
