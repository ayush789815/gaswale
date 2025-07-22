import React from "react";
import {
  useGetOrdersListQuery,
  useGetPaymentListQuery,
} from "../../store/services";
import CustomDropdown from "../../components/CustomDropdown";
import CustomRadioButton from "../../components/CustomRadioButton";
import { CustomInput } from "../../components/CustomInput";
import CustomDatePicker from "../../components/CustomDatePicker";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const AddPayemt = ({ setClose, onSuccess }) => {
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { isLoading, isError, refetch } = useGetPaymentListQuery(
    {
      userid: userData.userid, //userData?.userid,
      page: "1",
      limit: "10",
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data } = useGetOrdersListQuery({
    userid: userData?.userid,
    page: 1,
    limit: 100,
  });
console.log(data, "data from orders list");
  const orderList =
    data?.orders?.map((item) => ({
      label: item?.orderid,
      value: item?.orderid,
      orders: item,
    })) || [];

  const initialValues = {
    orderids: [],
    tds: "1",
    voucher_date: null,
    rate_of_tds: "",
    tds_amount: "",
    tds_type: "",
    under_section: "",
    payment_mode: "",
    transaction_number: "",
    mode_of_transaction: "",
    narration: "",
  };

  const validationSchema = Yup.object().shape({
    orderids: Yup.array()
      .min(1, "At least one order must be selected")
      .required("Order selection is required"),
    voucher_date: Yup.date().required("Voucher date is required"),
    tds: Yup.string().required("TDS selection is required"),
    rate_of_tds: Yup.string().when("tds", {
      is: "1",
      then: (schema) => schema.required("Rate of TDS is required"),
    }),

    under_section: Yup.string().when("tds", {
      is: "1",
      then: (schema) => schema.required("Under Section is required"),
    }),
    payment_mode: Yup.string().required("Payment mode is required"),
    transaction_number: Yup.string().required("Transaction number is required"),
    mode_of_transaction: Yup.string().required(
      "Mode of transaction is required"
    ),
    narration: Yup.string().required("Narration is required"),
  });

  const handleSubmit = async (values) => {
    values.tds_amount = tdsCalculationAmount(values);
  
    const formData = new FormData();
    formData.append("action", "create"); 
    formData.append("userid", userData?.userid); 
    formData.append("voucher_date", values.voucher_date);
    formData.append("amount", calculationAmount(values.orderids));
    formData.append("payment_mode", values.payment_mode);
    formData.append("transaction_number", values.transaction_number);
    formData.append("mode_of_transaction", values.mode_of_transaction);
    formData.append("narration", values.narration);
  
    // Append order IDs
    values.orderids.forEach((option) =>
      formData.append("orderid[]", option.value)
    );
  
    // If TDS is applicable, append TDS-related fields
    if (values.tds === "1") {
      formData.append("rate_of_tds", values.rate_of_tds);
      formData.append("tds_amount", values.tds_amount);
      formData.append("tds_type", "1"); // hardcoded as per payload
      formData.append("under_section", values.under_section);
    }
  
    formData.append("tds", values.tds);
  
    try {
      const res = await axios.post(
        "https://gaswale.vensframe.com/api/customer/payment.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const response = await res.data;
      if (response?.success) {
        toast.success(response.message);
        refetch();
        // Call the onSuccess callback to refresh the parent component
        if (onSuccess) {
          onSuccess();
        } else {
          setClose(false);
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting payment details.");
    }
  };
  

  const calculationAmount = (orderids) =>
    orderids.reduce((sum, item) => sum + item?.orders?.totalamount, 0) || "000";

  const tdsCalculationAmount = (values) => {
    const total = values.orderids.reduce(
      (sum, item) => sum + item?.orders?.totalamount,
      0
    );
    return ((values.rate_of_tds * total) / 100).toFixed(2);
  };

  const tdsOptions = [
    { label: "0.1%", value: "0.1" },
    { label: "1%", value: "1" },
    { label: "2%", value: "2" },
    { label: "5%", value: "5" },
    { label: "10%", value: "10" },
    { label: "20%", value: "20" },
    { label: "30%", value: "30" },
    { label: "40%", value: "40" },
    { label: "50%", value: "50" },
  ];

  const sectionOptions = [
    { label: "us 206 c1 (H1)", value: "1" },
    { label: "194Q Section", value: "2" },
  ];

  const transactionOptions = [
    { label: "Phonepay", value: "1" },
    { label: "GPay", value: "2" },
    { label: "Paytm", value: "3" },
    { label: "Cred", value: "4" },
    { label: "RTGS", value: "6" },
    { label: "NEFT", value: "7" },
    { label: "IMPS", value: "8" },
    { label: "Others", value: "5" },
  ];

  const paymentOptions = [
    { label: "Cash", value: "1" },
    { label: "Cheque", value: "2" },
    { label: "Online", value: "3" },
  ];

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, errors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <CustomDropdown
                isMulti
                required
                label="Select Invoices"
                options={orderList}
                value={values.orderids}
                onChange={(selected) => setFieldValue("orderids", selected)}
                error={touched.orderids && errors.orderids}
              />
              {/* <CustomDatePicker
                required
                label="Voucher Date"
                name="voucher_date"
                selected={values.voucher_date}
                onChange={(val) => setFieldValue("voucher_date", val)}
                error={touched.voucher_date && errors.voucher_date}
              /> */}
              <CustomDatePicker
                required
                label="Voucher Date"
                name={"voucher_date"}
                selected={values.voucher_date}
                // onChange={(val) => setFieldValue("voucher_date", val)}
                onChange={handleChange}
                placeholder="Select date and time"
                error={touched.voucher_date && errors.voucher_date}
              />
            </div>

            <p className="mt-4">TDS</p>
            <div className="flex gap-4 items-center mb-4 mt-2">
              <CustomRadioButton
                label="Yes"
                checked={values.tds === "1"}
                onChange={() => setFieldValue("tds", "1")}
              />
              <CustomRadioButton
                label="No"
                checked={values.tds === "0"}
                onChange={() => setFieldValue("tds", "0")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              {values.tds === "1" && (
                <>
                  <CustomDropdown
                    required
                    label="Rate of TDS"
                    name="rate_of_tds"
                    options={tdsOptions}
                    value={values.rate_of_tds}
                    onChange={(option) =>
                      setFieldValue("rate_of_tds", option.value)
                    }
                    error={touched.rate_of_tds && errors.rate_of_tds}
                  />
                  <CustomInput
                    required
                    readOnly
                    label="TDS Amount"
                    value={tdsCalculationAmount(values)}
                  />
                  <CustomDropdown
                    required
                    label="Under Section"
                    name="under_section"
                    options={sectionOptions}
                    value={values.under_section}
                    onChange={(option) =>
                      setFieldValue("under_section", option.value)
                    }
                    error={touched.under_section && errors.under_section}
                  />
                </>
              )}

              <CustomDropdown
                required
                label="Payment Mode"
                name="payment_mode"
                options={paymentOptions}
                value={values.payment_mode}
                onChange={(option) =>
                  setFieldValue("payment_mode", option.value)
                }
                error={touched.payment_mode && errors.payment_mode}
              />
              <CustomInput
                required
                label="Transaction Number"
                placeholder="Enter Transaction Number"
                name="transaction_number"
                value={values.transaction_number}
                onChange={handleChange}
                error={touched.transaction_number && errors.transaction_number}
              />
              <CustomDropdown
                required
                label="Mode of Transaction"
                name="mode_of_transaction"
                options={transactionOptions}
                value={values.mode_of_transaction}
                onChange={(option) =>
                  setFieldValue("mode_of_transaction", option.value)
                }
                error={
                  touched.mode_of_transaction && errors.mode_of_transaction
                }
              />
              <CustomInput
                required
                label="Narration"
                placeholder="Enter Narration"
                name="narration"
                value={values.narration}
                onChange={handleChange}
                error={touched.narration && errors.narration}
              />
              <CustomInput
                required
                readOnly
                label="Amount"
                value={calculationAmount(values.orderids)}
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-[#169e49] hover:bg-[#12833d] text-white px-5 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPayemt;