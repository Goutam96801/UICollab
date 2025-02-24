import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
  let navigate = useNavigate();
  return (
    <div className="bg-[#111] shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <button onClick={() => {
          navigate(-1);
        }} className="flex gap-1 px-2 py-1 bg-[#212121] rounded-md text-lg font-semibold"><ArrowLeft/> Go back</button>
        <h2 className="text-2xl font-bold leading-7 text-[#fff] sm:text-3xl sm:truncate">Terms and Conditions</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-300">Last updated: 24 Jan 2025</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">1. Acceptance of Terms</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                By accessing and using uicollab, you acknowledge that you have read, understood, and agree to be bound
                by these Terms and Conditions. If you do not agree to these terms, you must not use our website or
                services.
              </p>
              <p className="mt-2">
                We reserve the right to modify these terms at any time without prior notice. Your continued use of
                uicollab after any such changes constitutes your acceptance of the new Terms and Conditions.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">2. Use of UI Elements</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                All UI elements provided on uicollab are open-source and free to use, modify, and distribute under the
                MIT License, unless otherwise specified. You may use these elements in both personal and commercial
                projects.
              </p>
              <p className="mt-2">
                However, you may not claim the UI elements as your own original work. When using our UI elements, we
                encourage you to provide attribution to uicollab, although it is not required.
              </p>
              <p className="mt-2">
                You are responsible for any modifications you make to the UI elements and how you implement them in your
                projects. uicollab is not liable for any issues arising from your use or modification of the elements.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">3. Intellectual Property</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                The uicollab name, logo, and any other trademarks, service marks, graphics, and logos used in connection
                with uicollab are trademarks or registered trademarks of uicollab or its licensors. You may not use
                these marks without the prior written permission of uicollab.
              </p>
              <p className="mt-2">
                While the UI elements themselves are open-source, the content, organization, graphics, design,
                compilation, magnetic translation, digital conversion, and other matters related to the uicollab website
                are protected under applicable copyrights, trademarks, and other proprietary rights.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">4. User Accounts</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                Some features of uicollab may require you to create an account. You are responsible for maintaining the
                confidentiality of your account information, including your password, and for all activity that occurs
                under your account.
              </p>
              <p className="mt-2">
                You agree to notify us immediately of any unauthorized use of your account or any other breach of
                security. uicollab will not be liable for any loss that you may incur as a result of someone else using
                your password or account, either with or without your knowledge.
              </p>
              <p className="mt-2">
                You may not use anyone else's account at any time without the express permission of the account holder.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">5. User-Generated Content</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                Users may have the ability to post, upload, publish, submit, or transmit content ("User Content"). By
                making available any User Content on or through uicollab, you grant to uicollab a worldwide,
                irrevocable, perpetual, non-exclusive, transferable, royalty-free license to use, copy, modify, create
                derivative works based upon, distribute, publicly display, publicly perform, and distribute your User
                Content in connection with operating and providing the Services.
              </p>
              <p className="mt-2">
                You are solely responsible for your User Content and the consequences of posting or publishing it. You
                represent and warrant that you own or have the necessary rights to post the User Content and that it
                does not violate any third party's intellectual property rights.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">6. Prohibited Activities</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Copying, distributing, or disclosing any part of the uicollab website in any medium, including by any
                  automated or non-automated "scraping"
                </li>
                <li>
                  Using any automated system, including "robots," "spiders," "offline readers," etc., to access the
                  uicollab website
                </li>
                <li>Transmitting spam, chain letters, or other unsolicited email</li>
                <li>
                  Attempting to interfere with, compromise the system integrity or security, or decipher any
                  transmissions to or from the servers running uicollab
                </li>
                <li>
                  Taking any action that imposes, or may impose at our sole discretion an unreasonable or
                  disproportionately large load on our infrastructure
                </li>
                <li>Uploading invalid data, viruses, worms, or other software agents through uicollab</li>
                <li>
                  Impersonating another person or otherwise misrepresenting your affiliation with a person or entity
                </li>
                <li>Violating any applicable law or regulation</li>
              </ul>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">7. Modifications to Service</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                We reserve the right to modify or discontinue, temporarily or permanently, the uicollab website or any
                service to which it connects, with or without notice and without liability to you.
              </p>
              <p className="mt-2">
                We may from time to time provide enhancements or improvements to the features/functionality of the
                website, which may include patches, bug fixes, updates, upgrades and other modifications ("Updates").
              </p>
              <p className="mt-2">
                Updates may modify or delete certain features and/or functionalities of the website. You agree that we
                have no obligation to (i) provide any Updates, or (ii) continue to provide or enable any particular
                features and/or functionalities of the website to you.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">8. Third-Party Links</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                uicollab may contain links to third-party websites or services that are not owned or controlled by
                uicollab.
              </p>
              <p className="mt-2">
                uicollab has no control over, and assumes no responsibility for, the content, privacy policies, or
                practices of any third party websites or services. You further acknowledge and agree that uicollab shall
                not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be
                caused by or in connection with the use of or reliance on any such content, goods, or services available
                on or through any such websites or services.
              </p>
              <p className="mt-2">
                We strongly advise you to read the terms and conditions and privacy policies of any third-party websites
                or services that you visit.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">9. Disclaimer of Warranty</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                These services are provided by uicollab on an "AS IS" and "AS AVAILABLE" basis. uicollab makes no
                representations or warranties of any kind, express or implied, as to the operation of their services, or
                the information, content or materials included therein.
              </p>
              <p className="mt-2">
                You expressly agree that your use of these services, their content, and any services or items obtained
                from us is at your sole risk.
              </p>
              <p className="mt-2">
                To the full extent permissible by applicable law, uicollab disclaims all warranties, express or implied,
                including, but not limited to, implied warranties of merchantability and fitness for a particular
                purpose. uicollab does not warrant that the services, content, or electronic communications sent from or
                on behalf of uicollab are free of viruses or other harmful components.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">10. Limitation of Liability</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                To the fullest extent permitted by applicable law, in no event will uicollab, its affiliates, officers,
                directors, employees, agents, suppliers or licensors be liable to any person for any indirect,
                incidental, special, punitive, cover or consequential damages (including, without limitation, damages
                for lost profits, revenue, sales, goodwill, use of content, impact on business, business interruption,
                loss of anticipated savings, loss of business opportunity) however caused, under any theory of
                liability, including, without limitation, contract, tort, warranty, breach of statutory duty, negligence
                or otherwise, even if uicollab has been advised as to the possibility of such damages or could have
                foreseen such damages.
              </p>
              <p className="mt-2">
                To the maximum extent permitted by applicable law, the aggregate liability of uicollab and its
                affiliates, officers, employees, agents, suppliers and licensors, relating to the services will be
                limited to an amount greater of one dollar or any amounts actually paid in cash by you to uicollab for
                the prior one month period prior to the first event or occurrence giving rise to such liability.
              </p>
              <p className="mt-2">
                The limitations and exclusions also apply if this remedy does not fully compensate you for any losses or
                fails of its essential purpose.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">11. Indemnification</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                You agree to indemnify and hold uicollab and its affiliates, directors, officers, employees, and agents
                harmless from and against any liabilities, losses, damages or costs, including reasonable attorneys'
                fees, incurred in connection with or arising from any third-party allegations, claims, actions,
                disputes, or demands asserted against any of them as a result of or relating to your Content, your use
                of the Website or Services or any willful misconduct on your part.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">12. Governing Law</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without
                regard to its conflict of law provisions.
              </p>
              <p className="mt-2">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
                provisions of these Terms will remain in effect.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">13. Changes to Terms</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="mt-2">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound
                by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">14. Contact Us</dt>
            <dd className="mt-1 text-sm text-[#e8e8e8] sm:mt-0 sm:col-span-2">
              <p>If you have any questions about these Terms, please contact us at [Your Contact Information].</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

