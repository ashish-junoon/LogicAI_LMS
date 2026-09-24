import { createContext, useContext, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({children})=> {
    const [state, setState] = useState()

    return <UserContext.Provider value={{state}}>{children}</UserContext.Provider>
}

export const useUser = () => {
    return useContext(UserContext)
}