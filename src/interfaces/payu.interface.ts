export interface PayUResponse { 
    merchantId: string;
    accountId: string;
    description: string;
    referenceCode: string;
    amount: string;
    tax: string;
    taxReturnBase: string;
    currency: string;
    signature: string;
    test: string;
    buyerEmail: string;
    buyerFullName: string;
    telephone: string;
    responseUrl: string;
    confirmationUrl: string;
}