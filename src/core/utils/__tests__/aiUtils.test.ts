import { describe, it, expect, vi } from 'vitest';
import { validateGeneratedWorkflow } from '../aiUtils';
import { nodeRegistry } from '../../registry/NodeRegistry';

// Mock registry
vi.mock('../../registry/NodeRegistry', () => ({
  nodeRegistry: {
    has: vi.fn(),
    getAll: vi.fn(() => [])
  }
}));

describe('validateGeneratedWorkflow', () => {
  it('should pass for valid workflow', () => {
    // Setup mock
    (nodeRegistry.has as any).mockReturnValue(true);

    const nodes: any[] = [
      { id: 'start', type: 'start-event' },
      { id: 'end', type: 'end-event' }
    ];
    const edges: any[] = [
      { id: 'e1', source: 'start', target: 'end' }
    ];

    const result = validateGeneratedWorkflow(nodes, edges);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail for invalid node types', () => {
    (nodeRegistry.has as any).mockImplementation((type: string) => type === 'valid-type');

    const nodes: any[] = [
      { id: 'start', type: 'invalid-type' }
    ];
    const edges: any[] = [];

    const result = validateGeneratedWorkflow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Invalid node type');
  });

  it('should fail for edges referencing missing nodes', () => {
    (nodeRegistry.has as any).mockReturnValue(true);

    const nodes: any[] = [
        { id: 'n1', type: 't1' }
    ];
    const edges: any[] = [
        { id: 'e1', source: 'n1', target: 'MISSING' }
    ];

    const result = validateGeneratedWorkflow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('missing target node');
  });

  it('should fail if missing start event', () => {
    (nodeRegistry.has as any).mockReturnValue(true);

    const nodes: any[] = [
        { id: 'n1', type: 'task' }
    ];
    const edges: any[] = [];

    const result = validateGeneratedWorkflow(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('missing Start Event');
  });
});
