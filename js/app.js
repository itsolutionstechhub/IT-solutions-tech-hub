// Core Application State
let posts = [];
let messages = [];
let currentAdminEditPostId = null;
let currentFormImages = ["", "", "", ""];
let currentActiveSlot = 0;
let previousFeedView = "home"; // Remembers which page to return to from Detail View

// Firebase Auth & Comments State
let auth = null;
let currentUser = null;
let activeDetailedPostId = null;

// Global Site Settings State (Defaults populated before load)
let siteSettings = {
  siteName: "Laptop Tech Hub",
  logoText: "TechHub",
  logoIcon: "fa-solid fa-microchip",
  techNewsLabel: "Tech News",
  repairArticlesLabel: "Repair Articles",
  storeLabel: "Store",
  email: "itsolutionslab23@gmail.com",
  phone: "+94742544138",
  youtubeUrl: "https://www.youtube.com/@itsolutionspro",
  youtubeName: "IT Solutions Pro",
  youtubeDesc: "Sri Lanka's premium tech education brand! We teach motherboard level-3 chip repairing, laptop power sequence trace diagnostics, verified BIOS modifications, and expert troubleshooting workflows. Join thousands of technicians advancing their careers!",
  aboutUs: `<h2>About Laptop Tech Hub</h2>
  <p>Welcome to <strong>Laptop Tech Hub</strong>, the premium online repository and resource directory tailored specifically for motherboard repair engineers, electronics enthusiasts, and IT hardware technicians. Founded in 2026, our platform was engineered to address a persistent challenge in the laptop servicing industry: the lack of verified, clean, and well-organized bios files, motherboard layout schematics, and specialized flashing software utility tools.</p>
  <h2>Our Core Mission</h2>
  <p>We are committed to empowering professional repair workshops and independent motherboard level-3 technicians globally. By providing a central, lightning-fast hub loaded with verified chip dumps, boardview files, and diagnostics systems, we help reduce troubleshooting times, optimize device lifecycle sustainability, and support green repair movements.</p>
  <h2>Why Choose Our Resources?</h2>
  <ul>
    <li><strong>100% Tested Bin Dumps:</strong> Every single BIOS dump uploaded to our repository undergoes hardware test verification to ensure stable post validation and clean ME region state.</li>
    <li><strong>Organized & Searchable:</strong> Find files instantly by motherboard code, CPU platform architecture, or laptop model.</li>
    <li><strong>Expert Sourced:</strong> Our inventory items and tools are handpicked by experienced circuit board analysts.</li>
  </ul>`,
  privacyPolicy: `<h2>Privacy Policy</h2>
  <p>Last updated: June 4, 2026</p>
  <p>At Laptop Tech Hub, accessible from our portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Laptop Tech Hub and how we use it.</p>
  <h2>Log Files</h2>
  <p>Laptop Tech Hub follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
  <h2>Cookies and Web Beacons</h2>
  <p>Like any other website, Laptop Tech Hub uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>`,
  termsConditions: `<h2>Terms & Conditions</h2>
  <p>Last updated: June 4, 2026</p>
  <p>Welcome to Laptop Tech Hub! These terms and conditions outline the rules and regulations for the use of Laptop Tech Hub's Website.</p>
  <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Laptop Tech Hub if you do not agree to take all of the terms and conditions stated on this page.</p>
  <h2>License & File Sharing</h2>
  <p>Unless otherwise stated, Laptop Tech Hub and/or its licensors own the intellectual property rights for all material, BIOS dumps, tools, and technical documents hosted on Laptop Tech Hub. All intellectual property rights are reserved. You may access this from Laptop Tech Hub for your own personal repair and training workshop use subjected to restrictions set in these terms and conditions.</p>
  <p>You must not:</p>
  <ul>
    <li>Republish binary BIOS dumps on competing commercial forums without attribution.</li>
    <li>Sell, rent or sub-license schematic PDF diagrams acquired from this site.</li>
    <li>Reproduce, duplicate or copy diagnostic software source files.</li>
  </ul>`,
  disclaimer: `<h2>Legal Disclaimer</h2>
  <p>Last updated: June 4, 2026</p>
  <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email.</p>
  <h2>Disclaimers for Laptop Tech Hub</h2>
  <p>All the information and downloadable assets on this website - softwares, bios dumps, motherboard schematics, repair equipment details - are published in good faith and for general educational, training, and professional repair purposes only. Laptop Tech Hub does not make any warranties about the completeness, reliability, and precision of these files. <strong>Any action you take upon the information you find on this website is strictly at your own risk.</strong></p>
  <h2>Technical Warning</h2>
  <p style="border-left: 4px solid hsl(var(--danger)); padding-left: 16px; color: hsl(var(--text-primary)); font-weight: 500;">
    WARNING: Flashing incorrect, unverified, or incompatible BIOS bin files, or executing EC firmware modifications can permanently disable or damage hardware chips. Ensure you back up your motherboard's original chip data dump prior to performing any programming operations.
  </p>`,
  // Menu Link Toggles defaults
  showHome: true,
  showNews: true,
  showRepair: true,
  showStore: true,
  showAdmin: true,
  showAbout: true,
  showContact: true,
  showPrivacy: true,
  showTerms: true,
  showDisclaimer: true
};

// Firestore reference
let db = null;
let isFirebaseActive = false;

// Auto carousel sliding interval variable
let autoCarouselInterval = null;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initFirebase();
  initData();
  setupSPARouter();
  setupAdminPortal();
  setupAdminSettings();
  setupContactForm();
  setupLiveSearch();
  setupDetailViewBackBtn();
  setupCommentsForm();
  renderAllData();
  startAutoCarouselLoop();
});

// Initialize Firebase client if configured
function initFirebase() {
  const warningBanner = document.getElementById("firebase-warning-banner");
  if (typeof isFirebaseConfigured === "function" && isFirebaseConfigured()) {
    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();
      isFirebaseActive = true;
      console.log("Firebase Firestore & Auth connected successfully!");
      if (warningBanner) warningBanner.style.display = "none";

      // Listen for Auth changes
      auth.onAuthStateChanged((user) => {
        currentUser = user;
        updateCommentsAuthUI();
      });
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      isFirebaseActive = false;
      if (warningBanner) warningBanner.style.display = "block";
    }
  } else {
    isFirebaseActive = false;
    if (warningBanner) warningBanner.style.display = "block";
    console.warn("Firebase credentials not configured. Running in Local Storage Mode.");
  }
}

// Fetch Initial Data & Listen to real-time changes
function initData() {
  if (isFirebaseActive) {
    // 1. Listen to Site Settings
    db.collection("settings").doc("site").onSnapshot((doc) => {
      if (doc.exists) {
        siteSettings = { ...siteSettings, ...doc.data() };
      } else {
        // Create initial settings document
        db.collection("settings").doc("site").set(siteSettings);
      }
      applySettingsToUI();
    }, (error) => {
      console.error("Failed to read settings from Firestore:", error);
    });

    // 2. Listen to Posts (Realtime updates)
    db.collection("posts").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      posts = [];
      snapshot.forEach(doc => {
        posts.push(doc.data());
      });
      
      // If db is completely empty, populate seed data
      if (posts.length === 0 && typeof DEFAULT_POSTS !== "undefined") {
        console.log("Database empty. Seeding default data to Firestore...");
        uploadSeedData();
      } else {
        renderAllData();
        renderAdminPostsTable();
      }
    }, (error) => {
      console.error("Failed to read posts from Firestore:", error);
      loadLocalFallbackPosts();
    });

    // 3. Listen to Messages
    db.collection("messages").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      messages = [];
      snapshot.forEach(doc => {
        messages.push(doc.data());
      });
      renderAdminMessagesInbox();
    }, (error) => {
      console.error("Failed to read messages from Firestore:", error);
    });

  } else {
    // Local Fallback Mode
    loadLocalFallbackPosts();
    applySettingsToUI();
    renderAllData();
  }
}

// Seeding Firestore helper
function uploadSeedData() {
  if (!isFirebaseActive || typeof DEFAULT_POSTS === "undefined") return;
  
  const batch = db.batch();
  
  // Format legacy categories to fit the 3 new ones: tech-news, repair-articles, store
  const formattedSeeds = DEFAULT_POSTS.map(p => {
    let category = "repair-articles";
    if (p.category === "online-shop") category = "store";
    else if (p.category === "softwares" || p.category === "laptop-bios" || p.category === "laptop-schematics") {
      category = "repair-articles";
    }

    // Remap spec metadata
    const metadata = {};
    if (category === "store") {
      metadata.warranty = p.metadata?.warranty || "1 Year";
      metadata.condition = p.metadata?.condition || "Brand New";
      metadata.stock = p.metadata?.stock || "In Stock";
    } else {
      metadata.board = p.metadata?.motherboard || p.metadata?.boardModel || "N/A";
      metadata.size = p.metadata?.biosSize || p.metadata?.fileSize || "N/A";
      metadata.version = p.metadata?.version || "V1.0";
    }

    return {
      id: p.id,
      category: category,
      title: p.title,
      description: p.description,
      image: p.image || "",
      images: p.images || [p.image || ""],
      link: p.link || "#",
      downloadLink: p.downloadLink || "#",
      price: p.price || "",
      createdAt: p.createdAt || new Date().toISOString(),
      views: Math.floor(Math.random() * 95) + 12, // realistic seeded view counts
      metadata: metadata
    };
  });

  formattedSeeds.forEach(post => {
    const docRef = db.collection("posts").doc(post.id);
    batch.set(docRef, post);
  });

  batch.commit()
    .then(() => {
      console.log("Seeding posts database successful!");
      showToast("Firestore seeded with default data.", "success");
    })
    .catch(err => console.error("Error seeding Firestore database:", err));

  // Seed default messages too
  if (typeof DEFAULT_MESSAGES !== "undefined") {
    DEFAULT_MESSAGES.forEach(msg => {
      db.collection("messages").doc(msg.id).set(msg);
    });
  }
}

// Local storage loading fallback
function loadLocalFallbackPosts() {
  const storedSettings = localStorage.getItem("laptop_tech_settings");
  if (storedSettings) {
    siteSettings = { ...siteSettings, ...JSON.parse(storedSettings) };
  }

  const storedPosts = localStorage.getItem("laptop_tech_posts");
  if (storedPosts) {
    posts = JSON.parse(storedPosts);
  } else if (typeof DEFAULT_POSTS !== "undefined") {
    // Populate seeds locally
    posts = DEFAULT_POSTS.map(p => {
      let category = "repair-articles";
      if (p.category === "online-shop") category = "store";
      
      const metadata = {};
      if (category === "store") {
        metadata.warranty = p.metadata?.warranty || "1 Year";
        metadata.condition = p.metadata?.condition || "Brand New";
        metadata.stock = p.metadata?.stock || "In Stock";
      } else {
        metadata.board = p.metadata?.motherboard || p.metadata?.boardModel || "N/A";
        metadata.size = p.metadata?.biosSize || p.metadata?.fileSize || "N/A";
        metadata.version = p.metadata?.version || "V1.0";
      }

      return {
        id: p.id,
        category: category,
        title: p.title,
        description: p.description,
        image: p.image || "",
        images: p.images || [p.image || ""],
        link: p.link || "#",
        downloadLink: p.downloadLink || "#",
        price: p.price || "",
        createdAt: p.createdAt || new Date().toISOString(),
        views: Math.floor(Math.random() * 45) + 5,
        metadata: metadata
      };
    });
    localStorage.setItem("laptop_tech_posts", JSON.stringify(posts));
  }

  const storedMessages = localStorage.getItem("laptop_tech_messages");
  if (storedMessages) {
    messages = JSON.parse(storedMessages);
  } else if (typeof DEFAULT_MESSAGES !== "undefined") {
    messages = [...DEFAULT_MESSAGES];
    localStorage.setItem("laptop_tech_messages", JSON.stringify(messages));
  }
}

// --- APPLY DYNAMIC SETTINGS TO CLIENT UI ---
function applySettingsToUI() {
  // Update browser document Title & meta description
  document.title = siteSettings.siteName;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", `Dynamic dashboard for ${siteSettings.siteName}.`);

  // Update Website name branding and icons (Header)
  const headerIcon = document.getElementById("header-logo-icon");
  const headerText = document.getElementById("header-logo-text");
  if (headerIcon) headerIcon.className = siteSettings.logoIcon;
  if (headerText) headerText.innerHTML = `${siteSettings.logoText}<span style="color:hsl(var(--primary));">.</span>`;

  // Update Footer Branding
  const footerIcon = document.getElementById("footer-logo-icon");
  const footerText = document.getElementById("footer-logo-text");
  const footerDesc = document.getElementById("footer-branding-desc");
  const footerCopy = document.getElementById("footer-copy-text");

  if (footerIcon) footerIcon.className = siteSettings.logoIcon;
  if (footerText) footerText.innerHTML = `${siteSettings.logoText}<span style="color:hsl(var(--primary));">.</span>`;
  if (footerDesc) footerDesc.innerText = `Premium online portal for ${siteSettings.siteName} resources.`;
  if (footerCopy) footerCopy.innerHTML = `&copy; 2026 ${siteSettings.siteName}. All intellectual rights reserved.`;

  // Update Navigation and category Tab labels
  const navNews = document.getElementById("nav-item-news");
  const navRepair = document.getElementById("nav-item-repair");
  const navStore = document.getElementById("nav-item-store");

  const footerNews = document.getElementById("footer-link-tech-news");
  const footerRepair = document.getElementById("footer-link-repair-articles");
  const footerStore = document.getElementById("footer-link-store");

  const feedTitleNews = document.getElementById("feed-title-news");
  const feedTitleRepair = document.getElementById("feed-title-repair");
  const feedTitleStore = document.getElementById("feed-title-store");

  // Admin select form options
  const optNews = document.getElementById("opt-tech-news");
  const optRepair = document.getElementById("opt-repair-articles");
  const optStore = document.getElementById("opt-store");

  // Admin stats category labels
  const statNewsLabel = document.getElementById("admin-stat-lbl-news");
  const statRepairLabel = document.getElementById("admin-stat-lbl-repair");
  const statStoreLabel = document.getElementById("admin-stat-lbl-store");

  const statNewsHome = document.getElementById("lbl-news-count");
  const statRepairHome = document.getElementById("lbl-repair-count");
  const statStoreHome = document.getElementById("lbl-store-count");

  if (navNews) navNews.innerText = siteSettings.techNewsLabel;
  if (navRepair) navRepair.innerText = siteSettings.repairArticlesLabel;
  if (navStore) navStore.innerText = siteSettings.storeLabel;

  if (footerNews) footerNews.innerText = siteSettings.techNewsLabel;
  if (footerRepair) footerRepair.innerText = siteSettings.repairArticlesLabel;
  if (footerStore) footerStore.innerText = siteSettings.storeLabel;

  if (feedTitleNews) feedTitleNews.innerText = `Latest ${siteSettings.techNewsLabel}`;
  if (feedTitleRepair) feedTitleRepair.innerText = `${siteSettings.repairArticlesLabel} & Resource Center`;
  if (feedTitleStore) feedTitleStore.innerText = `${siteSettings.storeLabel} Listings`;

  if (optNews) optNews.innerText = siteSettings.techNewsLabel;
  if (optRepair) optRepair.innerText = siteSettings.repairArticlesLabel;
  if (optStore) optStore.innerText = siteSettings.storeLabel;

  if (statNewsLabel) statNewsLabel.innerText = siteSettings.techNewsLabel;
  if (statRepairLabel) statRepairLabel.innerText = siteSettings.repairArticlesLabel;
  if (statStoreLabel) statStoreLabel.innerText = siteSettings.storeLabel;

  if (statNewsHome) statNewsHome.innerText = siteSettings.techNewsLabel;
  if (statRepairHome) statRepairHome.innerText = siteSettings.repairArticlesLabel;
  if (statStoreHome) statStoreHome.innerText = siteSettings.storeLabel;

  // Apply Statutory Page Contents (HTML markup allowed)
  const aboutContainer = document.getElementById("about-us-container");
  const privacyContainer = document.getElementById("privacy-policy-container");
  const termsContainer = document.getElementById("terms-conditions-container");
  const disclaimerContainer = document.getElementById("disclaimer-container");

  if (aboutContainer) aboutContainer.innerHTML = siteSettings.aboutUs;
  if (privacyContainer) privacyContainer.innerHTML = siteSettings.privacyPolicy;
  if (termsContainer) termsContainer.innerHTML = siteSettings.termsConditions;
  if (disclaimerContainer) disclaimerContainer.innerHTML = siteSettings.disclaimer;

  // Apply Contact page values
  const emailLink = document.getElementById("contact-email-link");
  const waLink = document.getElementById("contact-whatsapp-link");
  const waNum = document.getElementById("contact-whatsapp-num");
  const ytLink = document.getElementById("contact-youtube-link");
  const ytName = document.getElementById("contact-youtube-name");
  const ytDesc = document.getElementById("contact-youtube-desc");

  if (emailLink) {
    emailLink.href = `mailto:${siteSettings.email}`;
    emailLink.innerText = siteSettings.email;
  }
  if (waLink && waNum) {
    const rawNum = siteSettings.phone.replace(/[+\s-]/g, "");
    waLink.href = `https://wa.me/${rawNum}`;
    waNum.innerText = siteSettings.phone;
  }
  if (ytLink && ytName) {
    ytLink.href = siteSettings.youtubeUrl;
    ytName.innerText = siteSettings.youtubeName;
  }
  if (ytDesc) {
    ytDesc.innerText = siteSettings.youtubeDesc;
  }

  // --- MENU BAR VISIBILITY CUSTOMIZATION ---
  const toggleMenuElement = (elementId, show) => {
    const el = document.getElementById(elementId);
    if (el) el.style.display = show ? "inline-block" : "none";
  };

  const showHome = siteSettings.showHome !== false;
  const showNews = siteSettings.showNews !== false;
  const showRepair = siteSettings.showRepair !== false;
  const showStore = siteSettings.showStore !== false;
  const showAdmin = siteSettings.showAdmin !== false;
  const showAbout = siteSettings.showAbout !== false;
  const showContact = siteSettings.showContact !== false;
  const showPrivacy = siteSettings.showPrivacy !== false;
  const showTerms = siteSettings.showTerms !== false;
  const showDisclaimer = siteSettings.showDisclaimer !== false;

  // Toggle Header navbar link elements
  toggleMenuElement("nav-item-home", showHome);
  toggleMenuElement("nav-item-news", showNews);
  toggleMenuElement("nav-item-repair", showRepair);
  toggleMenuElement("nav-item-store", showStore);
  toggleMenuElement("nav-item-admin", showAdmin);
  toggleMenuElement("nav-item-about", showAbout);
  toggleMenuElement("nav-item-contact", showContact);
  toggleMenuElement("nav-item-privacy", showPrivacy);
  toggleMenuElement("nav-item-terms", showTerms);
  toggleMenuElement("nav-item-disclaimer", showDisclaimer);

  // Toggle Header lock icon admin button
  const adminTriggerBtn = document.getElementById("admin-trigger-btn");
  if (adminTriggerBtn) adminTriggerBtn.style.display = showAdmin ? "flex" : "none";

  // Toggle Footer Column links & Bottom statutory links
  toggleMenuElement("footer-item-about", showAbout);
  toggleMenuElement("footer-item-contact", showContact);
  toggleMenuElement("footer-item-privacy", showPrivacy);
  toggleMenuElement("footer-item-terms", showTerms);
  toggleMenuElement("footer-item-disclaimer", showDisclaimer);

  toggleMenuElement("footer-bottom-privacy", showPrivacy);
  toggleMenuElement("footer-bottom-terms", showTerms);
  toggleMenuElement("footer-bottom-disclaimer", showDisclaimer);

  // Toggle quick links column if news/repair/store are all hidden
  const footerQuickLinksCol = document.getElementById("footer-col-quick-links");
  if (footerQuickLinksCol) {
    footerQuickLinksCol.style.display = (showNews || showRepair || showStore) ? "block" : "none";
    toggleMenuElement("footer-link-tech-news", showNews);
    toggleMenuElement("footer-link-repair-articles", showRepair);
    toggleMenuElement("footer-link-store", showStore);
  }

  // Toggle Home view Statistics counter cards
  const cNewsCard = document.getElementById("home-stat-news-card");
  const cRepairCard = document.getElementById("home-stat-repair-card");
  const cStoreCard = document.getElementById("home-stat-store-card");
  if (cNewsCard) cNewsCard.style.display = showNews ? "block" : "none";
  if (cRepairCard) cRepairCard.style.display = showRepair ? "block" : "none";
  if (cStoreCard) cStoreCard.style.display = showStore ? "block" : "none";

  // Dynamic grid column balancing for counters
  const cluster = document.querySelector(".stats-cluster");
  if (cluster) {
    const activeCount = [showNews, showRepair, showStore].filter(Boolean).length;
    cluster.style.gridTemplateColumns = `repeat(${activeCount || 1}, 1fr)`;
    cluster.style.display = activeCount === 0 ? "none" : "grid";
    setTimeout(() => {
      cluster.style.opacity = "1";
    }, 50);
  }

  // Update settings inputs fields in admin settings form
  const inSiteName = document.getElementById("settings-site-name");
  const inLogoText = document.getElementById("settings-logo-text");
  const inLogoIcon = document.getElementById("settings-logo-icon");
  const inLabelNews = document.getElementById("settings-label-news");
  const inLabelRepair = document.getElementById("settings-label-repair");
  const inLabelStore = document.getElementById("settings-label-store");
  const inEmail = document.getElementById("settings-email");
  const inPhone = document.getElementById("settings-phone");
  const inYoutubeUrl = document.getElementById("settings-youtube-url");
  const inYoutubeName = document.getElementById("settings-youtube-name");
  const inAboutUs = document.getElementById("settings-about-us");
  const inPrivacy = document.getElementById("settings-privacy-policy");
  const inTerms = document.getElementById("settings-terms-conditions");
  const inDisclaimer = document.getElementById("settings-disclaimer");

  if (inSiteName) inSiteName.value = siteSettings.siteName;
  if (inLogoText) inLogoText.value = siteSettings.logoText;
  if (inLogoIcon) inLogoIcon.value = siteSettings.logoIcon;
  if (inLabelNews) inLabelNews.value = siteSettings.techNewsLabel;
  if (inLabelRepair) inLabelRepair.value = siteSettings.repairArticlesLabel;
  if (inLabelStore) inLabelStore.value = siteSettings.storeLabel;
  if (inEmail) inEmail.value = siteSettings.email;
  if (inPhone) inPhone.value = siteSettings.phone;
  if (inYoutubeUrl) inYoutubeUrl.value = siteSettings.youtubeUrl;
  if (inYoutubeName) inYoutubeName.value = siteSettings.youtubeName;
  if (inAboutUs) inAboutUs.value = siteSettings.aboutUs;
  if (inPrivacy) inPrivacy.value = siteSettings.privacyPolicy;
  if (inTerms) inTerms.value = siteSettings.termsConditions;
  if (inDisclaimer) inDisclaimer.value = siteSettings.disclaimer;

  // Sync checkboxes states in Admin settings tab
  const setChk = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = val !== false;
  };
  setChk("settings-menu-home", siteSettings.showHome);
  setChk("settings-menu-news", siteSettings.showNews);
  setChk("settings-menu-repair", siteSettings.showRepair);
  setChk("settings-menu-store", siteSettings.showStore);
  setChk("settings-menu-admin", siteSettings.showAdmin);
  setChk("settings-menu-about", siteSettings.showAbout);
  setChk("settings-menu-contact", siteSettings.showContact);
  setChk("settings-menu-privacy", siteSettings.showPrivacy);
  setChk("settings-menu-terms", siteSettings.showTerms);
  setChk("settings-menu-disclaimer", siteSettings.showDisclaimer);
}

// Save Settings Event Handler
function setupAdminSettings() {
  const settingsForm = document.getElementById("admin-settings-form");
  if (!settingsForm) return;

  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const siteName = document.getElementById("settings-site-name").value.trim();
    const logoText = document.getElementById("settings-logo-text").value.trim();
    const logoIcon = document.getElementById("settings-logo-icon").value.trim();
    const techNewsLabel = document.getElementById("settings-label-news").value.trim();
    const repairArticlesLabel = document.getElementById("settings-label-repair").value.trim();
    const storeLabel = document.getElementById("settings-label-store").value.trim();
    const email = document.getElementById("settings-email").value.trim();
    const phone = document.getElementById("settings-phone").value.trim();
    const youtubeUrl = document.getElementById("settings-youtube-url").value.trim();
    const youtubeName = document.getElementById("settings-youtube-name").value.trim();
    const aboutUs = document.getElementById("settings-about-us").value.trim();
    const privacyPolicy = document.getElementById("settings-privacy-policy").value.trim();
    const termsConditions = document.getElementById("settings-terms-conditions").value.trim();
    const disclaimer = document.getElementById("settings-disclaimer").value.trim();

    // Checkboxes configurations
    const showHome = document.getElementById("settings-menu-home").checked;
    const showNews = document.getElementById("settings-menu-news").checked;
    const showRepair = document.getElementById("settings-menu-repair").checked;
    const showStore = document.getElementById("settings-menu-store").checked;
    const showAdmin = document.getElementById("settings-menu-admin").checked;
    const showAbout = document.getElementById("settings-menu-about").checked;
    const showContact = document.getElementById("settings-menu-contact").checked;
    const showPrivacy = document.getElementById("settings-menu-privacy").checked;
    const showTerms = document.getElementById("settings-menu-terms").checked;
    const showDisclaimer = document.getElementById("settings-menu-disclaimer").checked;

    siteSettings = {
      ...siteSettings,
      siteName,
      logoText,
      logoIcon,
      techNewsLabel,
      repairArticlesLabel,
      storeLabel,
      email,
      phone,
      youtubeUrl,
      youtubeName,
      aboutUs,
      privacyPolicy,
      termsConditions,
      disclaimer,
      showHome,
      showNews,
      showRepair,
      showStore,
      showAdmin,
      showAbout,
      showContact,
      showPrivacy,
      showTerms,
      showDisclaimer
    };

    if (isFirebaseActive) {
      db.collection("settings").doc("site").set(siteSettings)
        .then(() => {
          showToast("Global configurations updated in Cloud Storage!", "success");
        })
        .catch((error) => {
          console.error("Firestore settings save error:", error);
          showToast("Failed to sync settings with Cloud.", "danger");
        });
    } else {
      localStorage.setItem("laptop_tech_settings", JSON.stringify(siteSettings));
      applySettingsToUI();
      showToast("Global configurations saved locally.", "success");
    }
  });
}

// --- SPA ROUTER ---
function setupSPARouter() {
  const navLinks = document.querySelectorAll("#navbar .nav-link");
  const footerLinks = document.querySelectorAll("footer [data-target]");
  const viewSections = document.querySelectorAll(".view-section");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navbar = document.getElementById("navbar");
  const logoBtn = document.getElementById("logo-btn");
  const authModal = document.getElementById("admin-auth-modal");
  const authPasscode = document.getElementById("auth-passcode");

  function switchView(targetViewId) {
    // Hide all sections, remove active links
    viewSections.forEach(section => section.classList.remove("active"));
    navLinks.forEach(link => link.classList.remove("active"));

    // Find target section
    const targetSection = document.getElementById(`view-${targetViewId}`);
    if (targetSection) {
      targetSection.classList.add("active");
      
      // Update nav link selection if applicable
      const matchingNavLink = document.querySelector(`#navbar .nav-link[data-target="${targetViewId}"]`);
      if (matchingNavLink) {
        matchingNavLink.classList.add("active");
      }
      
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Close mobile menu if open
    navbar.classList.remove("open");
    hamburgerBtn.classList.remove("open");
  }

  // Intercept nav link clicks with authentication check for admin
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("data-target");
      if (target === "admin" && sessionStorage.getItem("isAdminAuthenticated") !== "true") {
        e.preventDefault();
        authModal.classList.add("active");
        authPasscode.focus();
        return;
      }
      switchView(target);
    });
  });

  // Footer link clicks
  footerLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      switchView(target);
    });
  });

  // Logo click
  logoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    switchView("home");
  });

  // Mobile menu hamburger toggle
  hamburgerBtn.addEventListener("click", () => {
    navbar.classList.toggle("open");
    hamburgerBtn.classList.toggle("open");
  });

  // Home Page Stats card redirection
  document.querySelectorAll(".stats-cluster .stat-card").forEach(card => {
    card.addEventListener("click", () => {
      const target = card.getAttribute("data-target");
      if (target) {
        switchView(target);
      }
    });
  });

  // Expose router function globally
  window.navigateToView = switchView;
}

// --- ADMIN PORTAL CONTROLLERS & SECURITY ---
function setupAdminPortal() {
  const adminTriggerBtn = document.getElementById("admin-trigger-btn");
  const authModal = document.getElementById("admin-auth-modal");
  const authClose = document.getElementById("auth-modal-close");
  const authSubmit = document.getElementById("auth-submit-btn");
  const authPasscode = document.getElementById("auth-passcode");

  // Open modal / Admin View
  adminTriggerBtn.addEventListener("click", () => {
    if (sessionStorage.getItem("isAdminAuthenticated") === "true") {
      window.navigateToView("admin");
    } else {
      authModal.classList.add("active");
      authPasscode.focus();
    }
  });

  // Close passcode modal
  authClose.addEventListener("click", () => {
    authModal.classList.remove("active");
    authPasscode.value = "";
  });

  // Handle Passcode Unlock Submission
  authSubmit.addEventListener("click", performAuthCheck);
  authPasscode.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performAuthCheck();
  });

  function performAuthCheck() {
    const passcode = authPasscode.value.trim();
    if (passcode.toLowerCase() === "admin") {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      authModal.classList.remove("active");
      authPasscode.value = "";
      showToast("Access Unlocked. Welcome back, Administrator!", "success");
      window.navigateToView("admin");
      renderAdminPostsTable();
    } else {
      showToast("Access Denied! Incorrect security passcode.", "danger");
      authPasscode.value = "";
      authPasscode.focus();
    }
  }

  // --- ADMIN PORTAL INTERNAL TABS ---
  const tabManagePostsBtn = document.getElementById("tab-manage-posts-btn");
  const tabMessagesBtn = document.getElementById("tab-messages-btn");
  const tabSettingsBtn = document.getElementById("tab-settings-btn");

  const tabManagePostsContent = document.getElementById("admin-tab-manage-posts");
  const tabMessagesContent = document.getElementById("admin-tab-messages");
  const tabSettingsContent = document.getElementById("admin-tab-settings");

  tabManagePostsBtn.addEventListener("click", () => {
    tabManagePostsBtn.classList.add("active");
    tabMessagesBtn.classList.remove("active");
    tabSettingsBtn.classList.remove("active");
    tabManagePostsContent.style.display = "grid";
    tabMessagesContent.style.display = "none";
    tabSettingsContent.style.display = "none";
  });

  tabMessagesBtn.addEventListener("click", () => {
    tabMessagesBtn.classList.add("active");
    tabManagePostsBtn.classList.remove("active");
    tabSettingsBtn.classList.remove("active");
    tabMessagesContent.style.display = "block";
    tabManagePostsContent.style.display = "none";
    tabSettingsContent.style.display = "none";
    renderAdminMessagesInbox();
  });

  tabSettingsBtn.addEventListener("click", () => {
    tabSettingsBtn.classList.add("active");
    tabManagePostsBtn.classList.remove("active");
    tabMessagesBtn.classList.remove("active");
    tabSettingsContent.style.display = "block";
    tabManagePostsContent.style.display = "none";
    tabMessagesContent.style.display = "none";
  });

  // --- DYNAMIC FORM FIELD TOGGLES ---
  const formCategorySelect = document.getElementById("form-category");
  const formPriceGroup = document.getElementById("form-price-group");

  formCategorySelect.addEventListener("change", () => {
    const category = formCategorySelect.value;
    
    // Toggle Price block for Store
    if (category === "store") {
      formPriceGroup.style.display = "block";
      document.getElementById("form-price").setAttribute("required", "true");
    } else {
      formPriceGroup.style.display = "none";
      document.getElementById("form-price").removeAttribute("required");
      document.getElementById("form-price").value = "";
    }

    // Toggle Technical specifications fields
    renderDynamicMetaFields(category);
  });

  // --- MULTI-IMAGE SLOT UPLOADER LOGIC ---
  function syncImageSlotsUI() {
    for (let i = 0; i < 4; i++) {
      const thumbEl = document.getElementById(`slot-thumb-${i}`);
      const iconEl = document.getElementById(`slot-icon-${i}`);
      const deleteEl = document.getElementById(`slot-delete-${i}`);
      const slotEl = document.querySelector(`.image-slot[data-slot="${i}"]`);
      
      const imgData = currentFormImages[i];
      
      if (imgData) {
        thumbEl.src = imgData;
        thumbEl.style.display = "block";
        iconEl.style.display = "none";
        deleteEl.style.display = "flex";
      } else {
        thumbEl.src = "";
        thumbEl.style.display = "none";
        iconEl.style.display = "block";
        deleteEl.style.display = "none";
      }
      
      if (i === currentActiveSlot) {
        slotEl.classList.add("active");
      } else {
        slotEl.classList.remove("active");
      }
    }
    
    const activeData = currentFormImages[currentActiveSlot];
    const imageUrlInput = document.getElementById("form-image-url");
    if (activeData && !activeData.startsWith("data:image") && !activeData.includes("res.cloudinary.com")) {
      imageUrlInput.value = activeData;
    } else {
      imageUrlInput.value = "";
    }
    
    document.getElementById("form-images-json").value = JSON.stringify(currentFormImages);
    
    const uploadText = document.getElementById("upload-zone-text");
    const slotLabel = currentActiveSlot === 0 ? "Cover (Slot 1)" : `Slot ${currentActiveSlot + 1}`;
    uploadText.innerText = `Upload image to ${slotLabel}`;
  }

  window.syncImageSlotsUI = syncImageSlotsUI;

  // Bind Slot clicks
  document.querySelectorAll(".image-slot").forEach(slotEl => {
    slotEl.addEventListener("click", (e) => {
      if (e.target.closest(".slot-delete")) return;
      const slotIndex = parseInt(slotEl.getAttribute("data-slot"));
      currentActiveSlot = slotIndex;
      syncImageSlotsUI();
    });
  });

  // Bind delete button clicks on slots
  document.querySelectorAll(".slot-delete").forEach((deleteEl, index) => {
    deleteEl.addEventListener("click", (e) => {
      e.stopPropagation();
      currentFormImages[index] = "";
      syncImageSlotsUI();
      showToast(`Slot ${index + 1} image cleared.`, "warning");
    });
  });

  // File selection triggers
  const imageUploadZone = document.getElementById("image-upload-zone");
  const imageFileInput = document.getElementById("form-image-file");
  const imageUrlInput = document.getElementById("form-image-url");

  imageUploadZone.addEventListener("click", () => imageFileInput.click());

  // Drag-and-drop file support
  imageUploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageUploadZone.classList.add("dragover");
  });

  imageUploadZone.addEventListener("dragleave", () => {
    imageUploadZone.classList.remove("dragover");
  });

  imageUploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    imageUploadZone.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFileSelection(files[0]);
    }
  });

  imageFileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageFileSelection(files[0]);
    }
  });

  // Upload to Cloudinary helper (unsigned upload)
  async function uploadToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);

    const response = await fetch(url, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Failed to upload image.");
    }

    const data = await response.json();
    return data.secure_url;
  }

  // Handle local file uploads with Cloudinary or base64 fallback
  async function handleImageFileSelection(file) {
    if (!file.type.match("image.*")) {
      showToast("Only image files are supported!", "danger");
      return;
    }

    // Set UI to loading state
    const uploadIcon = document.getElementById("upload-icon-element");
    const uploadText = document.getElementById("upload-zone-text");
    const uploadLimitText = document.getElementById("upload-limit-text");

    uploadIcon.className = "fa-solid fa-spinner fa-spin";
    uploadText.innerText = "Processing image file...";
    uploadLimitText.innerText = "Please wait, uploading to cloud...";

    if (typeof isCloudinaryConfigured === "function" && isCloudinaryConfigured()) {
      try {
        const secureUrl = await uploadToCloudinary(file);
        currentFormImages[currentActiveSlot] = secureUrl;
        syncImageSlotsUI();
        showToast(`Uploaded to Cloudinary (Slot ${currentActiveSlot + 1}) successfully!`, "success");
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        showToast("Cloudinary upload failed! Falling back to local Base64.", "warning");
        loadAsBase64(file);
      } finally {
        // Restore UI icons
        uploadIcon.className = "fa-solid fa-cloud-arrow-up";
        uploadLimitText.innerText = "Supports JPG, PNG, WebP (Max 2MB)";
      }
    } else {
      loadAsBase64(file);
      uploadIcon.className = "fa-solid fa-cloud-arrow-up";
      uploadLimitText.innerText = "Supports JPG, PNG, WebP (Max 2MB)";
    }
  }

  // Read file as Base64 local fallback
  function loadAsBase64(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentFormImages[currentActiveSlot] = event.target.result;
      syncImageSlotsUI();
      showToast(`Image loaded locally to slot ${currentActiveSlot + 1}.`, "success");
    };
    reader.readAsDataURL(file);
  }

  // Handle external URL input changes
  imageUrlInput.addEventListener("input", () => {
    const url = imageUrlInput.value.trim();
    currentFormImages[currentActiveSlot] = url;
    syncImageSlotsUI();
  });

  // --- CRUD FORM SUBMIT ---
  const adminPostForm = document.getElementById("admin-post-form");
  const cancelEditBtn = document.getElementById("form-cancel-btn");
  adminPostForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const category = formCategorySelect.value;
    const title = document.getElementById("form-title").value.trim();
    const description = document.getElementById("form-description").value.trim();
    const mainLink = document.getElementById("form-link").value.trim() || "#";
    const downloadLink = document.getElementById("form-download").value.trim() || "#";
    const price = document.getElementById("form-price").value.trim();
    const postId = document.getElementById("form-post-id").value;

    // Pick dynamic metadata inputs
    const metadata = {};
    if (category === "store") {
      metadata.warranty = document.getElementById("meta-warranty")?.value.trim() || "N/A";
      metadata.condition = document.getElementById("meta-condition")?.value.trim() || "Brand New";
      metadata.stock = document.getElementById("meta-stock")?.value.trim() || "In Stock";
    } else if (category === "repair-articles") {
      metadata.board = document.getElementById("meta-board")?.value.trim() || "N/A";
      metadata.size = document.getElementById("meta-size")?.value.trim() || "N/A";
      metadata.version = document.getElementById("meta-version")?.value.trim() || "V1.0";
    } // tech-news metadata has been removed (Source & Read Time)

    const populatedImages = currentFormImages.filter(img => img !== "");
    let coverImage = populatedImages[0] || "";
    
    if (!coverImage) {
      if (category === "tech-news") coverImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
      else if (category === "repair-articles") coverImage = "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80";
      else coverImage = "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80";
    }

    if (populatedImages.length === 0) {
      populatedImages.push(coverImage);
    }

    const id = postId || "post-" + Date.now();
    const postData = {
      id,
      category,
      title,
      description,
      image: coverImage,
      images: populatedImages,
      link: mainLink,
      downloadLink,
      price,
      metadata,
      views: postId ? (posts.find(p => p.id === postId)?.views || 0) : 0,
      createdAt: postId ? (posts.find(p => p.id === postId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    if (isFirebaseActive) {
      db.collection("posts").doc(id).set(postData)
        .then(() => {
          showToast(postId ? "Technical post updated in cloud." : "New technical post added to cloud.", "success");
          resetAdminForm();
        })
        .catch(err => {
          console.error("Firestore post submit error:", err);
          showToast("Failed to save post in Cloud.", "danger");
        });
    } else {
      if (postId) {
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) posts[index] = postData;
        showToast("Post updated locally.", "success");
      } else {
        posts.unshift(postData);
        showToast("Post created locally.", "success");
      }
      localStorage.setItem("laptop_tech_posts", JSON.stringify(posts));
      resetAdminForm();
      renderAllData();
      renderAdminPostsTable();
    }
  });

  cancelEditBtn.addEventListener("click", () => {
    resetAdminForm();
  });
}

function resetAdminForm() {
  const form = document.getElementById("admin-post-form");
  const cancelEditBtn = document.getElementById("form-cancel-btn");
  const formTitleHeading = document.getElementById("form-action-title");
  const formPriceGroup = document.getElementById("form-price-group");
  const metaFieldsContainer = document.getElementById("meta-fields-container");

  form.reset();
  currentAdminEditPostId = null;
  document.getElementById("form-post-id").value = "";
  currentFormImages = ["", "", "", ""];
  currentActiveSlot = 0;
  if (typeof window.syncImageSlotsUI === "function") {
    window.syncImageSlotsUI();
  }

  formPriceGroup.style.display = "none";
  metaFieldsContainer.innerHTML = "";
  
  formTitleHeading.innerHTML = '<i class="fa-solid fa-circle-plus"></i> Add New Resource';
  document.getElementById("form-submit-btn").innerText = "Add Resource";
  cancelEditBtn.style.display = "none";
}

function renderDynamicMetaFields(category, existingData = null) {
  const container = document.getElementById("meta-fields-container");
  container.innerHTML = "";
  
  if (!category) return;
  container.style.display = "block";

  const getVal = (field) => (existingData && existingData.metadata ? existingData.metadata[field] : "");

  let html = "";
  if (category === "repair-articles") {
    html = `
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label>Board Code</label>
          <input type="text" id="meta-board" class="form-control" placeholder="e.g. LA-E081P" value="${getVal('board')}">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label>File Size / Info</label>
          <input type="text" id="meta-size" class="form-control" placeholder="e.g. 16 MB / PDF" value="${getVal('size')}">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label>Software / Tool Version</label>
          <input type="text" id="meta-version" class="form-control" placeholder="e.g. V2.0" value="${getVal('version')}">
        </div>
      </div>
    `;
  } else if (category === "store") {
    html = `
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label>Warranty</label>
          <input type="text" id="meta-warranty" class="form-control" placeholder="e.g. 1 Year" value="${getVal('warranty') || '1 Year'}">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label>Condition</label>
          <input type="text" id="meta-condition" class="form-control" placeholder="e.g. Brand New" value="${getVal('condition') || 'Brand New'}">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label>Availability</label>
          <input type="text" id="meta-stock" class="form-control" placeholder="e.g. In Stock" value="${getVal('stock') || 'In Stock'}">
        </div>
      </div>
    `;
  } // news category dynamic fields removed as requested

  container.innerHTML = html;
}

// --- ADMIN DATABASES TABLE POPULATION ---
function renderAdminPostsTable(filterQuery = "") {
  const tableBody = document.getElementById("admin-posts-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  const query = filterQuery.toLowerCase().trim();
  const filtered = posts.filter(post => 
    post.title.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query) ||
    (post.metadata && Object.values(post.metadata).some(val => String(val).toLowerCase().includes(query)))
  );

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <i class="fa-solid fa-folder-open"></i>
            <p>No inventory matches found.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(post => {
    const tr = document.createElement("tr");

    let catDisplay = "REPAIR";
    if (post.category === "tech-news") catDisplay = siteSettings.techNewsLabel.toUpperCase();
    else if (post.category === "repair-articles") catDisplay = siteSettings.repairArticlesLabel.toUpperCase();
    else if (post.category === "store") catDisplay = siteSettings.storeLabel.toUpperCase();

    let subDetail = "";
    if (post.category === "store") subDetail = `<span style="color: hsl(var(--accent)); font-weight: 700;">${post.price || "N/A"}</span>`;
    else if (post.category === "repair-articles") subDetail = post.metadata?.board || "Motherboard N/A";
    else if (post.category === "tech-news") subDetail = `<i class="fa-solid fa-eye"></i> ${post.views || 0} views`;

    tr.innerHTML = `
      <td>
        <div class="admin-table-item">
          <img src="${post.image}" class="admin-table-thumb" alt="thumb">
          <div style="overflow:hidden;">
            <div class="admin-table-name" title="${post.title}">${post.title}</div>
            <div style="font-size: 11px; color: hsl(var(--text-muted)); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${post.description.substring(0, 45)}...
            </div>
          </div>
        </div>
      </td>
      <td>
        <span class="card-badge badge-${getBadgeClass(post.category)}" style="position: static; font-size:10px; padding: 2px 8px;">
          ${catDisplay}
        </span>
      </td>
      <td style="font-size: 13px; font-weight:600;">
        ${subDetail}
      </td>
      <td>
        <div class="admin-action-btns">
          <button class="admin-btn-icon btn-edit" title="Edit Post" onclick="triggerEditPost('${post.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="admin-btn-icon btn-delete" title="Delete Post" onclick="triggerDeletePost('${post.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function getBadgeClass(cat) {
  if (cat === "tech-news") return "softwares"; // reuses software styling
  if (cat === "repair-articles") return "bios"; // reuses bios/schem styling
  return "shop";
}

// Global hook for editing items
window.triggerEditPost = function(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  currentAdminEditPostId = postId;

  document.getElementById("form-post-id").value = post.id;
  document.getElementById("form-category").value = post.category;
  document.getElementById("form-title").value = post.title;
  document.getElementById("form-description").value = post.description;
  document.getElementById("form-link").value = post.link || "#";
  document.getElementById("form-download").value = post.downloadLink || "#";

  const priceGroup = document.getElementById("form-price-group");
  if (post.category === "store") {
    priceGroup.style.display = "block";
    document.getElementById("form-price").value = post.price || "";
    document.getElementById("form-price").setAttribute("required", "true");
  } else {
    priceGroup.style.display = "none";
    document.getElementById("form-price").value = "";
    document.getElementById("form-price").removeAttribute("required");
  }

  renderDynamicMetaFields(post.category, post);
 
  if (post.images && Array.isArray(post.images) && post.images.length > 0) {
    currentFormImages = [...post.images];
    while (currentFormImages.length < 4) {
      currentFormImages.push("");
    }
  } else {
    currentFormImages = [post.image || "", "", "", ""];
  }
  currentActiveSlot = 0;
  if (typeof syncImageSlotsUI === "function") {
    syncImageSlotsUI();
  }
 
  document.getElementById("form-action-title").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit: ${post.title.substring(0, 16)}...`;
  document.getElementById("form-submit-btn").innerText = "Update Resource";
  document.getElementById("form-cancel-btn").style.display = "block";

  document.querySelector(".admin-form-panel").scrollIntoView({ behavior: "smooth" });
};

// Global hook for deleting items
window.triggerDeletePost = function(postId) {
  if (confirm(`Are you absolutely sure you want to delete this post? This cannot be undone.`)) {
    if (isFirebaseActive) {
      db.collection("posts").doc(postId).delete()
        .then(() => {
          showToast("Resource successfully deleted from Cloud Database.", "danger");
        })
        .catch(err => {
          console.error("Firestore delete error:", err);
          showToast("Failed to delete post from Cloud.", "danger");
        });
    } else {
      posts = posts.filter(p => p.id !== postId);
      localStorage.setItem("laptop_tech_posts", JSON.stringify(posts));
      showToast("Resource deleted locally.", "danger");
      renderAllData();
      renderAdminPostsTable();
    }
  }
};

// --- MESSAGES INBOX PANEL ---
function renderAdminMessagesInbox() {
  const inboxContainer = document.getElementById("admin-messages-container");
  const countBadge = document.getElementById("inbox-badge-count");
  
  if (!inboxContainer) return;
  inboxContainer.innerHTML = "";
  countBadge.innerText = messages.length;

  if (messages.length === 0) {
    inboxContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-inbox"></i>
        <p>Your support inbox is currently empty.</p>
      </div>
    `;
    return;
  }

  messages.forEach(msg => {
    const item = document.createElement("div");
    item.className = "message-item";

    const formattedDate = new Date(msg.createdAt).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    item.innerHTML = `
      <div class="message-meta">
        <div class="message-sender">
          <h4>${msg.name}</h4>
          <span>${msg.email}</span>
        </div>
        <div style="display:flex; align-items:center; gap: 12px;">
          <div class="message-date">${formattedDate}</div>
          <button class="admin-btn-icon btn-delete" title="Delete Message" onclick="triggerDeleteMessage('${msg.id}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      <div class="message-subject">RE: ${msg.subject}</div>
      <div class="message-text">${msg.message}</div>
    `;
    inboxContainer.appendChild(item);
  });
}

window.triggerDeleteMessage = function(msgId) {
  if (confirm("Delete this message?")) {
    if (isFirebaseActive) {
      db.collection("messages").doc(msgId).delete()
        .then(() => {
          showToast("Message purged from Cloud Database.", "danger");
        })
        .catch(err => {
          console.error("Firestore delete msg error:", err);
          showToast("Failed to delete message.", "danger");
        });
    } else {
      messages = messages.filter(m => m.id !== msgId);
      localStorage.setItem("laptop_tech_messages", JSON.stringify(messages));
      showToast("Message deleted locally.", "danger");
      renderAdminMessagesInbox();
    }
  }
};

// --- CONTACT FORM HANDLER ---
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    const msgId = "msg-" + Date.now();
    const newMessage = {
      id: msgId,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseActive) {
      db.collection("messages").doc(msgId).set(newMessage)
        .then(() => {
          showToast("Thank you! Your message was sent to the tech admins.", "success");
          contactForm.reset();
        })
        .catch(err => {
          console.error("Firestore send message error:", err);
          showToast("Failed to send message online.", "danger");
        });
    } else {
      messages.unshift(newMessage);
      localStorage.setItem("laptop_tech_messages", JSON.stringify(messages));
      showToast("Message saved locally.", "success");
      contactForm.reset();
    }

    // Submit to Netlify Form for direct Email Forwarding automatically
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "contact",
        "name": name,
        "email": email,
        "subject": subject,
        "message": message
      }).toString()
    })
    .then(() => console.log("Netlify form submission forward initiated."))
    .catch(() => {});
  });
}

// --- DETAILED SINGLE POST VIEW CONFIG ---
function setupDetailViewBackBtn() {
  const backBtn = document.getElementById("detail-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (typeof window.navigateToView === "function") {
        window.navigateToView(previousFeedView);
      }
    });
  }
}

// Detailed page view router helper
window.viewPostDetail = function(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  activeDetailedPostId = postId; // Store current postId globally
  loadPostComments(postId); // Fetch comments in real-time

  // Remembers previous view (e.g. home, tech-news, repair-articles, store)
  const activeSection = document.querySelector(".view-section.active");
  if (activeSection) {
    const activeId = activeSection.id.replace("view-", "");
    if (activeId !== "post-detail") {
      previousFeedView = activeId;
    }
  }

  // Increment views count in database
  const nextViews = (post.views || 0) + 1;
  post.views = nextViews; // update state

  if (isFirebaseActive) {
    db.collection("posts").doc(postId).update({
      views: firebase.firestore.FieldValue.increment(1)
    }).catch(err => console.error("Error updating views:", err));
  } else {
    localStorage.setItem("laptop_tech_posts", JSON.stringify(posts));
  }

  // Render elements in detailed section
  const categoryBadge = document.getElementById("detail-category-badge");
  const titleEl = document.getElementById("detail-title");
  const dateEl = document.getElementById("detail-date");
  const viewsEl = document.getElementById("detail-views");
  const mediaContainer = document.getElementById("detail-media-container");
  const descEl = document.getElementById("detail-description");
  const sideHeader = document.getElementById("detail-side-header");
  const specsContainer = document.getElementById("detail-specs-container");
  const actionsContainer = document.getElementById("detail-actions-container");

  // Format category badge label
  let catDisplay = "Repair Article";
  let badgeClass = getBadgeClass(post.category);
  if (post.category === "tech-news") catDisplay = siteSettings.techNewsLabel;
  else if (post.category === "repair-articles") catDisplay = siteSettings.repairArticlesLabel;
  else if (post.category === "store") catDisplay = siteSettings.storeLabel;

  if (categoryBadge) {
    categoryBadge.innerText = catDisplay;
    categoryBadge.className = `card-badge badge-${badgeClass}`;
  }

  if (titleEl) titleEl.innerText = post.title;
  
  if (dateEl) {
    dateEl.innerText = new Date(post.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  if (viewsEl) viewsEl.innerText = nextViews;

  if (descEl) descEl.innerText = post.description;

  // Render Slider / Image Gallery
  if (mediaContainer) {
    mediaContainer.innerHTML = "";
    if (post.images && Array.isArray(post.images) && post.images.length > 1) {
      const slides = post.images.map(img => `<img src="${img}" alt="slide" loading="lazy">`).join("");
      const dots = post.images.map((_, idx) => `<span class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="setCarouselSlide(this, ${idx})"></span>`).join("");
      
      mediaContainer.innerHTML = `
        <div class="card-carousel" data-active-slide="0" style="width:100%; height:100%;">
          <div class="detail-carousel-track" style="transform: translateX(0%);">
            ${slides}
          </div>
          <button type="button" class="carousel-btn btn-prev" onclick="moveCarouselSlide(this, -1)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button type="button" class="carousel-btn btn-next" onclick="moveCarouselSlide(this, 1)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
          <div class="carousel-dots">
            ${dots}
          </div>
        </div>
      `;
    } else {
      mediaContainer.innerHTML = `<img src="${post.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'}" style="width: 100%; height: 100%; object-fit: cover;" alt="cover">`;
    }
  }

  // Specs & CTA sidebar
  if (sideHeader && specsContainer && actionsContainer) {
    specsContainer.innerHTML = "";
    actionsContainer.innerHTML = "";

    if (post.category === "store") {
      sideHeader.innerHTML = `<i class="fa-solid fa-tag"></i> Price: ${post.price || "N/A"}`;
      
      // Store Specs
      specsContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:14px; border-bottom:1px solid hsl(var(--border-color) / 0.5); padding: 8px 0;">
          <span style="color:hsl(var(--text-muted));">Warranty</span>
          <span style="font-weight:600;">${post.metadata?.warranty || "N/A"}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:14px; border-bottom:1px solid hsl(var(--border-color) / 0.5); padding: 8px 0;">
          <span style="color:hsl(var(--text-muted));">Condition</span>
          <span style="font-weight:600;">${post.metadata?.condition || "Brand New"}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:14px; padding: 8px 0;">
          <span style="color:hsl(var(--text-muted));">Availability</span>
          <span style="font-weight:600; color:hsl(var(--accent));">${post.metadata?.stock || "In Stock"}</span>
        </div>
      `;

      // Buy Actions
      const rawPhone = siteSettings.phone.replace(/[+\s-]/g, "");
      const waText = encodeURIComponent(`Hi ${siteSettings.siteName}! I am interested in purchasing "${post.title}". Is it currently available?`);
      const waLink = `https://wa.me/${rawPhone}?text=${waText}`;

      actionsContainer.innerHTML = `
        <a href="${waLink}" target="_blank" class="btn btn-shop-buy" style="width:100%; justify-content:center; padding:12px;">
          <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp
        </a>
        ${post.link && post.link !== "#" ? `
          <a href="${post.link}" target="_blank" class="btn btn-secondary" style="width:100%; justify-content:center; padding:12px;">
            <i class="fa-solid fa-earth-americas"></i> Visit Web Page
          </a>
        ` : ""}
      `;
    } else {
      sideHeader.innerHTML = `<i class="fa-solid fa-circle-info"></i> Resource Specs`;

      // Repair details specifications
      if (post.category === "repair-articles" && post.metadata) {
        specsContainer.style.display = "flex";
        specsContainer.innerHTML = `
          <div style="display:flex; justify-content:space-between; font-size:14px; border-bottom:1px solid hsl(var(--border-color) / 0.5); padding: 8px 0;">
            <span style="color:hsl(var(--text-muted));">Board Code</span>
            <span style="font-weight:600;">${post.metadata.board || "N/A"}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:14px; border-bottom:1px solid hsl(var(--border-color) / 0.5); padding: 8px 0;">
            <span style="color:hsl(var(--text-muted));">File Info / Size</span>
            <span style="font-weight:600;">${post.metadata.size || "N/A"}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:14px; padding: 8px 0;">
            <span style="color:hsl(var(--text-muted));">Version / Code</span>
            <span style="font-weight:600;">${post.metadata.version || "V1.0"}</span>
          </div>
        `;
      } else {
        // Hide specs block for news or pages without technical metadata
        specsContainer.style.display = "none";
      }

      // Download Actions
      const hasDownload = post.downloadLink && post.downloadLink !== "#";
      const dlLink = hasDownload ? post.downloadLink : "javascript:showToast('Downloading file has started... (Mock link)', 'success');";

      actionsContainer.innerHTML = `
        <a href="${dlLink}" class="btn btn-primary" style="width:100%; justify-content:center; padding:12px;" ${hasDownload ? 'download' : ''}>
          <i class="fa-solid fa-cloud-arrow-down"></i> ${hasDownload ? 'Download File Asset' : 'Download File Now'}
        </a>
        ${post.link && post.link !== "#" ? `
          <a href="${post.link}" target="_blank" class="btn btn-secondary" style="width:100%; justify-content:center; padding:12px;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Source
          </a>
        ` : ""}
      `;
    }
  }

  // Switch to detail view
  if (typeof window.navigateToView === "function") {
    window.navigateToView("post-detail");
  }
};

// --- RENDERING FEEDS (PUBLIC BOARDS) ---
function renderAllData() {
  updateGlobalCounters();

  const recentGrid = document.getElementById("recent-posts-grid");
  const newsGrid = document.getElementById("tech-news-grid");
  const repairGrid = document.getElementById("repair-articles-grid");
  const storeGrid = document.getElementById("store-grid");

  if (!recentGrid) return; // safety check
  recentGrid.innerHTML = "";
  if (newsGrid) newsGrid.innerHTML = "";
  if (repairGrid) repairGrid.innerHTML = "";
  if (storeGrid) storeGrid.innerHTML = "";

  posts.forEach((post, i) => {
    const cardHTML = generateCardHTML(post);
    
    // Add to home (top 6 items)
    if (i < 6) {
      recentGrid.insertAdjacentHTML("beforeend", cardHTML);
    }

    // Add to category feeds
    if (post.category === "tech-news" && newsGrid) {
      newsGrid.insertAdjacentHTML("beforeend", cardHTML);
    } else if (post.category === "repair-articles" && repairGrid) {
      repairGrid.insertAdjacentHTML("beforeend", cardHTML);
    } else if (post.category === "store" && storeGrid) {
      storeGrid.insertAdjacentHTML("beforeend", cardHTML);
    }
  });

  // Empty lists feedback check
  if (newsGrid) checkGridEmptyState(newsGrid, "newspaper", `No ${siteSettings.techNewsLabel} uploaded yet.`);
  if (repairGrid) checkGridEmptyState(repairGrid, "screwdriver-wrench", `No ${siteSettings.repairArticlesLabel} uploaded yet.`);
  if (storeGrid) checkGridEmptyState(storeGrid, "store", `No ${siteSettings.storeLabel} items listed yet.`);
}

function updateGlobalCounters() {
  const newsCount = posts.filter(p => p.category === "tech-news").length;
  const repairCount = posts.filter(p => p.category === "repair-articles").length;
  const storeCount = posts.filter(p => p.category === "store").length;

  // Render on home dashboard counters
  const cNews = document.getElementById("stat-count-news");
  const cRepair = document.getElementById("stat-count-repair");
  const cStore = document.getElementById("stat-count-store");

  if (cNews) cNews.innerText = newsCount;
  if (cRepair) cRepair.innerText = repairCount;
  if (cStore) cStore.innerText = storeCount;

  // Render in admin internal metrics dashboard
  const adminStatTotal = document.getElementById("admin-stat-total");
  const adminStatNews = document.getElementById("admin-stat-news");
  const adminStatRepair = document.getElementById("admin-stat-repair");
  const adminStatStore = document.getElementById("admin-stat-store");
  const inboxBadgeCount = document.getElementById("inbox-badge-count");

  if (adminStatTotal) {
    adminStatTotal.innerText = posts.length;
    adminStatNews.innerText = newsCount;
    adminStatRepair.innerText = repairCount;
    adminStatStore.innerText = storeCount;
    inboxBadgeCount.innerText = messages.length;
  }
}

function checkGridEmptyState(gridEl, icon, msg) {
  if (gridEl.children.length === 0) {
    gridEl.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; width: 100%;">
        <i class="fa-solid fa-${icon}"></i>
        <p>${msg}</p>
      </div>
    `;
  }
}

function generateCardHTML(post) {
  let mediaHTML = "";
  if (post.images && Array.isArray(post.images) && post.images.length > 1) {
    const imagesHTML = post.images.map(img => `<img src="${img}" class="card-img" alt="cover" loading="lazy">`).join("");
    const dotsHTML = post.images.map((_, idx) => `<span class="carousel-dot ${idx === 0 ? "active" : ""}" onclick="setCarouselSlide(this, ${idx})"></span>`).join("");
    
    mediaHTML = `
      <div class="card-carousel" data-active-slide="0">
        <div class="carousel-track" style="transform: translateX(0%);">
          ${imagesHTML}
        </div>
        <button type="button" class="carousel-btn btn-prev" onclick="moveCarouselSlide(this, -1)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button type="button" class="carousel-btn btn-next" onclick="moveCarouselSlide(this, 1)">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
        <div class="carousel-dots">
          ${dotsHTML}
        </div>
      </div>
    `;
  } else {
    mediaHTML = `<img src="${post.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'}" class="card-img" alt="cover" loading="lazy">`;
  }
  
  let badgeClass = getBadgeClass(post.category);
  let displayCategory = "Repair";
  if (post.category === "tech-news") displayCategory = siteSettings.techNewsLabel;
  else if (post.category === "repair-articles") displayCategory = siteSettings.repairArticlesLabel;
  else if (post.category === "store") displayCategory = siteSettings.storeLabel;

  let badgeHTML = `<span class="card-badge badge-${badgeClass}">${displayCategory}</span>`;

  let priceHTML = "";
  if (post.category === "store" && post.price) {
    priceHTML = `<div class="card-price-tag">${post.price}</div>`;
  }

  // Generate specs
  let specsHTML = "";
  if (post.category === "repair-articles" && post.metadata) {
    specsHTML = `
      <div class="card-spec-grid">
        <div class="spec-item">
          <div class="spec-label">Board Model</div>
          <div class="spec-value" title="${post.metadata.board || "N/A"}">${post.metadata.board || "N/A"}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">File Size</div>
          <div class="spec-value">${post.metadata.size || "N/A"}</div>
        </div>
        <div class="spec-item" style="grid-column: span 2;">
          <div class="spec-label">Version / Tool</div>
          <div class="spec-value">${post.metadata.version || "N/A"}</div>
        </div>
      </div>
    `;
  } else if (post.category === "store" && post.metadata) {
    specsHTML = `
      <div class="card-spec-grid">
        <div class="spec-item">
          <div class="spec-label">Warranty</div>
          <div class="spec-value">${post.metadata.warranty || "N/A"}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Condition</div>
          <div class="spec-value">${post.metadata.condition || "Brand New"}</div>
        </div>
        <div class="spec-item" style="grid-column: span 2;">
          <div class="spec-label">Availability</div>
          <div class="spec-value">${post.metadata.stock || "In Stock"}</div>
        </div>
      </div>
    `;
  } // news specifications are empty (Source and Read Time removed)

  // Create card actions
  let actionButtons = "";
  if (post.category === "store") {
    const rawPhone = siteSettings.phone.replace(/[+\s-]/g, "");
    const waText = encodeURIComponent(`Hi ${siteSettings.siteName}! I am interested in purchasing "${post.title}". Is it currently available?`);
    const waLink = `https://wa.me/${rawPhone}?text=${waText}`;

    actionButtons = `
      <a href="${waLink}" target="_blank" class="btn btn-shop-buy">
        <i class="fa-brands fa-whatsapp"></i> Buy/Inquire
      </a>
      <button type="button" class="btn btn-secondary" style="padding: 10px 14px;" onclick="viewPostDetail('${post.id}')">
        <i class="fa-solid fa-eye"></i> Details
      </button>
    `;
  } else {
    const hasDownload = post.downloadLink && post.downloadLink !== "#";
    const dlLink = hasDownload ? post.downloadLink : "javascript:showToast('Downloading file has started... (Mock link)', 'success');";
    
    actionButtons = `
      <a href="${dlLink}" class="btn btn-primary" ${hasDownload ? 'download' : ''}>
        <i class="fa-solid fa-cloud-arrow-down"></i> ${hasDownload ? 'Download' : 'Download Now'}
      </a>
      ${post.link && post.link !== "#" ? `
        <a href="${post.link}" target="_blank" class="btn btn-secondary" style="padding: 10px 14px;" title="Official Source">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      ` : ""}
    `;
  }

  // Views counter eye element
  const viewsHTML = `
    <div style="display:flex; align-items:center; gap:5px; font-size:12px; color:hsl(var(--text-muted)); margin-bottom:12px;">
      <i class="fa-solid fa-eye" style="font-size:13px; color:hsl(var(--primary));"></i>
      <span>${post.views || 0} views</span>
    </div>
  `;

  // Description limits: truncated to 3 lines (handled via styling, or truncated here)
  const isLongDescription = post.description && post.description.length > 120;
  const toggleBtnHTML = `
    <button type="button" class="btn-read-more" onclick="viewPostDetail('${post.id}')">
      More Details <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;

  // Capped description in layout (card-description has max 3 lines style)
  return `
    <div class="card" data-id="${post.id}">
      <div class="card-img-container">
        ${mediaHTML}
        ${badgeHTML}
        ${priceHTML}
      </div>
      <div class="card-content">
        <h3 class="card-title">${post.title}</h3>
        <p class="card-description" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; max-height: 4.8em; line-height: 1.6; margin-bottom: 12px;">${post.description}</p>
        
        ${viewsHTML}
        ${toggleBtnHTML}
        
        <!-- Specifications -->
        ${specsHTML}

        <!-- Actions -->
        <div class="card-actions">
          ${actionButtons}
        </div>
      </div>
    </div>
  `;
}

// --- AUTO RUN SLIDESHOW LOOP ---
function startAutoCarouselLoop() {
  if (autoCarouselInterval) clearInterval(autoCarouselInterval);
  autoCarouselInterval = setInterval(() => {
    // Find all carousels on the screen
    const carousels = document.querySelectorAll(".card-carousel");
    carousels.forEach(carousel => {
      // Avoid sliding if card is hovered by user to preserve UX
      const card = carousel.closest(".card") || carousel.closest("#view-post-detail");
      if (card && card.matches(":hover")) return;

      const track = carousel.querySelector(".carousel-track") || carousel.querySelector(".detail-carousel-track");
      const dots = carousel.querySelectorAll(".carousel-dot");
      if (!track || track.children.length <= 1) return;

      let activeIndex = parseInt(carousel.getAttribute("data-active-slide") || "0");
      activeIndex = (activeIndex + 1) % track.children.length;

      carousel.setAttribute("data-active-slide", activeIndex);
      track.style.transform = `translateX(-${activeIndex * 100}%)`;

      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === activeIndex);
      });
    });
  }, 3500);
}

// --- SEARCH CONTROLS ---
function setupLiveSearch() {
  const homeSearch = document.getElementById("home-search-bar");
  const adminSearchInput = document.getElementById("admin-items-search");

  if (homeSearch) {
    homeSearch.addEventListener("input", () => {
      const val = homeSearch.value.toLowerCase().trim();
      const recentGrid = document.getElementById("recent-posts-grid");
      
      if (!recentGrid) return;
      recentGrid.innerHTML = "";

      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(val) ||
        post.description.toLowerCase().includes(val) ||
        post.category.toLowerCase().includes(val) ||
        (post.metadata && Object.values(post.metadata).some(metaVal => String(metaVal).toLowerCase().includes(val)))
      );

      if (filtered.length === 0) {
        recentGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; width: 100%;">
            <i class="fa-solid fa-magnifying-glass-minus"></i>
            <p>No technician resources or files match your search keywords.</p>
          </div>
        `;
        return;
      }

      filtered.forEach(post => {
        recentGrid.insertAdjacentHTML("beforeend", generateCardHTML(post));
      });
    });
  }

  if (adminSearchInput) {
    adminSearchInput.addEventListener("input", () => {
      renderAdminPostsTable(adminSearchInput.value);
    });
  }
}

// --- CUSTOM TOAST SYSTEM ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-notification-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconHTML = "";
  if (type === "success") iconHTML = '<i class="fa-solid fa-circle-check" style="color: hsl(var(--accent));"></i>';
  else if (type === "danger") iconHTML = '<i class="fa-solid fa-circle-exclamation" style="color: hsl(var(--danger));"></i>';
  else iconHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: hsl(var(--warning));"></i>';

  toast.innerHTML = `
    ${iconHTML}
    <div style="font-size: 13px; font-weight:600;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideIn 0.35s reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 3500);
}

window.showToast = showToast;

// Global carousel slideshow navigation helpers
window.moveCarouselSlide = function(btn, direction) {
  const carousel = btn.closest('.card-carousel');
  const track = carousel.querySelector('.carousel-track') || carousel.querySelector('.detail-carousel-track');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const slideCount = track.children.length;
  
  let activeIndex = parseInt(carousel.getAttribute('data-active-slide') || '0');
  
  activeIndex += direction;
  
  if (activeIndex < 0) {
    activeIndex = slideCount - 1;
  } else if (activeIndex >= slideCount) {
    activeIndex = 0;
  }
  
  carousel.setAttribute('data-active-slide', activeIndex);
  track.style.transform = `translateX(-${activeIndex * 100}%)`;
  
  dots.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
};

window.setCarouselSlide = function(dot, index) {
  const carousel = dot.closest('.card-carousel');
  const track = carousel.querySelector('.carousel-track') || carousel.querySelector('.detail-carousel-track');
  const dots = carousel.querySelectorAll('.carousel-dot');
  
  carousel.setAttribute('data-active-slide', index);
  track.style.transform = `translateX(-${index * 100}%)`;
  
  dots.forEach((d, idx) => {
    if (idx === index) {
      d.classList.add('active');
    } else {
      d.classList.remove('active');
    }
  });
};

// --- DISCUSSION & COMMENTS ENGINE ---

function setupCommentsForm() {
  const loginBtn = document.getElementById("btn-comments-google-login");
  const logoutBtn = document.getElementById("btn-comments-logout");
  const commentForm = document.getElementById("comment-submission-form");

  if (loginBtn) loginBtn.addEventListener("click", loginWithGoogle);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  if (commentForm) {
    commentForm.addEventListener("submit", submitComment);
  }
}

function loginWithGoogle() {
  if (!isFirebaseActive || !auth) {
    showToast("Login only available in Live Online Mode.", "warning");
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      showToast(`Logged in as ${result.user.displayName}`, "success");
    })
    .catch((error) => {
      console.error("Google authentication failed:", error);
      showToast("Sign in failed. Check your Firebase config or try again.", "danger");
    });
}

function logout() {
  if (auth) {
    auth.signOut().then(() => {
      showToast("Signed out successfully.", "success");
    });
  }
}

function updateCommentsAuthUI() {
  const loggedOutBlock = document.getElementById("comments-logged-out");
  const loggedInBlock = document.getElementById("comments-logged-in");
  const inputArea = document.getElementById("comments-input-area");
  
  const userAvatar = document.getElementById("comments-user-avatar");
  const userName = document.getElementById("comments-user-name");
  const userEmail = document.getElementById("comments-user-email");

  if (currentUser) {
    if (loggedOutBlock) loggedOutBlock.style.display = "none";
    if (loggedInBlock) loggedInBlock.style.display = "flex";
    if (inputArea) inputArea.style.display = "block";

    if (userAvatar) userAvatar.src = currentUser.photoURL || "https://www.gravatar.com/avatar/?d=mp";
    if (userName) userName.innerText = currentUser.displayName;
    if (userEmail) userEmail.innerText = currentUser.email;
  } else {
    if (loggedOutBlock) loggedOutBlock.style.display = "flex";
    if (loggedInBlock) loggedInBlock.style.display = "none";
    if (inputArea) inputArea.style.display = "none";
  }

  // Refresh dynamic delete icons on current comments feed
  if (activeDetailedPostId) {
    renderDeleteIcons();
  }
}

function submitComment(e) {
  e.preventDefault();
  
  if (!currentUser) {
    showToast("Please sign in to write comments.", "warning");
    return;
  }

  const commentTextEl = document.getElementById("comment-text");
  const text = commentTextEl.value.trim();
  if (!text) return;

  const commentId = "comment-" + Date.now();
  const commentData = {
    id: commentId,
    postId: activeDetailedPostId,
    uid: currentUser.uid,
    userName: currentUser.displayName,
    userPhoto: currentUser.photoURL || "",
    text: text,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseActive) {
    db.collection("comments").doc(commentId).set(commentData)
      .then(() => {
        commentTextEl.value = "";
        showToast("Comment published!", "success");
      })
      .catch((err) => {
        console.error("Firestore save comment error:", err);
        showToast("Failed to publish comment.", "danger");
      });
  } else {
    // Offline local storage fallback
    const offlineComments = JSON.parse(localStorage.getItem("laptop_tech_comments") || "[]");
    offlineComments.unshift(commentData);
    localStorage.setItem("laptop_tech_comments", JSON.stringify(offlineComments));
    commentTextEl.value = "";
    showToast("Comment saved locally (Offline).", "success");
    
    // Trigger local list render
    loadLocalOfflineComments(activeDetailedPostId);
  }
}

function loadPostComments(postId) {
  if (isFirebaseActive) {
    // Unsubscribe previous collection listener if active
    if (window.activeCommentsUnsubscribe) {
      window.activeCommentsUnsubscribe();
    }

    window.activeCommentsUnsubscribe = db.collection("comments")
      .where("postId", "==", postId)
      .onSnapshot((snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push(doc.data());
        });
        // Sort client-side by createdAt asc to bypass composite index requirements
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        renderCommentsFeed(list);
      }, (err) => {
        console.error("Comments subscription failed:", err);
      });
  } else {
    loadLocalOfflineComments(postId);
  }
}

function loadLocalOfflineComments(postId) {
  const offlineComments = JSON.parse(localStorage.getItem("laptop_tech_comments") || "[]");
  const filtered = offlineComments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  renderCommentsFeed(filtered);
}

function renderCommentsFeed(comments) {
  const thread = document.getElementById("comments-list-thread");
  if (!thread) return;
  
  thread.innerHTML = "";

  if (comments.length === 0) {
    thread.innerHTML = `
      <div style="text-align: center; padding: 20px; color: hsl(var(--text-muted)); font-size: 14px;">
        <i class="fa-solid fa-comments" style="font-size: 24px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
        No comments yet. Be the first to start the discussion!
      </div>
    `;
    return;
  }

  comments.forEach((comment) => {
    const isOwner = currentUser && currentUser.uid === comment.uid;
    const isAdmin = sessionStorage.getItem("isAdminAuthenticated") === "true";
    const showDelete = isOwner || isAdmin;

    const formattedDate = new Date(comment.createdAt).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    commentItem.style.display = "flex";
    commentItem.style.gap = "15px";
    commentItem.style.padding = "15px";
    commentItem.style.background = "hsl(var(--bg-dark))";
    commentItem.style.borderRadius = "var(--radius-sm)";
    commentItem.style.border = "1px solid hsl(var(--border-color) / 0.5)";

    commentItem.innerHTML = `
      <img src="${comment.userPhoto || 'https://www.gravatar.com/avatar/?d=mp'}" style="width: 38px; height: 38px; border-radius: 50%; border: 1px solid hsl(var(--border-color)); object-fit: cover;" alt="Avatar">
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div>
            <span style="font-size: 14px; font-weight: 700; color: hsl(var(--text-primary));">${comment.userName}</span>
            <span style="font-size: 11px; color: hsl(var(--text-muted)); margin-left: 10px;">${formattedDate}</span>
          </div>
          ${showDelete ? `
            <button type="button" class="btn-comment-delete" onclick="triggerDeleteComment('${comment.id}')" style="background: none; border: none; color: hsl(var(--danger)); cursor: pointer; font-size: 12px; opacity: 0.7; transition: opacity var(--transition-fast);" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : ""}
        </div>
        <p style="font-size: 14px; color: hsl(var(--text-secondary)); line-height: 1.5; white-space: pre-wrap; margin: 0;">${comment.text}</p>
      </div>
    `;
    thread.appendChild(commentItem);
  });
}

function renderDeleteIcons() {
  if (activeDetailedPostId) {
    if (isFirebaseActive) {
      db.collection("comments")
        .where("postId", "==", activeDetailedPostId)
        .get()
        .then((snapshot) => {
          const list = [];
          snapshot.forEach((doc) => list.push(doc.data()));
          // Sort client-side by createdAt asc to bypass composite index requirements
          list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          renderCommentsFeed(list);
        });
    } else {
      loadLocalOfflineComments(activeDetailedPostId);
    }
  }
}

window.triggerDeleteComment = function(commentId) {
  if (confirm("Are you sure you want to delete this comment?")) {
    if (isFirebaseActive) {
      db.collection("comments").doc(commentId).delete()
        .then(() => {
          showToast("Comment deleted successfully.", "success");
        })
        .catch((err) => {
          console.error("Firestore delete comment error:", err);
          showToast("Failed to delete comment.", "danger");
        });
    } else {
      let offlineComments = JSON.parse(localStorage.getItem("laptop_tech_comments") || "[]");
      offlineComments = offlineComments.filter(c => c.id !== commentId);
      localStorage.setItem("laptop_tech_comments", JSON.stringify(offlineComments));
      showToast("Comment deleted locally.", "success");
      loadLocalOfflineComments(activeDetailedPostId);
    }
  }
};
