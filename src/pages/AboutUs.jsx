import React from "react";

function AboutUs() {
  const data = [
    // {
    //   title: "Empowering Gas & Fuel Trade in India",
    //   sections: [
    //     {
    //       heading: "",
    //       content:
    //         "Welcome to Gaswale.com, India’s pioneer marketplace for trading LPG, industrial gases, fuels, and allied services. We are revolutionizing the gas and fuel industry by connecting buyers, sellers, and service providers on a single digital platform.",
    //     },
    //   ],
    // },
    {
      title: "Who We Are",
      sections: [
        {
          heading: "",
          content:
            "Gaswale.com is a tech-driven marketplace developed by Meta Gas Innovations Pvt Ltd, designed to simplify and streamline the buying, selling, and distribution of gases and fuels across India. Whether you are a retail buyer, bulk buyer, distributor, industrial user, or fuel service provider, Gaswale.com offers a transparent, efficient, and secure platform for seamless transactions.",
        },
      ],
    },
    {
      title: "Our Vision",
      sections: [
        {
          heading: "",
          content:
            "To become India’s leading digital hub for gas and fuel trade by enabling efficient procurement, distribution, and logistics management with cutting-edge technology.",
        },
      ],
    },
    {
      title: "What We Offer",
      sections: [
        {
          heading: "LPG, Industrial Gases & Fuels Trading",
          content:
            "Seamless buying and selling of LPG, propane, butane, oxygen, nitrogen, CO2, hydrogen, and liquid fuels like HSD, furnace oil, LDO, and other petroleum products.",
        },
        {
          heading: "Equipment & Accessories",
          content:
            "Get pipeline projects, associated equipment, safety gear, and fuel storage solutions from trusted suppliers.",
        },
        {
          heading: "Marketplace for Services",
          content:
            "Connect with installation, maintenance, and logistics providers for both gas and fuel distribution.",
        },
        {
          heading: "Secure Transactions",
          content:
            "Ensuring reliability through verified sellers and payment security.",
        },
      ],
    },
    {
      title: "Why Choose Gaswale.com?",
      sections: [
        {
          heading: "🚀 End-to-End Gas & Fuel Trading",
          content: "From procurement to logistics, we cover it all.",
        },
        {
          heading: "💼 For All Business Sizes",
          content:
            "Whether you're a small buyer or a large industrial buyer, we have solutions for you.",
        },
        {
          heading: "🔒 Safety & Compliance",
          content:
            "Transactions aligned with government regulations for gas and fuel trade.",
        },
      ],
    },
  ];

  return (
    <div className="mt-6 max-w-4xl border border-gray-300 rounded-2xl mx-auto px-4 sm:px-6 py-12 text-slate-800">
      <h1 className="text-4xl mb-6">About Us</h1>
    <div className="  mb-6">
        <h1 className="text-[#555555]">Empowering Gas & Fuel Trade in India</h1>
        <p className="mt-6">Welcome to Gaswale.com, India’s pioneer marketplace for trading LPG, industrial gases, fuels, and allied services. We are revolutionizing the gas and fuel industry by connecting buyers, sellers, and service providers on a single digital platform.</p>
    </div>
      {data.map((section, index) => (
        <div key={index} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          {section.sections.map((item, idx) => (
            <div key={idx} className="mb-4">
              {item.heading && (
                <p className="font-semibold mb-1">{item.heading}</p>
              )}
              <p className="text-gray-700 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AboutUs;
