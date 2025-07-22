import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen sm:w-full bg-gray-50 py-6 px-4 sm:px-6 lg:px-20">
      <div className="border border-gray-300 rounded-xl  p-5 sm:p-8 lg:p-10 max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
          Privacy Policy for Gaswale.com and Gaswale App
        </h1>
        <p className="text-red-600 font-medium text-center mb-8">
          Effective Date: 26th March 2025
        </p>

        <div className="space-y-8 text-gray-800 text-sm sm:text-base leading-relaxed">
          {/* 1. General */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">1. General</h2>
            <p>
              Meta Gas Innovations Pvt Ltd (“Company,” “we,” “us,” or “our”) values your privacy and is committed to protecting your personal and business information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit Gaswale.com (the “Website” or “Platform”) and use our services to trade LPG and other industrial gases along with allied services.
            </p>
            <p className="mt-2">
              By using Gaswale.com, you consent to the practices described in this policy.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">2. Information We Collect</h2>

            <div className="pl-4">
              <h3 className="font-semibold mb-1">2.1 Personal & Business Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, email address, phone number, and business details.</li>
                <li>Address, GSTIN, and licensing details (for businesses trading LPG and industrial gases).</li>
                <li>Payment and transaction details for purchases made on the platform.</li>
              </ul>
            </div>

            <div className="pl-4 mt-4">
              <h3 className="font-semibold mb-1">2.2 Usage Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Log details such as IP address, device type, browser type, pages visited, and timestamps.</li>
                <li>Platform interactions such as order history, messages, and support queries.</li>
              </ul>
            </div>

            <div className="pl-4 mt-4">
              <h3 className="font-semibold mb-1">2.3 Cookies & Tracking Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to enhance user experience, analyze trends, and improve our services.
                Users can manage cookie preferences through browser settings.
              </p>
            </div>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Facilitate transactions between buyers and sellers.</li>
              <li>Process payments and provide order fulfillment support.</li>
              <li>Enhance platform security and detect fraud.</li>
              <li>Send notifications about service updates, offers, and regulatory changes.</li>
              <li>Comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          {/* 4. Information Sharing & Disclosure */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">4. Information Sharing & Disclosure</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>With service providers:</strong> Partners like logistics and payment processors.</li>
              <li><strong>Legal requirements:</strong> If required by law.</li>
              <li><strong>Business Transfers:</strong> In case of mergers or acquisitions.</li>
            </ul>
          </section>

          {/* 5. Data Security & Retention */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">5. Data Security & Retention</h2>
            <p>
              We implement strong security practices. Your data is encrypted and stored securely.
              We retain it as long as needed to fulfill services and legal obligations.
            </p>
          </section>

          {/* 6. Location Data Collection and Usage */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">6. Location Data Collection and Usage</h2>
            <p>
              We collect location data to improve deliveries and services.
            </p>

            <h3 className="font-semibold mt-3 mb-1">Types of Location Data:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Precise:</strong> GPS-based data for accurate delivery.</li>
              <li><strong>Approximate:</strong> Derived from IP/Wi-Fi networks.</li>
              <li><strong>History:</strong> Used for past order tracking.</li>
            </ul>

            <h3 className="font-semibold mt-3 mb-1">Use of Location Data:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Timely delivery and vendor assignment.</li>
              <li>Send location-based offers and updates.</li>
            </ul>

            <h3 className="font-semibold mt-3 mb-1">Sharing:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>With delivery partners and vendors.</li>
              <li>For legal compliance if needed.</li>
            </ul>
          </section>

          {/* 7. User Rights & Choices */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">7. User Rights & Choices</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Access & Update:</strong> From account settings.</li>
              <li>
                <strong>Delete:</strong> Email{" "}
                <a href="mailto:support@gaswale.com" className="text-blue-600 underline">support@gaswale.com</a>
              </li>
              <li><strong>Marketing Preferences:</strong> Opt-out anytime via email link.</li>
            </ul>
          </section>

          {/* 8. Third-Party Links */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">8. Third-Party Links</h2>
            <p>
              We may link to third-party websites. Their policies apply, and we’re not responsible for their practices.
            </p>
          </section>

          {/* 9. Changes to This Policy */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">9. Changes to This Policy</h2>
            <p>
              We may revise this policy periodically. Continued use after updates implies your acceptance.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold mb-2">10. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, contact us at:
              <br />
              <a href="mailto:support@gaswale.com" className="text-blue-600 underline">support@gaswale.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
