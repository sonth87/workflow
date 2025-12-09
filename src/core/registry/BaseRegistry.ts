/**
 * Base Registry Class
 * Class cơ sở cho tất cả các registry (Node, Edge, Rule, Theme, etc.)
 */

import type { RegistryItem } from "../types/base.types";
import { globalEventBus, WorkflowEventTypes } from "../events/EventBus";

export class BaseRegistry<T = unknown> {
  private items: Map<string, RegistryItem<T>> = new Map();
  private registryName: string;

  constructor(name: string) {
    this.registryName = name;
  }

  /**
   * Register một item mới
   */
  register(item: RegistryItem<T>): void {
    if (this.items.has(item.id)) {
      console.warn(
        `Item with id "${item.id}" already exists in ${this.registryName}. Overwriting...`
      );
    }

    this.items.set(item.id, item);

    globalEventBus.emit(WorkflowEventTypes.REGISTRY_ITEM_REGISTERED, {
      registry: this.registryName,
      item,
    });
  }

  /**
   * Register nhiều items cùng lúc
   */
  registerMany(items: RegistryItem<T>[]): void {
    items.forEach(item => this.register(item));
  }

  /**
   * Unregister một item
   */
  unregister(id: string): boolean {
    const item = this.items.get(id);
    const deleted = this.items.delete(id);

    if (deleted && item) {
      globalEventBus.emit(WorkflowEventTypes.REGISTRY_ITEM_UNREGISTERED, {
        registry: this.registryName,
        item,
      });
    }

    return deleted;
  }

  /**
   * Get một item theo id
   */
  get(id: string): RegistryItem<T> | undefined {
    return this.items.get(id);
  }

  /**
   * Get config của một item
   */
  getConfig(id: string): T | undefined {
    return this.items.get(id)?.config;
  }

  /**
   * Check xem item có tồn tại không
   */
  has(id: string): boolean {
    return this.items.has(id);
  }

  /**
   * Get tất cả items
   */
  getAll(): RegistryItem<T>[] {
    return Array.from(this.items.values());
  }

  /**
   * Get items theo type
   */
  getByType(type: string): RegistryItem<T>[] {
    return this.getAll().filter(item => item.type === type);
  }

  /**
   * Get items theo category
   */
  getByCategory(category: string): RegistryItem<T>[] {
    return this.getAll().filter(item => item.category === category);
  }

  /**
   * Search items
   */
  search(query: string): RegistryItem<T>[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.id.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Clear tất cả items
   */
  clear(): void {
    this.items.clear();
  }

  /**
   * Get số lượng items
   */
  size(): number {
    return this.items.size;
  }

  /**
   * Get tất cả categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.getAll().forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  }

  /**
   * Get tất cả types
   */
  getTypes(): string[] {
    const types = new Set<string>();
    this.getAll().forEach(item => {
      types.add(item.type);
    });
    return Array.from(types);
  }

  /**
   * Update một item
   */
  update(id: string, updates: Partial<RegistryItem<T>>): boolean {
    const item = this.items.get(id);
    if (!item) {
      return false;
    }

    const updatedItem = { ...item, ...updates };
    this.items.set(id, updatedItem);

    globalEventBus.emit(WorkflowEventTypes.REGISTRY_ITEM_REGISTERED, {
      registry: this.registryName,
      item: updatedItem,
    });

    return true;
  }
}
