# API Documentation

## Invalid tokenegister a new user

**POST** `/register`

#### Request Body:
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "address": "123 Main Street",
  "profilePicture": "http://example.com/profile.jpg"
}
```

#### Responses:
- **201 Created**
  ```json
  {
    "id": 1,
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "phoneNumber": "1234567890",
    "address": "123 Main Street",
    "profilePicture": "http://example.com/profile.jpg"
  }
  ```
- **400 Bad Request**
  ```json
  { "message": "Email is required" }
  ```
  ```json
  { "message": "Password is required" }
  ```

---

### Login

**POST** `/login`

#### Request Body:
```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```

#### Responses:
- **200 OK**
  ```json
  { "access_token": "your_access_token" }
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid email or password" }
  ```

---

### Google Login

**POST** `/google-login`

#### Request Body:
```json
{
  "token": "valid-google-token"
}
```

#### Responses:
- **200 OK**
  ```json
  { "access_token": "your_access_token" }
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid Google token" }
  ```

---

## Customer

### Initiate Midtrans Payment

**POST** `/customers/payment/midtrans/initiate`

#### Request Body:
```json
{
  "order_id": "order-123",
  "gross_amount": 100000
}
```

#### Responses:
- **201 Created**
  ```json
  {
    "token": "f9bb1441-6a4f-4a31-a1b3-d90423f528df",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v4/redirection/f9bb1441-6a4f-4a31-a1b3-d90423f528df"
  }
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid token" }
  ```

---

### Get All Products

**GET** `/customers/product`

#### Responses:
- **200 OK**
  ```json
  [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product Description",
      "price": 10000,
      "imgUrl": "http://example.com/image.jpg",
      "CategoryId": 1,
      "stock": 10,
      "createdAt": "2025-02-26T03:33:10.471Z",
      "updatedAt": "2025-02-26T03:33:10.471Z",
      "Category": {
        "id": 1,
        "name": "Category Name",
        "createdAt": "2025-02-26T03:33:09.921Z",
        "updatedAt": "2025-02-26T03:33:09.921Z"
      }
    }
  ]
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid token" }
  ```

---

### Get Profile

**GET** `/customers/profile`

#### Responses:
- **200 OK**
  ```json
  {
    "id": 1,
    "fullName": "John Doe",
    "email": "johndoe@example.com",
    "phoneNumber": "1234567890",
    "address": "123 Main Street",
    "profilePicture": "http://example.com/profile.jpg"
  }
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid token" }
  ```

---

### Get Product by ID

**GET** `/customers/product/:id`

#### Responses:
- **200 OK**
  ```json
  {
    "id": 2,
    "name": "KFC Spicy Chicken",
    "description": "Spicy, crispy fried chicken with a special hot seasoning.",
    "price": 55000,
    "imgUrl": "https://tse1.mm.bing.net/th?id=OIP.uC0gpTnmfHUTjdMu3UE_6QHaEH&pid=Api&P=0&h=180",
    "CategoryId": 1,
    "stock": 5,
    "createdAt": "2025-02-26T03:33:10.471Z",
    "updatedAt": "2025-02-26T03:33:10.471Z"
  }
  ```
- **404 Not Found**
  ```json
  { "message": "Product is not found" }
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid token" }
  ```

---

### Get Product Recommendations by Category ID

**GET** `/customers/product/:id/recommendation`

#### Responses:
- **200 OK**
  ```json
  [
    {
      "name": "KFC Spicy Chicken",
      "price": 55000,
      "imgUrl": "https://tse1.mm.bing.net/th?id=OIP.uC0gpTnmfHUTjdMu3UE_6QHaEH&pid=Api&P=0&h=180",
      "description": "Spicy fried chicken",
      "CategoryId": 1
    }
  ]
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid token" }
  ```

---

### Update Profile by ID

**PUT** `/customers/profile/:id`

#### Request Body:
```json
{
  "fullName": "KFC Original Chicken",
  "phoneNumber": "081223232434",
  "address": "Jl. KFC No. 1, Jakarta",
  "profilePicture": "https://tse2.mm.bing.net/th?id=OIP.FodjM90_PuNDCtsqQT48fQHaEK&pid=Api&P=0&h=180"
}
```

#### Responses:
- **200 OK**
  ```json
  { "message": "Profile updated successfully" }
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid token" }
  ```

---

### Delete Profile by ID

**DELETE** `/customers/profile/:id`

#### Responses:
- **200 OK**
  ```json
  { "message": "Profile deleted successfully" }
  ```
- **401 Unauthorized**
  ```json
  { "message": "Invalid token" }
  ```

