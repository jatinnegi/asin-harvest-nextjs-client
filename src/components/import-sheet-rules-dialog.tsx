"use client";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImportSheetRulesDialogType {
  openImportSheetRulesDialog: boolean;
  setOpenImportSheetRulesDialog: Dispatch<SetStateAction<boolean>>;
}

export const ImportSheetRulesDialog: FC<ImportSheetRulesDialogType> = ({
  openImportSheetRulesDialog,
  setOpenImportSheetRulesDialog,
}) => {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  // To avoid hydration errors
  const visualModeSrc: string = mounted
    ? resolvedTheme === "dark"
      ? "/assets/import-sheet-rules-visual-representation-dark-mode.gif"
      : "/assets/import-sheet-rules-visual-representation-light-mode.gif"
    : "/assets/import-sheet-rules-visual-representation-light-mode.gif";

  return (
    <Dialog
      open={openImportSheetRulesDialog}
      onOpenChange={setOpenImportSheetRulesDialog}
    >
      <DialogContent className="sm:max-w-md max-h-[95svh] overflow-y-scroll">
        <DialogHeader className="text-left">
          <DialogTitle>Help</DialogTitle>
        </DialogHeader>
        <section className="flex flex-col gap-1.5 text-sm">
          <ul className="list-none ml-0.5 sm:ml-1 flex flex-col gap-1 sm:gap-2">
            <li className="flex gap-1 items-start justify-start">
              <span>1.</span>
              <span>Add all ASIN codes under column "A" from row 2.</span>
            </li>
            <li className="flex gap-1 items-start justify-start">
              <span>2.</span>
              <span>All other columns will be ignored.</span>
            </li>
            <li className="flex gap-1 items-start justify-start">
              <span>3.</span>
              <span>
                If using a Google Spreadsheet, ensure it's publicly accessible.
              </span>
            </li>
          </ul>
          <div className="relative w-full aspect-[1.105/1] mt-2">
            <Image
              src={visualModeSrc}
              alt="import-sheet-rules-visual-representation"
              layout="fill"
              objectFit="contain"
              loading="eager"
            />
          </div>
        </section>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={(_: React.MouseEvent<HTMLButtonElement>) => {
                setOpenImportSheetRulesDialog(false);
              }}
            >
              Got it!
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
