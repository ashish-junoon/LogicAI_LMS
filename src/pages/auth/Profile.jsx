
// import React from "react";
// import {
//   RiUser3Line,
//   RiMailLine,
//   RiShieldUserLine,
//   RiBuilding2Line,
//   RiBriefcaseLine,
//   RiMapPinLine,
//   RiIdCardLine,
//   RiEditLine,
//   RiUserSettingsLine,
//   RiArrowRightSLine,
//   RiVerifiedBadgeLine,
//   RiCalendarLine,
// } from "react-icons/ri";

// import { useAuthData } from "../../context/authContext";

// const Profile = () => {
//   const { authData } = useAuthData();

//   const user = authData;

//   const initials = user?.full_name
//     ?.split(" ")
//     .filter(Boolean)
//     .map((name) => name[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();

//   const InfoItem = ({ icon: Icon, label, value, subtext }) => (
//     <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 transition-all duration-200 hover:border-primary/20 hover:bg-primary/[0.02] hover:shadow-sm">
//       <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
//         <Icon className="text-xl" />
//       </div>

//       <div className="min-w-0">
//         <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
//           {label}
//         </p>
//         <p className="mt-1 truncate text-sm font-semibold text-gray-800">
//           {value || "—"}
//         </p>
//         {subtext && (
//           <p className="mt-0.5 text-xs text-gray-400">{subtext}</p>
//         )}
//       </div>
//     </div>
//   );

//   const SectionHeader = ({ icon: Icon, title, description }) => (
//     <div className="mb-5 flex items-center gap-3">
//       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//         <Icon className="text-xl" />
//       </div>
//       <div>
//         <h3 className="text-sm font-bold text-gray-800">{title}</h3>
//         <p className="mt-0.5 text-xs text-gray-400">{description}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen space-y-6 bg-[#f7f9fc] p-4 sm:p-6 lg:p-7">
//       {/* Heading */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
//             <span>Dashboard</span>
//             <RiArrowRightSLine />
//             <span className="text-primary">My Profile</span>
//           </div>
//           <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
//             My Profile
//           </h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage your personal information and workspace details.
//           </p>
//         </div>

//         <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-500 shadow-sm sm:flex">
//           <RiVerifiedBadgeLine className="text-lg text-green-600" />
//           Active Account
//         </div>
//       </div>

//       {/* Hero Profile Card */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f5c4d] via-[#116b59] to-[#123f50] shadow-lg shadow-primary/10">
//         {/* Decorative shapes */}
//         <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/[0.04]" />
//         <div className="pointer-events-none absolute -bottom-32 right-44 h-64 w-64 rounded-full bg-white/[0.04]" />

//         <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
//             {/* Avatar */}
//             <div className="relative w-fit">
//               <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white/20 bg-white text-3xl font-bold text-[#0f5c4d] shadow-xl sm:h-28 sm:w-28">
//                 {initials || <RiUser3Line />}
//               </div>
//               <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#116b59] bg-green-400 text-white">
//                 <RiVerifiedBadgeLine className="text-base" />
//               </span>
//             </div>

//             <div className="text-white">
//               <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
//                 Welcome back
//               </p>
//               <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
//                 {user?.full_name || "User"}
//               </h2>
//               <p className="mt-1 text-sm text-white/70">
//                 {user?.designation || "Team Member"}
//               </p>

//               <div className="mt-4 flex flex-wrap gap-2">
//                 <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
//                   <RiShieldUserLine />
//                   {user?.role || "User"}
//                 </span>
//                 <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
//                   <RiBuilding2Line />
//                   {user?.branch_name || "Branch"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <button
//               type="button"
//               onClick={() => alert("Edit profile functionality coming soon")}
//               className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0f5c4d] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-100"
//             >
//               <RiEditLine className="text-lg" />
//               Edit Profile
//             </button>
//           </div>
//         </div>

//         {/* Bottom summary */}
//         <div className="relative grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 bg-black/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
//           <div className="flex items-center gap-3 px-6 py-4">
//             <RiMailLine className="text-xl text-white/60" />
//             <div className="min-w-0">
//               <p className="text-[10px] uppercase tracking-wider text-white/50">
//                 Email Address
//               </p>
//               <p className="truncate text-sm font-medium text-white">
//                 {user?.email_id || "—"}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 px-6 py-4">
//             <RiBriefcaseLine className="text-xl text-white/60" />
//             <div>
//               <p className="text-[10px] uppercase tracking-wider text-white/50">
//                 Department
//               </p>
//               <p className="text-sm font-medium text-white">
//                 {user?.department || "—"}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 px-6 py-4">
//             <RiMapPinLine className="text-xl text-white/60" />
//             <div>
//               <p className="text-[10px] uppercase tracking-wider text-white/50">
//                 Work Location
//               </p>
//               <p className="text-sm font-medium text-white">
//                 {user?.branch_name || "—"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Details Grid */}
//       <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
//         {/* Personal Details */}
//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
//           <SectionHeader
//             icon={RiUser3Line}
//             title="Personal Information"
//             description="Your personal and account identity"
//           />

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <InfoItem
//               icon={RiUser3Line}
//               label="Full Name"
//               value={user?.full_name}
//             />
//             <InfoItem
//               icon={RiMailLine}
//               label="Email Address"
//               value={user?.email_id}
//             />
//             <InfoItem
//               icon={RiIdCardLine}
//               label="User ID"
//               value={user?.user_id}
//             />
//             <InfoItem
//               icon={RiShieldUserLine}
//               label="Account Role"
//               value={user?.role}
//             />
//           </div>
//         </div>

//         {/* Work Details */}
//         <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
//           <SectionHeader
//             icon={RiBuilding2Line}
//             title="Work Information"
//             description="Your organization and professional details"
//           />

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <InfoItem
//               icon={RiMapPinLine}
//               label="Branch"
//               value={user?.branch_name}
//             />
//             <InfoItem
//               icon={RiBuilding2Line}
//               label="Department"
//               value={user?.department}
//             />
//             <InfoItem
//               icon={RiBriefcaseLine}
//               label="Designation"
//               value={user?.designation}
//             />
//             <InfoItem
//               icon={RiShieldUserLine}
//               label="User Type"
//               value={user?.user_type}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Account Details */}
//       <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
//         <SectionHeader
//           icon={RiUserSettingsLine}
//           title="Account Details"
//           description="System-generated account identification"
//         />

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <InfoItem
//             icon={RiIdCardLine}
//             label="User ID"
//             value={user?.user_id}
//           />
//           <InfoItem
//             icon={RiIdCardLine}
//             label="Branch ID"
//             value={user?.branch_id}
//           />
//           <InfoItem
//             icon={RiIdCardLine}
//             label="Department ID"
//             value={user?.department_id}
//           />
//           <InfoItem
//             icon={RiIdCardLine}
//             label="Designation ID"
//             value={user?.designation_id}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;



import React from "react";
import {
  RiUser3Line,
  RiMailLine,
  RiShieldUserLine,
  RiBuilding2Line,
  RiBriefcaseLine,
  RiMapPinLine,
  RiIdCardLine,
  RiEditLine,
  RiUserSettingsLine,
  RiArrowRightSLine,
  RiVerifiedBadgeLine,
} from "react-icons/ri";

import { useAuthData } from "../../context/authContext";

const Profile = () => {
  const { authData } = useAuthData();

  const user = authData

  const initials = user?.full_name?.split(" ")
      .filter(Boolean).map((name) => name[0])
      .join("").slice(0, 2).toUpperCase() || "U";

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="text-xl" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-gray-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="text-xl" />
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 bg-gray-50/70 py-2 sm:p-0 lg:p-2">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span>Dashboard</span>
            <RiArrowRightSLine />
            <span className="text-primary">My Profile</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and workspace details.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-xl border border-primary/10 bg-white px-4 py-2.5 text-xs font-semibold text-primary shadow-sm sm:flex">
          <RiVerifiedBadgeLine className="text-lg" />
          Active Account
        </div>
      </div>

      {/* Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg shadow-primary/15">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-32 right-44 h-64 w-64 rounded-full bg-white/[0.05]" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-full w-px bg-white/[0.04]" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative w-fit">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white/20 bg-white text-3xl font-bold text-primary shadow-xl sm:h-28 sm:w-28">
                {initials}
              </div>

              <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-primary bg-primary text-white shadow-sm">
                <RiVerifiedBadgeLine className="text-base" />
              </span>
            </div>

            {/* User Information */}
            <div className="text-white">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                Welcome back
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {user?.full_name || "User"}
              </h2>

              <p className="mt-1 text-sm text-white/70">
                {user?.designation || "Team Member"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                  <RiShieldUserLine />
                  {user?.role || "User"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                  <RiBuilding2Line />
                  {user?.branch_name || "Branch"}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {/* <div>
            <button
              type="button"
              onClick={() => alert("Edit profile functionality coming soon")}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100"
            >
              <RiEditLine className="text-lg" />
              Edit Profile
            </button>
          </div> */}
        </div>

        {/* Banner Bottom Information */}
        <div className="relative grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 bg-black/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-3 px-6 py-4">
            <RiMailLine className="shrink-0 text-xl text-white/60" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Email Address
              </p>
              <p className="truncate text-sm font-medium text-white">
                {user?.email_id || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <RiBriefcaseLine className="shrink-0 text-xl text-white/60" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Department
              </p>
              <p className="truncate text-sm font-medium text-white">
                {user?.department || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <RiMapPinLine className="shrink-0 text-xl text-white/60" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Work Location
              </p>
              <p className="truncate text-sm font-medium text-white">
                {user?.branch_name || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal & Professional Details */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Personal Information */}
        {/* <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
          <SectionHeader
            icon={RiUser3Line}
            title="Personal Information"
            description="Your personal and account identity"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoItem
              icon={RiUser3Line}
              label="Full Name"
              value={user?.full_name}
            />

            <InfoItem
              icon={RiMailLine}
              label="Email Address"
              value={user?.email_id}
            />

            <InfoItem
              icon={RiIdCardLine}
              label="User ID"
              value={user?.user_id}
            />

            <InfoItem
              icon={RiShieldUserLine}
              label="Account Role"
              value={user?.role}
            />
          </div>
        </div> */}

        {/* Work Information */}
        {/* <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
          <SectionHeader
            icon={RiBuilding2Line}
            title="Work Information"
            description="Your organization and professional details"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoItem
              icon={RiMapPinLine}
              label="Branch"
              value={user?.branch_name}
            />

            <InfoItem
              icon={RiBuilding2Line}
              label="Department"
              value={user?.department}
            />

            <InfoItem
              icon={RiBriefcaseLine}
              label="Designation"
              value={user?.designation}
            />

            <InfoItem
              icon={RiShieldUserLine}
              label="User Type"
              value={user?.user_type}
            />
          </div>
        </div> */}
      </div>

      {/* Account Details */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
        <SectionHeader
          icon={RiUserSettingsLine}
          title="Account Details"
          description="System-generated account identification"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            icon={RiIdCardLine}
            label="User ID"
            value={user?.user_id}
          />

          <InfoItem
            icon={RiIdCardLine}
            label="Branch Name"
            value={user?.branch_name}
          />

          <InfoItem
            icon={RiIdCardLine}
            label="Department"
            value={user?.department}
          />

          <InfoItem
            icon={RiIdCardLine}
            label="Designation"
            value={user?.designation}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
