import { IconBrandFacebook } from '@tabler/icons-react';
import { IconBrandInstagram } from '@tabler/icons-react';
import { IconBrandX } from '@tabler/icons-react';
import { IconBrandLinkedin } from '@tabler/icons-react';


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secundario py-6">
      <div className="text-center text-texto/60">
        <p className="mb-3">© {year} <span className="font-semibold text-texto">Red-Fi</span>. Todos los derechos reservados.</p>

        <div className="flex justify-center gap-4 mt-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition">
            <IconBrandFacebook size={18} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition">
            <IconBrandInstagram size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition">
            <IconBrandX size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-texto transition">
            <IconBrandLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
