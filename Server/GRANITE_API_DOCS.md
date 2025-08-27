# IBM Granite API Documentation

Setelah memindahkan data dari `my-replicate-app/index.js` ke controller `ibm-granite.js`, Anda sekarang memiliki dua endpoint API yang dapat digunakan:

## Endpoints

### 1. POST /granite/run

Menjalankan IBM Granite model dengan prompt dan parameter kustom.

**URL:** `http://localhost:3000/granite/run`

**Method:** POST

**Request Body:**

```json
{
  "prompt": "Your question or text here",
  "top_k": 50,
  "top_p": 0.9,
  "max_tokens": 512,
  "min_tokens": 0,
  "temperature": 0.6,
  "presence_penalty": 0,
  "frequency_penalty": 0
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "IBM Granite model executed successfully",
  "data": {
    "model": "ibm-granite/granite-3.3-8b-instruct:3ff9e6e20ff1f31263bf4f36c242bd9be1acb2025122daeefe2b06e883df0996",
    "input": {
      "prompt": "Your question or text here",
      "top_k": 50,
      "top_p": 0.9,
      "max_tokens": 512,
      "min_tokens": 0,
      "temperature": 0.6,
      "presence_penalty": 0,
      "frequency_penalty": 0
    },
    "output": "Generated response from IBM Granite model"
  }
}
```

### 2. GET /granite/info

Mendapatkan informasi tentang model IBM Granite dan parameter default.

**URL:** `http://localhost:3000/granite/info`

**Method:** GET

**Response Success (200):**

```json
{
  "success": true,
  "message": "IBM Granite model information",
  "data": {
    "model": "ibm-granite/granite-3.3-8b-instruct:3ff9e6e20ff1f31263bf4f36c242bd9be1acb2025122daeefe2b06e883df0996",
    "description": "IBM Granite 3.3 8B Instruct model for text generation",
    "defaultParams": {
      "top_k": 50,
      "top_p": 0.9,
      "max_tokens": 512,
      "min_tokens": 0,
      "temperature": 0.6,
      "presence_penalty": 0,
      "frequency_penalty": 0
    }
  }
}
```

## Cara Testing

### Menggunakan curl:

1. **Test endpoint info:**

```bash
curl -X GET http://localhost:3000/granite/info
```

2. **Test endpoint run dengan prompt default:**

```bash
curl -X POST http://localhost:3000/granite/run \
  -H "Content-Type: application/json" \
  -d '{}'
```

3. **Test endpoint run dengan prompt kustom:**

```bash
curl -X POST http://localhost:3000/granite/run \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain machine learning in simple terms",
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

## Environment Variables

Pastikan file `.env` di folder Server memiliki:

```
REPLICATE_API_TOKEN="your_replicate_api_token_here"
```

## Perubahan yang Dilakukan

1. ✅ Memindahkan logika dari `my-replicate-app/index.js` ke `controllers/ibm-granite.js`
2. ✅ Mengubah dari standalone script menjadi Express.js controller
3. ✅ Menambahkan error handling dan response format yang konsisten
4. ✅ Membuat router baru `/granite` dengan dua endpoint
5. ✅ Mengintegrasikan router ke dalam aplikasi utama
6. ✅ Menginstall package `replicate` di server utama
7. ✅ Menggunakan environment variable yang sudah ada untuk API token

Sekarang Anda dapat menggunakan IBM Granite model melalui API endpoint alih-alih menjalankan script standalone.
