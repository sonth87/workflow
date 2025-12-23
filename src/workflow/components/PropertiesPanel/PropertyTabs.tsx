/**
 * PropertyTabs Component
 * Tabs wrapper cho property groups (simplified tabs implementation)
 */

import type {
  PropertyGroupDefinition,
  PropertyEntity,
} from "@/core/properties";
import { PropertyGroup } from "./PropertyGroup";
import { useState } from "react";
import { cn } from "@sth87/shadcn-design-system";

interface PropertyTabsProps {
  groups: PropertyGroupDefinition[];
  entity: PropertyEntity;
}

/**
 * Component render tabs cho property groups
 * Using custom tabs implementation since shadcn tabs API might be different
 */
export function PropertyTabs({ groups, entity }: PropertyTabsProps) {
  const [activeTab, setActiveTab] = useState(groups[0]?.id || "");

  if (groups.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        No property groups available
      </div>
    );
  }

  // Nếu chỉ có 1 group, không cần tabs
  if (groups.length === 1) {
    return (
      <div className="p-4">
        <PropertyGroup
          group={groups[0]}
          entity={entity}
          propertyGroups={groups}
        />
      </div>
    );
  }

  const activeGroup = groups.find(g => g.id === activeTab) || groups[0];

  return (
    <div className="w-full">
      {/* Tabs List */}
      <div className="border-b border-border">
        <div className="flex">
          {groups.map(group => {
            const Icon = group.icon;
            const isActive = group.id === activeTab;

            return (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                  isActive
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{group.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <PropertyGroup
          group={activeGroup}
          entity={entity}
          propertyGroups={groups}
        />
      </div>
    </div>
  );
}
