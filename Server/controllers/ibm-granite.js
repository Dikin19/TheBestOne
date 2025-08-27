const Replicate = require('replicate')
require('dotenv').config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})

const model = 'ibm-granite/granite-3.3-8b-instruct:3ff9e6e20ff1f31263bf4f36c242bd9be1acb2025122daeefe2b06e883df0996'

// Controller function untuk menjalankan IBM Granite model
const runGraniteModel = async (req, res) => {
  try {
    const {
      prompt = 'How is perplexity measured for LLMs and why is it useful?',
      top_k = 50,
      top_p = 0.9,
      max_tokens = 512,
      min_tokens = 0,
      temperature = 0.6,
      presence_penalty = 0,
      frequency_penalty = 0,
    } = req.body

    const input = {
      top_k,
      top_p,
      prompt,
      max_tokens,
      min_tokens,
      temperature,
      presence_penalty,
      frequency_penalty,
    }

    console.log('Using model: %s', model)
    console.log('With input: %O', input)
    console.log('Running...')

    const output = await replicate.run(model, { input })
    
    console.log('Done!', output)

    res.status(200).json({
      success: true,
      message: 'IBM Granite model executed successfully',
      data: {
        model,
        input,
        output
      }
    })

  } catch (error) {
    console.error('Error running IBM Granite model:', error)
    res.status(500).json({
      success: false,
      message: 'Error running IBM Granite model',
      error: error.message
    })
  }
}

// Controller function untuk mendapatkan informasi model
const getModelInfo = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'IBM Granite model information',
      data: {
        model,
        description: 'IBM Granite 3.3 8B Instruct model for text generation',
        defaultParams: {
          top_k: 50,
          top_p: 0.9,
          max_tokens: 512,
          min_tokens: 0,
          temperature: 0.6,
          presence_penalty: 0,
          frequency_penalty: 0,
        }
      }
    })
  } catch (error) {
    console.error('Error getting model info:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting model information',
      error: error.message
    })
  }
}

module.exports = {
  runGraniteModel,
  getModelInfo
}