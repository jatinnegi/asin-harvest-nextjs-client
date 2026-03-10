import { FC, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import clsx from "clsx";

interface ProgressItem {
  id: string;
  label: string;
}

const progressItems: ProgressItem[] = [
  {
    id: "reading-asin-list",
    label: "Reading ASIN list",
  },
  {
    id: "connecting-to-amazon",
    label: "Connecting to Amazon",
  },
  {
    id: "fetching-product-data",
    label: "Fetching product data",
  },
  {
    id: "processing-and-enriching",
    label: "Processing & enriching",
  },
  {
    id: "generating-export-file",
    label: "Generating export file",
  },
];

interface Props {
  open: boolean;
  progress: ProgressProp;
}

export const LiveProgress: FC<Props> = ({ open, progress }) => {
  const [progressNumber, setProgressNumber] = useState<number>(0);
  const [nextProgressStop, setNextProgressStop] = useState<number>(
    parseInt((progress?.nextProgressStop || 0).toString()),
  );

  useEffect(() => {
    setNextProgressStop(parseInt((progress?.nextProgressStop || 0).toString()));
    setProgressNumber(
      parseInt(progress?.progress ? progress?.progress.toString() : "0"),
    );
  }, [progress?.progress]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutSeconds = Math.random() * 1000 + 0.75;

    const timeout = setTimeout(() => {
      const newProgressNumber = Math.min(nextProgressStop, progressNumber + 1);
      setProgressNumber(Math.min(100, newProgressNumber));
    }, timeoutSeconds);
    return () => {
      clearTimeout(timeout);
    };
  }, [open, nextProgressStop, progressNumber]);

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md overflow-y-scroll max-h-11/12"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">
            Harvesting...
          </DialogTitle>
          <DialogDescription className="text-center">
            Processing & enriching...
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-col gap-1.5 text-sm">
          <ul className="list-none flex flex-col">
            {progressItems.map((progressItem: ProgressItem) => (
              <li
                key={progressItem.id}
                className="flex gap-3 items-center justify-start border-b border-solid border-foreground/10 py-3"
              >
                <span
                  className={clsx(
                    progress.current === progressItem.id
                      ? "bg-chart-2/75 animate-shadow-pulse"
                      : progress.finished?.includes(progressItem.id)
                        ? "bg-chart-2/75 animate-none"
                        : "bg-foreground/50",
                    "block h-2 w-2 rounded-full",
                  )}
                ></span>
                <span
                  className={
                    progress.current === progressItem.id ||
                    progress.finished?.includes(progressItem.id)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {progressItem.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <div className="flex flex-col gap-3 items-center justify-start w-full mt-4">
          <div className="overflow-hidden relative block h-1 w-full bg-foreground/15 rounded">
            <span
              className="absolute top-0 left-0 h-full bg-chart-2/75 rounded ease-in duration-200"
              style={{
                width: `${progressNumber}%`,
              }}
            ></span>
          </div>
          <span className="text-sm">{progressNumber}%</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
