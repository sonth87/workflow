import { Button, Dialog, cn } from "@sth87/shadcn-design-system";
import { Info as InfoIcon } from "lucide-react";
import React, { useState } from "react";
import { defaultShortcuts } from "@/core/keyboard/defaultShortcuts";

interface ShortcutsProps {
  className?: string;
}

export function Shortcuts({ className }: ShortcutsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupedShortcuts = defaultShortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, typeof defaultShortcuts>
  );

  return (
    <>
      <Button
        title="Keyboard Shortcuts"
        onClick={() => setIsModalOpen(true)}
        color="muted"
        className={cn("flex items-center gap-2", className)}
      >
        <InfoIcon size={18} />
      </Button>

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Keyboard Shortcuts"
        description="List of available keyboard shortcuts in the workflow"
        confirmButton={{
          onClick: () => setIsModalOpen(false),
          text: "Close",
        }}
        size="lg"
      >
        <div className="max-h-96 overflow-y-auto space-y-4">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold capitalize mb-2">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts.map(shortcut => (
                  <div
                    key={shortcut.id}
                    className="flex justify-between items-center p-2 bg-muted rounded"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {Array.isArray(shortcut.keys) ? (
                        shortcut.keys.map((key, index) => (
                          <React.Fragment key={index}>
                            <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                              {typeof key === "string" ? key : key.key}
                            </kbd>
                            {index < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground">or</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <kbd className="px-2 py-1 bg-background border rounded text-xs font-mono">
                          {shortcut.keys}
                        </kbd>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
}
