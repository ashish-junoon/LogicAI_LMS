import { createContext, useContext, useState } from "react";

const userContext = createContext()

export const LoanProvider = ({children})=> {
    const [loanDetails, setLoanDetails] = useState({});
    return <userContext.Provider value={{loanDetails, setLoanDetails}}>{children}</userContext.Provider>
}

export const useLoanDetails = () => {
    return useContext(userContext)
}