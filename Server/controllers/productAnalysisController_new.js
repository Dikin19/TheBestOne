const { Product, Category, Order, User } = require('../models');
const Replicate = require('replicate');
require('dotenv').config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
});

const model = 'ibm-granite/granite-3.3-8b-instruct:3ff9e6e20ff1f31263bf4f36c242bd9be1acb2025122daeefe2b06e883df0996';

class ProductAnalysisController {
  
  // Helper function untuk memanggil IBM Granite
  static async callGraniteModel(prompt, maxTokens = 512) {
    try {
      const input = {
        prompt,
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 50,
        min_tokens: 0,
        presence_penalty: 0,
        frequency_penalty: 0,
      };

      console.log('Calling IBM Granite with prompt:', prompt.substring(0, 100) + '...');
      const output = await replicate.run(model, { input });
      
      if (output && output.length > 0) {
        return output.join('');
      } else {
        throw new Error('No output received from Granite model');
      }
    } catch (error) {
      console.error('Error calling Granite model:', error);
      throw error;
    }
  }

  // 1. Product Review Analysis
  static async analyzeProductReviews(req, res, next) {
    try {
      const { id } = req.params;
      const { reviewText } = req.body;

      const product = await Product.findByPk(id, {
        include: [{ model: Category }]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      let prompt = '';
      if (reviewText) {
        prompt = `Analisis review produk berikut secara mendalam:

PRODUK:
- Nama: ${product.name}
- Kategori: ${product.Category?.name || 'Tidak ada kategori'}
- Harga: Rp ${product.price?.toLocaleString('id-ID')}

REVIEW: "${reviewText}"

Berikan analisis yang mencakup:
1. Sentimen overall (Positif/Negatif/Netral)
2. Aspek yang disukai/tidak disukai  
3. Tingkat kepuasan (1-10)
4. Rekomendasi perbaikan untuk seller
5. Keywords penting dari review

Berikan analisis dalam bahasa Indonesia yang mudah dipahami.`;
      } else {
        prompt = `Buatlah analisis komprehensif untuk produk berikut:

PRODUK:
- Nama: ${product.name}
- Kategori: ${product.Category?.name || 'Tidak ada kategori'}
- Harga: Rp ${product.price?.toLocaleString('id-ID')}
- Deskripsi: ${product.description}

Berikan rekomendasi untuk:
1. Target audience yang tepat
2. Strategi pricing
3. Potential improvements
4. Marketing positioning
5. Competitive advantages

Format dalam bahasa Indonesia yang professional.`;
      }

      const analysisResult = await this.callGraniteModel(prompt, 600);

      res.status(200).json({
        success: true,
        message: 'Product review analysis completed successfully',
        data: {
          product: {
            id: product.id,
            name: product.name,
            category: product.Category?.name,
            price: product.price
          },
          analysisType: reviewText ? 'review_analysis' : 'product_analysis',
          analysis: analysisResult
        }
      });

    } catch (error) {
      console.error('Error analyzing product reviews:', error);
      next(error);
    }
  }

  // 2. Performance Analytics
  static async getPerformanceAnalytics(req, res, next) {
    try {
      const { id } = req.params;
      const { period = '30' } = req.query;

      const product = await Product.findByPk(id, {
        include: [{ model: Category }]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const orders = await Order.findAll({
        where: { productId: id },
        include: [{ model: User }]
      });

      const totalSales = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      const prompt = `Sebagai data analyst, berikan analisis performa penjualan untuk produk berikut:

PRODUK:
- Nama: ${product.name}
- Kategori: ${product.Category?.name || 'Tidak ada kategori'}
- Harga: Rp ${product.price?.toLocaleString('id-ID')}
- Stock: ${product.stock}

DATA PENJUALAN (${period} hari terakhir):
- Total Penjualan: ${totalSales} unit
- Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}
- Jumlah Order: ${orders.length}

Berikan analisis yang mencakup:
1. Performance summary
2. Tingkat popularitas produk
3. Revenue potential
4. Inventory turnover analysis
5. Rekomendasi strategi penjualan
6. Benchmark dengan kategori serupa
7. Action items untuk improvement

Berikan insights yang actionable dalam bahasa Indonesia.`;

      const analyticsResult = await this.callGraniteModel(prompt, 700);

      res.status(200).json({
        success: true,
        message: 'Performance analytics generated successfully',
        data: {
          product: {
            id: product.id,
            name: product.name,
            category: product.Category?.name,
            price: product.price,
            stock: product.stock
          },
          period,
          metrics: {
            totalSales,
            totalRevenue,
            totalOrders: orders.length,
            averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
          },
          analysis: analyticsResult
        }
      });

    } catch (error) {
      console.error('Error generating performance analytics:', error);
      next(error);
    }
  }

  // 3. Marketing Copy Generation
  static async generateMarketingCopy(req, res, next) {
    try {
      const { id } = req.params;
      const { copyType = 'general' } = req.body;

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
          promptTemplate = 'Buatlah konten social media yang menarik untuk promosi produk ini. Include hashtags yang relevan dan call-to-action yang kuat.';
          break;
        case 'email':
          promptTemplate = 'Buatlah email marketing yang persuasif untuk mempromosikan produk ini kepada existing customers.';
          break;
        case 'website':
          promptTemplate = 'Buatlah deskripsi produk yang menarik untuk website e-commerce, fokus pada benefit dan unique selling point.';
          break;
        case 'ads':
          promptTemplate = 'Buatlah copy iklan yang singkat, padat, dan menarik untuk digital advertising (Google Ads/Facebook Ads).';
          break;
        default:
          promptTemplate = 'Buatlah konten marketing yang menarik untuk promosi produk ini.';
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

      const marketingCopy = await this.callGraniteModel(prompt, 700);

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
          marketingCopy
        }
      });

    } catch (error) {
      console.error('Error generating marketing copy:', error);
      next(error);
    }
  }

  // 4. Product comparison
  static async compareProducts(req, res, next) {
    try {
      const { productIds } = req.body;

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

      const prompt = `Sebagai product analyst, lakukan perbandingan mendalam untuk produk-produk berikut:

PRODUK YANG DIBANDINGKAN:
${productDetails.map((p, index) => `
${index + 1}. ${p.name}
   - Kategori: ${p.category}
   - Harga: Rp ${p.price?.toLocaleString('id-ID')}
   - Stock: ${p.stock}
   - Deskripsi: ${p.description}
`).join('')}

Berikan analisis perbandingan yang mencakup:
1. Price positioning analysis
2. Target market comparison
3. Value proposition masing-masing produk
4. Competitive advantages dan disadvantages
5. Market opportunity assessment
6. Rekomendasi positioning strategy
7. Cross-selling opportunities

Berikan insights yang actionable untuk business strategy dalam bahasa Indonesia.`;

      const comparisonResult = await this.callGraniteModel(prompt, 800);

      res.status(200).json({
        success: true,
        message: 'Product comparison completed successfully',
        data: {
          products: productDetails,
          comparisonAnalysis: comparisonResult
        }
      });

    } catch (error) {
      console.error('Error comparing products:', error);
      next(error);
    }
  }
}

module.exports = ProductAnalysisController;
