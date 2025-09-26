import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const quickLinks = [
  { href: '/live-translate', label: 'الترجمة المباشرة' },
  { href: '/eye-tracking', label: 'تتبع العين' },
  { href: '/learning', label: 'التعليم' },
  { href: '/forum', label: 'المنتدى' },
  { href: '/settings', label: 'الإعدادات' },
];

const socialLinks = [
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <Logo className="text-white" />
            <p className="text-gray-300 text-sm leading-relaxed">
              جسر التواصل بين العالمين: الإشارة والصوت. نجعل التواصل ممكناً للجميع من خلال التكنولوجيا المتقدمة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* (تمت إزالة قسم الدعم بناءً على الطلب) */}
        </div>

        {/* (تمت إزالة قسم الحقوق والروابط القانونية بناءً على الطلب) */}
      </div>
    </footer>
  );
}