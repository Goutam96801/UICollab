import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  let navigate = useNavigate();
  return (
    <div className="bg-[#111] shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="flex gap-1 px-2 py-1 bg-[#212121] rounded-md text-lg font-semibold"
        >
          <ArrowLeft /> Go back
        </button>
        <h2 className="text-2xl font-bold leading-7 text-[#e8e8e8] sm:text-3xl sm:truncate">
          Privacy Policy
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-300">
          Last updated: 24 Jan, 2025
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">
              1. Information Collection
            </dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              We collect minimal personal information necessary to provide our
              services.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">
              2. Data Storage and Sharing
            </dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              Your data is securely stored and not shared with third parties
              without your consent.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">
              3. Use of Cookies
            </dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              We use cookies to enhance your browsing experience and analyze
              site traffic.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">
              4. User Rights
            </dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              You have the right to access, modify, or delete your personal
              information at any time.
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">
              5. Policy Updates
            </dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              We may update this policy periodically, and will notify users of
              any significant changes.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
