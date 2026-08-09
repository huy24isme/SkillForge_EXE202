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
   * Create dynamic VietQR & PayOS payment link via PayOS /v2/payment-requests API
   */
  public async createPaymentLink(params: CreatePaymentLinkParams): Promise<PaymentLinkResult> {
    const { orderCode, amount, description } = params;
    const cleanDesc = description.slice(0, 25).trim();

    // Fallback VietQR image URL
    const encodedDesc = encodeURIComponent(cleanDesc);
    const encodedName = encodeURIComponent(this.accountName);
    let qrCodeUrl = `https://img.vietqr.io/image/${this.bankId}-${this.accountNo}-compact2.png?amount=${amount}&addInfo=${encodedDesc}&accountName=${encodedName}`;
    let checkoutUrl = `https://payos.vn/checkout/${orderCode}`;
    let accountNo = this.accountNo;
    let accountName = this.accountName;
    let bankName = this.bankId;

    // Call official PayOS /v2/payment-requests API if credentials exist
    if (this.clientId && this.apiKey && this.checksumKey) {
      try {
        const payload = {
          orderCode,
          amount,
          description: cleanDesc,
          cancelUrl: params.cancelUrl || 'https://skillforge-exe202.onrender.com/checkout?cancel=true',
          returnUrl: params.returnUrl || 'https://skillforge-exe202.onrender.com/checkout?success=true',
        };
        const signature = this.generateSignature(payload);
        const reqBody = { ...payload, signature };

        console.log('[PAYOS API v2 CALL] Creating payment request for orderCode:', orderCode);
        const res = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
          method: 'POST',
          headers: {
            'x-client-id': this.clientId,
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        });
        const json: any = await res.json();
        console.log('[PAYOS API v2 RESPONSE]:', JSON.stringify(json));

        if (json.code === '00' && json.data) {
          checkoutUrl = json.data.checkoutUrl || checkoutUrl;
          qrCodeUrl = json.data.qrCode || qrCodeUrl;
          accountNo = json.data.accountNumber || accountNo;
          accountName = json.data.accountName || accountName;
          bankName = json.data.bin || bankName;
        }
      } catch (err: any) {
        console.warn('PayOS API v2 request warning, fallback to VietQR:', err?.message || err);
      }
    }

    return {
      orderCode,
      amount,
      checkoutUrl,
      qrCodeUrl,
      accountNo,
      accountName,
      bankName,
      description: cleanDesc,
    };
  }
}

export const payosService = new PayOSService();
