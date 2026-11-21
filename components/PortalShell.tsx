"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { Wordmark } from "./Wordmark";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}
interface ShellProps {
  area: "Customer" | "Operations";
  navigation: NavigationItem[];
  logoutHref: string;
  toolbar: ReactNode;
  pageKey: string;
  children: ReactNode;
}

export function PortalShell({ area, navigation, logoutHref, toolbar, pageKey, children }: ShellProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const previousPage = useRef(pageKey);
  useEffect(() => {
    if (previousPage.current !== pageKey && !document.activeElement?.closest(".preview-tools")) {
      main.current?.focus();
    }
    previousPage.current = pageKey;
  }, [pageKey]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnResize = () => {
      if (desktop.matches && dialog.current?.open) {
        dialog.current.close();
        main.current?.focus();
      }
    };
    desktop.addEventListener("change", closeOnResize);
    return () => desktop.removeEventListener("change", closeOnResize);
  }, []);

  function links(inDrawer: boolean) {
    function follow() {
      if (inDrawer) dialog.current?.close();
      main.current?.focus();
    }
    return <>
      <Wordmark />
      <nav aria-label={area + " navigation"}>
        {navigation.map(({ label, href, icon: Icon, active }) =>
          <a key={label} href={href} aria-current={active ? "page" : undefined} onClick={follow}>
            <Icon size={19} aria-hidden="true" />{label}
          </a>)}
      </nav>
      <a className="logout" href={logoutHref} onClick={follow}><LogOut size={19} aria-hidden="true" />Logout</a>
    </>;
  }

  return <div className="portal">
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <aside className="rail">{links(false)}</aside>
    <header className="portal-bar">
      <button ref={opener} className="menu-toggle" aria-haspopup="dialog" aria-label="Open navigation" onClick={() => dialog.current?.showModal()}><Menu aria-hidden="true" /></button>
      <span className="area-name">{area} portal</span>
      {toolbar}
    </header>
    <dialog ref={dialog} className="drawer" aria-label={area + " navigation menu"} onCancel={() => opener.current?.focus()}>
      <button className="close-menu" aria-label="Close navigation" onClick={() => { dialog.current?.close(); opener.current?.focus(); }}><X aria-hidden="true" /></button>
      {links(true)}
    </dialog>
    <main ref={main} id="main" tabIndex={-1} className="portal-main">{children}</main>
  </div>;
}
