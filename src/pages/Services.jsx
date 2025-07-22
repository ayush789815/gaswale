import React, { useState } from "react";
import CustomDropdown from "../components/CustomDropdown";
import CustomRadioButton from "../components/CustomRadioButton";

function Services() {
  const [serviceType, setServiceType] = useState("LPG");
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    location: "",
    productNature: "",
    fuelUsed: "",
    equipment: "",
    consumption: "",
    contactPerson: "",
    contactNo: "",
    designation: "",
    floors: "",
    kitchens: "",
    gasAvailability: "",
    bankSize: "",
    selectedMechanicService: "",
  });

  const services = {
    LPG: [
      "Industrial Fuel Conversion Projects on Turnkey Basis (HSD-LPG, FO/LDO-LPG)",
      "LPG pipeline works for Multi-storeyed Apartments / Gated Community projects (Reticulated Systems).",
      "Annual Maintenance Contracts of LPG Installations",
      "LPG Mechanic services",
    ],
    "Nitrogen/Oxygen/Others": [
      "N2/O2 pipeline works for Industries.",
      "Annual Maintenance Contracts of N2/O2 Installations",
      "Mechanic services",
    ],
  };

  const productNatureOptions = [
    "Food Processing",
    "Ceramics",
    "Pharma",
    "Aluminium",
    "Others",
  ].map((val) => ({ label: val, value: val }));

  const fuelOptions = ["FO", "LDO", "HSD", "BRICKETS", "COAL", "HUSK"].map((val) => ({
    label: val,
    value: val,
  }));

  const equipmentOptions = ["Furnace", "Oven", "Boiler", "Dryer", "Heater"].map((val) => ({
    label: val,
    value: val,
  }));

  const gasAvailabilityOptions = [
    "Less than 1 KM",
    "1-5 KM",
    "5-10 KM",
    "More than 10 KM",
  ].map((val) => ({ label: val, value: val }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", { serviceType, selectedService, ...formData });
    alert("Form submitted!");
  };

  return (
    <div className="w-full min-h-screen text-[#4B433E] bg-white py-10">
      <div className="w-[80%] mx-auto border border-slate-200 px-10 py-6 rounded-md shadow-sm">
        <h1 className="text-xl font-semibold mb-6">Services</h1>

        {/* Type of Service */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Type of Service <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6">
            {Object.keys(services).map((type) => (
              <CustomRadioButton
                key={type}
                label={type}
                name="serviceType"
                checked={serviceType === type}
                onChange={() => {
                  setServiceType(type);
                  setSelectedService("");
                  setFormData({
                    company: "",
                    location: "",
                    productNature: "",
                    fuelUsed: "",
                    equipment: "",
                    consumption: "",
                    contactPerson: "",
                    contactNo: "",
                    designation: "",
                    floors: "",
                    kitchens: "",
                    gasAvailability: "",
                    bankSize: "",
                    selectedMechanicService: "",
                  });
                }}
              />
            ))}
          </div>
        </div>

        {/* Select Service */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Select Service <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {services[serviceType]?.map((service, index) => (
              <CustomRadioButton
                key={index}
                label={`${index + 1}. ${service}`}
                name="selectedService"
                checked={selectedService === service}
                onChange={() => setSelectedService(service)}
              />
            ))}
          </div>
        </div>

        {/* Conditional Form */}
        {selectedService && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedService.includes("Gated Community") ? (
              <>
                <div>
                  <label className="block font-medium mb-1">
                    Name of the Apartment/Community <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded border-[#169e49]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 border-[#169e49] rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    No of Floors <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="floors"
                    type="number"
                    onChange={handleInputChange}
                    className="w-full border border-[#169e49] px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    No of Kitchens <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="kitchens"
                    type="number"
                    onChange={handleInputChange}
                    className="w-full border border-[#169e49] px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Near by Natural Gas availability <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    name="gasAvailability"
                    value={formData.gasAvailability}
                    options={gasAvailabilityOptions}
                    onChange={(val) => setFormData((prev) => ({ ...prev, gasAvailability: val.value }))}
                    placeholder="Select Distance"
                  />
                </div>
              </>
            ) : selectedService.includes("Mechanic") ? (
              <>
                <div>
                  <label className="block font-medium mb-1">
                    Name of the Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border border-[#169e49] px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Location <span className="text-red-500">*</span></label>
                  <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
                </div>

                <div>
                  <label className="block font-medium mb-1">Nature of Products <span className="text-red-500">*</span></label>
                  <CustomDropdown name="productNature" value={formData.productNature} options={productNatureOptions} onChange={(val) => setFormData((prev) => ({ ...prev, productNature: val.value }))} placeholder="Select Product" />
                </div>

                <div>
                  <label className="block font-medium mb-1">Type of Eqt <span className="text-red-500">*</span></label>
                  <CustomDropdown name="equipment" value={formData.equipment} options={equipmentOptions} onChange={(val) => setFormData((prev) => ({ ...prev, equipment: val.value }))} placeholder="Select Eqt" />
                </div>

                <div>
                  <label className="block font-medium mb-1">LPG Bank Size in tons <span className="text-red-500">*</span></label>
                  <input name="bankSize" value={formData.bankSize} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
                </div>

                <div>
                  <label className="block font-medium mb-1">Specify Service Required <span className="text-red-500">*</span></label>
                  <CustomDropdown name="selectedMechanicService" value={formData.selectedMechanicService} options={services["LPG"].map(s => ({ label: s, value: s }))} onChange={(val) => setFormData((prev) => ({ ...prev, selectedMechanicService: val.value }))} placeholder="Select Service" />
                </div>
              </>
            ) : selectedService.includes("Maintenance") ? (
              <>
                <div>
                  <label className="block font-medium mb-1">Name of the Company <span className="text-red-500">*</span></label>
                  <input name="company" value={formData.company} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
                </div>

                <div>
                  <label className="block font-medium mb-1">Location <span className="text-red-500">*</span></label>
                  <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
                </div>

                <div>
                  <label className="block font-medium mb-1">Nature of Products <span className="text-red-500">*</span></label>
                  <CustomDropdown name="productNature" value={formData.productNature} options={productNatureOptions} onChange={(val) => setFormData((prev) => ({ ...prev, productNature: val.value }))} placeholder="Select Product" />
                </div>

                <div>
                  <label className="block font-medium mb-1">Type of Eqt <span className="text-red-500">*</span></label>
                  <CustomDropdown name="equipment" value={formData.equipment} options={equipmentOptions} onChange={(val) => setFormData((prev) => ({ ...prev, equipment: val.value }))} placeholder="Select Eqt" />
                </div>

                <div>
                  <label className="block font-medium mb-1">Avg Monthly Consumption of LPG <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input name="consumption" value={formData.consumption} onChange={handleInputChange} className="w-full border px-3 py-2 rounded-l" required />
                    <span className="bg-gray-200 px-4 py-2 rounded-r border border-l-0">Kg</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">LPG Bank Size in tons <span className="text-red-500">*</span></label>
                  <input name="bankSize" value={formData.bankSize} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-medium mb-1">Name of the Company <span className="text-red-500">*</span></label>
                  <input name="company" value={formData.company} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
                </div>

                <div>
                  <label className="block font-medium mb-1">Location <span className="text-red-500">*</span></label>
                  <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
                </div>

                <div>
                  <label className="block font-medium mb-1">Nature of Products <span className="text-red-500">*</span></label>
                  <CustomDropdown name="productNature" value={formData.productNature} options={productNatureOptions} onChange={(val) => setFormData((prev) => ({ ...prev, productNature: val.value }))} placeholder="Select Product" />
                </div>

                <div>
                  <label className="block font-medium mb-1">Current Fuel Used <span className="text-red-500">*</span></label>
                  <CustomDropdown name="fuelUsed" value={formData.fuelUsed} options={fuelOptions} onChange={(val) => setFormData((prev) => ({ ...prev, fuelUsed: val.value }))} placeholder="Select Fuel" />
                </div>

                <div>
                  <label className="block font-medium mb-1">Type of Equipment <span className="text-red-500">*</span></label>
                  <CustomDropdown name="equipment" value={formData.equipment} options={equipmentOptions} onChange={(val) => setFormData((prev) => ({ ...prev, equipment: val.value }))} placeholder="Select Equipment" />
                </div>

                <div>
                  <label className="block font-medium mb-1">Avg Monthly Consumption of Current fuel <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input name="consumption" value={formData.consumption} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded-l" required />
                    <span className="bg-gray-200 px-4 py-2 rounded-r border border-l-0">Kg</span>
                  </div>
                </div>
              </>
            )}

            {/* Common Fields */}
            <div>
              <label className="block font-medium mb-1">Concerned Person Name <span className="text-red-500">*</span></label>
              <input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
            </div>

            <div>
              <label className="block font-medium mb-1">Contact No <span className="text-red-500">*</span></label>
              <input name="contactNo" value={formData.contactNo} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
            </div>

            <div>
              <label className="block font-medium mb-1">Designation <span className="text-red-500">*</span></label>
              <input name="designation" value={formData.designation} onChange={handleInputChange} className="w-full border border-[#169e49] px-3 py-2 rounded" required />
            </div>

            <div className="md:col-span-2 mt-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Services;
