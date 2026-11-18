import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import { toast } from "react-toastify";
import { GetPagePermission, SetPagePermission } from "../../api/userApi";
import Button from "../../components/utils/Button";
import Icon from "../../components/utils/Icon";
import { useAuthData } from "../../context/authContext";

const PagePermission = () => {
  const [tableData, setTableData] = useState([]);
  const [permissions, setPermissions] = useState([]);

  console.log(tableData.length)

  const navigate = useNavigate();
  const { authData } = useAuthData();
  const logged_id = authData?.user_id;
  const location = useLocation();
  const USER_ID = location.state.id;

  // const pageAccess = LoginPageFinder("page_display_name", "manage users");
  // const permission = pageAccess?.[0]?.r_w_permission;


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
        user_id: USER_ID,
        login_user: logged_id,
        page_name_type: "",
      };

      try {
        const response = await GetPagePermission(req);
        const filteredData = response?.data?.filter((item) => item.is_active);

        if (response.status) {
          setTableData(filteredData);

          const initialPermissions = filteredData?.map((item) => ({
            id: item.id || 0,
            user_id: USER_ID,
            page_id: item.page_id,
            group_id: item.group_id,
            set_permission_access: item.set_permission_access || false,
            r_w_permission: item.r_w_permission || false,
            is_active: item.is_active,
            created_by: logged_id,
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
  }, [USER_ID, logged_id]);

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
      permissions: permissions.map((item) => ({
        id: item.id || 0,
        user_id: item.user_id,
        page_id: item.page_id,
        group_id: item.group_id,
        set_permission_access: Boolean(item.set_permission_access),
        r_w_permission: Boolean(item.r_w_permission),
        is_active: Boolean(item.is_active),
        created_by: item.created_by,
      })),
    };

    try {
      const response = await SetPagePermission(req);

      if (response?.status) {
        toast.success(response.message);
        navigate(-1);
      } else {
        toast.error(response?.message || "Failed to save permissions.");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("An error occurred while saving permissions.");
    }
  };

  // PERMISSION CHECKBOX
  const PermissionCheckbox = ({ checked, disabled, onChange, label, id }) => (
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
      selector: (row) => row.group_display_name,
      sortable: true,
      width: "180px",
      wrap: true,
    },
    {
      name: "Page Name",
      selector: (row) => row.page_display_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Page Type",
      selector: (row) => row.page_name_type,
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
              checked={perm.set_permission_access && perm.r_w_permission}
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
        {Array.isArray(tableData) &&
          tableData.length > 0 &&
          true && ( //permission
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
