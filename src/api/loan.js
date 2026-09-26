import api from "./api.js";

// ========================================
// *Loan Related API's
// ========================================

//? Listing API's
//* =====================================

// export const GetAllLoans = async (params) => {
//     try {
//         const response = await api.post("/loans/GetAllLoanDetails", {
//             params: {
//                 page: params?.pageNo || 1,
//                 page_size: params?.page_size || 10
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error("GetAllLoans:", error.response?.data || error.message);
//         throw error;
//     }
// }

export const GetAllLoans = async ({
  pageNo = 1,
  page_size = 10,
  searchText = "",
}) => {
  try {
    const response = await api.post(
      "/loans/GetAllLoanDetails",
      {
        search_text: searchText,
      },
      {
        params: {
          page: pageNo,
          page_size: page_size,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("GetAllLoans:", error.response?.data || error.message);

    throw error;
  }
};

export const GetLoanById = async (params) => {
  try {
    const response = await api.get(
      `/Loans/GetLoanDetailById/${encodeURIComponent(params.loan_id)}/${params.product_code}`,
    );
    return response.data;
  } catch (error) {
    console.error("GetAllLoans:", error.response?.data || error.message);
    throw error;
  }
};
