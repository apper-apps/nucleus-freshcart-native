import categoriesData from "@/services/mockData/categories.json";
import productsData from "@/services/mockData/products.json";

class CategoryService {
  async getAll() {
    await this.delay(200);
    return [...categoriesData];
  }

  async getById(id) {
    await this.delay(150);
    const category = categoriesData.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  }

  async getWithTopProducts(limit = 3) {
    await this.delay(250);
    return categoriesData.map(category => ({
      ...category,
      topProducts: productsData
        .filter(p => p.category === category.name)
        .slice(0, limit)
    }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CategoryService();