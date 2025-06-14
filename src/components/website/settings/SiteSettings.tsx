"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateFavicon, updateLogo } from "@/actions/settings-actions";
import Image from "next/image";

interface SiteSettingsProps {
  currentFavicon?: string;
  currentLogo?: string;
}

export const SiteSettings = ({ currentFavicon, currentLogo }: SiteSettingsProps) => {
  const [favicon, setFavicon] = useState(currentFavicon);
  const [logo, setLogo] = useState(currentLogo);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [version, setVersion] = useState(Date.now());

  // Función para actualizar el favicon en el documento
  const updateFaviconInDocument = (url: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = `${url}?v=${version}`;
    document.getElementsByTagName('head')[0].appendChild(link);
    console.log('Favicon URL:', link.href);
  };

  // Actualizar el favicon cuando cambie
  useEffect(() => {
    if (favicon) {
      updateFaviconInDocument(favicon);
    }
  }, [favicon, version]);

  const handleFaviconChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingFavicon(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await updateFavicon(formData);
      setFavicon(result.url);
      setVersion(Date.now());
      toast.success("Favicon actualizado correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el favicon");
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await updateLogo(formData);
      setLogo(result.url);
      toast.success("Logo actualizado correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Configuración del Sitio</h2>
      
      <div className="space-y-6">
        {/* Favicon Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Favicon</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sube un archivo .ico o .png para personalizar el favicon de tu sitio.
          </p>
          
          {favicon && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Favicon actual:</p>
              <img 
                src={`${favicon}?v=${version}`}
                alt="Favicon actual" 
                className="w-8 h-8 object-contain"
              />
              <div className="mt-2 text-xs text-gray-500 break-all">
                URL: {`${favicon}?v=${version}`}
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFaviconChange}
              className="hidden"
              id="favicon-upload"
              disabled={isUploadingFavicon}
            />
            <label
              htmlFor="favicon-upload"
              className={`inline-block bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors cursor-pointer ${
                isUploadingFavicon ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploadingFavicon ? 'Subiendo...' : 'Subir nuevo favicon'}
            </label>
          </div>
        </div>

        {/* Logo Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Logo</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sube una imagen para personalizar el logo de tu sitio.
          </p>
          
          {logo && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Logo actual:</p>
              <div className="relative w-32 h-32">
                <Image 
                  src={logo}
                  alt="Logo actual"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 break-all">
                URL: {logo}
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
              disabled={isUploadingLogo}
            />
            <label
              htmlFor="logo-upload"
              className={`inline-block bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors cursor-pointer ${
                isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploadingLogo ? 'Subiendo...' : 'Subir nuevo logo'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}; 