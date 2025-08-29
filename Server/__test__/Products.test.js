const { expect, test, describe, beforeAll, afterAll } = require('@jest/globals')
const request = require('supertest')
const { Product, User, Category } = require('../models')
const app = require('../app')
const { signToken } = require('../helpers/jwt')


let access_token_staff
let staffId2
let access_token_admin
let adminId1

let access_token_admin3
let access_token_admin4
let access_token_admin5
let adminId3
let adminId4
let adminId5

const allCategories = require ('../data/category.json')
const allProduct = require ('../data/product.json')


beforeAll(async () => {
    console.log('beforeAll');
    try {
        // seeding user admin and staff
        
        adminId1 = await User.create({ 
            fullName: "Admin User",
            email: "admin77@mail.com", 
            password: "admin77",
            phoneNumber: "1234567890",
            address: "Admin Address"
        })
        access_token_admin = signToken({ id: adminId1.id })

        staffId2 = await User.create({ 
            fullName: "Staff User",
            email: "staff77@gmail.com", 
            password: "staff77",
            phoneNumber: "1234567891",
            address: "Staff Address"
        })
        access_token_staff = signToken({ id: staffId2.id })

        adminId3 = await User.create({ 
            fullName: "Admin User 3",
            email: "admin@mail.com", 
            password: "admin777",
            phoneNumber: "1234567892",
            address: "Admin Address 3"
        })
        access_token_admin3 = signToken({ id: adminId3.id })

        adminId4 = await User.create({ 
            fullName: "Admin User 4",
            email: "admin7@mail.com", 
            password: "admin777",
            phoneNumber: "1234567893",
            address: "Admin Address 4"
        })
        access_token_admin4 = signToken({ id: adminId4.id })

        adminId5 = await User.create({ 
            fullName: "Admin User 5",
            email: "admin777@mail.com", 
            password: "admin777",
            phoneNumber: "1234567894",
            address: "Admin Address 5"
        })
        access_token_admin5 = signToken({ id: adminId5.id })
        
        
        // Seeding table
        await Category.bulkCreate(allCategories)

    } catch (error) {
      console.log(error); 
    }
  })

afterAll(async () => {
  console.log('afterAll');
    try {
        
        await Product.destroy({
          truncate: true, 
          restartIdentity: true, 
          cascade: true
        })

        await Category.destroy({
          truncate: true, // hapus semua data dari db
          restartIdentity: true, // restart primary key (id) mulai dari 1 lg
          cascade: true // kalo datanya berelasi dengan data lain, data lainnya didelete
        })
    
        await User.destroy({
          truncate: true, 
          restartIdentity: true, 
          cascade: true
        })
        
    } catch (error) {
        console.log(error);
    }
  })

  describe('POST/login', () => {
    test('should login successfully', async () => {
      const user = {
       "email": "staff77@gmail.com",
       "password":"staff77"
      }
      const response = await request(app).post('/login').send(user)
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('access_token', expect.any(String))
    })

    test('gets fail if gets missing email', async () => {
        const user = {
         "email": "",
         "password":"staff77"
        }
        const response = await request(app).post('/login').send(user)
        expect(response.status).toBe(400)//BadRequest
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Email is required")
      })
      test('gets fail if gets missing password', async () => {
        const user = {
         "email": "staff77@gmail.com",
         "password":""
        }
        const response = await request(app).post('/login').send(user)
        expect(response.status).toBe(400)//BadRequest
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Password is required")
      })

      test('gets fail if email does not complete or match', async () => {
        const user = {
         "email": "staff@gmail.com",
         "password":"staff77"
        }
        const response = await request(app).post('/login').send(user)
        expect(response.status).toBe(401)//Unauthorized
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Email/Password is invalid")
      })

      test('gets fail if password does not complete or match', async () => {
      const user = {
        "email": "staff@gmail.com",
        "password":"staff77salah"
      }
      const response = await request(app).post('/login').send(user)
      expect(response.status).toBe(401)//Unauthorized
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message', "Email/Password is invalid")
    })

  })

describe('Post/Register', () => {
    test('should create a new user and return 201', async () => {
      const user = {
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        address: '123 Main Street',
        profilePicture: 'http://example.com/profile.jpg'
      };
  
      const response = await request(app)
        .post('/register')
        .send(user);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.fullName).toBe(user.fullName);
      expect(response.body.email).toBe(user.email);
      expect(response.body.phoneNumber).toBe(user.phoneNumber);
      expect(response.body.address).toBe(user.address);
      expect(response.body.profilePicture).toBe(user.profilePicture);
    });

    test('gets fail if gets missing email', async () => {
      const user = {
        fullName: 'John Doe',
        email: '',
        password: 'password123',
        phoneNumber: '1234567890',
        address: '123 Main Street',
        profilePicture: 'http://example.com/profile.jpg'
      };
  
      const response = await request(app)
        .post('/register')
        .send(user);
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required!');
    });

    test('gets fail if gets missing Password', async () => {
      const user = {
        fullName: 'Dikin',
        email: 'dikin@gmail.com',
        password: '',
        phoneNumber: '1234567890',
        address: '123 Main Street',
        profilePicture: 'http://example.com/profile.jpg'
      };
  
      const response = await request(app)
        .post('/register')
        .send(user);
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Password is required!');
    });

    test('should fail if email is invalid', async () => {
      const user = {
          fullName: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
          phoneNumber: '1234567890',
          address: '123 Main Street',
          profilePicture: 'http://example.com/profile.jpg'
      };

      const response = await request(app)
          .post('/register')
          .send(user);

      expect(response.status).toBe(400); // Bad Request
      expect(response.body).toHaveProperty('message', 'Email must be email format');
  });
});

describe('POST /payment/midtrans/initiate', () => {
  //   test('should initiate midtrans transaction and return 201', async () => {
  //     const paymentData = {
  //         order_id: 'order-123',
  //         gross_amount: 100000
  //     };

  //     const response = await request(app)
  //         .post('/customers/payment/midtrans/initiate')
  //         .set('Authorization', `Bearer ${access_token_admin}`)
  //         .send(paymentData);

  //     expect(response.status).toBe(201);
  //     expect(response.body).toBeInstanceOf(Object);
  //     expect(response.body).toHaveProperty('token');
  //     expect(response.body).toHaveProperty('redirect_url');
  //     expect(response.body.token).toBe('f9bb1441-6a4f-4a31-a1b3-d90423f528df');
  //     expect(response.body.redirect_url).toBe('https://app.sandbox.midtrans.com/snap/v4/redirection/f9bb1441-6a4f-4a31-a1b3-d90423f528df');
  // });

  // test('should return 401 if no token is provided', async () => {
  //     const paymentData = {
  //         order_id: 'order-123',
  //         gross_amount: 100000
  //     };

  //     const response = await request(app)
  //         .post('customers/payment/midtrans/initiate')
  //         .send(paymentData);

  //     expect(response.status).toBe(401);
  //     expect(response.body).toHaveProperty('message', 'Authentication failed');
  // });

  // test('should return 401 if token is invalid', async () => {
  //     const paymentData = {
  //         order_id: 'order-123',
  //         gross_amount: 100000
  //     };

  //     const response = await request(app)
  //         .post('customers/payment/midtrans/initiate')
  //         .set('Authorization', 'Bearer ' + 'invalidtoken')
  //         .send(paymentData);

  //     expect(response.status).toBe(401);
  //     expect(response.body).toHaveProperty('message', 'Invalid token');
  // });

  test('should return 401 if no token is provided', async () => {
      const paymentData = {
          order_id: 'order-123',
          gross_amount: 100000
      };

      const response = await request(app)
          .post('/customers/payment/midtrans/initiate')
          .send(paymentData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('should return 401 if token is invalid', async () => {
      const paymentData = {
          order_id: 'order-123',
          gross_amount: 100000
      };

      const response = await request(app)
          .post('/customers/payment/midtrans/initiate')
          .set('Authorization', 'Bearer ' + 'invalidtoken')
          .send(paymentData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('GET /customers/product', () => {
  test('should return a list of products with status 200', async () => {
    const response = await request(app)
        .get('/customers/product')
        .set('Authorization', `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('imgUrl');
        expect(product).toHaveProperty('CategoryId');
        expect(product).toHaveProperty('stock');
        expect(product).toHaveProperty('createdAt');
        expect(product).toHaveProperty('updatedAt');
        expect(product).toHaveProperty('Category');
        expect(product.Category).toBeInstanceOf(Object);
        expect(product.Category).toHaveProperty('id');
        expect(product.Category).toHaveProperty('name');
        expect(product.Category).toHaveProperty('createdAt');
        expect(product.Category).toHaveProperty('updatedAt');
    });
  });

  test('should return 401 if no token is provided', async () => {
      const response = await request(app)
          .get('/customers/product');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('GET /customers/profile', () => {
  test('should return profile with status 200', async () => {
      const response = await request(app)
          .get('/customers/profile')
          .set('Authorization', `Bearer ${access_token_admin}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('fullName');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('phoneNumber');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('profilePicture');
  });

  test('should return 401 if no token is provided', async () => {
      const response = await request(app)
          .get('/customers/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('should return 401 if token is invalid', async () => {
      const response = await request(app)
          .get('/customers/profile')
          .set('Authorization', 'Bearer ' + 'invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('GET /customers/product/:id/recomendation', () => {
  // test('should return a list of recommended products with status 200', async () => {
  //     const response = await request(app)
  //         .get('/customers/product/2/recomendation')
  //         .set('Authorization', `Bearer ${access_token_admin}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toBeInstanceOf(Array);
  //     response.body.forEach(product => {
  //         expect(product).toHaveProperty('name');
  //         expect(product).toHaveProperty('price');
  //         expect(product).toHaveProperty('imgUrl');
  //         expect(product).toHaveProperty('description');
  //         expect(product).toHaveProperty('CategoryId');
  //     });
  // });

  test('should return 401 if no token is provided', async () => {
      const response = await request(app)
          .get('/customers/product/1/recomendation');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('should return 401 if token is invalid', async () => {
      const response = await request(app)
          .get('/customers/product/1/recomendation')
          .set('Authorization', 'Bearer ' + 'invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('GET /customers/product/:id', () => {
  // test('should return a product by id with status 200', async () => {
  //     const response = await request(app)
  //         .get('/customers/product/4')
  //         .set('Authorization', `Bearer ${access_token_admin}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toBeInstanceOf(Array);
  // });

  test('should return 404 if product is not found', async () => {
      const response = await request(app)
          .get('/customers/product/999')
          .set('Authorization', `Bearer ${access_token_admin}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product is not found');
  });

  test('should return 401 if no token is provided', async () => {
      const response = await request(app)
          .get('/customers/product/2');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('should return 401 if token is invalid', async () => {
      const response = await request(app)
          .get('/customers/product/2')
          .set('Authorization', 'Bearer ' + 'invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('PUT/profile/:id', ()=>{
  test('should be updated by id successfully', async () => {
    const data = {

      "fullName": "KFC Original Chicken",
      "phoneNumber": "081223232434",
      "address": "Jl. KFC No. 1, Jakarta",
      "profilePicture": "https://tse2.mm.bing.net/th?id=OIP.FodjM90_PuNDCtsqQT48fQHaEK&pid=Api&P=0&h=180",

    }

    const response = await request(app).put(`/customers/profile/${adminId1.id}`).send(data).set('Authorization', 'Bearer ' + access_token_admin )
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('id', adminId1.id)
    expect(response.body).toHaveProperty('fullName', data.fullName)
    expect(response.body).toHaveProperty('phoneNumber', data.phoneNumber)
    expect(response.body).toHaveProperty('address', data.address)
    expect(response.body).toHaveProperty('profilePicture', data.profilePicture)
  })

  test('gets fail because not login yet', async () => {
    const data = {

      "fullName": "KFC Original Chicken",
      "phoneNumber": "081223232434",
      "address": "Jl. KFC No. 1, Jakarta",
      "profilePicture": "https://tse2.mm.bing.net/th?id=OIP.FodjM90_PuNDCtsqQT48fQHaEK&pid=Api&P=0&h=180",

    }

    const response = await request(app).put('/customers/profile/1').send(data).set('Authorization', 'Bearer ' )
    expect(response.status).toBe(401)//InvalidToken
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Invalid token")
  })

  test('gets fail because token is invalid', async () => {
    const data = {

      "fullName": "KFC Original Chicken",
      "phoneNumber": "081223232434",
      "address": "Jl. KFC No. 1, Jakarta",
      "profilePicture": "https://tse2.mm.bing.net/th?id=OIP.FodjM90_PuNDCtsqQT48fQHaEK&pid=Api&P=0&h=180",

    }

    const response = await request(app).put('/customers/profile/1').send(data).set('Authorization', 'Bearer ' + "test" )
    expect(response.status).toBe(401)//InvalidToken
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Invalid token")
  })
})

describe('DELETE/customers/profile/:id', () => {
      test('should delete data successfully', async () => {
      
        const response = await request(app).delete(`/customers/profile/${adminId1.id}`)
        .set('Authorization', 'Bearer ' + access_token_admin)
    
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Admin User has been deleted.")
      })
    
      test('gets fail if token is invalid', async () => {
      
        const response = await request(app).delete(`/customers/profile/${adminId1.id}`)
        .set('Authorization', 'Bearer ' + "tokensalah")
    
        expect(response.status).toBe(401)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', "Invalid token")
      })
    
  })
