import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import Table from "../../components/Table";
import Modal from "../../components/utils/Modal";
import TextInput from "../../components/fields/TextInput";
import TogleInput from "../../components/fields/TogleInput";
import Button from "../../components/utils/Button";


import { toast } from "react-toastify";
import Loader from "../../components/utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateBank, GetAllBanks, UpdateBank } from "../../api/mastersApi";

const BankMaster = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);

  // =========================================================
  // FETCH ALL BANKS
  // =========================================================

  const fetchAllBanks = async () => {
    try {
      setIsLoading(true);

      const response = await GetAllBanks();

      if (response?.code === 1 || response?.code === 0) {
        const transformedData = (response?.data || []).map((bank, index) => ({
          ...bank,
          sn: index + 1,
        }));

        setBankList(transformedData);
      } else {
        setBankList([]);
        toast.info(response?.msg || "Unable to fetch bank list!");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);

      toast.error(
        error?.response?.data?.title ||
          error?.response?.data?.errors?.request?.[0] ||
          error?.message ||
          "Something went wrong!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // ADD BANK
  // =========================================================

  const handleAddBank = () => {
    setIsEdit(false);
    setEditingBankId(null);

    bankFormik.resetForm();

    setIsModalOpen(true);
  };

  // =========================================================
  // EDIT BANK
  // =========================================================

  const handleEditBank = (bank) => {
    setIsEdit(true);
    setEditingBankId(bank.id);

    bankFormik.setValues({
      bank_name: bank.bank_name || "",
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // FORMIK
  // =========================================================

  const bankFormik = useFormik({
    initialValues: {
      bank_name: "",
    },

    validationSchema: Yup.object({
      bank_name: Yup.string()
        .trim()
        .required("Bank name is required"),
    }),

    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        const req = {
          bank_name: values.bank_name.trim(),
        };

        let response;

        // UPDATE
        if (isEdit) {
          response = await UpdateBank({
            id: editingBankId,
            ...req,
          });
        }

        // CREATE
        else {
          response = await CreateBank(req);
        }

        if (response?.code === 1 || response?.code === 0) {
          await fetchAllBanks();

          toast.success(
            response?.msg ||
              (isEdit
                ? "Bank updated successfully!"
                : "Bank added successfully!")
          );

          setIsModalOpen(false);

          resetForm();

          setIsEdit(false);
          setEditingBankId(null);
        } else {
          toast.info(
            response?.msg ||
              (isEdit
                ? "Unable to update bank!"
                : "Unable to add bank!")
          );
        }
      } catch (error) {
        console.error(
          isEdit ? "Error in updating bank" : "Error in creating bank",
          error
        );

        toast.error(
          error?.response?.data?.title ||
            error?.response?.data?.errors?.request?.[0] ||
            error?.message ||
            "Something went wrong!"
        );
      }
    },
  });

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns = [
    {
      name: "#",
      selector: (row) => row.sn,
      sortable: true,
      width: "80px",
    },

    {
      name: "Bank Name",
      selector: (row) => row.bank_name,
      sortable: true,
    },

    {
      name: "Action",
      center: true,
      width: "100px",
      selector: (row) => (
        <div className="flex justify-center gap-5">
          <button
            type="button"
            onClick={() => handleEditBank(row)}
            className="cursor-pointer"
          >
            <Icon
              name="FaEdit"
              size={18}
              color="black"
            />
          </button>
        </div>
      ),
    },

    {
      name: "Status",
      center: true,
      width: "100px",
      selector: (row) => (
        <TogleInput
          checked={row.is_active}
          onChange={() => {
            setBankList((prev) =>
              prev.map((bank) =>
                bank.id !== row.id
                  ? bank
                  : {
                      ...bank,
                      is_active: !bank.is_active,
                    }
              )
            );
          }}
        />
      ),
    },
  ];

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchAllBanks();
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {isLoading && <Loader text="Loading banks..." />}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <div className="text-md font-medium">
            All Banks
          </div>

          <button
            type="button"
            onClick={handleAddBank}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-sm bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
          >
            New Bank
          </button>
        </div>

        {/* Table */}
        <Table
          data={bankList}
          columns={columns}
        />
      </div>

      {/* Add / Update Modal */}
      <Modal
        title={isEdit ? "Update Bank" : "Add New Bank"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          bankFormik.resetForm();
          setIsEdit(false);
          setEditingBankId(null);
        }}
      >
        <form onSubmit={bankFormik.handleSubmit}>
          <div className="mt-6">

            <TextInput
              label="Bank Name"
              name="bank_name"
              placeholder="Enter bank name"
              value={bankFormik.values.bank_name}
              onChange={bankFormik.handleChange}
              onBlur={bankFormik.handleBlur}
            />

            {bankFormik.touched.bank_name &&
              bankFormik.errors.bank_name && (
                <p className="mt-1 text-xs text-red-500">
                  {bankFormik.errors.bank_name}
                </p>
            )}

          </div>

          {/* Buttons */}
          <div className="mt-5 flex justify-end gap-2">

            <Button
              btnName="Cancel"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                bankFormik.resetForm();
                setIsEdit(false);
                setEditingBankId(null);
              }}
              style="border text-sm border-gray-200 hover:bg-gray-100"
            />

            <Button
              btnName={isEdit ? "Update" : "Submit"}
              type="submit"
              style="bg-primary text-sm text-white hover:bg-primary/90"
            />

          </div>
        </form>
      </Modal>
    </>
  );
};

export default BankMaster;