export interface WhatsAppConfig {
  topWidth?: number | string;
  bottomWidth?: number | string;
  width?: number | string;
  leftHeight: number | string;
  rightHeight: number | string;
  thickness: number | string;
  openSide?: 'left' | 'right';
  colorName: string;
  colorHex: string;
}

export declare const sendWhatsAppInquiry: (
  config: WhatsAppConfig,
  phoneNumber?: string
) => void;
