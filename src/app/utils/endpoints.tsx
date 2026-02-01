export const ENDPOINTS = {
  get: {
    tags: 'api/tags',
    users: 'api/users',
    orders: 'api/orders',
    carousel: 'api/header/allbanner?lang=1',
    banners: 'api/banners',
    reviews: 'api/reviews/GetAllReviews',
    discount: 'api/coupon/applyCoupon',
    products: 'api/product/allProduct?lang=1',
    promocode: 'api/promocode',
    promocodes: 'api/promocodes',
    categories: 'api/categories',
    usersgetid: 'api/user/userGetById',
    UserImage: 'api/user/UserImage',


  },
  post: {
    order: 'api/order/createOrder',
    getorder: 'api/order/OrderlistById',
  },
  auth: {
    login: 'api/user/login',
    updateUser: 'api/auth/user/update',
    emailVerify: 'api/auth/email/verify',
    createNewUser: 'api/auth/user/create',
    ifUserExists: 'api/auth/user/exists',
    ifEmailExists: 'api/auth/email/exists',
    emailConfirm: 'api/auth/email/confirm',
  },
};
