export interface StoreSettings {
  storeName: string;
  supportPhone: string;
  supportEmail: string;
  address: string;
  currency: string;
  freeDeliveryThreshold: number;
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  facebookUrl: string;
  instagramUrl: string;
  metaPixelId: string;
  gaId: string;
}

export const storeSettings: StoreSettings = {
  storeName: "VERO",
  supportPhone: "+880 1XXX-XXXXXX",
  supportEmail: "support@vero-store.example.com",
  address: "House 12, Road 5, Banani, Dhaka 1213, Bangladesh",
  currency: "BDT",
  freeDeliveryThreshold: 2500,
  insideDhakaCharge: 70,
  outsideDhakaCharge: 130,
  codEnabled: true,
  onlinePaymentEnabled: true,
  facebookUrl: "https://facebook.com/verostore",
  instagramUrl: "https://instagram.com/verostore",
  metaPixelId: "",
  gaId: "",
};
