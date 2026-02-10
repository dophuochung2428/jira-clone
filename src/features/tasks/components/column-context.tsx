import { createContext, useContext } from "react";
import invariant from "tiny-invariant";

export type ColumnContextProps = {
    columnId: string;
    getCardIndex: (taskId: string) => number;
    getNumCards: () => number;
};

export const ColumnContext = createContext<ColumnContextProps | null>(null);

export function useColumnContext(): ColumnContextProps {
    const value = useContext(ColumnContext);
    invariant(value, "ColumnContext is missing");
    return value;
}
