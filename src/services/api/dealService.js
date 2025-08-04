class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "productIds" } },
          { field: { Name: "expiresAt" } },
          { field: { Name: "position" } }
        ],
        orderBy: [{ fieldName: "position", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("deal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const deals = response.data || [];
      
      // Enhance deals with product data
      const enhancedDeals = await Promise.all(
        deals.map(async (deal) => {
          const products = await this.getProductsForDeal(deal.productIds);
          return {
            ...deal,
            products: this.enhanceProductsWithTieredPricing(products)
          };
        })
      );

      return enhancedDeals;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
      } else {
        console.error("Error fetching deals:", error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "productIds" } },
          { field: { Name: "expiresAt" } },
          { field: { Name: "position" } }
        ]
      };

      const response = await this.apperClient.getRecordById("deal", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const deal = response.data;
      if (!deal) {
        throw new Error("Deal not found");
      }

      // Enhance deal with product data
      const products = await this.getProductsForDeal(deal.productIds);
      
      return {
        ...deal,
        products: this.enhanceProductsWithTieredPricing(products)
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching deal with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async getActive() {
    try {
      const now = new Date().toISOString();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "productIds" } },
          { field: { Name: "expiresAt" } },
          { field: { Name: "position" } }
        ],
        where: [
          {
            FieldName: "expiresAt",
            Operator: "GreaterThan",
            Values: [now]
          }
        ],
        orderBy: [{ fieldName: "position", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("deal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const deals = response.data || [];
      
      // Enhance deals with product data
      const enhancedDeals = await Promise.all(
        deals.map(async (deal) => {
          const products = await this.getProductsForDeal(deal.productIds);
          return {
            ...deal,
            products: this.enhanceProductsWithTieredPricing(products)
          };
        })
      );

      return enhancedDeals;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching active deals:", error?.response?.data?.message);
      } else {
        console.error("Error fetching active deals:", error.message);
      }
      throw error;
    }
  }

  async getHotDeals() {
    try {
      const now = new Date();
      const twentyFourHoursFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000)).toISOString();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "productIds" } },
          { field: { Name: "expiresAt" } },
          { field: { Name: "position" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [
                { fieldName: "expiresAt", operator: "GreaterThan", values: [now.toISOString()] }
              ],
              operator: "AND"
            },
            {
              conditions: [
                { fieldName: "expiresAt", operator: "LessThanOrEqualTo", values: [twentyFourHoursFromNow] }
              ],
              operator: "AND"
            }
          ]
        }],
        orderBy: [{ fieldName: "expiresAt", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("deal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const deals = response.data || [];
      
      // Enhance deals with product data and urgency
      const enhancedDeals = await Promise.all(
        deals.map(async (deal) => {
          const products = await this.getProductsForDeal(deal.productIds);
          return {
            ...deal,
            products: this.enhanceProductsWithTieredPricing(products),
            urgency: this.calculateUrgency(deal.expiresAt)
          };
        })
      );

      return enhancedDeals;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching hot deals:", error?.response?.data?.message);
      } else {
        console.error("Error fetching hot deals:", error.message);
      }
      throw error;
    }
  }

  async getProductsForDeal(productIds) {
    try {
      if (!productIds) return [];
      
      // Parse productIds string to array
      let ids = [];
      if (typeof productIds === 'string') {
        ids = productIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      } else if (Array.isArray(productIds)) {
        ids = productIds.map(id => parseInt(id)).filter(id => !isNaN(id));
      }

      if (ids.length === 0) return [];

      const { ApperClient } = window.ApperSDK;
      const productClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "category" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "priceTiers" } },
          { field: { Name: "inStock" } },
          { field: { Name: "stockCount" } },
          { field: { Name: "featured" } },
          { field: { Name: "trending" } },
          { field: { Name: "dealId" } },
          { field: { Name: "dietaryTags" } },
          { field: { Name: "frequentlyBoughtWith" } },
          { field: { Name: "featuredOrder" } }
        ],
        where: [
          {
            FieldName: "Id",
            Operator: "ExactMatch",
            Values: ids
          }
        ]
      };

      const response = await productClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error("Error fetching products for deal:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching products for deal:", error.message);
      return [];
    }
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
    
    let priceTiers = [];
    if (typeof product.priceTiers === 'string') {
      try {
        priceTiers = JSON.parse(product.priceTiers);
      } catch (e) {
        return null;
      }
    } else if (Array.isArray(product.priceTiers)) {
      priceTiers = product.priceTiers;
    }
    
    return priceTiers.map(tier => ({
      ...tier,
      savings: tier.discountPercentage > 0 ? 
        Math.round(tier.price / (1 - tier.discountPercentage / 100)) - tier.price : 0,
      bulkDiscount: tier.minQuantity >= 10 ? 'bulk' : 
                   tier.minQuantity >= 5 ? 'medium' : 'single'
    }));
  }

  calculateStockLevel(product) {
    // Use actual stock count if available, otherwise mock calculation
    if (product.stockCount !== undefined) {
      return product.stockCount;
    }
    
    const baseStock = Math.floor(Math.random() * 50) + 10;
    const demandFactor = product.featured ? 0.7 : 1.0;
    return Math.max(1, Math.floor(baseStock * demandFactor));
  }

  calculateRecommendationScore(product) {
    let score = 0;
    if (product.featured) score += 30;
    
    // Parse priceTiers to check for discounts
    let priceTiers = [];
    if (typeof product.priceTiers === 'string') {
      try {
        priceTiers = JSON.parse(product.priceTiers);
      } catch (e) {
        priceTiers = [];
      }
    } else if (Array.isArray(product.priceTiers)) {
      priceTiers = product.priceTiers;
    }
    
    if (priceTiers.some && priceTiers.some(tier => tier.discountPercentage > 20)) score += 25;
    
    // Parse dietaryTags
    let dietaryTags = [];
    if (typeof product.dietaryTags === 'string') {
      dietaryTags = product.dietaryTags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(product.dietaryTags)) {
      dietaryTags = product.dietaryTags;
    }
    
    if (dietaryTags.includes && dietaryTags.includes('Organic')) score += 15;
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
    try {
      // Only include updateable fields
      const dealData = {
        Name: deal.Name || deal.title,
        Tags: deal.Tags || "",
        title: deal.title,
        productIds: Array.isArray(deal.productIds) ? deal.productIds.join(',') : deal.productIds,
        expiresAt: deal.expiresAt,
        position: deal.position || 1
      };

      const params = {
        records: [dealData]
      };

      const response = await this.apperClient.createRecord("deal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create deals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        } else {
          throw new Error("Failed to create deal");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
      } else {
        console.error("Error creating deal:", error.message);
      }
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include updateable fields
      const updateData = { Id: parseInt(id) };
      
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.productIds !== undefined) updateData.productIds = Array.isArray(updates.productIds) ? updates.productIds.join(',') : updates.productIds;
      if (updates.expiresAt !== undefined) updateData.expiresAt = updates.expiresAt;
      if (updates.position !== undefined) updateData.position = updates.position;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord("deal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update deals ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        } else {
          throw new Error("Failed to update deal");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
      } else {
        console.error("Error updating deal:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("deal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete deals ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
      } else {
        console.error("Error deleting deal:", error.message);
      }
      throw error;
    }
  }
}

const dealService = new DealService();
export default dealService;