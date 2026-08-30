export interface WhatsAppConfig {
  width: number | string;
  leftHeight: number | string;
  rightHeight: number | string;
  thickness: number | string;
  colorName: string;
  colorHex: string;
}

export declare const sendWhatsAppInquiry: (
  config: WhatsAppConfig,
  phoneNumber?: string
) => void;
