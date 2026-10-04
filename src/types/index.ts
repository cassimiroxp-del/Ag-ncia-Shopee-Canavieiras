export type Screen = 'login' | 'print_preview' | 'history';

export type ReturnStatus = 'aguardando_coleta' | 'coletado_spx' | 'cancelado';

export interface ReturnReceipt {
  id: string;
  trackingNumber: string;
  orderNumber: string;
  returnId: string;
  customerName: string;
  customerCpf: string;
  customerPhone: string;
  sellerName: string;
  returnReason: string;
  itemDescription: string;
  weightKg: number;
  volumes: number;
  packageCondition: string;
  createdAt: string;
  operatorId: string;
  operatorName: string;
  status: ReturnStatus;
  authCode: string;
  printedCount: number;
  driverName?: string;
  collectedAt?: string;
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  badgeNumber: string;
  pin: string;
  shift: string;
  avatarColor: string;
}

export interface HubConfig {
  name: string;
  code: string;
  address: string;
  cityState: string;
  cep: string;
  cnpj: string;
  phone: string;
  terminalId: string;
  printerModel: string;
}
