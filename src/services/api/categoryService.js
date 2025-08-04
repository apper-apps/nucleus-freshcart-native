class CategoryService {
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
          { field: { Name: "icon" } },
          { field: { Name: "image" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
      };

      const response = await this.apperClient.fetchRecords("category", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
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
          { field: { Name: "icon" } },
          { field: { Name: "image" } }
        ]
      };

      const response = await this.apperClient.getRecordById("category", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

  async getWithTopProducts(limit = 3) {
    try {
      // Get all categories first
      const categories = await this.getAll();
      
      // For each category, get top products
      const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          try {
            // Get products for this category
            const { ApperClient } = window.ApperSDK;
            const productClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            });

            const productParams = {
              fields: [
                { field: { Name: "Name" } },
                { field: { Name: "category" } },
                { field: { Name: "images" } },
                { field: { Name: "priceTiers" } }
              ],
              where: [
                {
                  FieldName: "category",
                  Operator: "EqualTo",
                  Values: [category.Name]
                }
              ],
              pagingInfo: { limit: limit, offset: 0 }
            };

            const productResponse = await productClient.fetchRecords("product", productParams);
            
            return {
              ...category,
              topProducts: productResponse.success ? (productResponse.data || []) : []
            };
          } catch (err) {
            // If product fetch fails, return category without products
            return {
              ...category,
              topProducts: []
            };
          }
        })
      );

      return categoriesWithProducts;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories with products:", error?.response?.data?.message);
      } else {
        console.error("Error fetching categories with products:", error.message);
      }
      throw error;
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;
export default new CategoryService();