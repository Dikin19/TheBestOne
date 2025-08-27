const {User, Product, Category} = require("../models")
const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const fs = require('fs')
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const productJson = require ('../data/product.json')
const { GoogleGenerativeAI } = require("@google/generative-ai");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



module.exports = class CustController {
  
  static async register (req, res, next){
    try {
        
        const { fullName,
                email, 
                password,
                phoneNumber,
                address,
                profilePicture } = req.body //1. ambil req body
        
        const dataUser = await User.create ({
            fullName,
            email, 
            password,
            phoneNumber,
            address,
            profilePicture

        }) //2. create user, pastiin password udah dihash di hook beforeCreate model user nya
        
        res.status(201).json({
            id : dataUser.id,
            fullName : dataUser.fullName,
            email : dataUser.email,
            phoneNumber : dataUser.phoneNumber,
            address : dataUser.address,
            profilePicture : dataUser.profilePicture
          }) //3. response 201, dengan data user yg dicreate

    } catch (err) {
        next (err)
    }
  }

  static async login (req, res, next) {

    try {
      const { email, password } = req.body // 1, req body

    if (!email) {
      throw { name: "BadRequest", message: 'Email is required' }
    }

    if (!password) {
      throw { name: "BadRequest", message: 'Password is required' }
    }

    const dataUser = await User.findOne({
      where: {
        email
      }
    }) // 2. cek username/email di db tergantung data yg ingin digunakan

    if (!dataUser) {
      throw { name: "Unauthorized", message: 'Email/Password is invalid' }
    }

    const isPasswordMatch = comparePassword(password, dataUser.password)
      if (!isPasswordMatch) {
        throw { name: "Unauthorized", message: 'Email/Password is invalid' }
      } //3. compare password match ga ama yg didb?

      const access_token = signToken({ id: dataUser.id })
      res.status(200).json({ access_token })

    } catch (err) {
        console.log(err, '<<<<<<<<<');
      next (err)
    }
  }

  static async listProduct (req, res, next){
    try {
            
      const data = await Product.findAll({
          include:
              {
                  model: Category,
                  
              }
      })
      
      res.status(200).json(data)
  } catch (err) {
     next (err)
  }
  }

  static async productById (req, res, next) {
    try {
        

        let {id} = req.params

        const data = await Product.findByPk(id)

        if (!data) {
            throw { name: "NotFound", message: 'Product is not found' }
        }
        res.status(200).json(data)

    } catch (err) {
        next (err)
    }

}

static async Profile (req, res, next){
  try {
    
    res.json(req.user)
} catch (err) {
   next (err)
}
}

static async updateProfile (req, res, next){
  try {
      
      const data = await User.findByPk(req.params.id)

      if (!data) {
          throw { name: "NotFound", message: 'Profile is not found' }
        }

        const {
          fullName,
          phoneNumber,
          address,
          profilePicture
      } = req.body

      const result = await User.update({
        fullName,
        phoneNumber,
        address,
        profilePicture
      },
      {
          where : {
                      id: req.params.id
                  },
          returning: true
      }
  )

      res.status(200).json(result[1][0])

  } catch (err) {
      next (err)
  }
}

static async deleteById(req, res, next) {
  try {
    const id = +req.params.id;
    const dataUser = await User.findOne({ where: { id, isDeleted: false } });

    if (!dataUser) {
      throw { name: "NotFound", message: 'User is not found' };
    }

    // Cek jika user ingin hapus akun dirinya sendiri
    if (req.user.id !== id) {
      throw { name: "Forbidden", message: "You can't delete another user's account" };
    }

    await dataUser.update({ isDeleted: true }); // soft delete
    res.status(200).json({ message: `${dataUser.fullName} has been deleted.` });
  } catch (err) {
    next(err);
  }
}

static async ByCategoryId(req, res, next) {
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const product = await Product.findByPk(req.params.id);
    const data = await Product.findAll();

    const products = data.map(el => ({
      id: el.id,
      name: el.name,
      imgUrl: el.imgUrl,
      price: el.price,
      CategoryId: el.CategoryId
    }));

    const prompt = `
      I have a list of product menus in the following data: ${JSON.stringify(products)}.

      Please give me 3 menu recommendations from the same category as this product (CategoryId = ${product.CategoryId}).

      Instructions:
      - Only recommend menus with CategoryId = ${product.CategoryId}.
      - Do not include the same menu as the current product.
      - If there are not enough items in CategoryId = ${product.CategoryId}, recommend 3 closest items from the available data.

      Return the response in pure JSON array format, like this:
      [
        {
          "name": "string",
          "price": number,
          "imgUrl": "string",
          "description": "string",
          "CategoryId": number
        }
      ]

      Important:
      - Do NOT include any markdown formatting like \`\`\`json or \`\`\`.
      - Only return the JSON array, no extra text or explanation.
    `;

    const rawResult = await model.generateContent(prompt);
    const response = rawResult.response;
    const rawText = response.text();

    let cleanedText = rawText.trim();
    const startIdx = cleanedText.indexOf('[');
    const endIdx = cleanedText.lastIndexOf(']');

    if (startIdx === -1 || endIdx === -1) {
      console.error("RawText from Gemini:\n", rawText);
      throw new Error("Failed to locate valid JSON array in Gemini response.");
    }

    cleanedText = cleanedText.slice(startIdx, endIdx + 1);

    let result;
    try {
      result = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Gagal parsing JSON. Cleaned text:\n", cleanedText);
      throw err;
    }

    console.log("Gemini Result:\n", JSON.stringify(result, null, 2));

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);

  } catch (err) {
    console.error("ERROR:", err);
    next(err);
  }
}


  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user)
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { googleToken } = req.body;
      console.log(googleToken)

      if (!googleToken) {
        throw { name: 'BadRequest', message: "Google Token is required" };
      }

      // Verifikasi token Google
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // Ambil informasi dari token
      const payload = ticket.getPayload();
      console.log(payload, "<<<< Google Payload");

      // Buat password dummy (hanya digunakan sekali saat register otomatis)
      const dummyPassword = `${Math.random()}=${Date.now()}=${crypto.randomUUID()}`;
      console.log(dummyPassword, "<<<< dummy password");

      // Cari user, kalau belum ada, buat user baru
      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          email: payload.email,
          role: 'customer',
          password: dummyPassword,
          profilePicture: payload.picture,
        },
      });

      // Buat access token
      const access_token = signToken({ id: user.id });

      // Kirim respons
      res.status(200).json({
        access_token,
        user: {
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw { name: 'BadRequest', message: 'Email or password is required' }
      }
      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw { name: 'Unauthorized', message: 'Email or password is required' }
      }

      const isValidPassword = comparePassword(password, user.password)
      if (!isValidPassword) {
        throw { name: 'Unauthorized', message: 'Email or password is required' }
      }

      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token, user: { email: user.email, role: user.role } })
    } catch (err) {
      next(err);
    }
  }






}