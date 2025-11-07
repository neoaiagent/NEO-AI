import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Share2, Mic, Film, Edit, Image as Images, LayoutDashboard, Wallet, FileText, Search, ArrowUpRight } from 'lucide-react';
const tools = [{
  name: 'Social Media Generator',
  description: 'Buat post sosial media (gambar & caption) secara otomatis dari prompt.',
  icon: <Share2 className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'Text to Speech',
  description: 'Ubah teks menjadi narasi suara alami dengan durasi 5-7 detik.',
  icon: <Mic className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'Image to Video',
  description: 'Ubah gambar statis menjadi video pendek berdurasi 5 detik.',
  icon: <Film className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'ADS Generator',
  description: 'Hasilkan iklan video yang menarik untuk kampanye marketing Anda.',
  icon: <ArrowUpRight className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'Image Editing',
  description: 'Edit gambar dengan mudah menggunakan perintah teks (prompt).',
  icon: <Edit className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'Brief to Images',
  description: 'Hasilkan 5 variasi gambar unik dari satu prompt singkat.',
  icon: <Images className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'Moodboard Generator',
  description: 'Buat moodboard inspiratif dari sebuah prompt untuk proyek kreatif Anda.',
  icon: <LayoutDashboard className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'Money Tracking',
  description: 'Catat pengeluaran dan dapatkan laporan keuangan harian atau bulanan.',
  icon: <Wallet className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'CV Generator',
  description: 'Ubah format file PDF CV Anda menjadi teks dengan format yang rapi.',
  icon: <FileText className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'AI Scraper',
  description: 'Dapatkan rangkuman berita AI terbaru lengkap dengan sumbernya dalam format PDF.',
  icon: <Search className="w-6 h-6 text-[#0573AC]" />
}, {
  name: 'Image Upscaler',
  description: 'Tingkatkan resolusi dan pertajam kualitas gambar Anda secara instan.',
  icon: <ArrowUpRight className="w-6 h-6 text-[#0573AC]" />
}];
const Landing = () => {
  return <>
      <Helmet>
        <title>NeoAI - Super AI for Every Generation</title>
        <meta name="description" content="Build your ideas, business, and creativity with a single platform. Horizon Hosting unifies the power of AI, design, and automation in one place." />
      </Helmet>

      <div className="bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-bold text-[#0573AC]">
                NeoAI
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <a href="#section-pricing" className="text-gray-700 hover:text-[#0573AC] transition-colors font-medium">
                  Pricing
                </a>
                <a href="#section-features" className="text-gray-700 hover:text-[#0573AC] transition-colors font-medium">
                  Features
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
        backgroundImage: `url('https://horizons-cdn.hostinger.com/eb5db8c3-45ff-433f-8da7-9e43c8d72761/ca33ea721d182fd90471e02244b5186c.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
          <div className="container relative z-10">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#013353] mb-6" style={{
              textShadow: '0px 2px 10px rgba(255,255,255,0.5)'
            }}>
                Super AI for Every Generation
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto" style={{
              textShadow: '0px 1px 5px rgba(255,255,255,0.5)'
            }}>
                Build your ideas, business, and creativity with a single platform. Horizon Hosting unifies the power of AI, design, and automation in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login" className="btn-primary">
                  Start for Free
                </Link>
                <Link to="/dashboard" className="btn-secondary">
                  Explore Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="section-features" className="container section bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#013353] mb-4">
              Everything you need in one platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Neo AI menawarkan solusi lengkap untuk manajemen aplikasi dan kreativitas Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.slice(0, 6).map((tool, index) => <motion.div key={index} whileHover={{
            y: -5
          }} className="card">
                <div className="w-12 h-12 bg-[#0573AC]/10 rounded-lg flex items-center justify-center mb-4">
                  {tool.icon}
                </div>
                <h3 className="font-semibold text-[#013353] mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm">
                  {tool.description}
                </p>
              </motion.div>)}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="section-pricing" className="container section bg-[#F8F9FB]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#013353] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div whileHover={{
            scale: 1.02
          }} className="card border-2 border-gray-200">
              <h3 className="font-bold text-[#013353] mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#0573AC]">Rp 150,000</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">10,000 AI Credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">~ 100 image generations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">~ 15 Video generations</span>
                </li>
              </ul>
              <button className="btn-secondary w-full">Get Started</button>
            </motion.div>

            <motion.div whileHover={{
            scale: 1.02
          }} className="card border-2 border-[#0573AC] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0573AC] text-white px-4 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
              <h3 className="font-bold text-[#013353] mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#0573AC]">Rp 300,000</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">50,000 AI Credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">~ 500 images generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">~ 35 Video generations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Advanced tools</span>
                </li>
              </ul>
              <button className="btn-primary w-full">Get Started</button>
            </motion.div>

            <motion.div whileHover={{
            scale: 1.02
          }} className="card border-2 border-gray-200">
              <h3 className="font-bold text-[#013353] mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#0573AC]">Custom</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Unlimited Credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Dedicated Support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Custom Integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">SLA Guarantee</span>
                </li>
              </ul>
              <button className="btn-secondary w-full">Contact Sales</button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#013353] text-white py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <nav className="flex gap-6 text-sm">
                <a href="/about" className="hover:text-[#0573AC] transition-colors">About</a>
                <a href="/terms" className="hover:text-[#0573AC] transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-[#0573AC] transition-colors">Privacy</a>
                <a href="/contact" className="hover:text-[#0573AC] transition-colors">Contact</a>
              </nav>
              <p className="text-sm text-gray-300">© 2025 NEO AI</p>
            </div>
          </div>
        </footer>
      </div>
    </>;
};
export default Landing;