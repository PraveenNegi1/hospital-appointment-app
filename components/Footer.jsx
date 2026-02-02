// components/Footer.jsx
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 font-serif">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 - Brand & Mission */}
          <div className="space-y-6">
            <h3 className="text-white text-2xl font-bold tracking-tight">
              MediCare Hospital
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Committed to delivering compassionate, evidence-based care with
              patient safety and clinical excellence at the core of every
              service.
            </p>

            {/* Social Icons – subtle & professional */}
            <div className="flex items-center gap-5 pt-2">
              <a
                href="https://facebook.com/medicarehospital"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/medicarehosp"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/medicarehospital"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com/company/medicare-hospital"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/doctors"
                  className="hover:text-white transition-colors"
                >
                  Our Consultants
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Our Services (key departments) */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Key Departments
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/general-medicine"
                  className="hover:text-white transition-colors"
                >
                  General Medicine
                </a>
              </li>
              <li>
                <a
                  href="/cardiology"
                  className="hover:text-white transition-colors"
                >
                  Cardiology
                </a>
              </li>
              <li>
                <a
                  href="/orthopedics"
                  className="hover:text-white transition-colors"
                >
                  Orthopedics
                </a>
              </li>
              <li>
                <a
                  href="/pediatrics"
                  className="hover:text-white transition-colors"
                >
                  Pediatrics & Neonatology
                </a>
              </li>
              <li>
                <a
                  href="/gynecology-obstetrics"
                  className="hover:text-white transition-colors"
                >
                  Obstetrics & Gynecology
                </a>
              </li>
              <li>
                <a
                  href="/emergency"
                  className="hover:text-white transition-colors"
                >
                  Emergency & Trauma
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact & Hours */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Contact Information
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-gray-400 mt-1 flex-shrink-0"
                />
                <span>
                  123 Health Avenue, Civil Lines, Prayagraj, Uttar Pradesh
                  211001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400 flex-shrink-0" />
                <div className="space-y-1">
                  <a
                    href="tel:+915322500000"
                    className="hover:text-white transition-colors block"
                  >
                    +91 532 250 0000 (General)
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <a
                  href="mailto:info@medicarehospital.in"
                  className="hover:text-white transition-colors"
                >
                  info@medicarehospital.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                <span>
                  OPD Hours: 9:00 AM – 8:00 PM
                  <br />
                  Emergency: 24×7
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Legal, Accreditation & Copyright */}
      <div className="border-t border-gray-800 bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
            {/* Left - Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <p>© {currentYear} MediCare Hospital. All rights reserved.</p>
              <div className="flex flex-wrap gap-5 sm:gap-6">
                <a
                  href="/privacy-policy"
                  className="hover:text-gray-200 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-conditions"
                  className="hover:text-gray-200 transition-colors"
                >
                  Terms of Use
                </a>
                <a
                  href="/patient-rights-responsibilities"
                  className="hover:text-gray-200 transition-colors"
                >
                  Patient Rights
                </a>
                <a
                  href="/disclaimer"
                  className="hover:text-gray-200 transition-colors"
                >
                  Disclaimer
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-right">
              <div className="text-xs">
                <div className="text-gray-600">Quality Management System</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
