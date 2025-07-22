import React, { useState } from "react";
import {
  useGetPurchaseOrderQuery,
  useGetQutationQuery,
} from "../../store/services";
import CustomDropdown from "../../components/CustomDropdown";
import CustomRadioButton from "../../components/CustomRadioButton";
import { CustomInput } from "../../components/CustomInput";
import CustomDatePicker from "../../components/CustomDatePicker";
import { CustomFileInput } from "../../components/CustomFileInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import CustomButton from "../../components/CustomButton";

const AddPO = ({ setClose }) => {
  const [quotation, setQuotation] = useState({});
  const [poDoc, setPoDoc] = useState(null);
  const [receive, setReceive] = useState("1");
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { refetch } = useGetPurchaseOrderQuery({
    userid: userData?.userid,
  });
  const { data } = useGetQutationQuery(
    {
      userid: userData?.userid,
      type: "active",
    },
    { refetchOnMountOrArgChange: true }
  );
console.log(data);
  const quotationlist =
    data?.data?.map((item) => ({
      label: item?.sr_no,
      value: item?.sr_no,
      products: item?.products,
      id: item?.id,
    })) || [];
 console.log(quotationlist);
  const handleProductChange = (index, key, value) => {
    if (key === "qty") {
      if (!/^[0-9]*$/.test(value)) return;
      if (Number(value) < 1 && value !== "") return;
    }
    const updated = { ...quotation };
    const updatedProducts = [...(updated.products || [])];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [key]: value,
    };
    updated.products = updatedProducts;
    setQuotation(updated);
  };

  const handleQtyBlur = (index) => {
    const updated = { ...quotation };
    const updatedProducts = [...(updated.products || [])];
    if (!updatedProducts[index].qty || Number(updatedProducts[index].qty) < 1) {
      updatedProducts[index].qty = "1";
      updated.products = updatedProducts;
      setQuotation(updated);
    }
  };

  const initialValues = {
    ponumber: "",
    podate: null,
  };

  const validationSchema = Yup.object().shape({
    ponumber: Yup.string().required("PO Number is required"),
    podate: Yup.date().required("PO Date is required"),
  });

  const handleSubmit = async (values) => {
    if (!quotation?.products?.length) return alert("Select a quotation");
    const formData = new FormData();
    formData.append("userid", userData?.userid);
    formData.append("ingress", "4");
    formData.append("id", quotation?.id);
    formData.append("ponumber", values.ponumber);
    formData.append("recursive", receive);
    formData.append("podate", values.podate);

    quotation?.products?.forEach((item) => {
      formData.append("productid[]", item.uuid);
      formData.append("qty[]", item.qty);
    });

    if (poDoc) {
      formData.append("document", poDoc);
    }

    try {
      const res = await axios.post(
        "https://gaswale.vensframe.com/api/generate-po",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const response = await res.data;
      if (response?.success) {
        toast.success(response.message);
        refetch();
        setClose(false);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating PO");
    }
  };

  return (
    <div>
      <CustomDropdown
        className="max-w-lg"
        label={"Select Quotation"}
        options={quotationlist}
        placeholder="Select quotation"
        value={quotation?.value}
        onChange={(val) => {
          setQuotation(val);
        }}
      />

      {quotation?.value && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => (
            <Form>
              <div className="mt-3">
                <p>
                  Do you want to receive Quotation whenever the price is
                  changed?
                </p>
                <div className="flex gap-4 items-center mb-3 mt-2">
                  <CustomRadioButton
                    label={"Yes"}
                    checked={receive == 1}
                    onChange={() => setReceive(1)}
                  />
                  <CustomRadioButton
                    label={"No"}
                    checked={receive == 0}
                    onChange={() => setReceive(0)}
                  />
                </div>
                <div className="mb-3 items-center w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    required
                    label="Purchase Order Number"
                    name="ponumber"
                    value={values.ponumber}
                    onChange={handleChange}
                    error={touched.ponumber && errors.ponumber}
                    placeholder={"Purchase Order Number"}
                  />

                  <CustomDatePicker
                    required
                    label="Purchase Order Date"
                    name={"podate"}
                    selected={values.podate}
                    // onChange={(val) => setFieldValue("podate", val)}
                    onChange={handleChange}
                    placeholder="Select date and time"
                    error={touched.podate && errors.podate}
                  />

                  <CustomFileInput
                    label="PO Document"
                    name="po_document"
                    onChange={(e) => setPoDoc(e.target.files?.[0])}
                    fileName={poDoc?.name}
                    accept="application/pdf,image/*"
                  />
                </div>

                <p>Products</p>
                {quotation?.products?.map((item, index) => (
                  <div
                    key={index}
                    className="mb-3 items-center w-full grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <CustomInput value={item.description} readOnly />
                    <CustomInput
                      leftIcon={"QTY :"}
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        handleProductChange(index, "qty", e.target.value)
                      }
                      onBlur={() => handleQtyBlur(index)}
                    />
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <CustomButton className="text-white" type="submit">Generate PO</CustomButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AddPO;

// import React, { useState } from "react";
// import { useGetQutationQuery } from "../../store/services";
// import CustomDropdown from "../../components/CustomDropdown";
// import CustomRadioButton from "../../components/CustomRadioButton";
// import { CustomInput } from "../../components/CustomInput";
// import CustomDatePicker from "../../components/CustomDatePicker";
// import DatePicker from "react-datepicker";
// import { CustomFileInput } from "../../components/CustomFileInput";

// const AddPO = () => {
//   const [quotation, setQuotation] = useState({});
//   const [date, setDate] = useState(new Date());
//   const [poDoc, setPoDoc] = useState(null);
//   const userData = JSON.parse(localStorage.getItem("customer"));
//   const { data, isLoading, isError, refetch } = useGetQutationQuery(
//     {
//       userid: userData?.userid,
//       type: "active",
//     },
//     { refetchOnMountOrArgChange: true }
//   );

//   const quotationlist =
//     data?.data?.map((item) => ({
//       label: item?.quid,
//       value: item?.quid,
//       products: item?.products,
//     })) || [];

//   const handleProductChange = (index, key, value) => {
//     if (key === "qty") {
//       // Allow only digits
//       if (!/^\d*$/.test(value)) return;
//       const numericValue = Number(value);
//       if (numericValue < 1 && value !== "") return;
//     }

//     const updatedQuotation = { ...quotation };
//     const updatedProducts = [...(updatedQuotation.products || [])];
//     updatedProducts[index] = {
//       ...updatedProducts[index],
//       [key]: value,
//     };
//     updatedQuotation.products = updatedProducts;
//     setQuotation(updatedQuotation);
//   };

//   const handleQtyBlur = (index) => {
//     const updatedQuotation = { ...quotation };
//     const updatedProducts = [...(updatedQuotation.products || [])];
//     const currentQty = updatedProducts[index]?.qty;

//     if (!currentQty || isNaN(currentQty) || Number(currentQty) < 1) {
//       updatedProducts[index].qty = "1";
//       updatedQuotation.products = updatedProducts;
//       setQuotation(updatedQuotation);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     setPoDoc(file);
//   };

//   return (
//     <div>
//       <CustomDropdown
//         label={"Select Quotation"}
//         options={quotationlist}
//         placeholder="Select quotation"
//         value={quotation?.value}
//         onChange={(val) => {
//           setQuotation(val);
//         }}
//       />
//       {quotation?.value && (
//         <div className="mt-3">
//           <p>Do you want to receive Quotation whenever the price is changed?</p>
//           <div className="flex gap-4 items-center mb-3 mt-2">
//             <CustomRadioButton label={"Yes"} />
//             <CustomRadioButton label={"No"} />
//           </div>
//           <div className="mb-3 items-center w-full grid grid-cols-1 md:grid-cols-2 gap-4">
//             <CustomInput
//               required
//               label={"Purchase Order Number"}
//               // value={item.qty}
//               // onChange={(e) => handleProductChange(index, "qty", e.target.value)}
//             />

//             <CustomDatePicker
//               required
//               label="Purchase Order Date"
//               selected={date}
//               onChange={(val) => setDate(val)}
//               placeholder="Select date and time"
//             />

//             <CustomFileInput
//               label="PO Document"
//               name="po_document"
//               onChange={handleFileChange}
//               fileName={poDoc?.name}
//               accept="application/pdf,image/*"
//             />
//           </div>
//           <p>Products</p>
//           {quotation?.products?.map((item, index) => (
//             <div
//               key={index}
//               className="mb-3 items-center w-full grid grid-cols-1 md:grid-cols-2 gap-4"
//             >
//               <CustomInput value={item.description} readOnly />
//               <div className="flex items-center gap-2  w-full">
//                 <CustomInput
//                   leftIcon={"QTY :"}
//                   min={1}
//                   value={item.qty}
//                   onChange={(e) =>
//                     handleProductChange(index, "qty", e.target.value)
//                   }
//                   onBlur={() => handleQtyBlur(index)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddPO;
