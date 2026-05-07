// src/utils/swagger.js

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stella API",
      version: "1.0.0",
      description: "API pour la plateforme e-commerce Stella de vente d'étoiles",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Star: {
          type: "object",
          properties: {
            starid: { type: "integer" },
            name: { type: "string" },
            constellation: { type: "string" },
            magnitude: { type: "number" },
            price: { type: "number" },
            description: { type: "string" },
            distanceFromEarth: { type: "number" },
            luminosity: { type: "number" },
            mass: { type: "number" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["client", "admin"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        RegisterUserInput: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["firstName", "lastName", "email", "password"],
        },
        LoginUserInput: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
        Cart: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            cartItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  starId: { type: "integer" },
                  quantity: { type: "integer" },
                  Star: { $ref: "#/components/schemas/Star" },
                },
              },
            },
          },
        },
        AddToCartInput: {
          type: "object",
          properties: {
            starId: { type: "integer" },
            quantity: { type: "integer" },
          },
          required: ["starId", "quantity"],
        },
        UpdateCartItemInput: {
          type: "object",
          properties: {
            cartItemId: { type: "integer" },
            quantity: { type: "integer" },
          },
          required: ["cartItemId", "quantity"],
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  starId: { type: "integer" },
                  quantity: { type: "integer" },
                  price: { type: "number" },
                },
              },
            },
            totalAmount: { type: "number" },
            status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled", "paid"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateOrderInput: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  starId: { type: "integer" },
                  quantity: { type: "integer" },
                },
              },
            },
            shippingAddress: {
              type: "object",
              properties: {
                street: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                zipCode: { type: "string" },
                country: { type: "string" },
              },
            },
            paymentMethod: { type: "string", enum: ["credit_card", "paypal", "bank_transfer"] },
          },
          required: ["items", "shippingAddress", "paymentMethod"],
        },
        UpdateOrderStatusInput: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
          },
          required: ["status"],
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            starId: { type: "integer" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AddReviewInput: {
          type: "object",
          properties: {
            starId: { type: "integer" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string" },
          },
          required: ["starId", "rating"],
        },
        Wishlist: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            starId: { type: "integer" },
            Star: { $ref: "#/components/schemas/Star" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AddToWishlistInput: {
          type: "object",
          properties: {
            starId: { type: "integer" },
          },
          required: ["starId"],
        },
        UpdateReviewInput: {
          type: "object",
          properties: {
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", maxLength: 500 },
          },
        },
        UpdateUserInput: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
};
