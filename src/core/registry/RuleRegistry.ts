/**
 * Rule Registry
 * Registry để quản lý các validation và business rules
 */

import type { BaseRuleConfig } from "../types/base.types";
import { BaseRegistry } from "./BaseRegistry";

export class RuleRegistry extends BaseRegistry<BaseRuleConfig> {
  constructor() {
    super("RuleRegistry");
  }

  /**
   * Execute rule
   */
  async executeRule(ruleId: string, context: unknown): Promise<boolean> {
    const item = this.get(ruleId);
    if (!item || !item.config.enabled) {
      return true;
    }

    const rule = item.config;

    try {
      // Check condition first
      if (rule.condition) {
        let conditionResult = false;

        if (typeof rule.condition === "function") {
          conditionResult = rule.condition(context);
        } else if (typeof rule.condition === "string") {
          // Could use eval or a safe expression evaluator
          // For now, just log it
          console.warn("String conditions not yet implemented");
          conditionResult = true;
        }

        if (!conditionResult) {
          return true; // Rule condition not met, skip execution
        }
      }

      // Execute action
      if (rule.action) {
        await rule.action(context);
      }

      return true;
    } catch (error) {
      console.error(`Error executing rule "${ruleId}":`, error);
      return false;
    }
  }

  /**
   * Get rules by scope
   */
  getRulesByScope(scope: BaseRuleConfig["scope"]): BaseRuleConfig[] {
    return this.getAll()
      .filter(item => item.config.scope === scope)
      .map(item => item.config)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  /**
   * Get enabled rules
   */
  getEnabledRules(): BaseRuleConfig[] {
    return this.getAll()
      .filter(item => item.config.enabled)
      .map(item => item.config);
  }

  /**
   * Execute multiple rules
   */
  async executeRules(ruleIds: string[], context: unknown): Promise<boolean[]> {
    return Promise.all(ruleIds.map(id => this.executeRule(id, context)));
  }
}

// Global rule registry instance
export const ruleRegistry = new RuleRegistry();
