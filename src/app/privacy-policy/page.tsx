export const metadata = {
  title: "Privacy Policy - Wash Monkey",
  description: "Official Privacy Policy of Wash Monkey",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 leading-7">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p>
        Wash Monkey™ respects your privacy and is committed to protecting your
        personal data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Information We Collect
      </h2>
      <ul className="list-disc ml-6">
        <li>Name</li>
        <li>Phone number</li>
        <li>Email address</li>
        <li>Vehicle details</li>
        <li>Service address</li>
        <li>Payment details</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        How We Use Information
      </h2>
      <ul className="list-disc ml-6">
        <li>Process bookings</li>
        <li>Schedule services</li>
        <li>Improve service quality</li>
        <li>Customer support</li>
        <li>Send updates</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Protection</h2>
      <p>We use reasonable security measures to protect data.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Sharing</h2>
      <ul className="list-disc ml-6">
        <li>Payment processors</li>
        <li>Service staff</li>
        <li>Legal authorities if required</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Customer Rights</h2>
      <ul className="list-disc ml-6">
        <li>Access data</li>
        <li>Correct data</li>
        <li>Delete account</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Policy Updates
      </h2>
      <p>Updates will be available on our app or website.</p>
    </div>
  );
}