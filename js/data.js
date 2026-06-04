// Default seed data for Laptop Tech Hub
const DEFAULT_POSTS = [
  // Softwares
  {
    id: "soft-1",
    category: "softwares",
    title: "NeoProgrammer V2.2.0.10",
    description: "The most popular, lightweight, and stable software for CH341A and other USB programmers. Supports reading, writing, and erasing EEPROM/Flash chips (24xx, 25xx series) with automatic chip detection and verification.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    link: "https://neoprogrammer.com",
    downloadLink: "https://github.com/ch341a/neoprogrammer/releases",
    createdAt: "2026-05-10T12:00:00Z",
    metadata: {
      version: "2.2.0.10",
      fileSize: "3.2 MB",
      os: "Windows 7/8/10/11"
    }
  },
  {
    id: "soft-2",
    category: "softwares",
    title: "BoardViewer V2.0.1.9",
    description: "Essential software for laptop repair technicians. Used to open Boardview files (.asc, .bdv, .brd, .bv, .cad, .cst, .gr, .f2b, and more). Allows tracking pins, signals, and trace paths across complex multi-layer PCBs.",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80",
    link: "http://boardviewer.net",
    downloadLink: "http://boardviewer.net/downloads/boardviewer_setup.exe",
    createdAt: "2026-05-12T08:30:00Z",
    metadata: {
      version: "2.0.1.9",
      fileSize: "1.8 MB",
      os: "Windows XP/7/8/10/11"
    }
  },
  {
    id: "soft-3",
    category: "softwares",
    title: "Intel Easy Clean ME (FIT Engine)",
    description: "Intel Management Engine (ME) cleaner tool. Essential for laptop BIOS repair when solving issues like 30-minute shutdown, delayed display, full fan speed, or motherboard exchange boot hangs.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    link: "https://www.intel.com",
    downloadLink: "#",
    createdAt: "2026-05-15T15:45:00Z",
    metadata: {
      version: "V11.0 & V12.0",
      fileSize: "15.4 MB",
      os: "Windows 10/11"
    }
  },

  // Laptop BIOS
  {
    id: "bios-1",
    category: "laptop-bios",
    title: "HP EliteBook 840 G3 Working BIOS Bin File",
    description: "Tested and verified 100% working motherboard BIOS dump for HP EliteBook 840 G3. Cleaned ME engine region, solves slow display boot delay, boot loop, and fan spinning at maximum speed.",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80",
    link: "#",
    downloadLink: "https://example.com/downloads/hp-840-g3-bios.bin",
    createdAt: "2026-05-18T10:00:00Z",
    metadata: {
      motherboard: "6050A2723701-A02",
      biosSize: "16 MB",
      cpuGen: "Intel Skylake 6th Gen",
      chipModel: "W25Q128FV"
    }
  },
  {
    id: "bios-2",
    category: "laptop-bios",
    title: "Dell Latitude 5480 Clear ME BIOS Dump",
    description: "Tested dump for Dell Latitude 5480. ME region cleared using Intel FIT tool. Ready for programming. Fixed issues where laptop turns on with orange/white flashing light code.",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    link: "#",
    downloadLink: "https://example.com/downloads/dell-5480-bios.bin",
    createdAt: "2026-05-20T14:20:00Z",
    metadata: {
      motherboard: "LA-E081P Rev: 1.0",
      biosSize: "16 MB (Main) + 8 MB (EC)",
      cpuGen: "Intel Kaby Lake 7th Gen",
      chipModel: "GD25B128C / GD25Q64C"
    }
  },
  {
    id: "bios-3",
    category: "laptop-bios",
    title: "Lenovo ThinkPad T480 Dual BIOS Bin",
    description: "Factory clear verified working dual BIOS dump (Main 16MB + EC 128KB) for ThinkPad T480. Fixes Thunderbolt chip firmware brick issue and no-power state.",
    image: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=600&q=80",
    link: "#",
    downloadLink: "https://example.com/downloads/thinkpad-t480-bios.zip",
    createdAt: "2026-05-21T09:15:00Z",
    metadata: {
      motherboard: "ET480 NM-B501",
      biosSize: "16 MB + 128 KB",
      cpuGen: "Intel Kaby Lake R 8th Gen",
      chipModel: "MX25L12873F"
    }
  },

  // Laptop Schematics
  {
    id: "schem-1",
    category: "laptop-schematics",
    title: "Dell Inspiron 15-3521 Schematic Diagram PDF",
    description: "Full circuit schematic diagram for Dell Inspiron 15 (3521 / 5521) laptop. Extremely helpful for trace repair, measuring power rail voltages (3.3V/5V ALW, 1.05V ME, VCC_CORE), and diagnosing short circuits.",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    link: "#",
    downloadLink: "https://example.com/schematics/dell-la-9104p.pdf",
    createdAt: "2026-05-11T16:00:00Z",
    metadata: {
      boardModel: "LA-9104P Rev 1.0",
      fileType: "PDF Document",
      pages: "49 Pages",
      fileSize: "1.4 MB"
    }
  },
  {
    id: "schem-2",
    category: "laptop-schematics",
    title: "MacBook Pro Retina A1708 Schematic & Boardview",
    description: "Official Apple schematic circuit diagram and corresponding .brd boardview file for MacBook Pro Retina 13-inch A1708 (Late 2016 - Mid 2017). Necessary for charging chip CD3215 diagnostics and logic board repairs.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    link: "#",
    downloadLink: "https://example.com/schematics/macbook-a1708.zip",
    createdAt: "2026-05-19T11:10:00Z",
    metadata: {
      boardModel: "820-00840-A",
      fileType: "PDF + BRD (ZIP)",
      pages: "68 Pages",
      fileSize: "4.8 MB"
    }
  },

  // Online Shop
  {
    id: "shop-1",
    category: "online-shop",
    title: "RT809H EMMC NAND Universal Programmer",
    description: "High-speed universal programmer for computer technicians. Supports EMMC, NAND, NOR, SPI, MCU, and laptop EC chips (KB9012, IT8586, NPCE288). Includes rich adapter suite (SOP8, TSOP48, BGA).",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80"
    ],
    link: "#",
    downloadLink: "#",
    createdAt: "2026-05-22T10:00:00Z",
    price: "$179.00",
    metadata: {
      warranty: "1 Year Manufacturer",
      condition: "Brand New",
      stock: "In Stock"
    }
  },
  {
    id: "shop-2",
    category: "online-shop",
    title: "CH341A Pro USB Programmer with SOP8 Clip",
    description: "Crucial entry-level tool for BIOS and EEPROM flashing. Kit includes CH341A USB Board, SOP8 test clip, 1.8V adapter (for modern low-voltage BIOS chips), and SOP8 to DIP8 breakout boards.",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
    ],
    link: "#",
    downloadLink: "#",
    createdAt: "2026-05-22T11:30:00Z",
    price: "$12.50",
    metadata: {
      warranty: "6 Months Seller",
      condition: "Brand New",
      stock: "In Stock"
    }
  },
  {
    id: "shop-3",
    category: "online-shop",
    title: "Mechanic Solder Mask Green UV Ink & Light Kit",
    description: "UV-curing solder mask ink for repairing scratched PCB traces, masking jumper wires, or insulating repaired pads. Package includes 10cc green syringe, needle tips, and a portable UV curing light.",
    image: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
    ],
    link: "#",
    downloadLink: "#",
    createdAt: "2026-05-22T15:00:00Z",
    price: "$8.00",
    metadata: {
      warranty: "No Warranty",
      condition: "Brand New",
      stock: "24 Units Available"
    }
  }
];

// Default contact submissions for admin logs
const DEFAULT_MESSAGES = [
  {
    id: "msg-1",
    name: "Sunil Perera",
    email: "sunil.repair@gmail.com",
    subject: "BIOS Request for Asus X515JA",
    message: "Hi, do you have a working BIOS bin file for Asus X515JA motherboard X515JA Rev 2.0? The CPU is Intel 10th Gen. The client's laptop has a BIOS corruption issue.",
    createdAt: "2026-05-22T14:30:00Z"
  },
  {
    id: "msg-2",
    name: "TechFix Solutions",
    email: "info@techfix.lk",
    subject: "Bulk Purchase of CH341A Kits",
    message: "Hi Admin! I am looking to purchase 5 sets of the CH341A USB Programmer with SOP8 Clip for our trainees. Is there any wholesale discount available? Thank you.",
    createdAt: "2026-05-23T01:10:00Z"
  }
];
