"use client";

import { useEffect } from "react";

export const HOMEPAGE_SAVE_EVENT = "sharehope:save-homepage";
export const HOMEPAGE_DIRTY_EVENT = "sharehope:homepage-dirty";

interface HomepageSaveEventDetail {
  tasks: Promise<void>[];
}

export function markHomepageDirty() {
  window.dispatchEvent(new Event(HOMEPAGE_DIRTY_EVENT));
}

export async function saveHomepageEditors() {
  const detail: HomepageSaveEventDetail = { tasks: [] };
  window.dispatchEvent(new CustomEvent<HomepageSaveEventDetail>(HOMEPAGE_SAVE_EVENT, { detail }));
  const results = await Promise.allSettled(detail.tasks);
  const failed = results.find((result) => result.status === "rejected");
  if (failed?.status === "rejected") throw failed.reason;
}

export function useHomepageSaveEvent(save: () => void | Promise<void>) {
  useEffect(() => {
    const handleSave = (event: Event) => {
      const customEvent = event as CustomEvent<HomepageSaveEventDetail>;
      customEvent.detail.tasks.push(Promise.resolve().then(save));
    };
    window.addEventListener(HOMEPAGE_SAVE_EVENT, handleSave);
    return () => window.removeEventListener(HOMEPAGE_SAVE_EVENT, handleSave);
  }, [save]);
}
