"use client";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const DemoButton: FC = () => {
  const [openDemo, setOpenDemo] = useState<boolean>(false);

  return (
    <>
      <Button
        className="text-sm"
        onClick={() => {
          setOpenDemo(true);
        }}
      >
        Demo
      </Button>
      <Dialog open={openDemo} onOpenChange={setOpenDemo}>
        <DialogContent className="w-[90vw] max-w-4xl! max-h-[90svh] p-0 flex flex-col items-start justify-start">
          <DialogHeader className="text-left p-6 pb-0">
            <DialogTitle>Demo</DialogTitle>
          </DialogHeader>
          <section className="w-full p-6 pt-0 overflow-y-scroll flex-1">
            <video
              src="/assets/demo.mp4"
              className="w-full rounded-md overflow-hidden"
              controls
              autoPlay
              muted
              playsInline
            />
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
};
