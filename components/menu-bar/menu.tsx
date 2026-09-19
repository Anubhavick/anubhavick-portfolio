"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check } from "lucide-react";

export interface MenuItemDef {
  type?: "item" | "separator" | "note";
  label?: string;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  active?: boolean;
}

interface MenuProps {
  label: string;
  items: MenuItemDef[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function Menu({ label, items, isOpen, onOpen, onClose }: MenuProps) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectableIndexes = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => (item.type ?? "item") === "item" && !item.disabled)
    .map(({ i }) => i);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  function handleOpen() {
    setActiveIndex(selectableIndexes[0] ?? -1);
    onOpen();
  }

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      onClose();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onClose]);

  function move(direction: 1 | -1) {
    if (selectableIndexes.length === 0) return;
    const pos = selectableIndexes.indexOf(activeIndex);
    const nextPos =
      (pos === -1 ? 0 : pos + direction + selectableIndexes.length) %
      selectableIndexes.length;
    setActiveIndex(selectableIndexes[nextPos]);
  }

  function activate(index: number) {
    const item = items[index];
    if (!item || (item.type ?? "item") !== "item" || item.disabled) return;
    item.onSelect?.();
    onClose();
    buttonRef.current?.focus();
  }

  function handlePanelKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        activate(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        buttonRef.current?.focus();
        break;
      case "Tab":
        onClose();
        break;
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => (isOpen ? onClose() : handleOpen())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter") {
            e.preventDefault();
            handleOpen();
          }
        }}
        className={`rounded-control px-2 py-0.5 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
          isOpen ? "bg-accent-soft/25 text-ink" : "text-ink-muted hover:text-ink"
        }`}
      >
        {label}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label={label}
          aria-activedescendant={
            activeIndex >= 0 ? `${menuId}-item-${activeIndex}` : undefined
          }
          tabIndex={-1}
          onKeyDown={handlePanelKeyDown}
          className="absolute left-0 top-full z-50 mt-1 min-w-48 rounded-window border border-hairline bg-surface-1 py-1 shadow-window outline-none"
        >
          {items.map((item, i) => {
            if (item.type === "separator") {
              return (
                <div
                  key={`sep-${i}`}
                  role="separator"
                  className="my-1 h-px bg-hairline"
                />
              );
            }
            if (item.type === "note") {
              return (
                <p
                  key={`note-${i}`}
                  className="px-3 py-1 font-mono text-xs text-ink-muted"
                >
                  {item.label}
                </p>
              );
            }
            const active = i === activeIndex;
            return (
              <button
                key={item.label}
                id={`${menuId}-item-${i}`}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onPointerEnter={() => !item.disabled && setActiveIndex(i)}
                onClick={() => activate(i)}
                className={`flex w-full items-center justify-between gap-6 px-3 py-1 text-left text-sm outline-none disabled:cursor-not-allowed disabled:text-ink-muted/50 ${
                  active && !item.disabled ? "bg-accent-soft/25 text-ink" : "text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.active ? <Check size={13} strokeWidth={2.5} /> : <span className="w-[13px]" />}
                  {item.label}
                </span>
                {item.shortcut && (
                  <span className="font-mono text-xs text-ink-muted">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
