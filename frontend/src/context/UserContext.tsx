import { createContext, ReactNode, useState } from "react";

// Define the context type
interface UserContextType {
  user: any; // Replace 'any' with a more specific type according to your user object
  setUser: (user: any) => void; // Again, replace 'any' with a specific type
  checkInStatus: string;
  setCheckInStatus: (status: string) => void;
}

// Create a default context value
const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {},
  checkInStatus: "",
  setCheckInStatus: () => {}
};

// Create the context with the default value
export const UserContext = createContext<UserContextType>(defaultContextValue);

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<any>(null); // Use a specific type instead of 'any'
  const [checkInStatus, setCheckInStatus] = useState<string>("");

  return (
    <UserContext.Provider value={{ user, setUser, checkInStatus, setCheckInStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
