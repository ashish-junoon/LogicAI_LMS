import { createContext, useContext, useState } from "react";

const DataContext = createContext()

export const DataProvider = ({children}) => {
    const [state, setState] = useState()

    return <DataContext.Provider value={{state}}>{children}</DataContext.Provider>
}

export const useGetData = () => {
    return useContext(DataContext)
}