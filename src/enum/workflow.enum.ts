export enum NodeType {
  START_EVENT = "startEvent",
  START_EVENT_DEFAULT = "startEventDefault",
  START_EVENT_API = "startEventApi",
  START_EVENT_TIMER = "startEventTimer",
  START_EVENT_WEB = "startEventWeb",
  START_EVENT_RECEIVE_SIGNAL = "startEventReceiveSignal",
  START_EVENT_MESSAGE = "startEventMessage",

  TASK_DEFAULT = "taskDefault",
  TASK_USER = "taskUser",
  TASK_SYSTEM = "taskSystem",
  TASK_SEND_NOTIFICATION = "taskSendNotification",
  TASK_SCRIPT = "taskScript",
  TASK_MANUAL = "taskManual",
  TASK_BUSINESS_RULE = "taskBusinessRule",
  TASK_AI = "taskAi",

  IMMEDIATE_EMAIL = "immediateEmail",
  IMMEDIATE_RECEIVE_MESSAGE = "immediateReceiveMessage",
  IMMEDIATE_TIMER = "immediateTimer",
  IMMEDIATE_SIGNAL = "immediateSignal",
  IMMEDIATE_CONDITION = "immediateCondition",

  BOUNDARY_MESSAGE = "boundaryMessage",
  BOUNDARY_ERROR = "boundaryError",
  BOUNDARY_TIMER = "boundaryTimer",
  BOUNDARY_SIGNAL = "boundarySignal",

  SERVICE_TASK = "serviceTask",
  NOTIFICATION = "notification",
  TIME_DELAY = "timeDelay",

  EXCLUSIVE_GATEWAY = "exclusiveGateway",
  PARALLEL_GATEWAY = "parallelGateway",
  PARALLEL_GATEWAY_JOIN = "parallelGatewayJoin",
  INCLUSIVE_GATEWAY = "inclusiveGateway",

  END_EVENT_DEFAULT = "endEventDefault",
  END_EVENT_SEND_SIGNAL = "endEventSendSignal",
  END_EVENT_ERROR = "endEventError",
  END_EVENT_TERMINATE = "endEventTerminate",
  END_EVENT_COMPENSATION = "endEventCompensation",

  SUBFLOW = "subflow",
  POOL = "pool",
  LANE = "lane",
  NOTE = "note",
  ANNOTATION = "annotation",
}

export enum NotificationChannel {
  EMAIL = "email",
  SMS = "sms",
  SLACK = "slack",
  ZALO = "zalo",
  PUSH = "push",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum RoleType {
  AGENT = "Agent",
  LEADER = "Leader",
  MANAGER = "Manager",
  DIRECTOR = "Director",
  CUSTOMER = "Customer",
  SYSTEM = "System",
}

// Edge Path Type - Kiểu đường vẽ (rendering type)
export enum EdgePathType {
  SmoothStep = "smoothstep",
  Bezier = "bezier",
  Straight = "straight",
  Step = "step",
}

export enum EdgePathStyle {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
}

export enum CategoryType {
  START = "start",
  END = "end",
  TASK = "task",
  GATEWAY = "gateway",
  IMMEDIATE = "immediate",
  SUBFLOW = "subflow",
  BOUNDARY = "boundary",
  CUSTOM = "custom",
  OTHER = "other",
}

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  OPTION = "option",
  DATE = "date",
  DATE_TIME = "date_time",
  TIME = "time",
  FILE = "file",
  EMAIL = "email",
  IMAGE = "image",
  TEXTAREA = "textarea",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  GROUP_FIELD = "group_field",
}
