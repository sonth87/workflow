import { CategoryType, NodeType } from '@/enum/workflow.enum'
import { getIconConfig } from '@/pages/WorkflowBuilder/hooks/useGetIconByType'
import { X } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { type NodeCategory, NODES_BY_CATEGORIES } from '../../data/list-toolbox'
import { type DynamicWorkflowDefinition } from '@/types/dynamic-bpm.type'

interface Props {
  dynamicBpm?: DynamicWorkflowDefinition
}

export function Toolbox(props: Props) {
  const { dynamicBpm } = props
  const [selectedCategoryType, setSelectedCategoryType] = useState<CategoryType>()

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/reactflow', nodeType)
  }

  const builderCategories = useMemo(() => {
    if (!dynamicBpm) return NODES_BY_CATEGORIES

    const categories = NODES_BY_CATEGORIES.map((category) => ({
      ...category,
      nodes: [...category.nodes],
    }))

    const ensureCategory = (categoryType: CategoryType): NodeCategory => {
      let existing = categories.find((cat) => cat.categoryType === categoryType)
      if (!existing) {
        existing = {
          name: categoryType,
          isOpen: true,
          categoryType,
          nodes: [],
        }
        categories.push(existing)
      }
      return existing
    }

    dynamicBpm.nodes?.forEach((node) => {
      const normalizedType = (Object.values(CategoryType) as string[]).includes(
        node.category_type as string
      )
        ? (node.category_type as CategoryType)
        : CategoryType.OTHER

      const targetCategory = ensureCategory(normalizedType)

      if (!targetCategory.nodes.some((item) => item?.type === node?.data?.nodeType)) {
        targetCategory.nodes.push({ type: node.data.nodeType, label: node.label })
      }
    })

    return categories
  }, [dynamicBpm])

  const selectedCategory = useMemo(
    () => builderCategories.find((category) => category.categoryType === selectedCategoryType),
    [builderCategories, selectedCategoryType]
  )

  return (
    <aside className='h-full border border-border/50 bg-card overflow-y-auto rounded-2xl shadow-xl flex'>
      <div className='px-2.5 py-4 space-y-1 flex-1 overflow-y-auto flex flex-col items-center'>
        {builderCategories.map((category, index) => (
          <div
            key={`${category.name}-${index}`}
            className='p-2 rounded-lg hover:bg-foreground/10 cursor-pointer flex items-center justify-center'
            onClick={() => setSelectedCategoryType(category.categoryType)}
          >
            {category.icon}
          </div>
        ))}
        <div className='h-px w-6 bg-border my-4' />
      </div>
      {selectedCategory && (
        <div className='min-w-[320px] border-l border-border'>
          <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
            <h2 className='text-base text-ink800 font-medium flex-1'>{selectedCategory?.name}</h2>
            <button
              onClick={() => setSelectedCategoryType(undefined)}
              className='p-2 rounded-lg hover:bg-foreground/10'
            >
              <X size={16} />
            </button>
          </div>
          <div className='p-4 space-y-1'>
            {selectedCategory.nodes.map((node) => {
              const iconConfig = getIconConfig(node.type)
              const Icon = iconConfig.icon

              return (
                <div
                  key={node.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, node.type)}
                  className='flex items-center gap-2 rounded-lg bg-card/80 backdrop-blur-sm p-3 font-medium cursor-move hover:bg-foreground/10 hover:border-primary hover:scale-[1.02] active:scale-95 transition-all duration-150'
                >
                  {typeof Icon === 'string' ? (
                    <img src={Icon} alt={node.label} className='w-6 h-6' />
                  ) : (
                    <Icon size={24} style={{ color: iconConfig.color }} />
                  )}
                  <span className='text-sm font-medium text-ink800'>{node.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}
