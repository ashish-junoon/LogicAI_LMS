import api from "./api.js";

// ========================================
// *Application Related API's
// ========================================

//? Listing API's
//* =====================================

export const GetAllApplications = async ( req
    // {
    //     pageNo = 1,
    //     page_size = 10,
    //     searchText = "",
    // }
) => {
    try {
        const response = await api.post(
            "/CommonLoan/GetAllCustomerDetails", req
            //   {
            //     search_text: searchText,
            //   },
            //   {
            //     params: {
            //       page: pageNo,
            //       page_size: page_size,
            //     },
            //   },
        );

        return response.data;
    } catch (error) {
        console.error("GetAllApplications:", error.response?.data || error.message);

        throw error;
    }
};

export const CustomerDetails = async (req) => {
    try {
        const response = await api.post(
            "/CommonLoan/CustomerDetails",
            req
        );

        return response.data;
    } catch (error) {
        console.error("CustomerDetails:", error.response?.data || error.message);

        throw error;
    }
};
