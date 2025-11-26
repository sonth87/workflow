export enum NodeType {
  START_EVENT = 'startEvent',
  END_EVENT = 'endEvent',

  TASK = 'task', // human task
  SERVICE_TASK = 'serviceTask', // API, system task
  NOTIFICATION = 'notification', // email/sms/slack
  TIME_DELAY = 'timeDelay', // timer, wait

  EXCLUSIVE_GATEWAY = 'exclusiveGateway',
  PARALLEL_GATEWAY = 'parallelGateway',
  PARALLEL_GATEWAY_JOIN = 'parallelGatewayJoin',

  SUBFLOW = 'subflow',
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
