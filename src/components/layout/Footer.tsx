import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Phone, Mail, MapPin, MessageCircle, Share2, Globe, Send } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1 text-left">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Box className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">JANA FIBRE GLASS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manufacturers of premium custom FRP composite doors and frames. Waterproof, termite-proof, and custom-engineered to your exact dimensions.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://wa.me/916383236623" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800" title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800" title="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-sky-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800" title="Share">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="mailto:info@janafibreglass.com" className="hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800" title="Email">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Product Catalog</Link>
              </li>
              <li>
                <Link to="/studio" className="hover:text-white transition-colors">3D Door Studio</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Product Line */}
          <div className="text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Products</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/products" className="hover:text-white transition-colors">FRP Solid Core Doors</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Parametric Frame Assemblies</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Industrial Weatherproof Doors</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Custom Finish Options</Link></li>
            </ul>
          </div>

          {/* Direct Contact & WhatsApp */}
          <div className="space-y-3 text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>JANA FIBRE GLASS, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+91 6383236623</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>info@janafibreglass.com</span>
              </div>
            </div>
            <a
              href="https://wa.me/916383236623"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JANA FIBRE GLASS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-400 transition-colors">Terms & Disclaimers</Link>
            <Link to="/about" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
