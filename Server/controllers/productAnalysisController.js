const { Product, Category, Order, User } = require('../models');
const { runGraniteModel } = require('./ibm-granite');

class ProductAnalysisController {
  
  // 1. Generate product review berdasarkan data product
  static async generateProductReview(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: Category }]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const prompt = `Sebagai seorang reviewer produk profesional, buatlah review yang detail dan objektif untuk produk berikut:

Nama Produk: ${product.name}
Kategori: ${product.Category?.name || 'Tidak ada kategori'}
Harga: Rp ${product.price?.toLocaleString('id-ID')}
Deskripsi: ${product.description}
Stok: ${product.stock}

Buatlah review yang mencakup:
1. Analisis kualitas produk berdasarkan harga
2. Penilaian value for money
3. Perbandingan dengan produk sejenis di kategori yang sama
4. Rekomendasi untuk siapa produk ini cocok
5. Pro dan kontra dari produk ini
6. Rating dari 1-10 dengan penjelasan

Tuliskan review dalam bahasa Indonesia yang natural dan mudah dipahami, dengan gaya penulisan yang engaging dan informatif.`;

      // Panggil IBM Granite model
      const graniteRequest = {
        body: {
          prompt,
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.9
        }
      };

      // Mock response object untuk granite
      let graniteResponse;
      const mockRes = {
        status: () => ({ 
          json: (data) => { graniteResponse = data; } 
        })
      };

      await runGraniteModel(graniteRequest, mockRes);

      res.status(200).json({
        success: true,
        message: 'Product review generated successfully',
        data: {
          product: {
            id: product.id,
            name: product.name,
            category: product.Category?.name,
            price: product.price
          },
          review: graniteResponse?.data?.output || 'Review generation failed'
        }
      });

    } catch (error) {
      console.error('Error generating product review:', error);
      next(error);
    }
  }

  // 2. Analyze customer behavior dan product performance
  static async analyzeProductPerformance(req, res, next) {
    try {
      const { id } = req.params;
      
      // Get product dengan order statistics
      const product = await Product.findByPk(id, {
        include: [
          { model: Category },
          { 
            model: Order, 
            include: [{ model: User }],
            required: false 
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Calculate statistics
      const totalOrders = product.Orders?.length || 0;
      const totalQuantitySold = product.Orders?.reduce((sum, order) => sum + order.quantity, 0) || 0;
      const totalRevenue = product.Orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
      const averageOrderQuantity = totalOrders > 0 ? totalQuantitySold / totalOrders : 0;

      const prompt = `Sebagai seorang business analyst, analisis performa produk berikut berdasarkan data penjualan:

INFORMASI PRODUK:
- Nama: ${product.name}
- Kategori: ${product.Category?.name || 'Tidak ada kategori'}
- Harga: Rp ${product.price?.toLocaleString('id-ID')}
- Stok tersisa: ${product.stock}

DATA PENJUALAN:
- Total pesanan: ${totalOrders}
- Total unit terjual: ${totalQuantitySold}
- Total pendapatan: Rp ${totalRevenue.toLocaleString('id-ID')}
- Rata-rata quantity per pesanan: ${averageOrderQuantity.toFixed(2)}

Berikan analisis mendalam yang mencakup:
1. Evaluasi performa penjualan (baik/buruk/rata-rata)
2. Analisis tren pembelian konsumen
3. Rekomendasi strategi pemasaran
4. Saran optimasi harga dan stok
5. Identifikasi peluang cross-selling
6. Prediksi trend penjualan ke depan
7. Action items untuk meningkatkan penjualan

Berikan analisis yang actionable dan berbasis data dalam bahasa Indonesia.`;

      const graniteRequest = {
        body: {
          prompt,
          max_tokens: 1000,
          temperature: 0.6,
          top_p: 0.8
        }
      };

      let graniteResponse;
      const mockRes = {
        status: () => ({ 
          json: (data) => { graniteResponse = data; } 
        })
      };

      await runGraniteModel(graniteRequest, mockRes);

      res.status(200).json({
        success: true,
        message: 'Product performance analysis completed',
        data: {
          product: {
            id: product.id,
            name: product.name,
            category: product.Category?.name,
            price: product.price
          },
          statistics: {
            totalOrders,
            totalQuantitySold,
            totalRevenue,
            averageOrderQuantity: Math.round(averageOrderQuantity * 100) / 100
          },
          analysis: graniteResponse?.data?.output || 'Analysis generation failed'
        }
      });

    } catch (error) {
      console.error('Error analyzing product performance:', error);
      next(error);
    }
  }

  // 3. Generate marketing copy untuk produk
  static async generateMarketingCopy(req, res, next) {
    try {
      const { id } = req.params;
      const { copyType = 'social_media' } = req.query; // social_media, email, website, ads

      const product = await Product.findByPk(id, {
        include: [{ model: Category }]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      let promptTemplate = '';
      
      switch (copyType) {
        case 'social_media':
          promptTemplate = `Buatlah konten social media yang menarik untuk promosi produk ini. Include hashtags yang relevan dan call-to-action yang kuat.`;
          break;
        case 'email':
          promptTemplate = `Buatlah email marketing yang persuasif untuk mempromosikan produk ini kepada existing customers.`;
          break;
        case 'website':
          promptTemplate = `Buatlah deskripsi produk yang menarik untuk website e-commerce, fokus pada benefit dan unique selling point.`;
          break;
        case 'ads':
          promptTemplate = `Buatlah copy iklan yang singkat, padat, dan menarik untuk digital advertising (Google Ads/Facebook Ads).`;
          break;
        default:
          promptTemplate = `Buatlah konten marketing yang menarik untuk promosi produk ini.`;
      }

      const prompt = `Sebagai seorang copywriter profesional, buatlah konten marketing untuk produk berikut:

PRODUK:
- Nama: ${product.name}
- Kategori: ${product.Category?.name || 'Tidak ada kategori'}
- Harga: Rp ${product.price?.toLocaleString('id-ID')}
- Deskripsi: ${product.description}

TUGAS: ${promptTemplate}

Buatlah 3 variasi copy yang berbeda dengan tone yang sesuai untuk target audience Indonesia. Pastikan copy yang dibuat:
- Menarik perhatian
- Menjelaskan value proposition
- Memiliki call-to-action yang jelas
- Sesuai dengan platform dan format yang diminta

Berikan output dalam format yang siap digunakan.`;

      const graniteRequest = {
        body: {
          prompt,
          max_tokens: 700,
          temperature: 0.8,
          top_p: 0.9
        }
      };

      let graniteResponse;
      const mockRes = {
        status: () => ({ 
          json: (data) => { graniteResponse = data; } 
        })
      };

      await runGraniteModel(graniteRequest, mockRes);

      res.status(200).json({
        success: true,
        message: `Marketing copy for ${copyType} generated successfully`,
        data: {
          product: {
            id: product.id,
            name: product.name,
            category: product.Category?.name,
            price: product.price
          },
          copyType,
          marketingCopy: graniteResponse?.data?.output || 'Copy generation failed'
        }
      });

    } catch (error) {
      console.error('Error generating marketing copy:', error);
      next(error);
    }
  }

  // 4. Product comparison dan competitive analysis
  static async compareProducts(req, res, next) {
    try {
      const { productIds } = req.body; // Array of product IDs to compare

      if (!productIds || productIds.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Please provide at least 2 product IDs for comparison'
        });
      }

      const products = await Product.findAll({
        where: { id: productIds },
        include: [{ model: Category }]
      });

      if (products.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Not enough valid products found for comparison'
        });
      }

      const productDetails = products.map(p => ({
        name: p.name,
        category: p.Category?.name || 'No category',
        price: p.price,
        description: p.description,
        stock: p.stock
      }));

      const prompt = `Sebagai seorang product analyst, buatlah perbandingan mendalam antara produk-produk berikut:

${productDetails.map((p, index) => `
PRODUK ${index + 1}:
- Nama: ${p.name}
- Kategori: ${p.category}
- Harga: Rp ${p.price?.toLocaleString('id-ID')}
- Deskripsi: ${p.description}
- Stok: ${p.stock}
`).join('\n')}

Berikan analisis yang mencakup:
1. Perbandingan value for money
2. Target market masing-masing produk
3. Kelebihan dan kekurangan setiap produk
4. Rekomendasi untuk konsumen yang berbeda
5. Analisis positioning produk
6. Strategi pricing comparison
7. Kesimpulan produk mana yang paling worth it

Berikan analisis yang objektif dan membantu konsumen dalam pengambilan keputusan.`;

      const graniteRequest = {
        body: {
          prompt,
          max_tokens: 1000,
          temperature: 0.6,
          top_p: 0.8
        }
      };

      let graniteResponse;
      const mockRes = {
        status: () => ({ 
          json: (data) => { graniteResponse = data; } 
        })
      };

      await runGraniteModel(graniteRequest, mockRes);

      res.status(200).json({
        success: true,
        message: 'Product comparison completed',
        data: {
          comparedProducts: productDetails,
          comparison: graniteResponse?.data?.output || 'Comparison generation failed'
        }
      });

    } catch (error) {
      console.error('Error comparing products:', error);
      next(error);
    }
  }
}

module.exports = ProductAnalysisController;
