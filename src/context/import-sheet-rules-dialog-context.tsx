"use client";

import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

const ImportSheetRulesDialogContext = createContext<{
  disableImportSheetRulesDialog: boolean;
  setDisableImportSheetRulesDialog: Dispatch<SetStateAction<boolean>>;
  openImportSheetRulesDialog: boolean;
  setOpenImportSheetRulesDialog: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export function ImportSheetRulesDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [disable, setDisable] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ImportSheetRulesDialogContext.Provider
      value={{
        disableImportSheetRulesDialog: disable,
        setDisableImportSheetRulesDialog: setDisable,
        openImportSheetRulesDialog: open,
        setOpenImportSheetRulesDialog: setOpen,
      }}
    >
      {children}
    </ImportSheetRulesDialogContext.Provider>
  );
}

export function useImportSheetRulesDialog() {
  const ctx = useContext(ImportSheetRulesDialogContext);
  if (!ctx) {
    throw new Error(
      "useImportSheetRulesDialog must be used within ImportSheetRulesDialogProvider",
    );
  }

  return ctx;
}
