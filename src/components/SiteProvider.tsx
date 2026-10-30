"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { decodeVisible } from "@/lib/decode";
import { secrets } from "@/content/secrets";

export type Mode = "ifeanyi" | "cipher";

type Toast = { id: number; text: string };

type SiteState = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  keyring: string[];
  discover: (id: string, message?: string) => boolean;
  hasFound: (id: string) => boolean;
  toasts: Toast[];
  toast: (text: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  keyringOpen: boolean;
  setKeyringOpen: (v: boolean) => void;
  firstDecode: boolean;
  dismissFirstDecode: () => void;
};

const SiteContext = createContext<SiteState | null>(null);

const MODE_KEY = "iej:mode";
const KEYRING_KEY = "iej:keyring";

// localStorage can throw (private windows, blocked storage); never let it break the page.
function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("ifeanyi");
  const [keyring, setKeyring] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyringOpen, setKeyringOpen] = useState(false);
  const [firstDecode, setFirstDecode] = useState(false);
  const keyringRef = useRef<string[]>([]);
  const toastId = useRef(0);

  // Pick up what the inline <head> script already applied, plus the saved keyring.
  useEffect(() => {
    setModeState(document.documentElement.dataset.mode === "cipher" ? "cipher" : "ifeanyi");
    const saved = read<string[]>(KEYRING_KEY, []).filter((id) => id in secrets);
    keyringRef.current = saved;
    setKeyring(saved);
  }, []);

  const toast = useCallback((text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const discover = useCallback(
    (id: string, message?: string) => {
      if (keyringRef.current.includes(id)) return false;
      const next = [...keyringRef.current, id];
      keyringRef.current = next;
      setKeyring(next);
      write(KEYRING_KEY, next);
      toast(message ?? `◇ found: ${secrets[id] ?? id}`);
      return true;
    },
    [toast],
  );

  const hasFound = useCallback((id: string) => keyring.includes(id), [keyring]);

  const setMode = useCallback(
    (m: Mode) => {
      const root = document.documentElement;
      if ((root.dataset.mode === "cipher" ? "cipher" : "ifeanyi") === m) return;
      root.classList.add("mode-switching");
      if (m === "cipher") root.dataset.mode = "cipher";
      else delete root.dataset.mode;
      setModeState(m);
      write(MODE_KEY, m);
      requestAnimationFrame(() => decodeVisible());
      setTimeout(() => root.classList.remove("mode-switching"), 650);
      if (m === "cipher" && !keyringRef.current.includes("two-readings")) {
        discover("two-readings", "◇ you decoded the site.");
        setFirstDecode(true);
      }
    },
    [discover],
  );

  const toggleMode = useCallback(() => setMode(mode === "cipher" ? "ifeanyi" : "cipher"), [mode, setMode]);

  // Global keys: ⌘K / Ctrl+K opens the command line; ⌘. switches readings.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if ((e.metaKey || e.ctrlKey) && e.key === ".") {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleMode]);

  const value = useMemo<SiteState>(
    () => ({
      mode,
      setMode,
      toggleMode,
      keyring,
      discover,
      hasFound,
      toasts,
      toast,
      paletteOpen,
      setPaletteOpen,
      menuOpen,
      setMenuOpen,
      keyringOpen,
      setKeyringOpen,
      firstDecode,
      dismissFirstDecode: () => setFirstDecode(false),
    }),
    [mode, setMode, toggleMode, keyring, discover, hasFound, toasts, toast, paletteOpen, menuOpen, keyringOpen, firstDecode],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

/** Runs before first paint (inlined in <head>) so the saved reading never flashes. */
export const modeBootScript = `try{var m=JSON.parse(localStorage.getItem("${MODE_KEY}"));if(m==="cipher")document.documentElement.dataset.mode="cipher"}catch(e){}`;
