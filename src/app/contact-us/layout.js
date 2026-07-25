import settings from '../../../content/settings.json';

export const metadata = {
  title: `Contact Us & Support - ${settings.siteName || "IT Solutions Pro"}`,
  description: `Get in touch with the team at ${settings.siteName || "IT Solutions Pro"} for technical support, file requests, and inquiries.`,
};

export default function ContactUsLayout({ children }) {
  return children;
}
