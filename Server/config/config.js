require("dotenv").config();

// ini dipakai untuk db migrate. supabase and postgress sql 

module.exports = {
  development: {
    // Use SQLite for local development - easier setup
    storage: "./database.sqlite",
    dialect: "sqlite",
    logging: false
    
    // Uncomment below for PostgreSQL local development
    // username: process.env.DB_USER || "postgres",
    // password: process.env.DB_PASS || "postgres",
    // database: process.env.DB_NAME || "TheBestOne",
    // host: process.env.DB_HOST || "localhost",
    // port: process.env.DB_PORT || 5432,
    // dialect: "postgres"
  },
  test: {
    storage: "./test-database.sqlite",
    dialect: "sqlite",
    logging: false
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
