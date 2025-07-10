export const APP_NAME = 'Saakie';
export const APP_DESCRIPTION =
  'Discover exquisite Indian sarees for every occasion. From traditional silk to modern designs.';

export const PRODUCT_CATEGORIES = [
  { id: 'silk', name: 'Silk Sarees', slug: 'silk-sarees' },
  { id: 'cotton', name: 'Cotton Sarees', slug: 'cotton-sarees' },
  { id: 'designer', name: 'Designer Sarees', slug: 'designer-sarees' },
  { id: 'wedding', name: 'Wedding Collection', slug: 'wedding-collection' },
  { id: 'party', name: 'Party Wear', slug: 'party-wear' },
  { id: 'casual', name: 'Casual Wear', slug: 'casual-wear' },
] as const;

export const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
] as const;

export const ITEMS_PER_PAGE = 12;

export const SHIPPING_CHARGE = 100;
export const FREE_SHIPPING_THRESHOLD = 2999;

export const PAYMENT_METHODS = {
  CARD: 'Credit/Debit Card',
  UPI: 'UPI',
  NET_BANKING: 'Net Banking',
  COD: 'Cash on Delivery',
} as const;
