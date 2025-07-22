import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API Base URL
const API_URL = "https://gaswale.vensframe.com/api/customer";

// Helper function to create FormData
const createFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Cart", "Products"],

  endpoints: (build) => ({
    // ✅ Get Cart List
    getCart: build.query({
      query: ({ userId, lat = "", long = "" }) => {
        console.log(userId, lat, long);

        return {
          url: "/cartlist",
          method: "POST",
          body: createFormData({
            userid: userId
          }),
        };
      },
      providesTags: ["Cart"],
    }),

    // ✅ Get Product List
    getProductList: build.query({
      query: ({ userId, type }) => ({
        url: "/productlist",
        method: "POST",
        body: createFormData({ userid: userId, type: type }),
      }),
      providesTags: ["Products"],
    }),

    // ✅ Add or Update Cart
    addOrUpdateCart: build.mutation({
      query: ({ userId, productId, count, returncount = 1 }) => {
        return {
          url: "/tempcart",
          method: "POST",
          body: createFormData({
            userid: userId,
            productid: productId,
            count,
            action: 1,
            returncount,
          }),
        };
      },
      invalidatesTags: ["Cart", "Products"],
    }),

    // ✅ Remove from Cart
    removeFromCart: build.mutation({
      query: ({ userId, productId }) => ({
        url: "/tempcart",
        method: "POST",
        body: createFormData({
          userid: userId,
          productid: productId,
          action: 2,
          returncount: 0,
        }),
      }),
      invalidatesTags: ["Cart", "Products"],
    }),
  }),
});

// ✅ Export Hooks for Components
export const {
  useGetCartQuery,
  useGetProductListQuery,
  useAddOrUpdateCartMutation,
  useRemoveFromCartMutation,
} = cartApi;
