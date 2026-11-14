"use client";

import { useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";

// Client module memory survives layout remounts and resets on a full reload.
let dismissed = false;

export function DemoVideoNotice({ copy }: { copy: Dictionary["demoVideoNotice"] }) {
  const [open, setOpen] = useState(() => !dismissed);
  const previousFocus = useRef<HTMLElement | null>(null);

  function dismiss() {
    dismissed = true;
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={dismiss}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9999] bg-[#142D40]/45" />
        <Dialog.Content
          className="fixed inset-0 z-[10000] m-auto h-fit max-h-[calc(100dvh-2*max(1rem,env(safe-area-inset-top),env(safe-area-inset-bottom)))] w-[calc(100%-2*max(1rem,env(safe-area-inset-left),env(safe-area-inset-right)))] max-w-md overflow-auto rounded-xl border bg-white p-6 text-[#142D40] shadow-xl"
          onOpenAutoFocus={() => {
            previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const prior = previousFocus.current;
            const target = prior?.isConnected && prior !== document.body ? prior :
              document.querySelector<HTMLElement>("main a[href], main button:not(:disabled), a[href]");
            target?.focus({ preventScroll: true });
          }}
        >
          <Dialog.Title className="pr-10 text-xl font-bold">{copy.title}</Dialog.Title>
          <Dialog.Description className="my-4 leading-relaxed">{copy.message}</Dialog.Description>
          <a href={siteConfig.demoVideoUrl} target="_blank" rel="noopener noreferrer" onClick={dismiss}
            className="inline-flex min-h-11 items-center rounded-full bg-[#087F8C] px-5 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#142D40]">
            {copy.watch}
          </a>
          <Dialog.Close aria-label={copy.close} className="absolute right-2 top-2 grid size-11 place-items-center rounded-full hover:bg-[#F8F7F4] focus-visible:outline-2">
            <X aria-hidden="true" size={20} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
