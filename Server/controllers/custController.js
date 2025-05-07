const {User, Product, Category} = require("../models")
const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const fs = require('fs')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const productJson = require ('../data/product.json')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();


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

static async deleteById (req, res, next){
  try {
      
      let {id} = req.params
      let dataUser = await User.findByPk(id) 

      if (!dataUser) {
          throw { name: "NotFound", message: 'User is not found' }
        }

        let data = `${dataUser.fullName} success to delete`
        await dataUser.destroy();
        res.status(200).json({message:data});

  } catch (err) {
      next (err)
  }
}

static async ByCategoryId (req, res, next) {

  // const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {

    const product = await Product.findByPk(req.params.id)

    const data = await Product.findAll()
    const products = data.map((el)=>{
      return {
        
        id : el.id,
        name: el.name,
        imgUrl: el.imgUrl,
        price: el.price,
        CategoryId: el.CategoryId
      }
    })


    const prompt = `
    Give me 3 menu recommendation dari Category.
    It should be ${product.CategoryId} menu recommendation dari Category based on my data here ${JSON.stringify(products)}.
    Don't suggest any Category outside ${product.CategoryId} and don't suggest same menu ${product.CategoryId}.
    if you don't find any ${product.CategoryId} give me closser menu from ${JSON.stringify(products)} don't give more than 3.

    Please give me the response in JSON like below format:
    [
      {
        "name": string,
        "price": number,
        "imgUrl": string,
        "description": string,
        "CategoryId": number
      }
    ]

    and without this open \`\`\`json and close \`\`\`.
  `;

  const rawResult = await model.generateContent(prompt);
  const result =JSON.parse(rawResult.response.text())
  console.log(rawResult.response.text);
  res.json(result);
    
  } catch (err) {
    next(err)
    
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
      const { googleToken } = req.body

      if (!googleToken) {
        throw { name: 'BadRequest', message: "Google Token is required" }
      }

      // Verifikasi google token dari client, apakah benar datang dari google
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // payload adalah informasi yg terkandung didalam tokennya
      const payload = ticket.getPayload();

      console.log(payload, "<<<<");

      let dummyPassword = Math.random().toString() + '=' + Date.now() + '=' + crypto.randomUUID()

      console.log(dummyPassword);

      const [user] = await User.findOrCreate({
        where: {
          email: payload.email
        },
        defaults: {
          email: payload.email,
          role: 'customer',
          password: dummyPassword,
          profilePicture: payload.picture

          // name: payload.name,
          // profilePicture: payload.picture
        }
      })

      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token, user: { email: user.email, role: user.role, profilePicture: user.profilePicture } })
    } catch (error) {
      next(error)
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