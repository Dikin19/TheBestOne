# Profile API Documentation

## Overview

API untuk mengelola profile user dengan fitur upload foto dan update semua data profile.

## Base URL

```
http://localhost:3000/customer
```

## Authentication

Semua endpoint memerlukan authentication menggunakan Bearer token di header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Get Profile

Mendapatkan data profile user yang sedang login.

**Endpoint:** `GET /profile`

**Response Success (200):**

```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "08123456789",
    "address": "Jakarta, Indonesia",
    "profilePicture": "https://ui-avatars.com/api/?name=John%20Doe&background=random&size=200",
    "role": "customer",
    "isDeleted": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 2. Update Profile

Update data profile user. Bisa update semua field termasuk upload foto.

**Endpoint:** `PUT /profile`

**Content-Type:** `multipart/form-data`

**Request Body:**

```
fullName: string (optional)
email: string (optional)
phoneNumber: string (optional)
address: string (optional)
currentPassword: string (optional, required jika ingin ganti password)
newPassword: string (optional, minimal 6 karakter)
profilePicture: file (optional, format: jpg, jpeg, png, gif, max 5MB)
```

**Example Request:**

```javascript
const formData = new FormData();
formData.append("fullName", "John Doe Updated");
formData.append("phoneNumber", "08987654321");
formData.append("address", "Bandung, Indonesia");
formData.append("profilePicture", fileInput.files[0]); // File object

fetch("http://localhost:3000/customer/profile", {
  method: "PUT",
  headers: {
    Authorization: "Bearer <access_token>",
  },
  body: formData,
});
```

**Response Success (200):**

```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe Updated",
    "email": "john@example.com",
    "phoneNumber": "08987654321",
    "address": "Bandung, Indonesia",
    "profilePicture": "http://localhost:3000/uploads/profiles/1_1640995200000_profile.jpg",
    "role": "customer",
    "isDeleted": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 3. Generate Dummy Avatar

Generate URL dummy avatar berdasarkan nama.

**Endpoint:** `GET /profile/dummy-avatar?name=<nama>`

**Query Parameters:**

- `name` (optional): Nama untuk generate avatar. Jika tidak ada, akan menggunakan nama user yang login.

**Response Success (200):**

```json
{
  "message": "Dummy avatar generated successfully",
  "avatarUrl": "https://ui-avatars.com/api/?name=John%20Doe&background=random&size=200&font-size=0.6"
}
```

### 4. Delete Profile Picture

Hapus foto profile user dan kembali ke dummy avatar.

**Endpoint:** `DELETE /profile/picture`

**Response Success (200):**

```json
{
  "message": "Profile picture deleted successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "08123456789",
    "address": "Jakarta, Indonesia",
    "profilePicture": "https://ui-avatars.com/api/?name=John%20Doe&background=random&size=200",
    "role": "customer",
    "isDeleted": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Full name must be at least 2 characters long"
}
```

### 401 Unauthorized

```json
{
  "message": "Invalid token"
}
```

### 404 Not Found

```json
{
  "message": "User not found"
}
```

### 413 Payload Too Large

```json
{
  "message": "File too large"
}
```

## Validations

### Email

- Harus format email yang valid
- Unique (tidak boleh sama dengan user lain)

### Phone Number

- Format Indonesia: +62xxx, 62xxx, atau 0xxx
- Panjang 10-15 digit

### Password

- Minimal 6 karakter
- Harus memasukkan password lama untuk ganti password

### Profile Picture

- Format yang didukung: jpg, jpeg, png, gif
- Maksimal ukuran: 5MB
- File disimpan di folder `uploads/profiles/`

## Frontend Implementation Example

```javascript
// Get Profile
const getProfile = async () => {
  const response = await fetch("/customer/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

// Update Profile dengan foto
const updateProfile = async (formData) => {
  const response = await fetch("/customer/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return data;
};

// Update Profile tanpa foto
const updateProfileData = async (profileData) => {
  const formData = new FormData();
  Object.keys(profileData).forEach((key) => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      formData.append(key, profileData[key]);
    }
  });

  return updateProfile(formData);
};

// Generate Dummy Avatar
const getDummyAvatar = async (name) => {
  const response = await fetch(
    `/customer/profile/dummy-avatar?name=${encodeURIComponent(name)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data.avatarUrl;
};

// Delete Profile Picture
const deleteProfilePicture = async () => {
  const response = await fetch("/customer/profile/picture", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
```

## Static File Access

Foto profile yang diupload dapat diakses melalui URL:

```
http://localhost:3000/uploads/profiles/<filename>
```
