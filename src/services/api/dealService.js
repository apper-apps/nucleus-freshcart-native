import dealsData from "@/services/mockData/deals.json";
import productsData from "@/services/mockData/products.json";

class DealService {
  async getAll() {
    await this.delay(300);
    return dealsData.map(deal => ({
      ...deal,
      products: productsData.filter(p => deal.productIds.includes(p.Id))
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
      products: productsData.filter(p => deal.productIds.includes(p.Id))
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
        products: productsData.filter(p => deal.productIds.includes(p.Id))
      }));
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