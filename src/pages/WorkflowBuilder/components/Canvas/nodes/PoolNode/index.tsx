import { useState, useCallback, useMemo } from 'react'
import { NodeResizer, type NodeProps, useReactFlow, useUpdateNodeInternals } from '@xyflow/react'
import { Plus, GripVertical, Edit2, Trash2 } from 'lucide-react'
import type { PoolNode as PoolNodeType } from '@/types/workflow.type'

export function PoolNode({ id, data, selected }: NodeProps) {
  const { setNodes } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()
  const poolData = useMemo(() => (data as Partial<PoolNodeType>) || {}, [data])

  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [label, setLabel] = useState(poolData.label || 'Pool')
  const [rows, setRows] = useState(poolData.rows || [{ id: '1', label: 'Lane 1', height: 150 }])
  const [columns, setColumns] = useState(
    poolData.columns || [{ id: '1', label: 'Phase 1', width: 300 }]
  )
  const [customSize, setCustomSize] = useState<{ width?: number; height?: number } | null>(null)
  const [editingCell, setEditingCell] = useState<{ type: 'row' | 'column'; id: string } | null>(
    null
  )

  const totalHeight = useMemo(() => rows.reduce((sum: number, row) => sum + row.height, 0), [rows])
  const totalWidth = useMemo(
    () => columns.reduce((sum: number, col) => sum + col.width, 0),
    [columns]
  )

  const updateNodeData = useCallback(
    (updatedRows: typeof rows, updatedColumns: typeof columns) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label,
                rows: updatedRows,
                columns: updatedColumns,
              },
            }
          }
          return node
        })
      )
      // Notify React Flow to recalculate node internals
      requestAnimationFrame(() => {
        updateNodeInternals(id)
      })
    },
    [id, label, setNodes, updateNodeInternals]
  )

  const handleLabelDoubleClick = useCallback(() => {
    setIsEditingLabel(true)
  }, [])

  const handleLabelBlur = useCallback(() => {
    setIsEditingLabel(false)
    updateNodeData(rows, columns)
  }, [rows, columns, updateNodeData])

  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsEditingLabel(false)
        updateNodeData(rows, columns)
      } else if (e.key === 'Escape') {
        setLabel(poolData.label || 'Pool')
        setIsEditingLabel(false)
      }
    },
    [poolData.label, rows, columns, updateNodeData]
  )

  const handleAddRow = useCallback(() => {
    const currentHeight = customSize?.height || totalHeight + 40
    const newRowHeight = (currentHeight - 40) / (rows.length + 1)

    const newRow = {
      id: `${rows.length + 1}`,
      label: `Lane ${rows.length + 1}`,
      height: newRowHeight,
    }

    // Redistribute height equally among all rows
    const newRows = [...rows.map((row) => ({ ...row, height: newRowHeight })), newRow]
    setRows(newRows)

    // Update customSize to reflect new total
    const newTotalHeight = newRowHeight * newRows.length + 40
    setCustomSize({
      width: customSize?.width || totalWidth,
      height: newTotalHeight,
    })

    updateNodeData(newRows, columns)
  }, [customSize, totalHeight, totalWidth, rows, columns, updateNodeData])

  const handleAddColumn = useCallback(() => {
    const currentWidth = customSize?.width || totalWidth
    const newColumnWidth = currentWidth / (columns.length + 1)

    const newColumn = {
      id: `${columns.length + 1}`,
      label: `Phase ${columns.length + 1}`,
      width: newColumnWidth,
    }

    // Redistribute width equally among all columns
    const newColumns = [...columns.map((col) => ({ ...col, width: newColumnWidth })), newColumn]
    setColumns(newColumns)

    // Update customSize to reflect new total
    const newTotalWidth = newColumnWidth * newColumns.length
    setCustomSize({
      width: newTotalWidth,
      height: customSize?.height || totalHeight + 40,
    })

    updateNodeData(rows, newColumns)
  }, [customSize, totalWidth, totalHeight, rows, columns, updateNodeData])

  const handleDeleteRow = useCallback(
    (rowId: string) => {
      if (rows.length <= 1) return // Keep at least one row

      const newRows = rows.filter((r) => r.id !== rowId)
      const currentHeight = customSize?.height || totalHeight + 40
      const newRowHeight = (currentHeight - 40) / newRows.length

      const updatedRows = newRows.map((row) => ({ ...row, height: newRowHeight }))
      setRows(updatedRows)

      const newTotalHeight = newRowHeight * updatedRows.length + 40
      setCustomSize({
        width: customSize?.width || totalWidth,
        height: newTotalHeight,
      })

      updateNodeData(updatedRows, columns)
    },
    [rows, columns, customSize, totalHeight, totalWidth, updateNodeData]
  )

  const handleDeleteColumn = useCallback(
    (colId: string) => {
      if (columns.length <= 1) return // Keep at least one column

      const newColumns = columns.filter((c) => c.id !== colId)
      const currentWidth = customSize?.width || totalWidth
      const newColumnWidth = currentWidth / newColumns.length

      const updatedColumns = newColumns.map((col) => ({ ...col, width: newColumnWidth }))
      setColumns(updatedColumns)

      const newTotalWidth = newColumnWidth * updatedColumns.length
      setCustomSize({
        width: newTotalWidth,
        height: customSize?.height || totalHeight + 40,
      })

      updateNodeData(rows, updatedColumns)
    },
    [rows, columns, customSize, totalWidth, totalHeight, updateNodeData]
  )

  const handleEditRowLabel = useCallback(
    (rowId: string, newLabel: string) => {
      const updatedRows = rows.map((row) => (row.id === rowId ? { ...row, label: newLabel } : row))
      setRows(updatedRows)
      updateNodeData(updatedRows, columns)
    },
    [rows, columns, updateNodeData]
  )

  const handleEditColumnLabel = useCallback(
    (colId: string, newLabel: string) => {
      const updatedColumns = columns.map((col) =>
        col.id === colId ? { ...col, label: newLabel } : col
      )
      setColumns(updatedColumns)
      updateNodeData(rows, updatedColumns)
    },
    [rows, columns, updateNodeData]
  )

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={200}
        minHeight={140}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
        }}
        onResize={useCallback(
          (_event: unknown, params: { width: number; height: number }) => {
            setCustomSize({
              width: params.width,
              height: params.height,
            })

            // Update rows and columns proportionally
            const newHeight = params.height - 40 // minus header
            const newWidth = params.width

            const updatedRows = rows.map((row) => ({
              ...row,
              height: newHeight / rows.length,
            }))

            const updatedColumns = columns.map((col) => ({
              ...col,
              width: newWidth / columns.length,
            }))

            setRows(updatedRows)
            setColumns(updatedColumns)
            updateNodeData(updatedRows, updatedColumns)
          },
          [rows, columns, updateNodeData]
        )}
      />

      <div
        className='relative bg-background/50 border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden'
        style={{
          width: customSize?.width || totalWidth || 400,
          height: customSize?.height || (totalHeight || 200) + 40, // +40 for header
        }}
      >
        {/* Header with label - draggable */}
        <div className='absolute top-0 left-0 right-0 h-10 bg-muted/80 border-b border-muted-foreground/30 flex items-center px-3 gap-2 z-10 cursor-move'>
          <GripVertical className='w-4 h-4 text-muted-foreground' />
          {isEditingLabel ? (
            <input
              type='text'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
              autoFocus
              className='flex-1 px-2 py-1 text-sm font-semibold bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary nodrag'
            />
          ) : (
            <div
              className='flex-1 text-sm font-semibold cursor-pointer hover:text-primary transition-colors flex items-center gap-2'
              onDoubleClick={handleLabelDoubleClick}
            >
              {label}
              <Edit2 className='w-3 h-3 opacity-0 group-hover:opacity-100' />
            </div>
          )}

          {selected && (
            <div className='flex gap-1 nodrag'>
              <button
                className='p-1 hover:bg-background rounded transition-colors'
                title='Add Row'
                onClick={handleAddRow}
              >
                <Plus className='w-4 h-4' />
              </button>
              <button
                className='p-1 hover:bg-background rounded transition-colors'
                title='Add Column'
                onClick={handleAddColumn}
              >
                <Plus className='w-4 h-4 rotate-90' />
              </button>
            </div>
          )}
        </div>

        {/* Grid content - not draggable */}
        <div
          className='absolute top-10 left-0 right-0 bottom-0 grid nodrag'
          style={{
            gridTemplateRows: rows.map((r) => `${r.height}px`).join(' '),
            gridTemplateColumns: columns.map((c) => `${c.width}px`).join(' '),
          }}
        >
          {rows.map((row, rowIndex: number) =>
            columns.map((col, colIndex: number) => (
              <div
                key={`${row.id}-${col.id}`}
                className='border-r border-b border-muted-foreground/20 relative group/cell'
              >
                {/* Row label on left */}
                {colIndex === 0 && (
                  <div className='absolute left-2 top-2 flex items-center gap-1 nodrag'>
                    {editingCell?.type === 'row' && editingCell?.id === row.id ? (
                      <input
                        type='text'
                        value={row.label}
                        onChange={(e) => handleEditRowLabel(row.id, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingCell(null)
                          if (e.key === 'Escape') setEditingCell(null)
                        }}
                        autoFocus
                        className='w-20 px-1 py-0.5 text-xs font-medium bg-background border rounded focus:outline-none focus:ring-1 focus:ring-primary'
                      />
                    ) : (
                      <>
                        <span
                          className='text-xs text-muted-foreground font-medium cursor-pointer hover:text-primary'
                          onDoubleClick={() => setEditingCell({ type: 'row', id: row.id })}
                        >
                          {row.label}
                        </span>
                        {selected && rows.length > 1 && (
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className='opacity-0 group-hover/cell:opacity-100 p-0.5 hover:bg-destructive/10 rounded transition-all'
                            title='Delete row'
                          >
                            <Trash2 className='w-3 h-3 text-destructive' />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Column label on top */}
                {rowIndex === 0 && (
                  <div className='absolute left-1/2 -translate-x-1/2 top-1 flex items-center gap-1 nodrag'>
                    {editingCell?.type === 'column' && editingCell?.id === col.id ? (
                      <input
                        type='text'
                        value={col.label}
                        onChange={(e) => handleEditColumnLabel(col.id, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingCell(null)
                          if (e.key === 'Escape') setEditingCell(null)
                        }}
                        autoFocus
                        className='w-20 px-1 py-0.5 text-xs bg-background border rounded focus:outline-none focus:ring-1 focus:ring-primary text-center'
                      />
                    ) : (
                      <>
                        <span
                          className='text-xs text-muted-foreground/70 cursor-pointer hover:text-primary'
                          onDoubleClick={() => setEditingCell({ type: 'column', id: col.id })}
                        >
                          {col.label}
                        </span>
                        {selected && columns.length > 1 && (
                          <button
                            onClick={() => handleDeleteColumn(col.id)}
                            className='opacity-0 group-hover/cell:opacity-100 p-0.5 hover:bg-destructive/10 rounded transition-all'
                            title='Delete column'
                          >
                            <Trash2 className='w-3 h-3 text-destructive' />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
