import { createContext, useContext, useState } from "react";

const userContext = createContext()

export const LoanProvider = ({children})=> {
    const [loanDetails, setLoanDetails] = useState({});
    const [singleLoanDetails, setsingleLoanDetails] = useState({});
    return <userContext.Provider value={{loanDetails, singleLoanDetails, setLoanDetails, setsingleLoanDetails}}>{children}</userContext.Provider>
}

export const useLoanDetails = () => {
    return useContext(userContext)
}