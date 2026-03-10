import { FC } from "react";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-semibold text-3xl sm:text-5xl tracking-wider">
      {children}
    </h1>
  );
}

interface HeadingRichProps {
  serialNumber: number;
  text: string;
  helpCb?: () => void;
  tooltipText?: string;
}

export const HeadingRich: FC<HeadingRichProps> = ({
  serialNumber,
  text,
  helpCb,
  tooltipText = "Click for help!",
}) => {
  return (
    <p className="flex gap-4 items-center justify-start font-fraunces">
      <span className="bg-foreground text-background h-8 w-8 rounded-full flex items-center justify-center font-medium text-base">
        {serialNumber}
      </span>
      <span className="flex flex-1 items-center gap-2">
        <span className="text-xl font-semibold text-foreground">{text}</span>
        {helpCb ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  className="bg-transparent hover:bg-transparent text-foreground"
                  style={{ padding: "0px" }}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    e.preventDefault();
                    helpCb();
                  }}
                >
                  <InfoIcon className="mt-0.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <></>
        )}
      </span>
    </p>
  );
};
