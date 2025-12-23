/**
 * Example: How to use the BPM Core System
 *
 * This file demonstrates how to:
 * 1. Initialize the core system
 * 2. Create a custom plugin
 * 3. Use the workflow store
 * 4. Add custom validation
 * 5. Use event system
 */

import type { BaseNodeConfig, BaseRuleConfig, Plugin } from "@/core";
import { pluginManager } from "@/core/plugins/PluginManager";
import { nodeRegistry } from "@/core/registry/NodeRegistry";
import { ruleRegistry } from "@/core/registry/RuleRegistry";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { defaultBpmPlugin } from "@/plugins/defaultBpmPlugin";

// ============================================
// 1. Initialize Core System
// ============================================

export async function initializeWorkflowSystem() {
  try {
    // Install default BPM plugin
    await pluginManager.install(defaultBpmPlugin);
    await pluginManager.activate("default-bpm-plugin");

    console.log("✅ Workflow system initialized");
  } catch (error) {
    console.error("❌ Failed to initialize workflow system:", error);
  }
}

// ============================================
// 2. Create a Custom Plugin - E-commerce Example
// ============================================

export const ecommercePlugin: Plugin = {
  metadata: {
    id: "ecommerce-plugin",
    name: "E-commerce Plugin",
    version: "1.0.0",
    description: "E-commerce workflow nodes for order processing",
    author: "Your Company",
  },
  config: {
    nodes: [
      {
        id: "order-received",
        type: "order-received",
        name: "Order Received",
        config: {
          id: "",
          nodeType: "order-received",
          category: "task",
          position: { x: 0, y: 0 },
          data: {},
          metadata: {
            id: "order-received",
            title: "Order Received",
            description: "Process incoming order",
            version: "1.0.0",
          },
          icon: {
            type: "lucide",
            value: "ShoppingCart",
            color: "#16a34a",
            backgroundColor: "#dcfce7",
          },
          propertyDefinitions: [
            {
              id: "orderId",
              type: "text",
              label: "Order ID",
              required: true,
              placeholder: "Enter order ID",
            },
            {
              id: "customerEmail",
              type: "text",
              label: "Customer Email",
              required: true,
              validation: [
                {
                  id: "email-format",
                  type: "pattern",
                  message: "Please enter a valid email",
                  value: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                },
              ],
            },
            {
              id: "totalAmount",
              type: "number",
              label: "Total Amount",
              required: true,
              validation: [
                {
                  id: "min-amount",
                  type: "min",
                  message: "Amount must be greater than 0",
                  value: 0,
                },
              ],
            },
            {
              id: "paymentMethod",
              type: "select",
              label: "Payment Method",
              required: true,
              options: [
                { label: "Credit Card", value: "credit_card" },
                { label: "PayPal", value: "paypal" },
                { label: "Bank Transfer", value: "bank_transfer" },
              ],
            },
            {
              id: "shippingAddress",
              type: "textarea",
              label: "Shipping Address",
              required: true,
            },
          ],
          properties: {},
          collapsible: true,
          editable: true,
          deletable: true,
          connectable: true,
          draggable: true,
        },
      },
      {
        id: "payment-verification",
        type: "payment-verification",
        name: "Payment Verification",
        config: {
          id: "",
          nodeType: "payment-verification",
          category: "task",
          position: { x: 0, y: 0 },
          data: {},
          metadata: {
            id: "payment-verification",
            title: "Verify Payment",
            description: "Verify payment status",
            version: "1.0.0",
          },
          icon: {
            type: "lucide",
            value: "CreditCard",
            color: "#ea580c",
            backgroundColor: "#ffedd5",
          },
          propertyDefinitions: [
            {
              id: "autoVerify",
              type: "boolean",
              label: "Auto Verify",
              defaultValue: true,
            },
            {
              id: "verificationTimeout",
              type: "number",
              label: "Timeout (seconds)",
              defaultValue: 30,
            },
          ],
          properties: {
            autoVerify: true,
            verificationTimeout: 30,
          },
          connectable: true,
        },
      },
      {
        id: "inventory-check",
        type: "inventory-check",
        name: "Inventory Check",
        config: {
          id: "",
          nodeType: "inventory-check",
          category: "task",
          position: { x: 0, y: 0 },
          data: {},
          metadata: {
            id: "inventory-check",
            title: "Check Inventory",
            description: "Check product availability",
            version: "1.0.0",
          },
          icon: {
            type: "lucide",
            value: "Package",
            color: "#7c3aed",
            backgroundColor: "#f3e8ff",
          },
          propertyDefinitions: [
            {
              id: "warehouseId",
              type: "select",
              label: "Warehouse",
              required: true,
              options: [
                { label: "Warehouse A", value: "wh-a" },
                { label: "Warehouse B", value: "wh-b" },
                { label: "Warehouse C", value: "wh-c" },
              ],
            },
          ],
          properties: {},
        },
      },
      {
        id: "shipping-process",
        type: "shipping-process",
        name: "Shipping Process",
        config: {
          id: "",
          nodeType: "shipping-process",
          category: "task",
          position: { x: 0, y: 0 },
          data: {},
          metadata: {
            id: "shipping-process",
            title: "Process Shipping",
            description: "Prepare and ship order",
            version: "1.0.0",
          },
          icon: {
            type: "lucide",
            value: "Truck",
            color: "#0891b2",
            backgroundColor: "#cffafe",
          },
          propertyDefinitions: [
            {
              id: "carrier",
              type: "select",
              label: "Shipping Carrier",
              required: true,
              options: [
                { label: "FedEx", value: "fedex" },
                { label: "UPS", value: "ups" },
                { label: "DHL", value: "dhl" },
              ],
            },
            {
              id: "priority",
              type: "select",
              label: "Priority",
              options: [
                { label: "Standard", value: "standard" },
                { label: "Express", value: "express" },
                { label: "Overnight", value: "overnight" },
              ],
            },
          ],
          properties: {},
        },
      },
    ],
    rules: [
      {
        id: "minimum-order-value",
        type: "validation",
        name: "Minimum Order Value",
        config: {
          id: "minimum-order-value",
          name: "Minimum Order Value",
          description: "Order must have minimum value of $10",
          type: "validation",
          enabled: true,
          priority: 10,
          scope: "node",
          condition: (context: any) => {
            const { node } = context;
            if (node.nodeType === "order-received") {
              const amount = node.properties?.totalAmount;
              return !amount || amount >= 10;
            }
            return true;
          },
        },
      },
    ],
    contextMenus: [
      {
        id: "ecommerce-menu",
        type: "context-menu",
        name: "E-commerce Node Menu",
        config: {
          id: "ecommerce-menu",
          name: "E-commerce Context Menu",
          targetType: "node",
          targetNodeTypes: [
            "order-received",
            "payment-verification",
            "inventory-check",
          ],
          items: [
            {
              id: "view-order",
              label: "View Order Details",
              icon: {
                type: "lucide",
                value: "Eye",
              },
              onClick: async context => {
                console.log("View order:", context.node?.properties);
                // Open modal with order details
              },
            },
            {
              id: "cancel-order",
              label: "Cancel Order",
              icon: {
                type: "lucide",
                value: "XCircle",
              },
              onClick: async context => {
                const confirmed = confirm(
                  "Are you sure you want to cancel this order?"
                );
                if (confirmed) {
                  console.log("Cancel order:", context.nodeId);
                  // Call cancel API
                }
              },
            },
          ],
        },
      },
    ],
  },
  async initialize() {
    console.log("✅ E-commerce plugin initialized");

    // Setup any initialization logic here
    // e.g., connect to payment gateway, initialize inventory system
  },
  async onActivate() {
    console.log("✅ E-commerce plugin activated");
  },
};

// ============================================
// 3. Using the Workflow Store in Components
// ============================================

export function useWorkflowExample() {
  const { nodes, edges, addNode, updateNode, undo, redo } = useWorkflowStore();

  // Add a new order node
  const addOrderNode = () => {
    const newNode = nodeRegistry.createNode("order-received", {
      position: { x: 100, y: 100 },
      properties: {
        orderId: "ORD-" + Date.now(),
        customerEmail: "",
        totalAmount: 0,
        paymentMethod: "credit_card",
        shippingAddress: "",
      },
    });

    if (newNode) {
      addNode(newNode);
    }
  };

  // Update node properties
  const updateOrderAmount = (nodeId: string, amount: number) => {
    updateNode(nodeId, {
      properties: {
        totalAmount: amount,
      },
    });
  };

  return {
    nodes,
    edges,
    addOrderNode,
    updateOrderAmount,
    undo,
    redo,
  };
}

// ============================================
// 4. Custom Validation Rules
// ============================================

export function setupCustomValidation() {
  // Rule: Ensure payment verification comes after order received
  const paymentAfterOrderRule: BaseRuleConfig = {
    id: "payment-after-order",
    name: "Payment After Order",
    description: "Payment verification must come after order received",
    type: "validation",
    enabled: true,
    priority: 5,
    scope: "workflow",
    condition: (context: any) => {
      const { nodes, edges } = context;

      const paymentNode = nodes.find(
        (n: BaseNodeConfig) => n.nodeType === "payment-verification"
      );
      if (!paymentNode) return true;

      const orderNode = nodes.find(
        (n: BaseNodeConfig) => n.nodeType === "order-received"
      );
      if (!orderNode) return false;

      // Check if there's a path from order to payment
      const hasPath = edges.some(
        (e: any) => e.source === orderNode.id && e.target === paymentNode.id
      );

      return hasPath;
    },
  };

  ruleRegistry.register({
    id: "payment-after-order",
    type: "validation",
    name: "Payment After Order",
    config: paymentAfterOrderRule,
  });
}

// ============================================
// 5. Event System Usage
// ============================================

export function setupEventListeners() {
  // // Listen to node additions
  // globalEventBus.on(WorkflowEventTypes.NODE_ADDED, event => {
  //   console.log("📝 Node added:", event.payload.node.metadata.title);
  //   // Example: Send analytics
  //   // analytics.track('node_added', { type: event.payload.node.nodeType });
  // });
  // // Listen to node updates
  // globalEventBus.on(WorkflowEventTypes.NODE_UPDATED, event => {
  //   console.log("✏️ Node updated:", event.payload.nodeId);
  //   // Example: Auto-save
  //   // autoSaveWorkflow();
  // });
  // // Listen to validation
  // globalEventBus.on(WorkflowEventTypes.WORKFLOW_VALIDATED, event => {
  //   const { valid, errors } = event.payload;
  //   if (valid) {
  //     console.log("✅ Workflow validation passed");
  //   } else {
  //     console.log("❌ Workflow validation failed:", errors);
  //   }
  // });
  // // Custom event example
  // globalEventBus.on("order:processed", event => {
  //   console.log("📦 Order processed:", event.payload);
  //   // Send notification
  //   // notificationService.send({
  //   //   title: 'Order Processed',
  //   //   message: `Order ${event.payload.orderId} has been processed`,
  //   // });
  // });
}

// ============================================
// 6. Full Integration Example
// ============================================

export async function runFullExample() {
  // 1. Initialize system
  await initializeWorkflowSystem();

  // 2. Install custom plugin
  await pluginManager.install(ecommercePlugin);
  await pluginManager.activate("ecommerce-plugin");

  // 3. Setup validation
  setupCustomValidation();

  // 4. Setup event listeners
  setupEventListeners();

  // 5. Create a sample workflow
  const { addNode, addEdge } = useWorkflowStore.getState();

  // Add start node
  const startNode = nodeRegistry.createNode("start-event", {
    position: { x: 100, y: 100 },
  });
  if (startNode) addNode(startNode);

  // Add order node
  const orderNode = nodeRegistry.createNode("order-received", {
    position: { x: 300, y: 100 },
    properties: {
      orderId: "ORD-12345",
      customerEmail: "customer@example.com",
      totalAmount: 99.99,
      paymentMethod: "credit_card",
      shippingAddress: "123 Main St, City, Country",
    },
  });
  if (orderNode) addNode(orderNode);

  // Add payment verification
  const paymentNode = nodeRegistry.createNode("payment-verification", {
    position: { x: 500, y: 100 },
  });
  if (paymentNode) addNode(paymentNode);

  // Add inventory check
  const inventoryNode = nodeRegistry.createNode("inventory-check", {
    position: { x: 700, y: 100 },
  });
  if (inventoryNode) addNode(inventoryNode);

  // Add shipping
  const shippingNode = nodeRegistry.createNode("shipping-process", {
    position: { x: 900, y: 100 },
  });
  if (shippingNode) addNode(shippingNode);

  // Add end node
  const endNode = nodeRegistry.createNode("end-event", {
    position: { x: 1100, y: 100 },
  });
  if (endNode) addNode(endNode);

  // Connect nodes
  if (startNode && orderNode) {
    addEdge({
      id: "e1",
      source: startNode.id,
      target: orderNode.id,
      edgeType: "default",
      pathType: "default",
      metadata: { id: "e1", title: "" },
    });
  }

  console.log("✅ Example workflow created!");
}
