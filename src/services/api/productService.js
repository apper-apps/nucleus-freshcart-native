import productsData from "@/services/mockData/products.json";

class ProductService {
  async getAll() {
    await this.delay(300);
    return [...productsData];
  }

  async getById(id) {
    await this.delay(200);
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  }

  async getByCategory(category) {
    await this.delay(250);
    return productsData.filter(p => p.category === category).map(p => ({ ...p }));
  }

  async getFeatured() {
    await this.delay(200);
    return productsData.filter(p => p.featured).map(p => ({ ...p }));
  }

  async search(query, category = null) {
    await this.delay(300);
    let results = [...productsData];
    
    if (category) {
      results = results.filter(p => p.category === category);
    }
    
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }
    
    return results;
  }

  async getRecommended(productId, limit = 4) {
    await this.delay(200);
    const currentProduct = productsData.find(p => p.Id === parseInt(productId));
    if (!currentProduct) return [];
    
    // Get products from same category, excluding current product
    const sameCategory = productsData
      .filter(p => p.category === currentProduct.category && p.Id !== parseInt(productId))
      .slice(0, limit);
    
    // If not enough from same category, add random products
    if (sameCategory.length < limit) {
      const remaining = productsData
        .filter(p => p.Id !== parseInt(productId) && 
          !sameCategory.some(sc => sc.Id === p.Id))
        .slice(0, limit - sameCategory.length);
      
      return [...sameCategory, ...remaining];
    }
    
    return sameCategory;
  }

  async create(product) {
    await this.delay(300);
    const newProduct = {
      ...product,
      Id: Math.max(...productsData.map(p => p.Id)) + 1,
      inStock: true,
      featured: false,
      dealId: null
    };
    productsData.push(newProduct);
    return { ...newProduct };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    productsData[index] = { ...productsData[index], ...updates };
    return { ...productsData[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = productsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const deleted = productsData.splice(index, 1)[0];
    return { ...deleted };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ProductService();