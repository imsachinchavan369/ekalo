"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { listenToCurrentUser } from "@/lib/auth";
import { checkIsAdmin } from "@/lib/admin";
import { initializeHomepageContent, listenToHomepageContent, updateHomepageContent } from "@/lib/siteContent";
import type { HomepageContent } from "@/types/siteContent";
import { defaultHomepageContent } from "@/lib/siteContent";

type AdminContextValue = {
  user: User | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  isCheckingAdmin: boolean;
};

type SiteContentContextValue = {
  content: HomepageContent;
  contentExists: boolean;
  initializeContent: () => Promise<void>;
  updateContent: (updates: Record<string, unknown>) => Promise<void>;
};

const AdminContext = createContext<AdminContextValue>({
  user: null,
  isAdmin: false,
  isAuthLoading: true,
  isCheckingAdmin: true
});

const SiteContentContext = createContext<SiteContentContextValue>({
  content: defaultHomepageContent,
  contentExists: false,
  initializeContent: async () => undefined,
  updateContent: async () => undefined
});

export function AppProviders({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [contentExists, setContentExists] = useState(false);

  useEffect(() => {
    return listenToCurrentUser((currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkAdmin() {
      setIsCheckingAdmin(true);
      if (isAuthLoading) {
        return;
      }

      if (!user) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const result = await checkIsAdmin(user);
        if (isMounted) {
          setIsAdmin(result.isAdmin);
        }
      } catch {
        if (isMounted) {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAdmin(false);
        }
      }
    }

    checkAdmin();
    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, user]);

  useEffect(() => {
    try {
      return listenToHomepageContent((nextContent, exists) => {
        setContent(nextContent);
        setContentExists(exists);
      });
    } catch {
      setContent(defaultHomepageContent);
      setContentExists(false);
      return () => undefined;
    }
  }, []);

  const adminValue = useMemo(
    () => ({
      user,
      isAdmin,
      isAuthLoading,
      isCheckingAdmin
    }),
    [isAdmin, isAuthLoading, isCheckingAdmin, user]
  );

  const siteContentValue = useMemo(
    () => ({
      content,
      contentExists,
      initializeContent: async () => {
        if (!user) {
          throw new Error("Log in before initializing homepage content.");
        }

        await initializeHomepageContent(user.uid);
      },
      updateContent: async (updates: Record<string, unknown>) => {
        if (!user) {
          throw new Error("Log in before editing homepage content.");
        }

        await updateHomepageContent(updates, user.uid);
      }
    }),
    [content, contentExists, user]
  );

  return (
    <AdminContext.Provider value={adminValue}>
      <SiteContentContext.Provider value={siteContentValue}>{children}</SiteContentContext.Provider>
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
