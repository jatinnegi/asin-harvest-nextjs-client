import { Dispatch, FC, SetStateAction } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  exportedLink: string;
  open: boolean;
  close: () => void;
}

export const ExportSuccess: FC<Props> = ({ exportedLink, open, close }) => {
  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md overflow-y-scroll max-h-11/12 flex flex-col items-center justify-center gap-2 py-8 text-center"
        showCloseButton={false}
      >
        <DialogTitle>
          <span className="text-4xl sm:text-5xl">✅</span>
        </DialogTitle>
        <p className="text-xl sm:text-2xl font-bold font-fraunces">
          Export Ready!
        </p>
        <p className="text-xs sm:text-sm text-foreground/60">
          CSV export for Amazon US marketplace is ready.
        </p>
        {exportedLink.includes("google") ? (
          <a
            target="_blank"
            href={exportedLink}
            className="bg-foreground hover:bg-foreground/85 text-background mt-3 mb-2 rounded-sm py-2.5 px-10 flex items-center justify-center gap-3"
          >
            <span className="mt-0.5">⬇</span>
            <span className="text-sm sm:text-base font-medium font-fraunces">
              Download Export
            </span>
          </a>
        ) : (
          <a
            href={exportedLink}
            className="bg-foreground hover:bg-foreground/85 text-background mt-3 mb-2 rounded-sm py-2.5 px-10 flex items-center justify-center gap-3"
          >
            <span className="mt-0.5">⬇</span>
            <span className="text-sm sm:text-base font-medium font-fraunces">
              Download Export
            </span>
          </a>
        )}
        <Button
          type="button"
          className="bg-transparent hover:bg-transparent text-foreground/60 underline tracking-wide p-0 h-auto w-auto text-xs sm:text-sm"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            close();
          }}
        >
          Start a new harvest
        </Button>
      </DialogContent>
    </Dialog>
  );
};
