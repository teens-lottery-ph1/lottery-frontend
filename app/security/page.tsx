export default function SecurityPage() {
  return (
    <div className="w-full flex justify-center text-white">
      <div className="w-full max-w-4xl py-10 md:py-14">
        
        {/* Header */}
        <header className="mb-10 border-b border-[hsl(var(--border))] pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold">
            Security Policy
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Last Updated: {new Date().getFullYear()}
          </p>
        </header>

        {/* Document Content (All White Text) */}
        <div className="space-y-8 leading-7 text-[18px] text-white">
          
          <section>
            <p>
              Lottery Network is committed to ensuring the highest level of
              security for user data, transactions, and platform operations. We
              implement industry-standard security practices to maintain a safe
              and reliable lottery ecosystem for all users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Data Protection & Encryption
            </h2>
            <p>
              All user data, including account information and transaction
              details, is protected using secure encryption protocols and HTTPS
              communication. Sensitive information is stored securely to prevent
              unauthorized access, data leaks, or misuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Account & Authentication Security
            </h2>
            <p>
              We use secure authentication mechanisms such as OTP verification
              and email authentication to protect user accounts. Multi-factor
              authentication may be implemented to enhance account security and
              prevent unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. Payment & Wallet Security
            </h2>
            <p>
              All payments and wallet transactions are processed through secure
              and trusted payment gateways. We follow standard security
              practices to ensure safe handling of financial transactions
              including UPI, cards, and digital wallets.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Platform & Infrastructure Security
            </h2>
            <p>
              Our platform is hosted on secure cloud infrastructure protected by
              firewalls, access controls, and continuous monitoring systems.
              Regular updates and security audits are conducted to maintain
              system integrity and reliability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Fraud Detection & Monitoring
            </h2>
            <p>
              We actively monitor user activities and transactions to detect
              suspicious behavior, fraud, or unauthorized access attempts.
              Automated and manual reviews help ensure a fair and secure gaming
              environment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Compliance & Legal Standards
            </h2>
            <p>
              Lottery Network follows applicable data protection and security
              regulations. KYC verification and identity checks may be required
              based on regional legal and compliance requirements.
            </p>
          </section>

          <section className="pt-6 border-t border-[hsl(var(--border))]">
            <h2 className="text-xl font-semibold mb-3">
              7. Reporting Security Issues
            </h2>
            <p>
              If you discover any security vulnerabilities or suspicious
              activity on the platform, please contact our support team
              immediately. We take security concerns seriously and work to
              resolve them promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}