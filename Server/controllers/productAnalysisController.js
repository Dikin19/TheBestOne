const { Product, Category } = require('../models');
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
      
      // Pastikan output adalah string
      const resultText = Array.isArray(output) ? output.join('') : output.toString();
      console.log('IBM Granite response received:', resultText.substring(0, 100) + '...');
      
      return resultText;
    } catch (error) {
      console.error('Error calling IBM Granite:', error);
      throw new Error('Failed to generate AI response');
    }
  }
  
  // Product Review Analysis - Generate attractive review to interest customers
  static async analyzeProductReviews(req, res, next) {
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

      const prompt = `Sebagai seorang reviewer produk profesional yang berpengalaman, buatlah penjelasan yang sangat menarik dan persuasif untuk produk berikut yang akan membuat customer tertarik untuk membeli:

Nama Produk: ${product.name}
Kategori: ${product.Category?.name || 'Tidak ada kategori'}
Harga: Rp ${product.price?.toLocaleString('id-ID')}
Deskripsi: ${product.description}
Stok: ${product.stock}

Buatlah penjasan singkat sebagai reviewer profesional:

jelaskan product ini menurut ${product.imgUrl} dan ${product.name}
Cukup bikin penjelasan 1 kalimat saja.

Tuliskan penjelasan dengan gaya bahasa yang:
- Antusias dan engaging
- Meyakinkan tapi tetap natural
- Mudah dipahami
- Membuat pembaca excited untuk membeli
- Fokus pada benefit dan value yang didapat customer
- Cukup bikin penjelasan 1 kalimat saja.

Gunakan bahasa Indonesia yang menarik dan persuasif.`;

      const review = await ProductAnalysisController.callGraniteModel(prompt, 800);

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
          review
        }
      });

    } catch (error) {
      console.error('Error generating product review:', error);
      next(error);
    }
  }
}

module.exports = ProductAnalysisController;
