import dealsData from "@/services/mockData/deals.json";
import productsData from "@/services/mockData/products.json";

class DealService {
  async getAll() {
    await this.delay(300);
    return dealsData.map(deal => ({
      ...deal,
      products: this.enhanceProductsWithTieredPricing(
        productsData.filter(p => deal.productIds.includes(p.Id))
      )
    }));
  }

  async getById(id) {
    await this.delay(200);
    const deal = dealsData.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    
    return {
      ...deal,
      products: this.enhanceProductsWithTieredPricing(
        productsData.filter(p => deal.productIds.includes(p.Id))
      )
    };
  }

  async getActive() {
    await this.delay(250);
    const now = new Date();
    return dealsData
      .filter(deal => new Date(deal.expiresAt) > now)
      .sort((a, b) => a.position - b.position)
      .map(deal => ({
        ...deal,
        products: this.enhanceProductsWithTieredPricing(
          productsData.filter(p => deal.productIds.includes(p.Id))
        )
      }));
  }

  async getHotDeals() {
    await this.delay(200);
    const now = new Date();
    const hotDeals = dealsData
      .filter(deal => {
        const expiresAt = new Date(deal.expiresAt);
        const hoursUntilExpiry = (expiresAt - now) / (1000 * 60 * 60);
        return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
      })
      .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))
      .map(deal => ({
        ...deal,
        products: this.enhanceProductsWithTieredPricing(
          productsData.filter(p => deal.productIds.includes(p.Id))
        ),
        urgency: this.calculateUrgency(deal.expiresAt)
      }));
    
    return hotDeals;
  }

  enhanceProductsWithTieredPricing(products) {
    return products.map(product => ({
      ...product,
      dynamicPricing: this.calculateDynamicPricing(product),
      stockLevel: this.calculateStockLevel(product),
      recommendationScore: this.calculateRecommendationScore(product)
    }));
  }

  calculateDynamicPricing(product) {
    if (!product.priceTiers) return null;
    
    return product.priceTiers.map(tier => ({
      ...tier,
      savings: tier.discountPercentage > 0 ? 
        Math.round(tier.price / (1 - tier.discountPercentage / 100)) - tier.price : 0,
      bulkDiscount: tier.minQuantity >= 10 ? 'bulk' : 
                   tier.minQuantity >= 5 ? 'medium' : 'single'
    }));
  }

  calculateStockLevel(product) {
    // Mock stock calculation with some logic
    const baseStock = Math.floor(Math.random() * 50) + 10;
    const demandFactor = product.featured ? 0.7 : 1.0;
    return Math.max(1, Math.floor(baseStock * demandFactor));
  }

  calculateRecommendationScore(product) {
    let score = 0;
    if (product.featured) score += 30;
    if (product.priceTiers?.some(tier => tier.discountPercentage > 20)) score += 25;
    if (product.dietaryTags?.includes('Organic')) score += 15;
    if (product.inStock) score += 20;
    return Math.min(100, score + Math.floor(Math.random() * 10));
  }

  calculateUrgency(expiresAt) {
    const now = new Date();
    const expires = new Date(expiresAt);
    const hoursLeft = Math.max(0, (expires - now) / (1000 * 60 * 60));
    
    if (hoursLeft <= 2) return 'critical';
    if (hoursLeft <= 6) return 'high';
    if (hoursLeft <= 12) return 'medium';
    return 'low';
  }

  async create(deal) {
    await this.delay(300);
    const newDeal = {
      ...deal,
      Id: Math.max(...dealsData.map(d => d.Id)) + 1,
      position: dealsData.length + 1
    };
    dealsData.push(newDeal);
    return { ...newDeal };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = dealsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    dealsData[index] = { ...dealsData[index], ...updates };
    return { ...dealsData[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = dealsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const deleted = dealsData.splice(index, 1)[0];
    return { ...deleted };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new DealService();