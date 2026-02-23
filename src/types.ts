export interface AffiliateLink {
  id: number;
  title: string;
  url: string;
  platform: string;
  clicks: number;
  created_at: string;
}

export const PLATFORMS = [
  { name: 'Amazon', color: 'bg-[#FF9900]', icon: 'ShoppingBag' },
  { name: 'Flipkart', color: 'bg-[#2874F0]', icon: 'ShoppingCart' },
  { name: 'Myntra', color: 'bg-[#FF3F6C]', icon: 'Tag' },
  { name: 'Other', color: 'bg-slate-600', icon: 'Link' }
];
