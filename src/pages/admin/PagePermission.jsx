import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Table from "../../components/Table";
import { toast } from "react-toastify";
import { GetPagePermission, SetPagePermission } from "../../api/userApi";
import Button from "../../components/utils/Button";
import Icon from "../../components/utils/Icon";
import { useAuthData } from "../../context/authContext";
// import LoginPageFinder from "../../components/utils/LoginPageFinder";

const PagePermission = () => {
  const [tableData, setTableData] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // const { state } = useLocation();
  // const { user_id, emp_role } = state;

  const { authData } = useAuthData();
  const user_id = authData?.user_id

  // const pageAccess = LoginPageFinder("page_display_name", "manage users");
  // const permission = pageAccess?.[0]?.r_w_permission;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams()

  const USER = searchParams.get("id")

  useEffect(() => {
    const allGroups = authData?.loginGroupNames || [];

    const allLoginPages = allGroups.flatMap(
      (group) => group.loginpageNames || [],
    );

    const hasAccessToPageId3 = allLoginPages.some(
      (page) => page.page_id === 10,
    );

    // if (!hasAccessToPageId3) {
    //   navigate("/");
    // }
  }, [authData, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const req = {
        user_id: "",
        login_user: user_id,
      };

      try {
        const response = await GetPagePermission(req);

        if (response.status) {
          setTableData(response.data);

          const initialPermissions = response.data.map((item) => ({
            page_id: item.page_id,
            group_id: item.group_id,
            set_permission_access: item.set_permission_access || false,
            r_w_permission: item.r_w_permission || false,
            page_url: item.page_url || "",
          }));

          setPermissions(initialPermissions);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [user_id, authData.user_id]);

  const handlePermissionChange = (index, field, value, row) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = [...prevPermissions];

      updatedPermissions[index] = {
        ...updatedPermissions[index],
        [field]: value,
      };

      if (field === "set_permission_access" && !value) {
        updatedPermissions[index].r_w_permission = false;
      }

      if (field === "r_w_permission" && value) {
        updatedPermissions[index].set_permission_access = true;
      }

      return updatedPermissions;
    });
  };

  const handleSave = async () => {
    const req = {
      user_id: user_id,
      emp_role: emp_role,
      updated_emp_role: authData.role,
      updated_by: authData.user_id,
      permission: permissions,
    };

    try {
      const response = await SetPagePermission(req);

      if (response?.status) {
        navigate(-1);
        toast.success(response.message);
      } else {
        toast.error(response?.message || "Failed to save permissions.");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("An error occurred while saving permissions.");
    }
  };

  // PERMISSION CHECKBOX
  const PermissionCheckbox = ({
    checked,
    disabled,
    onChange,
    label,
    id,
  }) => (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 text-sm ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={Boolean(checked)}
        disabled={disabled}
        onChange={onChange}
        className="h-4 w-4 accent-primary cursor-pointer"
      />

      <span className="text-gray-700">{label}</span>
    </label>
  );

  // TABLE COLUMNS
  const columnsData = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "65px",
      center: true,
    },
    {
      name: "Group Name",
      selector: (row) => row.group_name,
      sortable: true,
      width: "180px",
      wrap: true,
    },
    {
      name: "Page Name",
      selector: (row) => row.page_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Page URL",
      selector: (row) => row.page_url,
      wrap: true,
    },
    {
      name: "Page Description",
      selector: (row) => row.page_small_discription,
      wrap: true,
    },
    {
      name: "Permission",
      width: "190px",
      center: true,
      cell: (row, index) => {
        const perm = permissions[index] || {};

        return (
          <div className="flex items-center justify-center gap-4">
            <PermissionCheckbox
              id={`read-${index}`}
              label="Read"
              checked={perm.set_permission_access}
              // disabled={!permission}
              onChange={(e) =>
                handlePermissionChange(
                  index,
                  "set_permission_access",
                  e.target.checked,
                  row,
                )
              }
            />

            <PermissionCheckbox
              id={`write-${index}`}
              label="Write"
              checked={
                perm.set_permission_access && perm.r_w_permission
              }
              // disabled={!perm.set_permission_access || !permission}
              onChange={(e) =>
                handlePermissionChange(
                  index,
                  "r_w_permission",
                  e.target.checked,
                  row,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-sm hover:bg-gray-100"
              title="Go Back"
            >
              <Icon name="FaArrowLeft" size={17} color="black" />
            </button>

            <div className="text-md font-medium">Page Permission</div>
          </div>

          {true && (
            <Button
              btnName="Save Permission"
              btnIcon="RiUserSettingsLine"
              style="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-sm"
              type="button"
              onClick={handleSave}
            />
          )}
        </div>

        {/* TABLE */}
        {Array.isArray(tableData) && tableData.length > 0 ? (
          <div className="px-4">
            <Table
              columns={columnsData}
              data={tableData}
              title="Page Permission"
              pagination={false}
            />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-12">
            <Icon name="FaRegFolderOpen" size={35} color="#9CA3AF" />

            <p className="text-sm text-gray-500 mt-3">
              No permission data available
            </p>
          </div>
        )}

        {/* SAVE BUTTON */}
        {Array.isArray(tableData) && tableData.length > 0 && true && ( //permission
          <div className="flex justify-end items-center gap-2 px-4 py-5">
            <Button
              btnName="Cancel"
              type="button"
              onClick={() => navigate(-1)}
              style="border border-gray-200 hover:bg-gray-100 text-gray-700"
            />

            <Button
              btnName="Save Permission"
              btnIcon="RiUserSettingsLine"
              type="button"
              onClick={handleSave}
              style="bg-primary hover:bg-primary/90 text-white font-medium"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PagePermission;