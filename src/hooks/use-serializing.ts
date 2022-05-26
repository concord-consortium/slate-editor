import { createContext, useContext } from "react";

export const SerializingContext = createContext(false);

export const useSerializing = () => useContext(SerializingContext);
