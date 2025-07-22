import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatIndianPrice, getImageUrl } from "../utils/utils";
import axios from "axios";
import { ContentLoader } from "../components/PageLoader";
import KeyValueItem from "../components/KeyValueItem";

const OrderDetails = () => {
  const { id } = useParams(); // Already decoded
  console.log("Order ID:", id); // B-25/26-0004
  const userData = JSON.parse(localStorage.getItem("customer"));
  const [loading, setLoading] = useState(false);

  // const orderData = {
  //   orderId: "B-25/26-0004",
  //   date: "16-Jun-2025 11:42",
  //   paymentMode: "COD",
  //   subTotal: 42525,
  //   securityDeposit: 0,
  //   totalSum: 42525,
  //   tracking: "In Process",
  //   product: {
  //     image: "https://i.ibb.co/DYjVYMk/gogas-425kg.png", // replace with your image URL or import
  //     brand: "Gogas",
  //     description: "425 KG LPG REFILL",
  //     price: 42525,
  //     count: 1,
  //     deposit: 0,
  //   },
  //   address: {
  //     name: "Tester",
  //     email: "knataraju45@gmail.com",
  //     phone: "7777777777",
  //     street: "Kocchar Apartements , Main Road Begumpet",
  //     city: "Hyderabad",
  //     state: "TELANGANA",
  //     pincode: "500016",
  //   },
  // };

  const [orderData, setOrderData] = useState({});
  console.log(orderData);
  const [products, setProducts] = useState([]);
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const body = new FormData();
      body.append("userid", userData?.userid);
      body.append("orderid", id);
      const res = await axios.post(
        "https://gaswale.vensframe.com/api/customer/orderbyid.php",
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const response = await res.data;
      console.log(response?.orders);
      if (response?.success) {
        setOrderData(response?.orders);
        const orderArray = response?.orders?.count?.map((_, i) => ({
          count: response?.orders.count[i],
          image: response?.orders.image[i],
          description: response?.orders.description[i],
          price: response?.orders.price[i],
          product: response?.orders.products[i],
          securityDeposit: response?.orders.securitydeposit[i],
          type: response?.orders.type[i],
        }));
        console.log("orderArray", orderArray);

        setProducts(orderArray);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading) {
    return <ContentLoader />;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col">
     
      <div className="flex md:gap-10 w-full flex-col md:flex-row md:mt-5 mt-2">
        <div className="flex w-full md:w-[60%]">
          <div className="flex flex-col border border-gray-300 p-4 rounded-lg w-full">
            {/* Product Card */}
            {products?.map((val, ind) => (
              <div
                className="last:border-b-0 border-b border-gray-300 p-4 w-full "
                key={ind}
              >
                <div className="flex gap-4">
                  <img
                    src={getImageUrl(val?.image)}
                    alt={val.description}
                    className="w-20 h-20 object-contain"
                  />
                  <div>
                    <p className="font-semibold">{val.type}</p>
                    <p>{val.description}</p>
                    <p>Price: {formatIndianPrice(val.price)}</p>
                    <p>Count: {val.count}</p>
                    {/* <p>
                      Security Deposit: {formatIndianPrice(val.securitydeposit)}
                    </p> */}
                    <p>Return Cylinder : {val.return_cylinder}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-[40%] mt-4 md:mt-0">
          {/* Order Info */}
          <div className="text-sm text-gray-800 flex flex-col w-full">
            <div className="w-full flex flex-col ">
              <KeyValueItem
                variant="between"
                label={"Order"}
                value={orderData?.orderid}
              />
              <KeyValueItem
                variant="between"
                label={"Order Date :"}
                value={orderData?.datetime}
              />
              <KeyValueItem
                variant="between"
                label={"Payment Mode :"}
                value={orderData?.paymentmode}
              />
                <KeyValueItem
                variant="between"
                label={"Total Quantity :"}
                value={orderData?.count}
              />
              <KeyValueItem
                variant="between"
                label={"Texable Amount :"}
                value={`₹  ${orderData?.taxable_amount} ` }
              />
               <KeyValueItem
                variant="between"
                label={"GST Amount :"}
                value={`₹  ${orderData?.gst_amount} ` }
              />
              <KeyValueItem
                variant="between"
                label={"Security Deposit :"}
                value={`₹  ${orderData?.security_deposit} ` }
              />
              <KeyValueItem
                variant="between"
                label={"Texable Amount :"}
                value={`₹  ${orderData?.totalamount} ` }
              />
            </div>
          </div>
          {/* Shipping Tracking */}
          <div className="mt-8">
            <h2 className="text-lg font-medium">Shipping Tracking</h2>
                        <p className="mt-1">Delivery Estimate: {orderData?.deliveryestimate}</p>
            <p className="mt-1">Tracking: {orderData?.orderstatustext}</p>
          </div>

          {/* Shipping Address */}
          <div className="mt-6">
            <h2 className="text-lg font-medium">Shipping Address</h2>
            {/* <KeyValueItem label={"Name"} value={orderData?.name} />
            <KeyValueItem label={"Email"} value={orderData?.email} />
            <p>{orderData?.email}</p> */}
            {/* <p>{orderData?.mobile}</p> */}
            <p className="text-sm">{orderData?.fulladdress}</p>
            <p className="text-sm">{orderData?.city}</p>
            <p className="text-sm">
              {orderData?.state} - {orderData?.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
