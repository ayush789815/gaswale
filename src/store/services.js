// services/gaswalaApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gaswalaApi = createApi({
  reducerPath: "gaswalaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://gaswale.vensframe.com/api/" }),
  endpoints: (builder) => ({
    getProductList: builder.query({
      query: (data) => {
        const formData = new FormData();
        formData.append("userid", data?.userid);
        // formData.append("type", data?.type); // fixed this to use data?.type, not userid again

        return {
          url: "customer/productlist",
          method: "POST",
          body: formData,
        };
      },
    }),

    getProfile: builder.query({
      query: (userid) => {
        const formData = new FormData();
        formData.append("userid", userid);

        return {
          url: "customer/profile",
          method: "POST",
          body: formData,
        };
      },
    }),
    getAddressList: builder.query({
      query: (userid) => {
        const formData = new FormData();
        formData.append("userid", userid);

        return {
          url: "customer/addresslist",
          method: "POST", // Still POST even though it's a query
          body: formData,
        };
      },
    }),
    // ✅ New Orders List Endpoint
    getOrdersList: builder.query({
      query: ({ userid, page = 1, limit = 10, type = 2 }) => {
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("page", page);
        formData.append("limit", limit);
        formData.append("type", type);

        return {
          url: "customer/orderslist",
          method: "POST",
          body: formData,
        };
      },
    }),

    // ✅ New: Get Cart List (Query)
    getCartList: builder.query({
      query: (userid) => {
        const formData = new FormData();
        formData.append("userid", userid);
        return {
          url: "customer/cartlist",
          method: "POST",
          body: formData,
        };
      },
    }),
    // ✅ Qutation
    getQutation: builder.query({
      query: ({ userid, type }) => {
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("ingress", 4);
        formData.append("action", type);
        return {
          url: "quotationlist",
          method: "POST",
          body: formData,
        };
      },
    }),
    // ✅ PurchaseOrder
    getPurchaseOrder: builder.query({
      query: ({ userid }) => {
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("ingress", 4);
        return {
          url: "po-list",
          method: "POST",
          body: formData,
        };
      },
    }),
    // ✅ Payment List
    getPaymentList: builder.query({
      query: ({ userid, page = 1, limit = 10 }) => {
        const formData = new FormData();
        formData.append("action", "list");
        formData.append("userid", userid);
        formData.append("page", page);
        formData.append("limit", limit);
        return {
          url: "customer/payment.php",
          method: "POST",
          body: formData,
        };
      },
    }),
    fetchPaymentList: builder.query({
      query: ({ userid }) => {
        const formData = new FormData();
        formData.append("action", "list");
        formData.append("userid", userid);
        return {
          url: "customer/paymentlist",
          method: "POST",
          body: formData,
        };
      },
    }),
    // ✅ Completelist
    getCompletelist: builder.query({
      query: (stateid) => {
        const formData = new FormData();
        formData.append("stateid", stateid);
        return {
          url: "customer/completelist",
          method: "POST",
          body: formData,
        };
      },
    }),

    // reports
    getReports: builder.mutation({
      query: ({
        userid,
        sdate,
        edate,
        // stype = "all",
        ptype = "all",
        ctype = "all",
      }) => {
        const formData = new FormData();
        formData.append("action", "bydate");
        formData.append("sdate", sdate);
        formData.append("edate", edate);
        formData.append("userid", userid);
        // formData.append("stype", stype);
        formData.append("ptype", ptype);
        formData.append("ctype", ctype);

        return {
          url: "customer/reports",
          method: "POST",
          body: formData,
        };
      },
    }),
    // in your api slice
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "customer/updateprofile",
        method: "POST",
        body: formData,
      }),
    }),

    // Create Address
    createAddress: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("userid", data.userid);
        formData.append("unitname", data.unitName);
        formData.append("name", data.receiverName);
        formData.append("mobile", data.mobile);
        formData.append("receiver_name", data.receiverName);
        formData.append("receiver_mobile", data.receiverMobile);
        formData.append("address", data.address);
        formData.append("landmark", data.landmark);
        formData.append("state", data.state);
        formData.append("district", data.district);
        formData.append("pincode", data.pinCode);
        formData.append("location", data.location || "23.2599,77.4126");
        formData.append("addressid", data.addressid || ""); // required if updating
        formData.append("shipping", data.shipping || "0"); // set 1 if active

        return {
          url: "customer/createaddress.php",
          method: "POST",
          body: formData,
        };
      },
    }),
    // updateAddressShipping: builder.mutation({
    //   query: ({ userid, addressid, shipping }) => ({
    //     url: "/updateaddress.php", // Replace with your actual endpoint
    //     method: "POST",
    //     body: {
    //       userid,
    //       addressid,
    //       shipping,
    //     },
    //   }),
    //   invalidatesTags: ["Address"],
    // }),
    deleteAddress: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("userid", data.userid);
        formData.append("addressid", data.addressid);

        return {
          url: "customer/deleteaddress",
          method: "POST",
          body: formData,
        };
      },
    }),
    // getNotifications: builder.query({
    //   query: ({ userid, ingress }) => {
    //     const formData = new FormData();
    //     formData.append("userid", userid);
    //     formData.append("ingress", ingress);

    //     return {
    //       url: "notifications",
    //       method: "POST",
    //       body: formData,
    //     };
    //   },
    // }),

    getNotifications: builder.query({
      query: ({ userid, ingress }) => {
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("ingress", ingress);
        return {
          url: "notifications",
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["Notifications"], 
    }),
    updateNotificationSeenStatus: builder.mutation({
      query: ({ userid, id }) => {
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("id", id);
        formData.append("status", "1"); // Hardcoded to '1' for marking as seen
        return {
          url: "customer/update_notify_seen.php",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Notifications"],
    }),
    updateShippingStatus: builder.mutation({
      query: ({ userid, id, value }) => {
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("id", id);
        formData.append("value", value); // "1" for active, "0" for inactive
    
        return {
          url: "customer/updateshipping",
          method: "POST",
          body: formData,
        };
      },
    }),
    updateContactDetails: builder.mutation({
      query: ({ userid, mobile, email, email1 }) => {
        const formData = new FormData();
        formData.append("userid", userid);
        formData.append("mobile", mobile);
        formData.append("email", email);
        formData.append("email1", email1);
    
        return {
          url: "customer/update_contact_details",
          method: "POST",
          body: formData,
        };
      },
    }),
  // Inside endpoints: (builder) => ({ ... })
createFeedback: builder.mutation({
  query: ({ userid, orderid, fbstatus, fbtext }) => {
    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("orderid", orderid);
    formData.append("fbstatus", fbstatus); // e.g., "5"
    formData.append("fbtext", fbtext);     // e.g., "Service was good"

    return {
      url: "customer/feedbackupdate",
      method: "POST",
      body: formData,
    };
  },
}),

    
  }),
});

export const {
  useGetProductListQuery,
  useGetProfileQuery,
  useGetAddressListQuery,
  useGetOrdersListQuery,
  useGetCartListQuery,
  useGetReportsMutation,
  useGetQutationQuery,
  useGetCompletelistQuery,
  useGetPaymentListQuery,
  useGetPurchaseOrderQuery,
  useUpdateProfileMutation,
  useUpdateShippingStatusMutation,
    useCreateAddressMutation,
  useDeleteAddressMutation,
  useFetchPaymentListQuery,
  useGetNotificationsQuery,
  useUpdateNotificationSeenStatusMutation, // ✅ Export the new mutation hook
    useUpdateContactDetailsMutation,
    useCreateFeedbackMutation, 
} = gaswalaApi;
