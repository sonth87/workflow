import type { CategoryType, FieldType, HttpMethod, NodeType } from '@/enum/workflow.enum'
import type { BaseConfig, DynamicConfig, NodeValidationRules } from './workflow.type'

export type WorkflowStatus = 'draft' | 'active' | 'inactive' | 'archived' | string

export interface DynamicWorkflowMetadata {
  [key: string]: unknown
  owner?: string
  category?: string
  tags?: string[]
}

export interface DynamicWorkflowDefinition {
  name: string
  description?: string
  status: WorkflowStatus
  version: string
  metadata?: DynamicWorkflowMetadata
  nodes: DynamicNode[]
  validationRules?: NodeValidationRules
}

export interface DynamicNode extends BaseConfig {
  nodeType: NodeType
  category_type: CategoryType
  data: DynamicConfig
}

export interface ApiConfig {
  url: string
  method: HttpMethod
  params?: Record<string, string>
  body?: Record<string, string>
  path_params?: Record<string, string>
  transform?: string
  error_transform?: string
  success_transform?: string
}

export type MultilingualTextType = {
  [key: string]: string | number | boolean | null | undefined
}

export interface OptionValue {
  value: string
  label: MultilingualTextType
}

export interface InputComponent {
  _id: string
  type: 'input'
  field_type: FieldType
  label: MultilingualTextType
  field_code: string
  editable: boolean | string
  visible: boolean | string
  order: number
  category_ref?: string
  category_where?: Record<string, unknown>
  dependencies?: string[]
  options_url?: ApiConfig
  option_value?: string
  option_label?: string
  value_option?: OptionValue[]
  value?: string | number | boolean | string[] | number[] | boolean[]
  format?: string // dành cho date picker
  placeholder?: MultilingualTextType
  components?: InputComponent[]
}
