export const APP_CONSTANTS = {
  // Animation et timing
  HERO_PHRASES_INTERVAL: 7000,
  FUN_FACTS_INTERVAL: 10000,
  LOADING_MIN_TIME: 500,
  SKELETON_LOADING_TIME: 800,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 200,
  SEARCH_SUGGESTIONS_DELAY: 200,
  MODAL_TRANSITION_DELAY: 10,

  // Layout et pagination
  STARS_PER_PAGE_HOME: 6,
  MAX_STARS_DISPLAY: 10,
  CATALOG_LIMIT: 100,
  MAX_SUGGESTIONS_HEIGHT: "15rem",

  // Search
  MAX_SEARCH_SUGGESTIONS: 5,
  MAX_SEARCH_SUGGESTIONS_EXPANDED: 8,

  // Form validation
  TEXTAREA_ROWS: 5,

  // UI dimensions
  IMAGE_MIN_WIDTH: "200px",
  IMAGE_HEIGHT_MD: "300px",
  STAR_CARD_WIDTH: "2/3",
  CONTENT_WIDTH_MD: "2/3",
  SIDEBAR_WIDTH_MD: "1/3",

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;

export const ENDPOINTS = {
  API_BASE: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  CATALOG: "/catalog",
  STARS: "/stars",
  CART: "/cart",
  WISHLIST: "/wishlist",
  ORDERS: "/orders",
  AUTH: "/auth",
  USERS: "/users",
  REVIEWS: "/reviews",
  ADMIN: "/admin",
  PAYMENT: "/payment",
} as const;

export const ROUTES = {
  HOME: "/",
  CATALOG: "/catalog",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_CONFIRMATION: "/order-confirmation",
  PROFILE: "/profile",
  AUTH: "/auth",
  ADMIN: "/admin",
  WISHLIST: "/wishlist",
  CONTACT: "/contact",
  ABOUT: "/about",
  FAQ: "/faq",
  LEGAL: "/legal",
  PRIVACY_POLICY: "/privacy-policy",
  STAR_DETAIL: "/star",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
