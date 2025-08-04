class ProductService {
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
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products:", error.message);
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
        ]
      };

      const response = await this.apperClient.getRecordById("product", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching product with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async getByCategory(category) {
    try {
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
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error("Error fetching products by category:", error.message);
      }
      throw error;
    }
  }

  async getFeatured() {
    try {
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
            FieldName: "featured",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [{ fieldName: "featuredOrder", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching featured products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching featured products:", error.message);
      }
      throw error;
    }
  }

  async setFeaturedOrder(productIds) {
    try {
      const updatePromises = productIds.map(async (id, index) => {
        const params = {
          records: [
            {
              Id: parseInt(id),
              featuredOrder: index + 1
            }
          ]
        };
        return this.apperClient.updateRecord("product", params);
      });

      const results = await Promise.all(updatePromises);
      
      // Check if all updates were successful
      const allSuccessful = results.every(response => response.success);
      
      if (!allSuccessful) {
        const failedUpdates = results.filter(response => !response.success);
        console.error(`Failed to update featured order for ${failedUpdates.length} products:${JSON.stringify(failedUpdates)}`);
      }

      return allSuccessful;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error setting featured order:", error?.response?.data?.message);
      } else {
        console.error("Error setting featured order:", error.message);
      }
      throw error;
    }
  }

  async search(query, category = null) {
    try {
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
        whereGroups: []
      };

      // Build search conditions
      const conditions = [];

      if (query) {
        conditions.push({
          conditions: [
            { fieldName: "Name", operator: "Contains", values: [query] },
            { fieldName: "description", operator: "Contains", values: [query] },
            { fieldName: "category", operator: "Contains", values: [query] }
          ],
          operator: "OR"
        });
      }

      if (category) {
        conditions.push({
          conditions: [
            { fieldName: "category", operator: "EqualTo", values: [category] }
          ],
          operator: "AND"
        });
      }

      if (conditions.length > 0) {
        params.whereGroups = [{
          operator: "AND",
          subGroups: conditions
        }];
      }

      const response = await this.apperClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
      } else {
        console.error("Error searching products:", error.message);
      }
      throw error;
    }
  }

  async getRecommended(productId, limit = 4) {
    try {
      // First get the current product to know its category
      const currentProduct = await this.getById(productId);
      if (!currentProduct) return [];

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
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              conditions: [
                { fieldName: "category", operator: "EqualTo", values: [currentProduct.category] }
              ],
              operator: "AND"
            },
            {
              conditions: [
                { fieldName: "Id", operator: "NotEqualTo", values: [parseInt(productId)] }
              ],
              operator: "AND"
            }
          ]
        }],
        pagingInfo: { limit: limit, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recommended products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching recommended products:", error.message);
      }
      return [];
    }
  }

  async getTrending() {
    try {
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
            FieldName: "trending",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching trending products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching trending products:", error.message);
      }
      throw error;
    }
  }

  async getFrequentlyBoughtWith(productId, limit = 3) {
    try {
      // First get the current product to get its frequentlyBoughtWith list
      const currentProduct = await this.getById(productId);
      if (!currentProduct || !currentProduct.frequentlyBoughtWith) {
        return [];
      }

      // Parse the frequentlyBoughtWith field (should be a string like "2,6,12")
      let productIds = [];
      if (typeof currentProduct.frequentlyBoughtWith === 'string') {
        productIds = currentProduct.frequentlyBoughtWith.split(',').map(id => parseInt(id.trim()));
      } else if (Array.isArray(currentProduct.frequentlyBoughtWith)) {
        productIds = currentProduct.frequentlyBoughtWith.map(id => parseInt(id));
      }

      if (productIds.length === 0) return [];

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
            Values: productIds
          }
        ],
        pagingInfo: { limit: limit, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords("product", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching frequently bought with products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching frequently bought with products:", error.message);
      }
      return [];
    }
  }

  async updateStock(id, quantity) {
    try {
      // First get current product to calculate new stock
      const currentProduct = await this.getById(id);
      if (!currentProduct) {
        throw new Error("Product not found");
      }

      const newStockCount = Math.max(0, (currentProduct.stockCount || 0) - quantity);
      const newInStock = newStockCount > 0;

      const params = {
        records: [
          {
            Id: parseInt(id),
            stockCount: newStockCount,
            inStock: newInStock
          }
        ]
      };

      const response = await this.apperClient.updateRecord("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to update stock");
        }
        return result.data;
      }

      return { ...currentProduct, stockCount: newStockCount, inStock: newInStock };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating stock:", error?.response?.data?.message);
      } else {
        console.error("Error updating stock:", error.message);
      }
      throw error;
    }
  }

  async create(product) {
    try {
      // Only include updateable fields
      const productData = {
        Name: product.Name || product.name,
        Tags: product.Tags || "",
        category: product.category,
        images: Array.isArray(product.images) ? product.images.join(',') : product.images,
        description: product.description,
        priceTiers: typeof product.priceTiers === 'object' ? JSON.stringify(product.priceTiers) : product.priceTiers,
        inStock: product.inStock !== undefined ? product.inStock : true,
        stockCount: product.stockCount || 50,
        featured: product.featured || false,
        trending: product.trending || false,
        dealId: product.dealId || "",
        dietaryTags: Array.isArray(product.dietaryTags) ? product.dietaryTags.join(',') : (product.dietaryTags || ""),
        frequentlyBoughtWith: Array.isArray(product.frequentlyBoughtWith) ? product.frequentlyBoughtWith.join(',') : (product.frequentlyBoughtWith || ""),
        featuredOrder: product.featuredOrder || null
      };

      const params = {
        records: [productData]
      };

      const response = await this.apperClient.createRecord("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create products ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        } else {
          throw new Error("Failed to create product");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
      } else {
        console.error("Error creating product:", error.message);
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
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.images !== undefined) updateData.images = Array.isArray(updates.images) ? updates.images.join(',') : updates.images;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.priceTiers !== undefined) updateData.priceTiers = typeof updates.priceTiers === 'object' ? JSON.stringify(updates.priceTiers) : updates.priceTiers;
      if (updates.inStock !== undefined) updateData.inStock = updates.inStock;
      if (updates.stockCount !== undefined) updateData.stockCount = updates.stockCount;
      if (updates.featured !== undefined) updateData.featured = updates.featured;
      if (updates.trending !== undefined) updateData.trending = updates.trending;
      if (updates.dealId !== undefined) updateData.dealId = updates.dealId;
      if (updates.dietaryTags !== undefined) updateData.dietaryTags = Array.isArray(updates.dietaryTags) ? updates.dietaryTags.join(',') : updates.dietaryTags;
      if (updates.frequentlyBoughtWith !== undefined) updateData.frequentlyBoughtWith = Array.isArray(updates.frequentlyBoughtWith) ? updates.frequentlyBoughtWith.join(',') : updates.frequentlyBoughtWith;
      if (updates.featuredOrder !== undefined) updateData.featuredOrder = updates.featuredOrder;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update products ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        } else {
          throw new Error("Failed to update product");
        }
      }

      throw new Error("No response data received");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
      } else {
        console.error("Error updating product:", error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("product", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete products ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
      } else {
        console.error("Error deleting product:", error.message);
      }
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService;

export default new ProductService();