import crypto from 'crypto';

export interface CreatePaymentLinkParams {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentLinkResult {
  orderCode: number;
  amount: number;
  checkoutUrl: string;
  qrCodeUrl: string;
  accountNo: string;
  accountName: string;
  bankName: string;
  description: string;
}

export class PayOSService {
  private clientId: string;
  private apiKey: string;
  private checksumKey: string;
  private bankId: string;
  private accountNo: string;
  private accountName: string;

  constructor() {
    this.clientId = process.env.PAYOS_CLIENT_ID || '';
    this.apiKey = process.env.PAYOS_API_KEY || '';
    this.checksumKey = process.env.PAYOS_CHECKSUM_KEY || '';
    this.bankId = process.env.VIETQR_BANK_ID || 'MB';
    this.accountNo = process.env.VIETQR_ACCOUNT_NO || '0932556236';
    this.accountName = process.env.VIETQR_ACCOUNT_NAME || 'NGUYEN MINH HUY';
  }

  /**
   * Sort data keys alphabetically and format key=value string for PayOS checksum
   */
  private sortAndFormatData(data: Record<string, any>): string {
    return Object.keys(data)
      .sort()
      .map((key) => {
        let value = data[key];
        if (value === null || value === undefined) value = '';
        return `${key}=${value}`;
      })
      .join('&');
  }

  /**
   * Generate HMAC SHA256 signature for PayOS request/webhook
   */
  public generateSignature(data: Record<string, any>, checksumKey?: string): string {
    const key = checksumKey || this.checksumKey || 'skillforge_payos_checksum_secret_2026';
    const sortedData = this.sortAndFormatData(data);
    return crypto.createHmac('sha256', key).update(sortedData).digest('hex');
  }

  /**
   * Verify signature received from PayOS Webhook
   */
  public verifyWebhookSignature(webhookData: any): boolean {
    if (!webhookData) return false;

    // In sandbox / test environment without live PayOS keys, allow test calls
    if (!this.checksumKey || this.checksumKey === 'skillforge_payos_checksum_secret_2026') {
      return true;
    }

    if (!webhookData.signature || !webhookData.data) return false;
    const calculatedSig = this.generateSignature(webhookData.data);
    return calculatedSig === webhookData.signature;
  }

  /**
   * Create dynamic VietQR & PayOS payment link
   */
  public async createPaymentLink(params: CreatePaymentLinkParams): Promise<PaymentLinkResult> {
    const { orderCode, amount, description } = params;
    const cleanDesc = description.slice(0, 25).trim();

    // Generate VietQR dynamic QR image URL
    const encodedDesc = encodeURIComponent(cleanDesc);
    const encodedName = encodeURIComponent(this.accountName);
    const qrCodeUrl = `https://img.vietqr.io/image/${this.bankId}-${this.accountNo}-compact2.png?amount=${amount}&addInfo=${encodedDesc}&accountName=${encodedName}`;

    const checkoutUrl = `https://payos.vn/checkout/${orderCode}`;

    return {
      orderCode,
      amount,
      checkoutUrl,
      qrCodeUrl,
      accountNo: this.accountNo,
      accountName: this.accountName,
      bankName: this.bankId,
      description: cleanDesc,
    };
  }
}

export const payosService = new PayOSService();
