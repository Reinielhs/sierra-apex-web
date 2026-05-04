/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- INICIALIZAR SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- DICCIONARIO DE IDIOMAS (INGLÉS / ESPAÑOL) ---
const translations = {
  en: {
    navInventory: "Inventory",
    navReviews: "Reviews",
    navStaff: "Staff Login",
    heroTitle: "Elevating the Standard",
    heroBtn: "Explore Collection",
    standardTitle: "The Sierra Apex Standard",
    standardDesc: "\"We don't just sell vehicles; we offer a collection with guaranteed excellence.\"",
    collectionTitle1: "Our",
    collectionTitle2: "Collection",
    available: "Available",
    viewAll: "View All",
    advSearch: "Advanced Search",
    make: "Make",
    model: "Model",
    all: "All",
    select: "Select",
    maxBudget: "Max Budget",
    searchBtn: "Search Now",
    loading: "Loading exclusive collection...",
    preparing: "Collection currently in preparation.",
    exactMatches: "Exact Matches",
    noMatchesTitle: "No exact matches found",
    noMatchesDesc: "However, we have excellent alternatives in our collection.",
    exploreOthers: "Explore Other Options",
    exploreBtn: "Explore",
    matchBadge: "Match",
    soldBadge: "Sold",
    experiencesTitle: "Sierra Apex Group Experiences",
    voicesTitle: "Voices of Trust",
    shareReviewBtn: "Share my experience",
    // Modal
    price: "Price",
    mileage: "Mileage",
    engine: "Engine",
    transmission: "Transmission",
    extColor: "Ext. Color",
    intColor: "Int. Color",
    material: "Material",
    descriptionQuote: "A collector's vehicle in impeccable condition. Contact us to schedule an exclusive test drive.",
    reqDetailsBtn: "Request Details",
    vehicleSoldBtn: "Vehicle Sold",
    goBack: "← Go Back",
    interestIn: "Interest in",
    yourName: "Your Name",
    email: "Email Address",
    phone: "Phone Number",
    specialReq: "Any special requirements?",
    sending: "Sending...",
    confirmInterest: "Confirm Interest",
    // Alerts
    alertContact: "Please enter at least an email or phone number to contact you.",
    alertError: "There was an error sending your message. Please try again.",
    alertSuccess: "Message sent successfully! We will contact you very soon.",
    // Footer
    redefining: "Redefining the acquisition of luxury and high-performance vehicles in South Florida.",
    directContact: "Direct Contact",
    hoursTitle: "Business Hours",
    monSat: "Monday - Saturday",
    apptOnly: "* After-hours availability by appointment only.",
    followUs: "Follow Us",
    rights: "© 2026 Sierra Apex Group LLC. All Rights Reserved."
  },
  es: {
    navInventory: "Inventario",
    navReviews: "Opiniones",
    navStaff: "Acceso Staff",
    heroTitle: "Elevando el Estándar",
    heroBtn: "Explorar Colección",
    standardTitle: "El Estándar Sierra Apex",
    standardDesc: "\"No vendemos simples vehículos; ofrecemos una colección con excelencia garantizada.\"",
    collectionTitle1: "Nuestra",
    collectionTitle2: "Colección",
    available: "Disponibles",
    viewAll: "Ver Todos",
    advSearch: "Búsqueda Avanzada",
    make: "Marca",
    model: "Modelo",
    all: "Todas",
    select: "Seleccione",
    maxBudget: "Presupuesto Máx",
    searchBtn: "Buscar Ahora",
    loading: "Cargando colección exclusiva...",
    preparing: "Colección actualmente en preparación.",
    exactMatches: "Coincidencias Exactas",
    noMatchesTitle: "No encontramos coincidencias exactas",
    noMatchesDesc: "Sin embargo, tenemos excelentes alternativas dentro de nuestra colección.",
    exploreOthers: "Explorar Otras Opciones",
    exploreBtn: "Explorar",
    matchBadge: "Coincidencia",
    soldBadge: "Vendido",
    experiencesTitle: "Experiencias Sierra Apex",
    voicesTitle: "Voces de Confianza",
    shareReviewBtn: "Compartir mi experiencia",
    // Modal
    price: "Precio",
    mileage: "Millaje",
    engine: "Motor",
    transmission: "Transmisión",
    extColor: "Color Ext.",
    intColor: "Color Int.",
    material: "Material",
    descriptionQuote: "Vehículo de colección en impecables condiciones. Contáctenos para agendar una prueba de manejo exclusiva.",
    reqDetailsBtn: "Solicitar Detalles",
    vehicleSoldBtn: "Vehículo Vendido",
    goBack: "← Regresar",
    interestIn: "Interés en",
    yourName: "Tu Nombre",
    email: "Correo Electrónico",
    phone: "Teléfono",
    specialReq: "¿Algún requerimiento especial?",
    sending: "Enviando...",
    confirmInterest: "Confirmar Interés",
    // Alerts
    alertContact: "Por favor, ingresa al menos un correo o teléfono para contactarte.",
    alertError: "Hubo un error al enviar el mensaje. Por favor intenta de nuevo.",
    alertSuccess: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.",
    // Footer
    redefining: "Redefiniendo la adquisición de vehículos de lujo y alto rendimiento en el sur de Florida.",
    directContact: "Contacto Directo",
    hoursTitle: "Atención",
    monSat: "Lunes - Sábado",
    apptOnly: "* Disponibilidad fuera de horario laboral únicamente mediante previa cita.",
    followUs: "Síguenos",
    rights: "© 2026 Sierra Apex Group LLC. Todos los derechos reservados."
  }
};

export default function HomePage() {
  // ==========================================
  // ESTADOS DEL SISTEMA
  // ==========================================
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- IDIOMA PÚBLICO ---
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const t = translations[lang];

  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('es')) {
      setLang('es');
    }
  }, []);

  // --- ESTADOS DE AUTENTICACIÓN (LOGIN) ---
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('inventory'); 

  // Verificar sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthenticated(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Cargar inventario inicial
  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const sortedData = data.sort((a: any, b: any) => {
        if (a.status === 'Vendido' && b.status !== 'Vendido') return 1;
        if (a.status !== 'Vendido' && b.status === 'Vendido') return -1;
        return 0;
      });
      setInventory(sortedData);
      if (sortedData.length > 0) {
        const maxPrice = Math.max(...sortedData.map((car: any) => car?.price || 0));
        setCurrentPrice(maxPrice);
      }
    } else {
      setInventory([]);
    }
    setIsLoading(false);
  };

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLegal, setShowLegal] = useState<'privacy' | 'terms' | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePublicImageIndex, setActivePublicImageIndex] = useState(0);
  
  const [searchActive, setSearchActive] = useState(false);

  // --- ESTADOS CARRUSEL TESTIMONIOS ---
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    { id: 1, name: 'Carlos R.', rating: 5, comment: 'Excellent service. The buying process was transparent and fast. Highly recommended for luxury vehicles.', date: '2 days ago' },
    { id: 2, name: 'Sarah M.', rating: 5, comment: 'Best dealership in South Florida. I absolutely love my new SUV! They took care of every detail.', date: '1 week ago' },
    { id: 3, name: 'David T.', rating: 5, comment: 'Incredible collection. They really know their cars. Will definitely come back for my next purchase.', date: '3 weeks ago' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    setActivePublicImageIndex(0); 
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCar || !selectedCar.images || selectedCar.images.length <= 1) return;
      if (e.key === 'ArrowRight') {
        setActivePublicImageIndex(prev => prev < selectedCar.images.length - 1 ? prev + 1 : 0);
      } else if (e.key === 'ArrowLeft') {
        setActivePublicImageIndex(prev => prev > 0 ? prev - 1 : selectedCar.images.length - 1);
      }
    };
    if (selectedCar) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCar]);

  const availableBrands = Array.from(new Set(inventory.filter(car => car?.status !== 'Vendido').map((car: any) => car?.brand).filter(Boolean))).sort();
  const availableModels = selectedBrand 
    ? Array.from(new Set(inventory.filter((car: any) => car?.brand?.toLowerCase() === selectedBrand && car?.status !== 'Vendido').map((car: any) => car?.model).filter(Boolean))).sort()
    : [];
  const minInventoryPrice = inventory.length > 0 ? Math.min(...inventory.map((car: any) => car?.price || 0)) : 0;
  const maxInventoryPrice = inventory.length > 0 ? Math.max(...inventory.map((car: any) => car?.price || 0)) : 100000;
  const [currentPrice, setCurrentPrice] = useState(maxInventoryPrice);
  
  const [leads, setLeads] = useState<any[]>([]);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    if (adminTab === 'leads' && isAuthenticated) fetchLeads();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminTab, isAuthenticated]);

  const fetchLeads = async () => {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error) {
      setLeads(data || []); 
    } else {
      setLeads([]);
    }
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.email && !leadForm.phone) {
      alert(t.alertContact);
      return;
    }
    setIsSubmittingLead(true);
    
    const { error } = await supabase.from('leads').insert([{
      name: leadForm.name || 'Cliente Anónimo',
      email: leadForm.email,
      phone: leadForm.phone,
      message: leadForm.message,
      car_title: `${selectedCar?.year || ''} ${selectedCar?.brand || ''} ${selectedCar?.model || ''}`.trim(),
      status: 'Nuevo'
    }]);

    setIsSubmittingLead(false);

    if (error) {
      alert(t.alertError);
    } else {
      alert(t.alertSuccess);
      setLeadForm({ name: '', email: '', phone: '', message: '' });
      setShowLeadForm(false);
      fetchLeads(); 
    }
  };

  const updateLeadStatus = async (id: number, newStatus: string) => {
    await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    fetchLeads(); 
  };

  const handleToggleSold = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Vendido' ? 'Disponible' : 'Vendido';
    const { error } = await supabase.from('inventory').update({ status: newStatus }).eq('id', id);
    if (error) {
      alert("Error al actualizar el estado: " + error.message);
    } else {
      fetchInventory();
    }
  };

  const [vinToDecode, setVinToDecode] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [draggedImgIndex, setDraggedImgIndex] = useState<number | null>(null);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);

  const [newCarForm, setNewCarForm] = useState({
    make: '', model: '', year: '', trim: '', engine: '', transmission: '', miles: '', price: '', description: '', color: '', interior: '', interiorColor: ''
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    let targetPosition = 0;
    if (id !== 'top') {
      const section = document.getElementById(id);
      if (!section) return;
      targetPosition = section.getBoundingClientRect().top + window.pageYOffset - 64;
    }
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  };

  const handleSearch = () => {
    setSearchActive(true);
    scrollToSection('inventario');
  };

  const handleClearSearch = () => {
    setSearchActive(false);
    setSelectedBrand('');
    setSelectedModel('');
    setCurrentPrice(maxInventoryPrice);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ 
      email: loginEmail, 
      password: loginPassword 
    });

    if (error) {
      setLoginError('Credenciales incorrectas o usuario no encontrado.');
      setIsLoading(false);
    } else {
      setIsAuthenticated(true);
      setLoginEmail('');
      setLoginPassword('');
      setIsLoading(false);
      fetchLeads(); 
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsStaffMode(false);
    setIsAuthenticated(false);
    setAdminTab('inventory');
  };

  const handleDecodeVIN = async () => {
    if (vinToDecode.length !== 17) return alert("Por favor, ingresa un VIN válido de 17 caracteres.");
    setIsDecoding(true);
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vinToDecode}?format=json`);
      const data = await response.json();
      const getValue = (variableName: string) => {
        const result = data.Results.find((r: any) => r.Variable === variableName);
        return result && result.Value && result.Value !== "Not Applicable" ? result.Value : '';
      };
      const engineLiters = getValue('Displacement (L)');
      const engineCylinders = getValue('Engine Number of Cylinders');
      const engineConfig = `${engineLiters ? engineLiters + 'L' : ''} ${engineCylinders ? engineCylinders + ' Cyl' : ''}`.trim();
      const newDecodedData = {
        make: getValue('Make') || '', model: getValue('Model') || '', year: getValue('Model Year') || '',
        trim: getValue('Trim') || '', engine: engineConfig, transmission: getValue('Transmission Style') || '',
      };
      setDecodedData(newDecodedData);
      setNewCarForm({ ...newCarForm, ...newDecodedData });
    } catch (error) {
      alert("Hubo un problema de conexión con la NHTSA.");
    } finally {
      setIsDecoding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(1); 
    const filesArray = Array.from(e.target.files);
    const newUrls: string[] = [];
    try {
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('vehicles').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('vehicles').getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
        setUploadProgress(Math.round(((i + 1) / filesArray.length) * 100));
      }
      setUploadedImages(prev => [...prev, ...newUrls]);
    } catch (error) {
      alert('Hubo un error al subir las fotos.');
    } finally {
      setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 1000);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const rotateImage = async (index: number) => {
    setIsUploading(true);
    setUploadProgress(50);
    const imgUrl = uploadedImages[index];
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgUrl;
      await new Promise((resolve) => (img.onload = resolve));
      const canvas = document.createElement("canvas");
      canvas.width = img.height; 
      canvas.height = img.width;
      const ctx = canvas.getContext("2d");
      if(ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      }
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      if(blob) {
        const fileName = `rotated-${Date.now()}.jpg`;
        const { error } = await supabase.storage.from('vehicles').upload(fileName, blob);
        if (!error) {
          const { data } = supabase.storage.from('vehicles').getPublicUrl(fileName);
          const newImages = [...uploadedImages];
          newImages[index] = data.publicUrl; 
          setUploadedImages(newImages);
        }
      }
    } catch(e) { 
      alert("Hubo un error al intentar rotar la imagen.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragStart = (index: number) => setDraggedImgIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault(); 
  const handleDrop = (index: number) => {
    if (draggedImgIndex === null || draggedImgIndex === index) return;
    const newImages = [...uploadedImages];
    const draggedImg = newImages[draggedImgIndex];
    newImages.splice(draggedImgIndex, 1); 
    newImages.splice(index, 0, draggedImg); 
    setUploadedImages(newImages);
    setDraggedImgIndex(null);
  };
  const deleteImage = (index: number) => setUploadedImages(prev => prev.filter((_, i) => i !== index));

  const handleSaveVehicle = async () => {
    if (!newCarForm.make || !newCarForm.price) return alert("Completa al menos Marca y Precio de Venta.");
    const dbPayload = {
      vin: vinToDecode || null, brand: newCarForm.make, model: newCarForm.model,
      year: Number(newCarForm.year) || new Date().getFullYear(), trim: newCarForm.trim,
      engine: newCarForm.engine, transmission: newCarForm.transmission, price: Number(newCarForm.price) || 0,
      miles: newCarForm.miles ? newCarForm.miles.toString() : '0', description: newCarForm.description,
      color: newCarForm.color, interior: newCarForm.interior, interior_color: newCarForm.interiorColor,
      status: 'Disponible',
      image: uploadedImages.length > 0 ? uploadedImages[0] : (editingVehicleId ? undefined : 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop'),
      images: uploadedImages
    };
    if (dbPayload.image === undefined) delete dbPayload.image;

    let error;
    if (editingVehicleId) {
      const { error: updateError } = await supabase.from('inventory').update(dbPayload).eq('id', editingVehicleId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('inventory').insert([{...dbPayload, stock: `SA-${Math.floor(1000 + Math.random() * 9000)}`, leads: 0, days_on_market: 0}]);
      error = insertError;
    }

    if (error) alert("Hubo un error al guardar en la nube.");
    else { alert('Vehículo guardado con éxito.'); fetchInventory(); resetForm(); }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vehículo?")) return;
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (!error) fetchInventory();
  };

  const handleEditClick = (car: any) => {
    setEditingVehicleId(car.id); setVinToDecode(car.vin || ''); setDecodedData(true); 
    setNewCarForm({
      make: car.brand || '', model: car.model || '', year: car.year?.toString() || '', trim: car.trim || '',
      engine: car.engine || '', transmission: car.transmission || '', miles: car.miles || '',
      price: car.price?.toString() || '', description: car.description || '', color: car.color || '',
      interior: car.interior || '', interiorColor: car.interior_color || '' 
    });
    setUploadedImages(car.images || (car.image ? [car.image] : []));
    setAdminTab('add-vehicle');
  };

  const resetForm = () => {
    setAdminTab('inventory'); setEditingVehicleId(null); setVinToDecode(''); setDecodedData(null);
    setUploadedImages([]); setUploadProgress(0);
    setNewCarForm({ make: '', model: '', year: '', trim: '', engine: '', transmission: '', miles: '', price: '', description: '', color: '', interior: '', interiorColor: '' });
  };

  const triggerFileInput = () => { if (fileInputRef.current) fileInputRef.current.click(); };

  // ==========================================
  // COMPONENTE DE TARJETA DE AUTO PÚBLICA
  // ==========================================
  const renderCarCard = (car: any, isHighlighted: boolean = false) => {
    const isSold = car?.status === 'Vendido';
    return (
      <div key={car.id} onClick={() => { setSelectedCar(car); setShowLeadForm(false); }} className={`group cursor-pointer ${isHighlighted ? 'ring-1 ring-sierra-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] rounded-2xl' : ''} ${isSold ? 'opacity-70 grayscale-[30%]' : ''}`}>
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/20 rounded-2xl border border-white/5 shadow-xl transition-all duration-500 group-hover:border-sierra-gold/30 mb-3">
          <img src={car?.image || (car?.images && car.images[0]) || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop'} alt={car?.model || 'Auto'} className={`w-full h-full object-cover transition-transform duration-1000 ${!isSold && 'group-hover:scale-110 opacity-90 group-hover:opacity-100'}`} />
          <div className="absolute top-3 right-3 bg-[#111C2D]/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10"><span className="text-xs font-bold text-white tracking-widest">{car?.year || ''}</span></div>
          {car?.images && car.images.length > 1 && <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-xs font-bold text-white tracking-widest">+{car.images.length - 1} Fotos</div>}
          {isHighlighted && <div className="absolute top-3 left-3 bg-sierra-gold text-black px-2 py-1 rounded-md text-xs font-bold tracking-widest shadow-lg uppercase">{t.matchBadge}</div>}
          
          {isSold && (
            <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
              <span className="border-4 border-red-500/80 text-red-500/80 px-4 py-1 text-xl md:text-2xl font-black uppercase tracking-[0.4em] -rotate-12 shadow-2xl">{t.soldBadge}</span>
            </div>
          )}
        </div>
        <div className="px-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-lg font-bold tracking-tight text-white uppercase group-hover:text-sierra-gold transition-colors">{car?.brand || 'Sin Marca'}</h4>
            <p className="text-lg font-light text-sierra-gold tracking-tighter">${(car?.price || 0).toLocaleString()}</p>
          </div>
          <p className="text-sm font-light text-white/50 mb-3">{car?.model || ''} {car?.trim || ''}</p>
          <div className="flex justify-between items-center text-xs text-white/40 uppercase tracking-[0.2em] border-t border-white/5 pt-3">
            <span>{car?.miles || 0} MI</span>
            <span className="text-sierra-gold/70 group-hover:text-sierra-gold group-hover:translate-x-1 transition-all duration-300 italic">{t.exploreBtn}</span>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // VISTA DE ADMINISTRACIÓN (DASHBOARD)
  // ==========================================
  if (isStaffMode) {
    if (!isAuthenticated) {
      return (
        <main className="bg-[#111C2D] text-white min-h-screen flex items-center justify-center font-sans p-6 relative">
          <button onClick={() => setIsStaffMode(false)} className="absolute top-8 left-8 text-white/50 hover:text-white uppercase tracking-widest text-xs transition-colors">← Volver al sitio web</button>
          <div className="max-w-md w-full bg-[#162439] p-10 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex justify-center mb-8"><img src="/logo-vertical.svg" alt="Logo" className="h-16 object-contain" /></div>
            <h2 className="text-xl font-bold mb-8 text-center uppercase tracking-widest">Portal de Acceso</h2>
            {loginError && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">{loginError}</div>}
            <form onSubmit={handleLogin} className="space-y-6">
              <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block">Usuario Corporativo (Email)</label><input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-4 outline-none focus:border-sierra-gold transition-colors text-white text-sm" /></div>
              <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block">Contraseña</label><input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-4 outline-none focus:border-sierra-gold transition-colors text-white text-sm" /></div>
              <button type="submit" disabled={isLoading} className={`w-full py-4 font-bold rounded-xl uppercase text-sm tracking-[0.2em] transition-all ${isLoading ? 'bg-sierra-gold/50 text-black/50 cursor-wait' : 'bg-sierra-gold text-black hover:bg-white'}`}>{isLoading ? 'Autenticando...' : 'Ingresar'}</button>
            </form>
          </div>
        </main>
      );
    }

    return (
      <main className="bg-[#111C2D] text-white min-h-screen font-sans flex overflow-hidden">
        <aside className="w-64 bg-[#0B1320] border-r border-white/5 flex flex-col h-screen">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-6"><img src="/logo-vertical.svg" alt="Logo" className="h-8" /><span className="text-base font-bold tracking-widest uppercase text-sierra-gold">Sierra Apex</span></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#162439] flex items-center justify-center text-sierra-gold border border-white/10 font-bold">RH</div><div><p className="text-sm font-bold">Reiniel Hernandez</p><p className="text-xs text-white/50 uppercase tracking-widest">Administrador</p></div></div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => { setAdminTab('inventory'); setEditingVehicleId(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${adminTab === 'inventory' || adminTab === 'add-vehicle' ? 'bg-sierra-gold text-black' : 'text-white/60 hover:bg-[#162439] hover:text-white'}`}>Inventario</button>
            <button onClick={() => setAdminTab('leads')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${adminTab === 'leads' ? 'bg-sierra-gold text-black' : 'text-white/60 hover:bg-[#162439] hover:text-white'}`}>
              <div className="flex items-center gap-3">Leads & CRM</div>
              {(leads || []).filter((l: any) => l?.status === 'Nuevo').length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{(leads || []).filter((l: any) => l?.status === 'Nuevo').length}</span>}
            </button>
          </nav>
          <div className="p-4 border-t border-white/5"><button onClick={handleLogout} className="w-full px-4 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all">Cerrar Sesión</button></div>
        </aside>

        <section className="flex-1 h-screen overflow-y-auto">
          <header className="bg-[#111C2D]/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5 px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-light tracking-widest uppercase">{adminTab === 'inventory' ? 'Inventario Existente' : adminTab === 'leads' ? 'Gestión de Prospectos' : (editingVehicleId ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo')}</h2>
            <div className="flex gap-4">{adminTab !== 'add-vehicle' && (<button onClick={() => { resetForm(); setAdminTab('add-vehicle'); }} className="px-6 py-2 bg-sierra-gold text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg">+ Añadir Vehículo</button>)}</div>
          </header>

          <div className="p-8 max-w-6xl mx-auto">
            {adminTab === 'add-vehicle' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#162439] p-8 rounded-2xl border border-white/5 shadow-xl mb-8">
                  <h3 className="text-base font-bold text-sierra-gold uppercase tracking-widest mb-6">¿Qué estás vendiendo?</h3>
                  
                  <div className="mb-10 p-8 bg-[#111C2D] border border-sierra-gold/30 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-sierra-gold"></div>
                    <label className="text-base uppercase text-sierra-gold tracking-widest mb-4 block font-bold">Paso 1: Identificación del Vehículo</label>
                    <p className="text-sm text-white/60 mb-4">Ingresa el VIN de 17 caracteres. Nuestro sistema extraerá los datos de fábrica automáticamente.</p>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input type="text" placeholder="INGRESA EL VIN AQUÍ..." value={vinToDecode} onChange={(e) => setVinToDecode(e.target.value.toUpperCase())} maxLength={17} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-sierra-gold text-lg md:text-xl tracking-[0.2em] font-mono uppercase text-white placeholder:text-white/30 transition-all" />
                      <button onClick={handleDecodeVIN} disabled={isDecoding || vinToDecode.length !== 17} className={`md:w-48 py-4 font-bold rounded-xl uppercase text-sm tracking-widest transition-all ${isDecoding || vinToDecode.length !== 17 ? 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10' : 'bg-sierra-gold text-black hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.3)]'}`}>{isDecoding ? 'Decodificando...' : 'Decodificar VIN'}</button>
                    </div>
                  </div>

                  <div className={`transition-all duration-700 ${decodedData ? 'opacity-100' : 'opacity-40'}`}>
                    <h3 className="text-base font-bold text-white uppercase tracking-widest mb-6">Paso 2: Detalles y Especificaciones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Marca</label><input type="text" value={newCarForm.make} onChange={(e) => setNewCarForm({...newCarForm, make: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm" /></div>
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Modelo</label><input type="text" value={newCarForm.model} onChange={(e) => setNewCarForm({...newCarForm, model: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm" /></div>
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Año</label><input type="number" value={newCarForm.year} onChange={(e) => setNewCarForm({...newCarForm, year: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm" /></div>
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Versión / Trim</label><input type="text" value={newCarForm.trim} onChange={(e) => setNewCarForm({...newCarForm, trim: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm" /></div>
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Motor</label><input type="text" value={newCarForm.engine} onChange={(e) => setNewCarForm({...newCarForm, engine: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm" /></div>
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Transmisión</label><input type="text" value={newCarForm.transmission} onChange={(e) => setNewCarForm({...newCarForm, transmission: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm" /></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-white/5 pt-6">
                      <div>
                        <label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Color Exterior</label>
                        <select value={newCarForm.color} onChange={(e) => setNewCarForm({...newCarForm, color: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm cursor-pointer text-white">
                          <option value="">Seleccione color</option><option value="Negro">Negro</option><option value="Blanco">Blanco</option><option value="Plata">Plata</option><option value="Gris">Gris</option><option value="Rojo">Rojo</option><option value="Azul">Azul</option><option value="Perla">Perla</option><option value="Otro">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Material Asientos</label>
                        <select value={newCarForm.interior} onChange={(e) => setNewCarForm({...newCarForm, interior: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm cursor-pointer text-white">
                          <option value="">Seleccione material</option><option value="Cuero">Cuero Premium</option><option value="Algodón / Tela">Algodón / Tela</option><option value="Sintético">Sintético</option><option value="Cuero/Algodón">Mixto</option><option value="Alcantara">Alcantara</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Color Interior</label>
                        <select value={newCarForm.interiorColor} onChange={(e) => setNewCarForm({...newCarForm, interiorColor: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm cursor-pointer text-white">
                          <option value="">Seleccione color interior</option><option value="Negro">Negro</option><option value="Beige / Crema">Beige / Crema</option><option value="Gris">Gris</option><option value="Rojo">Rojo</option><option value="Marrón / Café">Marrón / Café</option><option value="Blanco">Blanco</option><option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white uppercase tracking-widest mb-6 border-t border-white/5 pt-8">Gestión Interna</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Stock #</label><input type="text" placeholder="Auto-generado" className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none text-sm text-white/50 cursor-not-allowed" disabled /></div>
                      <div><label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Millaje Actual</label><input type="number" placeholder="Ej: 15000" value={newCarForm.miles} onChange={(e) => setNewCarForm({...newCarForm, miles: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm" /></div>
                      <div><label className="text-xs uppercase text-sierra-gold tracking-widest mb-2 block font-bold">Precio Venta ($)</label><input type="number" placeholder="0.00" value={newCarForm.price} onChange={(e) => setNewCarForm({...newCarForm, price: e.target.value})} className="w-full bg-[#111C2D] border border-sierra-gold/50 rounded-xl p-3 outline-none focus:border-sierra-gold text-sm text-sierra-gold font-bold" /></div>
                    </div>

                    <div className="mb-8">
                      <label className="text-xs uppercase text-white/50 tracking-widest mb-2 block font-bold">Descripción del Vehículo</label>
                      <textarea rows={4} placeholder="Ej: Excelente estado, único dueño..." value={newCarForm.description} onChange={(e) => setNewCarForm({...newCarForm, description: e.target.value})} className="w-full bg-[#111C2D] border border-white/10 rounded-xl p-4 outline-none focus:border-sierra-gold text-sm resize-none"/>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="mb-8 animate-in fade-in">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs uppercase text-sierra-gold tracking-widest font-bold animate-pulse">Procesando Archivos...</span>
                        <span className="text-xs text-white/70">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-3 bg-[#111C2D] rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-sierra-gold transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  {uploadedImages.length > 0 && !isUploading && (
                    <div className="mb-8 border-t border-white/5 pt-6 animate-in fade-in">
                      <label className="text-sm uppercase text-sierra-gold tracking-widest mb-4 block font-bold">Galería del Vehículo ({uploadedImages.length} fotos)</label>
                      <p className="text-sm text-white/50 mb-4">Arrastra las fotos para reordenar. La primera foto (Izquierda) será la principal.</p>
                      
                      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                        {uploadedImages.map((url: any, idx: number) => (
                          <div 
                            key={idx} draggable onDragStart={() => handleDragStart(idx)} onDragOver={handleDragOver} onDrop={() => handleDrop(idx)}
                            className={`relative w-48 h-32 shrink-0 rounded-xl overflow-hidden group border-2 cursor-grab active:cursor-grabbing transition-all ${idx === 0 ? 'border-sierra-gold' : 'border-white/10'} ${draggedImgIndex === idx ? 'opacity-50' : 'opacity-100'}`}
                          >
                            <img src={url} className="w-full h-full object-cover pointer-events-none" />
                            {idx === 0 && <span className="absolute top-2 left-2 bg-sierra-gold text-black text-xs font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-widest z-10">Principal</span>}
                            
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                              <button onClick={(e) => { e.preventDefault(); rotateImage(idx); }} title="Girar 90°" className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-sierra-gold hover:text-black transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>
                              <button onClick={(e) => { e.preventDefault(); deleteImage(idx); }} title="Eliminar Foto" className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end items-center gap-4 border-t border-white/5 pt-8 mt-8">
                    <button onClick={resetForm} className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-xl text-xs uppercase font-bold tracking-widest transition-all">Cancelar</button>
                    <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload}/>
                    <button onClick={triggerFileInput} disabled={isUploading} className={`px-8 py-4 border rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${isUploading ? 'border-white/10 text-white/40 cursor-wait' : 'border-sierra-gold text-sierra-gold hover:bg-sierra-gold hover:text-black'}`}>
                      {uploadedImages.length > 0 ? 'Añadir más fotos' : 'Subir Fotos'}
                    </button>
                    <button onClick={handleSaveVehicle} disabled={isUploading} className={`px-8 py-4 font-bold rounded-xl text-xs uppercase tracking-widest transition-all ${decodedData && !isUploading ? 'bg-sierra-gold text-black hover:bg-white shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}>
                      {editingVehicleId ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'inventory' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#162439] p-6 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-end">
                  <div className="flex flex-col"><label className="text-xs text-white/50 font-bold uppercase tracking-widest mb-2 ml-1">Stock #</label><input type="text" placeholder="Ej: SA-001" className="bg-[#111C2D] border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-sierra-gold w-40" /></div>
                  <div className="flex flex-col"><label className="text-xs text-white/50 font-bold uppercase tracking-widest mb-2 ml-1">Ordenar Por</label><select className="bg-[#111C2D] border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-sierra-gold w-48 cursor-pointer"><option>Agregados Recientemente</option><option>Precio: Mayor a Menor</option></select></div>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="p-10 text-center text-white/50 uppercase tracking-widest text-sm">Cargando base de datos...</div>
                  ) : inventory.length === 0 ? (
                    <div className="p-10 text-center bg-[#162439] rounded-2xl border border-white/5">
                      <p className="text-white/50 uppercase tracking-widest text-sm mb-4">No hay vehículos en el inventario.</p>
                      <button onClick={() => setAdminTab('add-vehicle')} className="px-8 py-3 bg-sierra-gold text-black rounded-lg text-xs font-bold uppercase tracking-widest">Añadir el primero</button>
                    </div>
                  ) : (
                    inventory.map((car: any) => (
                      <div key={car.id} className={`bg-[#162439] rounded-2xl border overflow-hidden flex flex-col md:flex-row shadow-lg hover:border-sierra-gold/30 transition-all ${car.status === 'Vendido' ? 'border-white/5 opacity-60' : 'border-white/5'}`}>
                        <div className="w-full md:w-64 h-48 md:h-auto relative bg-black/50">
                          <img src={car?.image || (car?.images && car.images[0]) || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop'} alt={car?.model || 'Auto'} className="w-full h-full object-cover opacity-90" />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/10 text-xs font-bold text-white tracking-widest">{car?.stock || 'N/A'}</div>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold uppercase tracking-tight">{car?.year || ''} {car?.brand || ''} {car?.model || ''} {car?.trim || ''}</h3>
                                {car.status === 'Vendido' && <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Vendido</span>}
                              </div>
                              <span className="text-xl font-light text-sierra-gold">${(car?.price || 0).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-white/50 uppercase tracking-widest mb-4">VIN: {car?.vin || 'No Registrado'}</p>
                          </div>
                          <div className="grid grid-cols-4 gap-2 border-t border-white/5 pt-4">
                            <div><p className="text-xs text-white/40 uppercase tracking-widest mb-1">Millaje</p><p className="text-sm font-bold">{car?.miles || 0}</p></div>
                            <div><p className="text-xs text-white/40 uppercase tracking-widest mb-1">Color Ext.</p><p className="text-sm font-bold text-white truncate">{car?.color || 'N/A'}</p></div>
                            <div><p className="text-xs text-white/40 uppercase tracking-widest mb-1">Color Int.</p><p className="text-sm font-bold text-white truncate">{car?.interior_color || 'N/A'}</p></div>
                            <div><p className="text-xs text-white/40 uppercase tracking-widest mb-1">Días Web</p><p className="text-sm font-bold">{car?.days_on_market || 0}</p></div>
                          </div>
                        </div>
                        <div className="w-full md:w-48 bg-[#0B1320] border-l border-white/5 p-6 flex flex-col justify-center gap-3">
                          <button onClick={() => handleEditClick(car)} className="w-full py-3 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#162439] transition-all">Editar</button>
                          <button onClick={() => handleDeleteVehicle(car.id)} className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all">Eliminar</button>
                          <button onClick={() => handleToggleSold(car.id, car.status)} className={`w-full py-3 border rounded-lg text-xs uppercase tracking-widest font-bold transition-all ${car.status === 'Vendido' ? 'border-white/50 text-white hover:bg-white hover:text-black' : 'border-sierra-gold/50 text-sierra-gold hover:bg-sierra-gold hover:text-black shadow-[0_0_15px_rgba(212,175,55,0.1)]'}`}>
                            {car.status === 'Vendido' ? 'Hacer Disponible' : 'Marcar Vendido'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* --- PANEL DE LEADS & CRM --- */}
            {adminTab === 'leads' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {(leads || []).length === 0 ? (
                  <div className="p-10 text-center bg-[#162439] rounded-2xl border border-white/5">
                    <p className="text-white/50 uppercase tracking-widest text-sm">No tienes mensajes de clientes todavía.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {(leads || []).map((lead: any) => (
                      <div key={lead.id} className={`bg-[#162439] p-6 rounded-2xl border transition-all shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${lead?.status === 'Nuevo' ? 'border-sierra-gold/30' : 'border-white/5'}`}>
                        <div className="flex gap-6 items-center w-full md:w-auto">
                          <div className="w-14 h-14 rounded-full bg-[#111C2D] border border-white/10 flex items-center justify-center text-sierra-gold font-bold text-xl uppercase shrink-0">
                            {lead?.name ? lead.name.substring(0,2) : 'CA'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="text-xl font-bold">{lead?.name || 'Cliente Anónimo'}</h4>
                              <span className={`text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full ${lead?.status === 'Nuevo' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                                {lead?.status || 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-white/80 font-mono mb-2">
                              {lead?.email || ''} {(lead?.email && lead?.phone) ? ' • ' : ''} {lead?.phone || ''}
                            </p>
                            <p className="text-sm text-white/50 mb-3">Interés: <span className="text-white font-bold">{lead?.car_title || 'N/A'}</span></p>
                            {lead?.message && (
                              <div className="bg-[#111C2D] p-4 rounded-xl border border-white/5 mt-2">
                                <p className="text-sm text-white/70 italic">"{lead.message}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-left md:text-right flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{lead?.created_at ? new Date(lead.created_at).toLocaleDateString() : ''}</p>
                          {lead?.status === 'Nuevo' && (
                            <button onClick={() => updateLeadStatus(lead.id, 'Contactado')} className="px-6 py-3 bg-sierra-gold text-black hover:bg-white rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">Marcar Contactado</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  const exactMatches = inventory.filter((car: any) => {
    if (car.status === 'Vendido') return false;
    const matchBrand = selectedBrand ? car?.brand?.toLowerCase() === selectedBrand : true;
    const matchModel = selectedModel ? car?.model?.toLowerCase() === selectedModel : true;
    const matchPrice = (car?.price || 0) <= currentPrice;
    return matchBrand && matchModel && matchPrice;
  });

  const otherCars = inventory.filter((car: any) => {
    if (car.status === 'Vendido') return false;
    if (exactMatches.some(e => e.id === car.id)) return false;
    if (selectedBrand && car?.brand?.toLowerCase() === selectedBrand) return true;
    const isSimilarPrice = car?.price >= currentPrice * 0.75 && car?.price <= currentPrice * 1.25;
    if (isSimilarPrice) return true;
    return false;
  });

  // ==========================================
  // VISTA PÚBLICA (CLIENTES)
  // ==========================================
  return (
    <main className="bg-[#111C2D] text-white font-sans min-h-screen relative">
      <header className="fixed top-0 left-0 w-full z-[60] bg-[#111C2D]/70 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center">
        <div className="absolute left-6 top-[55%] -translate-y-1/2 z-[61] cursor-pointer" onClick={() => scrollToSection('top')}>
         <img src="/logo.svg" alt="Sierra Apex Group" className="h-[200px] object-contain drop-shadow-2xl" onError={(e) => { e.currentTarget.style.display = 'none'; document.getElementById('fallback-logo')!.style.display = 'flex'; }} />
          <div id="fallback-logo" className="hidden text-xl font-bold tracking-widest uppercase items-center gap-2"><span className="text-white">SIERRA</span><span className="text-sierra-gold">APEX GROUP</span></div>
        </div>
        <div className="flex-1"></div>
        <div className="flex gap-6 items-center text-xs md:text-sm uppercase tracking-widest text-white/60 relative z-[60] font-bold">
          <span onClick={() => scrollToSection('inventario')} className="hover:text-white cursor-pointer transition-colors">{t.navInventory}</span>
          <span onClick={() => scrollToSection('testimonios')} className="hover:text-white cursor-pointer transition-colors">{t.navReviews}</span>
          
          {/* BOTÓN IDIOMA */}
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors text-white">
            <span className={lang === 'en' ? 'text-sierra-gold' : 'text-white/40'}>EN</span>
            <span className="text-white/20">|</span>
            <span className={lang === 'es' ? 'text-sierra-gold' : 'text-white/40'}>ES</span>
          </button>
          
          <button onClick={() => setIsStaffMode(true)} className="px-4 py-2 border border-white/10 hover:border-sierra-gold hover:text-white rounded transition-all">{t.navStaff}</button>
        </div>
      </header>

      <section className="relative w-full h-screen flex flex-col justify-between">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#111C2D]">
          <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=3000&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111C2D]/40 via-[#111C2D]/60 to-[#111C2D]"></div>
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] text-center pointer-events-none select-none">
            <h1 className="text-[7.5vw] md:text-[8vw] font-black uppercase text-white opacity-[0.03] tracking-normal whitespace-nowrap">SIERRA APEX GROUP</h1>
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="relative z-10 text-center px-4 pt-16">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12 uppercase drop-shadow-2xl">{t.heroTitle}</h1>
          <button onClick={() => scrollToSection('inventario')} className="px-10 py-5 border border-white/40 text-white hover:bg-sierra-gold hover:text-black hover:border-sierra-gold transition-all duration-500 rounded-full uppercase tracking-[0.2em] text-sm font-bold backdrop-blur-sm shadow-2xl">{t.heroBtn}</button>
        </div>
        <div className="relative z-10 flex-1 flex items-end justify-center pb-8 px-6">
          <div className="max-w-3xl text-center">
            <h2 className="text-xs md:text-sm tracking-[0.4em] text-sierra-gold mb-4 uppercase font-bold drop-shadow-md">{t.standardTitle}</h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90 italic">{t.standardDesc}</p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN INTEGRADA DE INVENTARIO Y BUSCADOR --- */}
      <section id="inventario" className="pt-16 pb-12 px-6 bg-[#111C2D] min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-2">
            <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white uppercase">{t.collectionTitle1} <span className="font-bold text-sierra-gold">{t.collectionTitle2}</span></h3>
            <div className="flex items-center gap-4">
              {searchActive && (
                <button onClick={handleClearSearch} className="text-xs text-white/50 hover:text-white uppercase tracking-widest border border-white/10 hover:border-white/30 px-4 py-2 font-bold rounded transition-all">{t.viewAll}</button>
              )}
              <span className="text-xs text-white/50 tracking-[0.3em] font-bold uppercase">{inventory.filter(c => c.status !== 'Vendido').length} {t.available}</span>
            </div>
          </div>

          <div className="mb-8 bg-[#111C2D]/60 p-6 md:p-8 rounded-2xl backdrop-blur-3xl border border-white/10 shadow-lg relative z-20">
            <div className="mb-4"><h4 className="text-xs text-sierra-gold uppercase tracking-[0.4em] font-bold">{t.advSearch}</h4></div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-end w-full">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full md:w-auto">
                <div className="flex flex-col w-full md:w-auto">
                  <label className="text-xs text-white/60 font-bold uppercase tracking-[0.2em] mb-2 ml-1">{t.make}</label>
                  <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(''); }} className="bg-transparent border-b border-white/20 p-2 text-base focus:border-sierra-gold outline-none text-white cursor-pointer w-full md:w-40 transition-all">
                    <option value="" className="bg-[#111C2D]">{t.all}</option>
                    {availableBrands.map((brand: any) => (<option key={brand} value={brand?.toLowerCase()} className="bg-[#111C2D]">{brand}</option>))}
                  </select>
                </div>
                <div className="flex flex-col w-full md:w-auto">
                  <label className="text-xs text-white/60 font-bold uppercase tracking-[0.2em] mb-2 ml-1">{t.model}</label>
                  <select disabled={!selectedBrand} value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className={`bg-transparent border-b p-2 text-base outline-none text-white w-full md:w-40 transition-all ${!selectedBrand ? 'border-white/5 text-white/20 cursor-not-allowed' : 'border-white/20 focus:border-sierra-gold cursor-pointer'}`}>
                    <option value="" className="bg-[#111C2D]">{!selectedBrand ? t.select : t.all}</option>
                    {availableModels.map((model: any) => (<option key={model} value={model?.toLowerCase()} className="bg-[#111C2D]">{model}</option>))}
                  </select>
                </div>
                <div className="flex flex-col w-full md:w-auto">
                  <span className="text-xs text-white/80 uppercase tracking-widest mb-3 ml-1">{t.maxBudget}: <span className="text-sierra-gold font-bold">${(currentPrice || 0).toLocaleString()}</span></span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40 font-bold">${(minInventoryPrice || 0).toLocaleString()}</span>
                    <input type="range" min={minInventoryPrice} max={maxInventoryPrice} value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} className="accent-sierra-gold cursor-pointer w-full md:w-48" />
                    <span className="text-xs text-white/40 font-bold">${(maxInventoryPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleSearch} className="w-full md:w-auto px-10 py-4 bg-sierra-gold text-black font-bold rounded-xl hover:bg-white transition-all duration-500 uppercase tracking-widest text-xs shadow-lg">{t.searchBtn}</button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-20 text-center text-white/50 uppercase font-bold tracking-widest text-sm">{t.loading}</div>
          ) : inventory.length === 0 ? (
            <div className="p-20 text-center bg-white/5 rounded-2xl border border-white/5">
              <p className="text-white/50 uppercase font-bold tracking-widest text-sm">{t.preparing}</p>
            </div>
          ) : searchActive ? (
            <div className="animate-in fade-in duration-700">
              {exactMatches.length > 0 ? (
                <div className="mb-16">
                  <h4 className="text-sierra-gold font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-sm">
                    <span className="w-3 h-3 rounded-full bg-sierra-gold animate-pulse"></span> {t.exactMatches}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exactMatches.map((car: any) => renderCarCard(car, true))}
                  </div>
                </div>
              ) : (
                <div className="mb-16 bg-[#162439] border border-white/5 p-10 rounded-2xl text-center shadow-lg">
                  <h4 className="text-white font-bold uppercase tracking-widest mb-3 text-lg">{t.noMatchesTitle}</h4>
                  <p className="text-white/60 text-base">{t.noMatchesDesc}</p>
                </div>
              )}

              {otherCars.length > 0 && (
                <div>
                  <h4 className="text-white/60 font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-sm">{t.exploreOthers}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80 hover:opacity-100 transition-all duration-500">
                    {otherCars.map((car: any) => renderCarCard(car, false))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
              {inventory.map((car: any) => renderCarCard(car, false))}
            </div>
          )}
        </div>
      </section>

      {/* --- SECCIÓN TESTIMONIOS: CARRUSEL AUTOMÁTICO --- */}
      <section id="testimonios" className="py-24 px-6 bg-[#131F33] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-sm font-bold text-sierra-gold uppercase tracking-[0.4em] mb-4">{t.experiencesTitle}</h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 uppercase tracking-tighter">{t.voicesTitle}</h2>
          
          <div className="relative w-full max-w-4xl mx-auto mb-16">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out" 
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonio: any) => (
                  <div key={testimonio.id} className="min-w-full px-4">
                    <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/5 backdrop-blur-sm mx-auto shadow-2xl">
                      <div className="flex justify-center text-sierra-gold mb-6 text-xl">{[...Array(testimonio.rating)].map((_, i) => <span key={i}>★</span>)}</div>
                      <p className="text-xl md:text-3xl text-white/90 italic font-light mb-8 leading-relaxed">"{testimonio.comment}"</p>
                      <div className="flex flex-col items-center">
                        <span className="text-base font-bold uppercase tracking-widest text-white">{testimonio.name}</span>
                        <span className="text-xs text-white/40 font-bold uppercase tracking-widest mt-2">{testimonio.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentTestimonial === idx ? 'w-10 bg-sierra-gold' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>
          
          <button onClick={() => setShowReviewModal(true)} className="px-10 py-4 border border-sierra-gold/40 text-sierra-gold hover:bg-sierra-gold hover:text-black transition-all duration-300 rounded-full uppercase tracking-widest text-xs font-bold shadow-lg">{t.shareReviewBtn}</button>
        </div>
      </section>

      <footer className="bg-[#0B1320] border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative">
            <div className="col-span-1 md:col-span-1 flex flex-col justify-start">
              <div className="text-3xl font-bold tracking-widest uppercase mb-6 drop-shadow-md"><span className="text-white">SIERRA</span><br/><span className="text-sierra-gold">APEX GROUP</span></div>
              <p className="text-base text-white/60 leading-relaxed font-light">{t.redefining}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-sierra-gold mb-6">{t.directContact}</h4>
              <ul className="space-y-5 text-base font-light text-white/80">
                <li className="flex flex-col"><span className="text-xs uppercase text-white/40 tracking-widest mb-1 font-bold">CEO</span><span className="text-white">Reiniel Hernandez Sierra</span></li>
                <li className="flex flex-col"><span className="text-xs uppercase text-white/40 tracking-widest mb-1 font-bold">Phone</span><a href="tel:7868506179" className="hover:text-sierra-gold transition-colors">786.850.6179</a></li>
                <li className="flex flex-col"><span className="text-xs uppercase text-white/40 tracking-widest mb-1 font-bold">Email</span><a href="mailto:Reiniel@sierraapexgroup.com" className="hover:text-sierra-gold transition-colors">Reiniel@sierraapexgroup.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-sierra-gold mb-6">{t.hoursTitle}</h4>
              <ul className="space-y-5 text-base font-light text-white/80">
                <li className="flex justify-between border-b border-white/10 pb-3"><span>{t.monSat}</span><span className="text-white font-bold">8:00 AM - 5:00 PM</span></li>
                <li className="pt-3"><p className="text-sm leading-relaxed italic text-white/50">{t.apptOnly}</p></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-sierra-gold mb-6">{t.followUs}</h4>
              <div className="flex gap-4 mb-8">
                <a href="https://www.instagram.com/sierraapexgroup/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-sierra-gold hover:text-sierra-gold cursor-pointer transition-all font-bold text-white decoration-transparent">IG</a>
                <div onClick={() => alert(lang === 'es' ? 'Estamos trabajando en nuestras redes sociales. ¡Regresa más tarde!' : 'We are working on our social networks. Please check back later!')} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-sierra-gold hover:text-sierra-gold cursor-pointer transition-all font-bold">FB</div>
                <div onClick={() => alert(lang === 'es' ? 'Estamos trabajando en nuestras redes sociales. ¡Regresa más tarde!' : 'We are working on our social networks. Please check back later!')} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-sierra-gold hover:text-sierra-gold cursor-pointer transition-all font-bold">LI</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-white/40 font-bold">{t.rights}</p>
            <div className="flex gap-6 text-xs uppercase tracking-widest text-white/40 font-bold">
              <span onClick={() => setShowLegal('privacy')} className="hover:text-white cursor-pointer transition-colors">{lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}</span>
              <span onClick={() => setShowLegal('terms')} className="hover:text-white cursor-pointer transition-colors">{lang === 'es' ? 'Términos de Servicio' : 'Terms of Service'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODAL DE OPINIONES --- */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#162439] border border-white/10 p-10 rounded-3xl max-w-md w-full relative animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-6 right-6 text-white/40 hover:text-white text-xl">✕</button>
            <h3 className="text-3xl font-bold mb-3 uppercase tracking-tighter text-sierra-gold">Su Opinión</h3>
            <p className="text-sm text-white/60 mb-8">La reseña será publicada tras la aprobación del administrador.</p>
            <div className="space-y-5">
              <input type="text" placeholder="Nombre (Anónimo opcional)" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-base text-white outline-none focus:border-sierra-gold transition-all" />
              <div className="flex gap-3 justify-center py-3">
                {[1,2,3,4,5].map((star: number) => <button key={star} className="text-3xl text-white/20 hover:text-sierra-gold transition-colors">★</button>)}
              </div>
              <textarea rows={4} placeholder="Experiencia..." className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-base text-white outline-none focus:border-sierra-gold transition-all resize-none"></textarea>
              <button className="w-full py-5 bg-sierra-gold text-black font-bold rounded-xl uppercase text-xs tracking-widest shadow-lg">Enviar para aprobación</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLES DEL AUTO + FORMULARIO LEAD */}
      {selectedCar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-[#111C2D]/95 backdrop-blur-md transition-all">
          <div className="absolute inset-0" onClick={() => setSelectedCar(null)}></div>
          <div className="relative w-full max-w-5xl bg-[#162439] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedCar(null)} className="absolute top-6 right-6 z-20 text-white/60 hover:text-white transition-colors bg-black/60 w-10 h-10 rounded-full flex items-center justify-center text-lg">✕</button>
            
            <div className="w-full md:w-3/5 h-64 md:h-auto relative flex flex-col bg-black group">
              <div className="flex-1 relative w-full h-[300px] md:h-full">
                <img 
                  src={selectedCar?.images && selectedCar.images.length > 0 ? selectedCar.images[activePublicImageIndex] : (selectedCar?.image || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop')} 
                  alt={selectedCar?.brand || 'Auto'} 
                  className="w-full h-full object-contain bg-[#050B14]" 
                />

                {selectedCar?.status === 'Vendido' && (
                  <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
                    <span className="border-4 border-red-500/80 text-red-500/80 px-6 py-2 text-3xl md:text-5xl font-black uppercase tracking-[0.4em] -rotate-12 shadow-2xl">{t.soldBadge}</span>
                  </div>
                )}

                {selectedCar?.images && selectedCar.images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setActivePublicImageIndex(prev => prev > 0 ? prev - 1 : selectedCar.images.length - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/80 text-white/60 hover:text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setActivePublicImageIndex(prev => prev < selectedCar.images.length - 1 ? prev + 1 : 0); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/80 text-white/60 hover:text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 opacity-0 group-hover:opacity-100">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </>
                )}
              </div>
              
              {selectedCar?.images && selectedCar.images.length > 1 && (
                <div className="h-28 bg-[#0B1320] flex gap-3 overflow-x-auto p-4 snap-x hide-scrollbar border-t border-white/5">
                  {selectedCar.images.map((url: any, idx: number) => (
                    <img key={idx} src={url} onClick={() => setActivePublicImageIndex(idx)} className={`h-full w-28 object-cover cursor-pointer rounded-lg shrink-0 snap-start border-2 transition-all ${activePublicImageIndex === idx ? 'border-sierra-gold opacity-100' : 'border-transparent opacity-40 hover:opacity-80'}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-2/5 p-10 flex flex-col justify-center bg-[#162439] overflow-y-auto">
              {!showLeadForm ? (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2 uppercase leading-none">{selectedCar?.year || ''} {selectedCar?.brand || ''}</h2>
                  <h3 className="text-xl md:text-2xl font-light text-white/60 mb-8 uppercase tracking-widest">{selectedCar?.model || ''} {selectedCar?.trim || ''}</h3>
                  
                  <div className="flex justify-between items-end mb-8">
                    <div><span className="text-xs text-white/50 uppercase font-bold tracking-widest block mb-2">{t.price}</span><span className="text-4xl font-bold text-sierra-gold">${(selectedCar?.price || 0).toLocaleString()}</span></div>
                    <div className="text-right"><span className="text-xs text-white/50 uppercase font-bold tracking-widest block mb-2">{t.mileage}</span><span className="text-2xl text-white/90 font-light">{selectedCar?.miles || 0} mi</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-base text-white/80 mb-10 border-t border-b border-white/10 py-8">
                    <div><span className="text-white/50 text-xs uppercase font-bold tracking-widest block mb-1">VIN</span>{selectedCar?.vin || 'N/A'}</div>
                    <div><span className="text-white/50 text-xs uppercase font-bold tracking-widest block mb-1">Trim</span>{selectedCar?.trim || 'N/A'}</div>
                    <div><span className="text-white/50 text-xs uppercase font-bold tracking-widest block mb-1">{t.engine}</span>{selectedCar?.engine || 'N/A'}</div>
                    <div><span className="text-white/50 text-xs uppercase font-bold tracking-widest block mb-1">{t.transmission}</span>{selectedCar?.transmission || 'N/A'}</div>
                    <div><span className="text-white/50 text-xs uppercase font-bold tracking-widest block mb-1">{t.extColor}</span>{selectedCar?.color || 'N/A'}</div>
                    <div><span className="text-white/50 text-xs uppercase font-bold tracking-widest block mb-1">{t.intColor}</span>{selectedCar?.interior_color || 'N/A'}</div>
                  </div>

                  <div className="mb-10"><p className="text-base font-light text-white/60 leading-relaxed italic">"{selectedCar?.description || t.descriptionQuote}"</p></div>
                  
                  {selectedCar?.status === 'Vendido' ? (
                    <button disabled className="w-full py-5 bg-black/50 border border-red-500/50 text-red-500/80 font-bold rounded-xl uppercase tracking-widest text-sm cursor-not-allowed">{t.vehicleSoldBtn}</button>
                  ) : (
                    <button onClick={() => setShowLeadForm(true)} className="w-full py-5 bg-sierra-gold text-black font-bold rounded-xl hover:bg-white transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)]">{t.reqDetailsBtn}</button>
                  )}
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-left-4">
                  <button onClick={() => setShowLeadForm(false)} className="text-sierra-gold text-xs uppercase font-bold tracking-[0.2em] mb-8 hover:text-white">{t.goBack}</button>
                  <h3 className="text-3xl font-bold text-white mb-6">{t.interestIn} {selectedCar?.brand || 'Auto'}</h3>
                  <div className="space-y-5">
                    <input type="text" placeholder={t.yourName} value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-base text-white outline-none focus:border-sierra-gold transition-colors" />
                    <div className="flex flex-col md:flex-row gap-5">
                      <input type="email" placeholder={t.email} value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-base text-white outline-none focus:border-sierra-gold transition-colors" />
                      <input type="tel" placeholder={t.phone} value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-base text-white outline-none focus:border-sierra-gold transition-colors" />
                    </div>
                    <textarea rows={4} placeholder={t.specialReq} value={leadForm.message} onChange={(e) => setLeadForm({...leadForm, message: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-base text-white outline-none focus:border-sierra-gold resize-none transition-colors" />
                    <button onClick={handleLeadSubmit} disabled={isSubmittingLead} className={`w-full py-5 font-bold rounded-xl uppercase tracking-widest text-sm transition-all ${isSubmittingLead ? 'bg-sierra-gold/50 text-black/50 cursor-wait' : 'bg-sierra-gold text-black hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.3)]'}`}>{isSubmittingLead ? t.sending : t.confirmInterest}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHATBOT */}
      <button onClick={() => setIsChatOpen(true)} className={`fixed bottom-8 right-8 z-[90] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 ${isChatOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'} ${isScrolled ? 'bg-sierra-gold shadow-2xl border-none' : 'bg-[#111C2D]/60 backdrop-blur-md border border-white/10 shadow-lg hover:bg-sierra-gold hover:border-sierra-gold'}`}>
        <img src="/logo-vertical.svg" alt="Asistente Sierra Apex" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; document.getElementById('fallback-chat-icon')!.style.display = 'block'; }} />
        <svg id="fallback-chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-8 h-8 hidden ${isScrolled ? 'text-black' : 'text-sierra-gold'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </button>

      {/* VENTANA CHAT */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 z-[100] w-[380px] bg-[#162439] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-[#111C2D] px-6 py-5 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-sierra-gold animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-sierra-gold">Asistente AI</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white transition-colors text-xl">✕</button>
          </div>
          <div className="p-6 h-[350px] overflow-y-auto flex flex-col gap-4">
            <div className="bg-white/5 rounded-2xl rounded-tl-none p-5 w-[85%] border border-white/5">
              <p className="text-base font-light text-white/90 leading-relaxed">Hola. Soy el asistente virtual de Sierra Apex Group. ¿En qué te puedo ayudar hoy?</p>
              <div className="mt-4 text-xs text-sierra-gold/50 uppercase font-bold tracking-widest italic border-t border-white/10 pt-3">(Pronto estaré conectado a la IA)</div>
            </div>
          </div>
          <div className="p-5 border-t border-white/10 bg-[#111C2D]">
            <div className="relative">
              <input type="text" placeholder="Escribe tu mensaje..." className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-5 pr-14 text-sm text-white outline-none focus:border-sierra-gold transition-all" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sierra-gold rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL LEGAL (BLINDAJE DE TÍTULO REBUILT) --- */}
      {showLegal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-[#162439] border border-white/10 p-8 md:p-12 rounded-3xl max-w-3xl w-full max-h-[80vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-300 shadow-2xl text-white">
            <button onClick={() => setShowLegal(null)} className="absolute top-6 right-6 text-white/40 hover:text-white text-2xl font-bold">✕</button>
            
            {showLegal === 'terms' ? (
              <div className="space-y-6 text-sm md:text-base font-light leading-relaxed">
                <h2 className="text-2xl font-bold text-sierra-gold uppercase tracking-tighter mb-4">
                  {lang === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
                </h2>
                
                <div className="bg-red-500/10 border-l-4 border-sierra-gold p-4 mb-6">
                  <h3 className="font-bold text-sierra-gold uppercase mb-2">
                    {lang === 'es' ? 'Aviso Importante: Títulos Reconstruidos (Rebuilt)' : 'Important Notice: Rebuilt Titles'}
                  </h3>
                  <p>
                    {lang === 'es' 
                      ? 'Sierra Apex Group LLC informa que ciertos vehículos en nuestro inventario poseen un Título Reconstruido (Rebuilt Title). Estos vehículos han sido inspeccionados y certificados por el Estado de Florida.' 
                      : 'Sierra Apex Group LLC informs that certain vehicles in our inventory hold a Rebuilt Title. These vehicles have been inspected and certified by the State of Florida.'}
                  </p>
                  <p className="mt-2 font-bold italic">
                    {lang === 'es'
                      ? 'TODO vehículo Rebuilt se identifica físicamente con el STICKER DE INSPECCIÓN oficial ubicado en el marco de la puerta del conductor (door jamb). La presencia de dicho sticker constituye notificación legal y plena.'
                      : 'EVERY Rebuilt vehicle is physically identified by the official INSPECTION STICKER located on the driver side door jamb. The presence of this sticker constitutes full and legal notification.'}
                  </p>
                </div>

                <p><strong>1. {lang === 'es' ? 'Condición de Venta' : 'Sale Condition'}:</strong> {lang === 'es' ? 'Todos los vehículos se venden "AS-IS" (Tal cual), sin garantías expresas o implícitas.' : 'All vehicles are sold "AS-IS", without any express or implied warranties.'}</p>
                <p><strong>2. {lang === 'es' ? 'Jurisdicción' : 'Jurisdiction'}:</strong> {lang === 'es' ? 'Cualquier disputa legal será resuelta bajo las leyes del Estado de Florida.' : 'Any legal dispute will be resolved under the laws of the State of Florida.'}</p>
              </div>
            ) : (
              <div className="space-y-6 text-sm md:text-base font-light leading-relaxed">
                <h2 className="text-2xl font-bold text-sierra-gold uppercase tracking-tighter mb-4">
                  {lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                </h2>
                <p>{lang === 'es' 
                  ? 'En Sierra Apex Group LLC, su privacidad es primordial. La información recolectada en nuestros formularios se utiliza exclusivamente para la gestión de su interés de compra.' 
                  : 'At Sierra Apex Group LLC, your privacy is paramount. Information collected in our forms is used exclusively to manage your purchase interest.'}</p>
                <p><strong>{lang === 'es' ? 'No Divulgación' : 'No Disclosure'}:</strong> {lang === 'es' ? 'No vendemos ni compartimos sus datos personales con terceros para fines de marketing masivo.' : 'We do not sell or share your personal data with third parties for mass marketing purposes.'}</p>
              </div>
            )}
            
            <button onClick={() => setShowLegal(null)} className="mt-10 w-full py-4 bg-sierra-gold text-black font-bold rounded-xl uppercase text-xs tracking-widest hover:bg-white transition-all">
              {lang === 'es' ? 'Entendido y Cerrar' : 'Understood & Close'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}