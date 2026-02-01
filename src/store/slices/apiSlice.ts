import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, AUTHORIZATION_TOKEN, ENDPOINTS } from '@/utils/config';

import {
  ProductType,
  BannerType,
  CarouselType,
  TagType,
  CategoryType,
  PromocodeType,
} from '@/store/types';

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('authorization', `Bearer ${AUTHORIZATION_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Existing GET queries...
    getProducts: builder.query<{ products: ProductType[] }, void>({
      query: () => ENDPOINTS.get.products,
    }),
    getBanners: builder.query<{ banners: BannerType[] }, void>({
      query: () => ENDPOINTS.get.banners,
    }),
    getCarousel: builder.query<{ carousel: any[]; banners: any[]; Categorys: any[] }, void>({
      query: () => ENDPOINTS.get.carousel,
    }),
    getCategories: builder.query<{ categories: CategoryType[] }, void>({
      query: () => ENDPOINTS.get.categories,
    }),
    getReviews: builder.query<{ reviews: any[] }, void>({
      query: () => ENDPOINTS.get.reviews,
    }),
    getUsers: builder.query<{ users: any[] }, void>({
      query: () => ENDPOINTS.get.users,
    }),
    getTags: builder.query<{ tags: TagType[] }, void>({
      query: () => ENDPOINTS.get.tags,
    }),
    getPromocodes: builder.query<{ promocodes: PromocodeType[] }, void>({
      query: () => ENDPOINTS.get.promocodes,
    }),

    // 🔐 Auth Mutations
    loginUser: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: ENDPOINTS.auth.login,
        method: 'POST',
        body: credentials,
      }),
    }),

    updateUser: builder.mutation<any, { userId: string; data: any }>({
      query: ({ userId, data }) => ({
        url: `${ENDPOINTS.auth.updateUser}/${userId}`,
        method: 'PUT',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<any, { token: string }>({
      query: ({ token }) => ({
        url: ENDPOINTS.auth.emailVerify,
        method: 'POST',
        body: { token },
      }),
    }),

    createNewUser: builder.mutation<any, { email: string; password: string; name?: string }>({
      query: (user) => ({
        url: ENDPOINTS.auth.createNewUser,
        method: 'POST',
        body: user,
      }),
    }),

    checkUserExists: builder.mutation<any, { phone: string }>({
      query: (payload) => ({
        url: ENDPOINTS.auth.ifUserExists,
        method: 'POST',
        body: payload,
      }),
    }),

    checkEmailExists: builder.mutation<any, { email: string }>({
      query: (payload) => ({
        url: ENDPOINTS.auth.ifEmailExists,
        method: 'POST',
        body: payload,
      }),
    }),

    confirmEmail: builder.mutation<any, { code: string; email: string }>({
      query: (payload) => ({
        url: ENDPOINTS.auth.emailConfirm,
        method: 'POST',
        body: payload,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: 'api/user/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'api/order/createOrder',
        method: 'POST',
        body: orderData,
      }),
    }),
    getOrder: builder.query({
      query: (userId: string) => `api/order/OrderlistById/${userId}`,
    }),

    getOrdertask: builder.query({
      query: (userId: string) => `api/order/Orderlist/${userId}`,
    }),

    userProfile: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `api/user/UserImage/${userId}`,
        method: 'POST',
        body: formData,
      }),
    }),

    getTodayTasks: builder.mutation<any, { latitude: number; longitude: number }>({
      query: (body) => ({
        url: 'api/order/tasks-today',
        method: 'POST',
        body,
      }),
    }),


  }),


});

export const {
  useGetTagsQuery,
  useGetUsersQuery,
  useGetBannersQuery,
  useGetReviewsQuery,
  useGetProductsQuery,
  useGetCarouselQuery,
  useGetCategoriesQuery,
  useGetPromocodesQuery,
  useLoginUserMutation,
  useUpdateUserMutation,
  useVerifyEmailMutation,
  useCreateNewUserMutation,
  useCheckUserExistsMutation,
  useCheckEmailExistsMutation,
  useConfirmEmailMutation,
  useVerifyOtpMutation,
  useCreateOrderMutation,
  useGetOrderQuery,
  useUserProfileMutation, // ✅ Correct hook
  useGetTodayTasksMutation

} = apiSlice;

export default apiSlice.reducer;
