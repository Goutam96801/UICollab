import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CookiePolicy() {
      let navigate = useNavigate();
    return (
      <div className="bg-[#111] shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
        <button onClick={() => {
          navigate(-1);
        }} className="flex gap-1 px-2 py-1 bg-[#212121] rounded-md text-lg font-semibold"><ArrowLeft/> Go back</button>
          
          <h2 className="text-2xl font-bold leading-7 text-[#e8e8e8] sm:text-3xl sm:truncate">Cookie Policy</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-300">Last updated: [Insert Date]</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">1. Types of Cookies</dt>
              <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
                We use both session and persistent cookies for various purposes.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">2. Purpose of Cookies</dt>
              <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
                Cookies help us understand how you interact with our website and improve our services.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">3. Managing Cookies</dt>
              <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
                You can manage cookie preferences through your browser settings.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">4. Disabling Cookies</dt>
              <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
                Disabling cookies may affect the functionality of certain features on our website.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">5. Third-party Cookies</dt>
              <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
                Third-party services we use may also set their own cookies.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }
  
  