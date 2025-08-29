const {User, Product, Category} = require("../models")
const { comparePassword, hashPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const fs = require('fs')
const path = require('path')
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const productJson = require ('../data/product.json')
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper function untuk validasi email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function untuk validasi phone number
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone);
};


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
      res.status(200).json({ 
        access_token,
        user: {
          email: dataUser.email,
          role: dataUser.role,
          profilePicture: dataUser.profilePicture
        }
      })

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

static async Profile(req, res, next) {
  try {
    // Get user data excluding password
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw { name: "NotFound", message: 'User not found' };
    }

    // Add dummy avatar if no profile picture
    const userData = user.toJSON();
    if (!userData.profilePicture) {
      userData.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'User')}&background=random&size=200`;
    }

    // Return the user data directly for easier frontend consumption
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
}

// Method untuk generate dummy avatar
static async generateDummyAvatar(req, res, next) {
  try {
    const { name } = req.query;
    const avatarName = name || req.user.fullName || 'User';
    
    const dummyAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarName)}&background=random&size=200&font-size=0.6`;
    
    res.status(200).json({
      message: 'Dummy avatar generated successfully',
      avatarUrl: dummyAvatarUrl
    });
  } catch (err) {
    next(err);
  }
}

// Method untuk delete profile picture
static async deleteProfilePicture(req, res, next) {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw { name: "NotFound", message: 'User not found' };
    }

    // Check if user has profile picture and it's not a dummy avatar
    if (user.profilePicture && !user.profilePicture.includes('ui-avatars.com')) {
      // Delete file from server
      const imagePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profilePicture));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Update user profile picture to null
    await User.update(
      { profilePicture: null },
      { where: { id: userId } }
    );

    // Get updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    const userData = updatedUser.toJSON();
    // Add dummy avatar
    userData.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'User')}&background=random&size=200`;

    res.status(200).json({
      message: 'Profile picture deleted successfully',
      data: userData
    });

  } catch (err) {
    next(err);
  }
}

static async updateProfile(req, res, next) {
  try {
    const userId = req.user.id; // Menggunakan user ID dari token authentication
    
    // Cari user berdasarkan ID
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw { name: "NotFound", message: 'User not found' };
    }

    // Siapkan data yang akan diupdate
    const updateData = {};
    
    // Ambil data dari request body
    const { fullName, phoneNumber, address, email, currentPassword, newPassword } = req.body;
    
    // Validasi dan update field yang diberikan
    if (fullName !== undefined) {
      if (fullName.trim().length < 2) {
        throw { name: "BadRequest", message: 'Full name must be at least 2 characters long' };
      }
      updateData.fullName = fullName.trim();
    }
    
    if (phoneNumber !== undefined) {
      if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
        throw { name: "BadRequest", message: 'Invalid phone number format' };
      }
      updateData.phoneNumber = phoneNumber;
    }
    
    if (address !== undefined) {
      updateData.address = address;
    }
    
    if (email !== undefined) {
      if (!isValidEmail(email)) {
        throw { name: "BadRequest", message: 'Invalid email format' };
      }
      
      // Check if email already exists (excluding current user)
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [require('sequelize').Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        throw { name: "BadRequest", message: 'Email already exists' };
      }
      
      updateData.email = email;
    }
    
    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        throw { name: "BadRequest", message: 'Current password is required to change password' };
      }
      
      if (newPassword.length < 6) {
        throw { name: "BadRequest", message: 'New password must be at least 6 characters long' };
      }
      
      // Verify current password
      const isCurrentPasswordValid = comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw { name: "Unauthorized", message: 'Current password is incorrect' };
      }
      
      // Hash new password
      updateData.password = hashPassword(newPassword);
    }
    
    // Handle profile picture upload
    if (req.file) {
      // Delete old profile picture if exists and it's not a dummy avatar
      if (user.profilePicture && !user.profilePicture.includes('ui-avatars.com')) {
        const oldImagePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profilePicture));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new profile picture URL
      updateData.profilePicture = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      throw { name: "BadRequest", message: 'No data provided to update' };
    }

    // Update user data
    await User.update(updateData, {
      where: { id: userId }
    });

    // Fetch updated user data (exclude password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    // Add dummy avatar if no profile picture
    const userData = updatedUser.toJSON();
    if (!userData.profilePicture) {
      userData.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'User')}&background=random&size=200`;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      ...userData
    });

  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/profiles', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(err);
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


}