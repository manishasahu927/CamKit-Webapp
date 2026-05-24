const PRODUCTS = [
  {
    id: 'canon-eos-200d',
    name: 'Canon EOS 200D',
    category: 'cameras',
    badge: 'DSLR CAMERA',
    image: 'assets/products/Rectangle 129.png',
    price: 'ask for price',
    description: 'Compact 24.2 MP DSLR with Dual Pixel autofocus, vari-angle touchscreen, and full HD video. A great companion for travel and everyday shoots.',
    specs: ['24.2 MP APS-C sensor', 'DIGIC 7 processor', 'Vari-angle touchscreen', 'Wi-Fi + Bluetooth', '1080p Full HD video']
  },
  {
    id: 'canon-eos-80d',
    name: 'Canon EOS 80D',
    category: 'cameras',
    badge: 'DSLR CAMERA',
    image: 'assets/products/Rectangle 128.png',
    price: 'ask for price',
    description: 'Versatile 24.2 MP APS-C DSLR with 45-point all cross-type AF and 1080/60p Full HD video.',
    specs: ['24.2 MP APS-C sensor', '45-point AF system', '7 fps continuous', '1080/60p Full HD', 'Vari-angle touchscreen']
  },
  {
    id: 'sony-fx3',
    name: 'Sony ILME - FX3',
    category: 'cameras',
    badge: 'CINEMA CAMERA',
    image: 'assets/products/Rectangle 86.png',
    price: 'ask for price',
    description: 'Full-frame cinema line camera optimized for video creators. 4K 120p, dual base ISO, active cooling.',
    specs: ['10.2 MP full-frame sensor', '4K 120p / FHD 240p', 'Dual base ISO 800/12800', 'Active cooling fan', 'XLR top handle included']
  },
  {
    id: 'sony-a6400',
    name: 'Sony Alpha ILCE 6400',
    category: 'cameras',
    badge: 'MIRRORLESS CAMERA',
    image: 'assets/products/Rectangle 85.png',
    price: 'ask for price',
    description: 'APS-C mirrorless with real-time eye AF and 4K HDR video. Compact and quick.',
    specs: ['24.2 MP APS-C', 'Real-time Eye AF', '4K HDR video', '11 fps continuous', '180° flip screen']
  },
  {
    id: 'sony-a7s3',
    name: 'Sony Alpha ILCE - 7SM III',
    category: 'cameras',
    badge: 'CINEMA CAMERA',
    image: 'assets/products/Rectangle 87.png',
    price: 'ask for price',
    description: 'Low-light champion full-frame mirrorless designed for video. 4K 120p, S-Cinetone profile.',
    specs: ['12.1 MP full-frame', '4K 120p / FHD 240p', 'Dual native ISO', 'S-Cinetone color', 'Vari-angle screen']
  },
  {
    id: 'nikon-d5600',
    name: 'Nikon D5600',
    category: 'cameras',
    badge: 'DSLR CAMERA',
    image: 'assets/products/Rectangle 88.png',
    price: 'ask for price',
    description: 'APS-C DSLR with vari-angle touchscreen, SnapBridge connectivity and 1080/60p video.',
    specs: ['24.2 MP APS-C', 'EXPEED 4 processor', '39-point AF', 'SnapBridge Bluetooth', 'Vari-angle touchscreen']
  },
  {
    id: 'sony-50mm',
    name: 'Sony FE 50mm F 1.8',
    category: 'lenses',
    badge: 'PRIME LENS',
    image: 'assets/products/50mm.png',
    price: 'ask for price',
    description: 'Lightweight full-frame 50 mm prime with bright F1.8 aperture for portraits and low-light.',
    specs: ['Full-frame E-mount', 'F1.8 max aperture', '7-blade aperture', 'Compact 186 g', 'Smooth bokeh']
  },
  {
    id: 'sony-24-70',
    name: 'Sony FE 24-70mm F 2.8 GM',
    category: 'lenses',
    badge: 'ZOOM LENS',
    image: 'assets/products/24-70.png',
    price: 'ask for price',
    description: 'Pro standard zoom with constant F2.8 aperture, sharp wide open and beautiful bokeh.',
    specs: ['Full-frame E-mount', 'F2.8 constant aperture', 'XA element', 'Dust & moisture sealed', '11-blade aperture']
  },
  {
    id: 'sony-35mm',
    name: 'Sony FE 35mm F 1.4 GM',
    category: 'lenses',
    badge: 'PRIME LENS',
    image: 'assets/products/35mm.png',
    price: 'ask for price',
    description: 'Premium full-frame 35 mm prime ideal for environmental portraits, weddings and reportage.',
    specs: ['F1.4 max aperture', '11-blade aperture', 'Dust & moisture sealed', 'Linear motors', 'Aperture click on/off']
  },
  {
    id: 'sony-24-105',
    name: 'Sony FE 24-105mm F4 G OSS',
    category: 'lenses',
    badge: 'ZOOM LENS',
    image: 'assets/products/24-105.png',
    price: 'ask for price',
    description: 'Versatile full-frame standard zoom with F4 constant aperture and Optical SteadyShot.',
    specs: ['F4 constant aperture', 'Optical SteadyShot', 'Direct Drive SSM motor', 'Dust & moisture sealed', '4 aspherical elements']
  },
  {
    id: 'godox-la200',
    name: 'Godox LA200',
    category: 'lighting',
    badge: 'CONTINUOUS LIGHT',
    image: 'assets/products/Rectangle 105.png',
    price: 'ask for price',
    description: 'High-output 230W bi-color continuous LED light with FX effects, perfect for video and photography in studio.',
    specs: ['230W output', 'Bi-color (2800K-6500K)', 'CRI/TLCI 96+', 'Bowens mount', 'App control via Godox Light']
  },
  {
    id: 'godox-sl200',
    name: 'Godox SL200',
    category: 'lighting',
    badge: 'CONTINUOUS LIGHT',
    image: 'assets/products/Rectangle 103.png',
    price: 'ask for price',
    description: 'Quiet 200W daylight LED for video and photography.',
    specs: ['200W output', 'Daylight 5600K', 'CRI 95+', 'Bowens mount', 'DMX support']
  },
  {
    id: 'godox-ad600',
    name: 'Godox AD600 Pro',
    category: 'lighting',
    badge: 'STUDIO STROBE',
    image: 'assets/products/Rectangle 107.png',
    price: 'ask for price',
    description: 'High-power 600Ws portable strobe with TTL, HSS up to 1/8000s and stable color.',
    specs: ['600Ws output', 'TTL + HSS 1/8000', 'Bowens mount', '32-channel 2.4G', 'Cooling fan']
  },
  {
    id: 'godox-ad200',
    name: 'Godox AD200 Pro',
    category: 'lighting',
    badge: 'POCKET STROBE',
    image: 'assets/products/Rectangle 109.png',
    price: 'ask for price',
    description: 'Pocket-size 200Ws strobe with interchangeable bare bulb and speedlight heads.',
    specs: ['200Ws output', 'Interchangeable heads', 'TTL + HSS', '500 full-power flashes', 'Lithium-ion battery']
  },
  {
    id: 'godox-sk400',
    name: 'Godox SK400',
    category: 'lighting',
    badge: 'STUDIO STROBE',
    image: 'assets/products/Rectangle 110.png',
    price: 'ask for price',
    description: 'Studio monolight with 400Ws output, ideal for product and portrait shoots.',
    specs: ['400Ws output', 'Bowens mount', 'AC powered', 'Built-in optical slave', 'Modeling lamp']
  },
  {
    id: 'godox-v1',
    name: 'Godox V1',
    category: 'lighting',
    badge: 'ON-CAMERA FLASH',
    image: 'assets/products/Rectangle 113.png',
    price: 'ask for price',
    description: 'Round head on-camera flash with magnetic accessories, TTL and HSS support.',
    specs: ['Round head', '76Ws output', 'TTL + HSS', '1.5 sec recycle', 'Lithium battery']
  },
  {
    id: 'godox-lc500r',
    name: 'Godox LC500R',
    category: 'lighting',
    badge: 'RGB TUBE LIGHT',
    image: 'assets/products/Rectangle 114.png',
    price: 'ask for price',
    description: 'Battery-powered RGB tube light with 16 million color combinations and 13 built-in FX modes.',
    specs: ['RGB full-color', 'Built-in battery', '13 lighting effects', 'App control', 'Bi-color 2700K-6500K']
  },
  {
    id: 'godox-studio-kit',
    name: 'Godox Studio Strobe Kit',
    category: 'lighting',
    badge: 'STUDIO KIT',
    image: 'assets/products/Rectangle 124.png',
    price: 'ask for price',
    description: 'Two-light studio strobe kit with softboxes, light stands and a carry bag.',
    specs: ['2 strobe heads', '2 softboxes', '2 light stands', 'Carry bag included', 'Bowens mount']
  },
  {
    id: 'rode-wireless',
    name: 'Rode Wireless Go 2',
    category: 'audio',
    badge: 'WIRELESS MIC',
    image: 'assets/products/Rectangle 127.png',
    price: 'ask for price',
    description: 'Dual-channel ultra-compact wireless mic system with on-board recording and 200 m range.',
    specs: ['Dual transmitters', '200 m range', '7 hr internal recording', 'USB-C audio interface', 'Crystal-clear digital audio']
  },
  {
    id: 'simpex-tripod',
    name: 'Simpex VCT 899 Tripod',
    category: 'other',
    badge: 'TRIPOD',
    image: 'assets/products/Rectangle 121.png',
    price: 'ask for price',
    description: 'Professional video tripod with smooth fluid head, ideal for run-and-gun and studio work.',
    specs: ['Max load 8 kg', 'Height up to 1.8 m', 'Fluid pan-and-tilt head', 'Quick release plate', 'Aluminium build']
  },
  {
    id: 'manfrotto-tripod',
    name: 'Manfrotto Compact Tripod',
    category: 'other',
    badge: 'TRIPOD',
    image: 'assets/products/Manfrotto MKCOMPACTADV-BK Compact Advanced Aluminum Tripod.png',
    price: 'ask for price',
    description: 'Lightweight aluminium tripod for travel and lifestyle photography.',
    specs: ['Max load 3 kg', 'Height up to 1.65 m', '5-section legs', 'Quick release plate', '1.4 kg weight']
  },
  {
    id: 'dji-osmo',
    name: 'DJI Osmo Mobile 8 Gimbal',
    category: 'other',
    badge: 'GIMBAL',
    image: 'assets/products/Rectangle 123.png',
    price: 'ask for price',
    description: 'Smartphone gimbal with ActiveTrack, magnetic phone clamp, and built-in extension rod.',
    specs: ['3-axis stabilization', 'Magnetic clamp', 'Built-in extension rod', 'ActiveTrack 7.0', 'Up to 10 hr battery']
  },
  {
    id: 'backdrop-screen',
    name: 'Professional Backdrop Screen',
    category: 'other',
    badge: 'STUDIO BACKGROUND',
    image: 'assets/products/Rectangle 119.png',
    price: 'ask for price',
    description: 'Heavy-duty backdrop stand with seamless paper or muslin fabric. Suits portrait and product photography.',
    specs: ['Adjustable width up to 3 m', 'Height up to 2.6 m', 'Sturdy crossbar', 'Carry bag included', 'Fabric/paper compatible']
  }
];
