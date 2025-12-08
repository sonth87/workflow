export enum NodeType {
  START_EVENT_DEFAULT = 'startEventDefault',
  START_EVENT_API = 'startEventApi',
  START_EVENT_TIMER = 'startEventTimer',
  START_EVENT_WEB = 'startEventWeb',
  START_EVENT_RECEIVE_SIGNAL = 'startEventReceiveSignal',

  TASK_DEFAULT = 'taskDefault',
  TASK_USER = 'taskUser',
  TASK_SYSTEM = 'taskSystem',
  TASK_SEND_NOTIFICATION = 'taskSendNotification',
  TASK_SCRIPT = 'taskScript',
  TASK_MANUAL = 'taskManual',
  TASK_BUSINESS_RULE = 'taskBusinessRule',
  TASK_AI = 'taskAi',

  SERVICE_TASK = 'serviceTask',
  NOTIFICATION = 'notification',
  TIME_DELAY = 'timeDelay',

  EXCLUSIVE_GATEWAY = 'exclusiveGateway',
  PARALLEL_GATEWAY = 'parallelGateway',
  PARALLEL_GATEWAY_JOIN = 'parallelGatewayJoin',
  EVENT_BASED_GATEWAY = 'eventBasedGateway',

  END_EVENT_DEFAULT = 'endEventDefault',
  END_EVENT_SEND_SIGNAL = 'endEventSendSignal',

  SUBFLOW = 'subflow',
  POOL = 'pool',
  NOTE = 'note',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  SLACK = 'slack',
  ZALO = 'zalo',
  PUSH = 'push',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum RoleType {
  AGENT = 'Agent',
  LEADER = 'Leader',
  MANAGER = 'Manager',
  DIRECTOR = 'Director',
  CUSTOMER = 'Customer',
  SYSTEM = 'System',
}

export enum EdgeType {
  Default = 'default',
  Straight = 'straight',
  Step = 'step',
  SmoothStep = 'smoothstep',
  Bezier = 'bezier',
  SimpleBezier = 'simplebezier',
}

export enum CategoryType {
  START = 'start',
  END = 'end',
  TASK = 'task',
  GATEWAY = 'gateway',
  SUBFLOW = 'subflow',
  OTHER = 'other',
}

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  OPTION = 'option',
  DATE = 'date',
  DATE_TIME = 'date_time',
  TIME = 'time',
  FILE = 'file',
  EMAIL = 'email',
  IMAGE = 'image',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  GROUP_FIELD = 'group_field',
}
