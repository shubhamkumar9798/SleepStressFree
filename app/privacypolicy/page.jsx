import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> [Insert Date]</p>
      <p><strong>Last Updated:</strong> [Insert Date]</p>

      <p>
        At <strong>Sleep Stressify</strong>, your privacy is important to us. This Privacy Policy outlines
        how we collect, use, and safeguard your information when you use our application.
      </p>

      <h2 style={styles.subHeading}>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Personal Information:</strong> When you sign in via Google, we collect your name, email
          address, and profile picture.
        </li>
        <li>
          <strong>Google Fit Data:</strong> With your consent, we access your Google Fit data such as step
          count and other fitness-related metrics.
        </li>
        <li>
          <strong>Session Data:</strong> We may collect information about your device, browser, and
          interaction with our application.
        </li>
      </ul>

      <h2 style={styles.subHeading}>2. How We Use Your Information</h2>
      <p>We use the collected data for the following purposes:</p>
      <ul>
        <li>To provide personalized insights into your stress patterns.</li>
        <li>To improve the accuracy and functionality of our stress prediction model.</li>
        <li>To enhance user experience and improve our services.</li>
      </ul>

      <h2 style={styles.subHeading}>3. Data Sharing</h2>
      <p>We do <strong>not</strong> sell, trade, or rent your personal information to third parties. Data may be shared only in the following cases:</p>
      <ul>
        <li><strong>With Your Consent:</strong> If you authorize sharing with specific third-party services.</li>
        <li><strong>For Legal Obligations:</strong> If required by law or to comply with legal proceedings.</li>
        <li><strong>For Service Providers:</strong> Trusted third-party services that help us operate our application (e.g., hosting services).</li>
      </ul>

      <h2 style={styles.subHeading}>4. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data. However, no method of
        transmission over the internet is 100% secure. We encourage you to use strong passwords and protect
        your account.
      </p>

      <h2 style={styles.subHeading}>5. Third-Party Services</h2>
      <p>
        Our application integrates Google Fit and Google authentication services. Your use of these services
        is subject to their respective privacy policies:
      </p>
      <p>
        ➡️ <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>
      </p>

      <h2 style={styles.subHeading}>6. Your Choices</h2>
      <ul>
        <li>Access, update, or delete your personal information.</li>
        <li>Revoke access to your Google Fit data through your Google account settings.</li>
        <li>Sign out at any time to stop data collection.</li>
      </ul>

      <h2 style={styles.subHeading}>7. Changes to This Privacy Policy</h2>
      <p>
        We may update this policy from time to time. Any significant changes will be communicated to users via email
        or in-app notifications.
      </p>

      <h2 style={styles.subHeading}>8. Contact Us</h2>
      <p>
        If you have questions or concerns regarding this Privacy Policy, please contact us at:<br />
        📧 <strong>[Insert Contact Email]</strong>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#2a2a2a',
  },
  subHeading: {
    marginTop: '1.5rem',
    color: '#0070f3',
  }
};

export default PrivacyPolicy;
