// function AuthLayout({ children }) {
//   return (
//     <div className="min-h-screen flex relative overflow-hidden">
//       {/*  BACKGROUND VIDEO */}
//       <video
//         autoPlay
//         loop
//         muted
//         className="absolute w-full h-full object-cover"
//       >
//         <source src="/car.mp4" type="video/mp4" />
//       </video>

//       {/*  DARK OVERLAY */}
//       <div className="absolute inset-0 bg-black/50"></div>

//       {/* CONTENT */}
//       <div className="relative z-10 flex w-full items-center justify-center cursor-pointer">
//         <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[350px] text-white border border-white/20">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuthLayout;

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/car.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 sm:px-6">
        <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-[350px] text-white border border-white/20">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
