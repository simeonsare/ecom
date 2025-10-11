/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, ReactNode, useContext } from "react";

interface User {
  id: string;
  email: string;
  is_superuser: boolean;
  // add other user fields you need
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

