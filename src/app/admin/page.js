'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import settings from '../../../content/settings.json';
import initialPosts from '../../../content/posts.json';

// Helper function to compress and resize image on the client-side
const compressImage = (file, maxWidth, maxHeight, quality) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with the specified quality compression
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function AdminPortal() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('manage-posts');
  
  // Database States
  const [postsList, setPostsList] = useState([]);
  const [settingsData, setSettingsData] = useState(settings);
  const [searchQuery, setSearchQuery] = useState('');

  // Form States (Posts CRUD)
  const [postId, setPostId] = useState('');
  const [category, setCategory] = useState('');
  const [showSpecs, setShowSpecs] = useState('show');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sourceLink, setSourceLink] = useState('#');
  const [downloadLink, setDownloadLink] = useState('#');
  
  // Image Upload Slot States
  const [imageSlots, setImageSlots] = useState(['', '', '', '']);
  const [activeSlot, setActiveSlot] = useState(0);
  const [externalUrl, setExternalUrl] = useState('');
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Dynamic Metadata Fields States
  const [metaWarranty, setMetaWarranty] = useState('1 Year');
  const [metaCondition, setMetaCondition] = useState('Brand New');
  const [metaStock, setMetaStock] = useState('In Stock');
  const [metaBoard, setMetaBoard] = useState('');
  const [metaSize, setMetaSize] = useState('');
  const [metaVersion, setMetaVersion] = useState('V1.0');

  // Verify Admin Authentication on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('isAdminAuthenticated') === 'true';
      setIsAuthenticated(auth);
      if (auth) {
        setPostsList(initialPosts);
      }
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuthenticated(true);
      setPostsList(initialPosts);
      if (window.showToast) {
        window.showToast('Access Unlocked. Welcome back, Administrator!', 'success');
      }
    } else {
      if (window.showToast) {
        window.showToast('Access Denied! Incorrect security passcode.', 'danger');
      }
      setPasscode('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    setPasscode('');
    router.push('/');
  };

  // Image Slot Click Selection
  const handleSlotClick = (idx) => {
    setActiveSlot(idx);
    const currentUrl = imageSlots[idx];
    if (currentUrl && !currentUrl.startsWith('data:image')) {
      setExternalUrl(currentUrl);
    } else {
      setExternalUrl('');
    }
  };

  const handleDeleteSlot = (idx, e) => {
    e.stopPropagation();
    const nextSlots = [...imageSlots];
    nextSlots[idx] = '';
    setImageSlots(nextSlots);
    if (activeSlot === idx) {
      setExternalUrl('');
    }
    if (window.showToast) {
      window.showToast(`Slot ${idx + 1} image cleared.`, 'warning');
    }
  };

  const handleExternalUrlChange = (e) => {
    const url = e.target.value;
    setExternalUrl(url);
    const nextSlots = [...imageSlots];
    nextSlots[activeSlot] = url;
    setImageSlots(nextSlots);
  };

  // Process Local File to Base64 with client-side compression
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      if (window.showToast) window.showToast('Only image files are supported!', 'danger');
      return;
    }

    setIsUploading(true);
    // Compress to maximum width 1000px, max height 1000px, quality 0.7
    compressImage(file, 1000, 1000, 0.7)
      .then((compressedBase64) => {
        const nextSlots = [...imageSlots];
        nextSlots[activeSlot] = compressedBase64;
        setImageSlots(nextSlots);
        setIsUploading(false);
        if (window.showToast) {
          window.showToast(`Image slot ${activeSlot + 1} loaded & compressed successfully.`, 'success');
        }
      })
      .catch((err) => {
        console.error("Compression error:", err);
        setIsUploading(false);
        if (window.showToast) window.showToast('Failed to load and compress image.', 'danger');
      });
  };

  // Form Reset Helper
  const resetForm = () => {
    setPostId('');
    setCategory('');
    setShowSpecs('show');
    setTitle('');
    setDescription('');
    setPrice('');
    setSourceLink('#');
    setDownloadLink('#');
    setImageSlots(['', '', '', '']);
    setActiveSlot(0);
    setExternalUrl('');
    setMetaWarranty('1 Year');
    setMetaCondition('Brand New');
    setMetaStock('In Stock');
    setMetaBoard('');
    setMetaSize('');
    setMetaVersion('V1.0');
  };

  // CRUD: Trigger Edit
  const handleEditTrigger = (post) => {
    setPostId(post.id);
    setCategory(post.category);
    setShowSpecs(post.showSpecs === false ? 'hide' : 'show');
    setTitle(post.title);
    setDescription(post.description);
    setPrice(post.price || '');
    setSourceLink(post.link || '#');
    setDownloadLink(post.downloadLink || '#');
    
    // Load images array
    const nextSlots = ['', '', '', ''];
    if (post.images && Array.isArray(post.images)) {
      post.images.forEach((img, idx) => {
        if (idx < 4) nextSlots[idx] = img;
      });
    } else if (post.image) {
      nextSlots[0] = post.image;
    }
    setImageSlots(nextSlots);
    setActiveSlot(0);
    setExternalUrl(nextSlots[0] && !nextSlots[0].startsWith('data:image') ? nextSlots[0] : '');

    // Load specs metadata
    if (post.category === 'store') {
      setMetaWarranty(post.metadata?.warranty || '1 Year');
      setMetaCondition(post.metadata?.condition || 'Brand New');
      setMetaStock(post.metadata?.stock || 'In Stock');
    } else if (post.category === 'repair-articles') {
      setMetaBoard(post.metadata?.board || '');
      setMetaSize(post.metadata?.size || '');
      setMetaVersion(post.metadata?.version || 'V1.0');
    }

    const formPanel = document.querySelector('.admin-form-panel');
    if (formPanel) {
      formPanel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // CRUD: Handle Submit
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      if (window.showToast) window.showToast('Please select a category.', 'warning');
      return;
    }

    const metadata = {};
    if (category === 'store') {
      metadata.warranty = metaWarranty;
      metadata.condition = metaCondition;
      metadata.stock = metaStock;
    } else if (category === 'repair-articles') {
      metadata.board = metaBoard;
      metadata.size = metaSize;
      metadata.version = metaVersion;
    }

    const payload = {
      id: postId || "post-" + Date.now(),
      category,
      title,
      description,
      showSpecs: showSpecs === 'show',
      images: imageSlots,
      link: sourceLink,
      downloadLink,
      price: category === 'store' ? price : '',
      metadata
    };

    if (window.showToast) {
      window.showToast(postId ? 'Updating resource on GitHub...' : 'Creating resource on GitHub...', 'info');
    }

    try {
      const securePasscode = sessionStorage.getItem('isAdminAuthenticated') === 'true' ? 'admin' : '';
      
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-passcode': securePasscode
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit post');
      }

      if (window.showToast) {
        window.showToast(postId ? 'Updated successfully. Rebuilding site...' : 'Added successfully. Rebuilding site...', 'success');
      }

      // Update local state instantly for active feedback
      const updatedPost = resData.post;
      if (postId) {
        setPostsList(prev => prev.map(p => p.id === postId ? updatedPost : p));
      } else {
        setPostsList(prev => [updatedPost, ...prev]);
      }

      resetForm();

    } catch (err) {
      console.error(err);
      if (window.showToast) window.showToast(err.message || 'Failed to sync with GitHub.', 'danger');
    }
  };

  // CRUD: Handle Delete
  const handlePostDelete = async (id) => {
    if (!confirm('Are you absolutely sure you want to delete this resource? This will remove the file from GitHub.')) return;

    if (window.showToast) window.showToast('Deleting resource from GitHub...', 'info');

    try {
      const securePasscode = sessionStorage.getItem('isAdminAuthenticated') === 'true' ? 'admin' : '';

      const response = await fetch(`/api/admin/posts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'admin-passcode': securePasscode
        }
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to delete post');
      }

      if (window.showToast) {
        window.showToast('Resource deleted from GitHub. Rebuilding site...', 'danger');
      }

      // Update state locally
      setPostsList(prev => prev.filter(p => p.id !== id));
      if (postId === id) {
        resetForm();
      }

    } catch (err) {
      console.error(err);
      if (window.showToast) window.showToast(err.message || 'Failed to delete.', 'danger');
    }
  };

  // Settings Save Handler
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();

    if (window.showToast) window.showToast('Syncing configurations with GitHub...', 'info');

    try {
      const securePasscode = sessionStorage.getItem('isAdminAuthenticated') === 'true' ? 'admin' : '';

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-passcode': securePasscode
        },
        body: JSON.stringify(settingsData)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to update settings');
      }

      if (window.showToast) {
        window.showToast('Dynamic configurations saved to GitHub. Rebuilding...', 'success');
      }

    } catch (err) {
      console.error(err);
      if (window.showToast) window.showToast(err.message || 'Failed to save settings.', 'danger');
    }
  };

  const handleSettingsChange = (field, val) => {
    setSettingsData({ ...settingsData, [field]: val });
  };

  const handleSettingsCheckboxChange = (field, e) => {
    setSettingsData({ ...settingsData, [field]: e.target.checked });
  };

  // Filter posts in inventory search
  const getFilteredInventory = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return postsList;
    return postsList.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.metadata && Object.values(p.metadata).some(val => String(val).toLowerCase().includes(q)))
    );
  };

  const filteredInventory = getFilteredInventory();

  // Statistics counters
  const totalPosts = postsList.length;
  const newsCount = postsList.filter(p => p.category === 'tech-news').length;
  const repairCount = postsList.filter(p => p.category === 'repair-articles').length;
  const storeCount = postsList.filter(p => p.category === 'store').length;

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="content-rich-box" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '30px' }}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: '48px', color: 'hsl(var(--primary))', marginBottom: '20px' }}></i>
          <h2>Admin Access</h2>
          <p style={{ color: 'hsl(var(--text-muted))', marginBottom: '24px' }}>Please enter the security passcode to manage administrative features.</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="admin-login-passcode">Security Passcode</label>
              <input 
                type="password" 
                id="admin-login-passcode"
                className="form-control" 
                style={{ textAlign: 'center', letterSpacing: '4px', fontWeight: 700, fontSize: '18px' }} 
                placeholder="••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <i className="fa-solid fa-key"></i> Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section id="view-admin" className="view-section active">
      <div className="admin-hub">
        <div className="admin-header-row">
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-screwdriver-wrench" style={{ color: 'hsl(var(--primary))' }}></i>
              Admin Dashboard
            </h2>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px' }}>
              Manage resource assets, product listings, and dynamic configurations.
            </p>
          </div>
          
          <div className="admin-nav-tabs">
            <span 
              className={`admin-tab-btn ${activeTab === 'manage-posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage-posts')}
            >
              Manage Posts
            </span>
            <span 
              className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              Inbox
            </span>
            <span 
              className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fa-solid fa-sliders"></i> Site Settings
            </span>
            <span 
              className="admin-tab-btn" 
              style={{ color: 'hsl(var(--danger))', fontWeight: 700 }}
              onClick={handleLogout}
            >
              Sign Out
            </span>
          </div>
        </div>

        {/* Dashboard Statistics Overview */}
        <div className="stats-cluster" style={{ margin: 0, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="stat-card" style={{ padding: '16px' }}>
            <div className="stat-val" style={{ fontSize: '24px' }}>{totalPosts}</div>
            <div className="stat-lbl" style={{ fontSize: '11px' }}>Total Posts</div>
          </div>
          <div className="stat-card" style={{ padding: '16px' }}>
            <div className="stat-val" style={{ fontSize: '24px' }}>{newsCount}</div>
            <div className="stat-lbl" style={{ fontSize: '11px' }}>{settingsData.techNewsLabel || "Tech News"}</div>
          </div>
          <div className="stat-card" style={{ padding: '16px' }}>
            <div className="stat-val" style={{ fontSize: '24px' }}>{repairCount}</div>
            <div className="stat-lbl" style={{ fontSize: '11px' }}>{settingsData.repairArticlesLabel || "Repair Articles"}</div>
          </div>
          <div className="stat-card" style={{ padding: '16px' }}>
            <div className="stat-val" style={{ fontSize: '24px' }}>{storeCount}</div>
            <div className="stat-lbl" style={{ fontSize: '11px' }}>{settingsData.storeLabel || "Store"}</div>
          </div>
        </div>

        {/* ================= TAB 1: MANAGE POSTS ================= */}
        {activeTab === 'manage-posts' && (
          <div className="admin-dashboard-layout" id="admin-tab-manage-posts">
            {/* Left Column: Form */}
            <div className="admin-form-panel">
              <h3>
                <i className="fa-solid fa-circle-plus"></i> {postId ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <form onSubmit={handlePostSubmit}>
                <div className="form-group">
                  <label htmlFor="form-category">Category</label>
                  <select 
                    id="form-category" 
                    className="form-control" 
                    style={{ backgroundColor: 'hsl(var(--bg-dark))' }}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="tech-news">{settingsData.techNewsLabel || "Tech News"}</option>
                    <option value="repair-articles">{settingsData.repairArticlesLabel || "Repair Articles"}</option>
                    <option value="store">{settingsData.storeLabel || "Store"}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="form-show-specs">Resource Specs Sidebar</label>
                  <select 
                    id="form-show-specs" 
                    className="form-control" 
                    style={{ backgroundColor: 'hsl(var(--bg-dark))' }}
                    value={showSpecs}
                    onChange={(e) => setShowSpecs(e.target.value)}
                  >
                    <option value="show">Show Specs & Action buttons</option>
                    <option value="hide">Hide Specs & Action/Download buttons</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="form-title">Post / Product Title</label>
                  <input 
                    type="text" 
                    id="form-title" 
                    className="form-control" 
                    placeholder="e.g. Asus Vivobook X510 Working Dump" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-description">Description / Technical Notes (HTML markup allowed)</label>
                  <textarea 
                    id="form-description" 
                    className="form-control" 
                    style={{ minHeight: '120px' }} 
                    placeholder="Add details, chip models, and instructions..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Dynamic Price input for Store */}
                {category === 'store' && (
                  <div className="form-group price-field-group">
                    <label htmlFor="form-price">Price Tag</label>
                    <input 
                      type="text" 
                      id="form-price" 
                      className="form-control" 
                      placeholder="e.g. $15.00 or LKR 4,500" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Dynamic Metadata Specs Grid */}
                {category === 'repair-articles' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Board Code</label>
                      <input type="text" className="form-control" placeholder="e.g. LA-E081P" value={metaBoard} onChange={(e) => setMetaBoard(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>File Info/Size</label>
                      <input type="text" className="form-control" placeholder="e.g. 16 MB" value={metaSize} onChange={(e) => setMetaSize(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Version/Code</label>
                      <input type="text" className="form-control" placeholder="e.g. V1.0" value={metaVersion} onChange={(e) => setMetaVersion(e.target.value)} />
                    </div>
                  </div>
                )}

                {category === 'store' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Warranty</label>
                      <input type="text" className="form-control" placeholder="e.g. 1 Year" value={metaWarranty} onChange={(e) => setMetaWarranty(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Condition</label>
                      <input type="text" className="form-control" placeholder="e.g. Brand New" value={metaCondition} onChange={(e) => setMetaCondition(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Availability</label>
                      <input type="text" className="form-control" placeholder="e.g. In Stock" value={metaStock} onChange={(e) => setMetaStock(e.target.value)} />
                    </div>
                  </div>
                )}

                {/* 4-Slot Image Uploader */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label>Resource Images (Up to 4)</label>
                  <div className="image-slots-container">
                    {imageSlots.map((slot, idx) => (
                      <div 
                        key={idx} 
                        className={`image-slot ${idx === activeSlot ? 'active' : ''}`}
                        onClick={() => handleSlotClick(idx)}
                        title={idx === 0 ? 'Select Cover (Slot 1)' : `Select Slot ${idx + 1}`}
                      >
                        <div className="slot-badge">{idx === 0 ? 'Cover' : `Img ${idx + 1}`}</div>
                        {slot ? (
                          <>
                            <img className="slot-thumb" src={slot} style={{ display: 'block' }} alt="slot" />
                            <div className="slot-delete" style={{ display: 'flex' }} onClick={(e) => handleDeleteSlot(idx, e)} title="Remove Image">
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </>
                        ) : (
                          <i className="fa-solid fa-plus slot-icon" style={{ display: 'block' }}></i>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Upload Control Button Zone */}
                  <div 
                    className="upload-zone" 
                    id="image-upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className={isUploading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-cloud-arrow-up"}></i>
                    <p>{isUploading ? 'Loading Image File...' : `Upload image to ${activeSlot === 0 ? 'Cover (Slot 1)' : `Slot ${activeSlot + 1}`}`}</p>
                    <span>Supports JPG, PNG, WebP (Max 2MB)</span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange}
                    />
                  </div>

                  <div style={{ margin: '10px 0', textAlign: 'center', fontSize: '11px', color: 'hsl(var(--text-muted))' }}>- OR -</div>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Paste external image URL for selected slot here..." 
                    value={externalUrl}
                    onChange={handleExternalUrlChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-link">External / Source Link</label>
                  <input type="text" id="form-link" className="form-control" placeholder="e.g. https://www.motherboard.net" value={sourceLink} onChange={(e) => setSourceLink(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="form-download">Download Link (Optional)</label>
                  <input type="text" id="form-download" className="form-control" placeholder="e.g. https://google-drive.com/bios.bin" value={downloadLink} onChange={(e) => setDownloadLink(e.target.value)} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {postId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm} style={{ flex: 1 }}>
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                    {postId ? 'Update Resource' : 'Add Resource'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Inventory Table */}
            <div className="admin-items-panel">
              <div className="admin-panel-header">
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Database Inventory</h3>
                <div className="admin-search">
                  <div className="admin-search-container">
                    <input 
                      type="text" 
                      placeholder="Search database..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Resource Details</th>
                      <th>Category</th>
                      <th>Extra Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map(post => {
                        let catDisplay = "REPAIR";
                        if (post.category === "tech-news") catDisplay = (settingsData.techNewsLabel || "Tech News").toUpperCase();
                        else if (post.category === "repair-articles") catDisplay = (settingsData.repairArticlesLabel || "Repair Articles").toUpperCase();
                        else if (post.category === "store") catDisplay = (settingsData.storeLabel || "Store").toUpperCase();

                        let subDetail = "";
                        if (post.category === "store") {
                          subDetail = <span style={{ color: 'hsl(var(--accent))', fontWeight: 700 }}>{post.price || "N/A"}</span>;
                        } else if (post.category === "repair-articles") {
                          subDetail = post.metadata?.board || "N/A";
                        } else {
                          subDetail = "News Item";
                        }

                        // Determine Badge Styling Class
                        const getBadgeClass = (cat) => {
                          if (cat === "tech-news") return "softwares";
                          if (cat === "repair-articles") return "bios";
                          return "shop";
                        };

                        return (
                          <tr key={post.id}>
                            <td>
                              <div className="admin-table-item">
                                <img src={post.image || "/images/posts/default.png"} className="admin-table-thumb" alt="thumb" />
                                <div style={{ overflow: 'hidden' }}>
                                  <div className="admin-table-name" title={post.title}>{post.title}</div>
                                  <div style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {post.description.replace(/<[^>]*>/g, '').substring(0, 45)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`card-badge badge-${getBadgeClass(post.category)}`} style={{ position: 'static', fontSize: '10px', padding: '2px 8px' }}>
                                {catDisplay}
                              </span>
                            </td>
                            <td style={{ fontSize: '13px', fontWeight: 600 }}>
                              {subDetail}
                            </td>
                            <td>
                              <div className="admin-action-btns">
                                <button className="admin-btn-icon btn-edit" title="Edit Post" onClick={() => handleEditTrigger(post)}>
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <button className="admin-btn-icon btn-delete" title="Delete Post" onClick={() => handlePostDelete(post.id)}>
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4">
                          <div className="empty-state">
                            <i className="fa-solid fa-folder-open"></i>
                            <p>No inventory items match your criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INBOX ================= */}
        {activeTab === 'messages' && (
          <div className="admin-items-panel" style={{ width: '100%' }}>
            <div className="admin-panel-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Contact Inquiries</h3>
            </div>
            <div style={{ padding: '30px 10px', textAlign: 'center', background: 'hsl(var(--bg-dark))', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color) / 0.5)' }}>
              <i className="fa-solid fa-inbox" style={{ fontSize: '40px', color: 'hsl(var(--primary))', marginBottom: '16px', display: 'block', opacity: 0.6 }}></i>
              <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Netlify Forms Integration Active</h4>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', maxWidth: '550px', margin: '0 auto', lineHeight: 1.6 }}>
                Customer messages submitted through the Contact Form are securely captured and managed within your **Netlify Forms Dashboard**. 
                You can configure automatic email notifications and export submissions directly from your Netlify account!
              </p>
              <a 
                href="https://app.netlify.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary" 
                style={{ display: 'inline-flex', marginTop: '20px', padding: '10px 24px' }}
              >
                Open Netlify Dashboard <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: '8px' }}></i>
              </a>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SITE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="admin-items-panel" style={{ width: '100%' }}>
            <div className="admin-panel-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
                <i className="fa-solid fa-sliders"></i> Dynamic Site Configurations
              </h3>
            </div>
            
            <form onSubmit={handleSettingsSubmit} style={{ maxWidth: '900px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                
                {/* Branding & Logos */}
                <div style={{ background: 'hsl(var(--bg-dark))', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color) / 0.5)' }}>
                  <h4 style={{ marginBottom: '15px', color: 'hsl(var(--primary))', fontSize: '15px', fontWeight: 700 }}>
                    <i className="fa-solid fa-tags"></i> Branding & Logos
                  </h4>
                  <div className="form-group">
                    <label>Website Name / Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsData.siteName} 
                      onChange={(e) => handleSettingsChange('siteName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Logo Brand Text</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsData.logoText} 
                      onChange={(e) => handleSettingsChange('logoText', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Logo Icon (FontAwesome Class)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsData.logoIcon} 
                      onChange={(e) => handleSettingsChange('logoIcon', e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* Custom Category Labels */}
                <div style={{ background: 'hsl(var(--bg-dark))', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color) / 0.5)' }}>
                  <h4 style={{ marginBottom: '15px', color: 'hsl(var(--accent))', fontSize: '15px', fontWeight: 700 }}>
                    <i className="fa-solid fa-folder-tree"></i> Custom Category Labels
                  </h4>
                  <div className="form-group">
                    <label>Tech News Label</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsData.techNewsLabel} 
                      onChange={(e) => handleSettingsChange('techNewsLabel', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Repair Articles Label</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsData.repairArticlesLabel} 
                      onChange={(e) => handleSettingsChange('repairArticlesLabel', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Store Label</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsData.storeLabel} 
                      onChange={(e) => handleSettingsChange('storeLabel', e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* Homepage Hero Settings */}
                <div style={{ background: 'hsl(var(--bg-dark))', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color) / 0.5)', gridColumn: 'span 2' }}>
                  <h4 style={{ marginBottom: '15px', color: 'hsl(var(--primary))', fontSize: '15px', fontWeight: 700 }}>
                    <i className="fa-solid fa-house-laptop"></i> Homepage Hero Section
                  </h4>
                  <div className="form-group">
                    <label>Hero Title (HTML supported)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsData.heroTitle} 
                      onChange={(e) => handleSettingsChange('heroTitle', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Hero Description / Subtitle</label>
                    <textarea 
                      className="form-control" 
                      style={{ minHeight: '80px' }}
                      value={settingsData.heroDesc} 
                      onChange={(e) => handleSettingsChange('heroDesc', e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Menu Bar Visibility Customization */}
              <div style={{ background: 'hsl(var(--bg-dark))', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color) / 0.5)', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '15px', color: 'hsl(var(--secondary))', fontSize: '15px', fontWeight: 700 }}><i className="fa-solid fa-bars"></i> Menu Bar Link Customization</h4>
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '12px', marginBottom: '15px' }}>Check the pages you want to show in the header navigation menu bar:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showHome} onChange={(e) => handleSettingsCheckboxChange('showHome', e)} /> Home
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showNews} onChange={(e) => handleSettingsCheckboxChange('showNews', e)} /> Tech News
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showRepair} onChange={(e) => handleSettingsCheckboxChange('showRepair', e)} /> Repair Articles
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showStore} onChange={(e) => handleSettingsCheckboxChange('showStore', e)} /> Store
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showAdmin} onChange={(e) => handleSettingsCheckboxChange('showAdmin', e)} /> Admin Portal
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showAbout} onChange={(e) => handleSettingsCheckboxChange('showAbout', e)} /> About Us
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showContact} onChange={(e) => handleSettingsCheckboxChange('showContact', e)} /> Contact Us
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showPrivacy} onChange={(e) => handleSettingsCheckboxChange('showPrivacy', e)} /> Privacy Policy
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showTerms} onChange={(e) => handleSettingsCheckboxChange('showTerms', e)} /> Terms & Conditions
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showDisclaimer} onChange={(e) => handleSettingsCheckboxChange('showDisclaimer', e)} /> Disclaimer
                  </label>
                </div>
                <div style={{ marginTop: '15px', borderTop: '1px solid hsl(var(--border-color) / 0.5)', paddingTop: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={settingsData.showStatsCounters} onChange={(e) => handleSettingsCheckboxChange('showStatsCounters', e)} /> Show Dashboard Statistics Cards on Homepage
                  </label>
                </div>
              </div>

              {/* Support & Social Links */}
              <div style={{ background: 'hsl(var(--bg-dark))', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color) / 0.5)', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '15px', color: 'hsl(var(--warning))', fontSize: '15px', fontWeight: 700 }}><i className="fa-solid fa-address-book"></i> Support & Social Media Links</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div className="form-group">
                    <label>Support Email Address</label>
                    <input type="email" className="form-control" value={settingsData.email} onChange={(e) => handleSettingsChange('email', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Number (with country code)</label>
                    <input type="text" className="form-control" value={settingsData.phone} onChange={(e) => handleSettingsChange('phone', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>YouTube Channel Link</label>
                    <input type="text" className="form-control" value={settingsData.youtubeUrl} onChange={(e) => handleSettingsChange('youtubeUrl', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>YouTube Channel Name</label>
                    <input type="text" className="form-control" value={settingsData.youtubeName} onChange={(e) => handleSettingsChange('youtubeName', e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Statutory Page Contents */}
              <div style={{ background: 'hsl(var(--bg-dark))', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color) / 0.5)', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '15px', color: 'hsl(var(--text-primary))', fontSize: '15px', fontWeight: 700 }}>
                  <i className="fa-solid fa-file-contract"></i> Statutory & Static Page Content (HTML Supported)
                </h4>
                <div className="form-group">
                  <label>About Us Page Content</label>
                  <textarea className="form-control" style={{ minHeight: '120px' }} value={settingsData.aboutUs} onChange={(e) => handleSettingsChange('aboutUs', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Privacy Policy Content</label>
                  <textarea className="form-control" style={{ minHeight: '120px' }} value={settingsData.privacyPolicy} onChange={(e) => handleSettingsChange('privacyPolicy', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Terms & Conditions Content</label>
                  <textarea className="form-control" style={{ minHeight: '120px' }} value={settingsData.termsConditions} onChange={(e) => handleSettingsChange('termsConditions', e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Legal Disclaimer Content</label>
                  <textarea className="form-control" style={{ minHeight: '120px' }} value={settingsData.disclaimer} onChange={(e) => handleSettingsChange('disclaimer', e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                <i className="fa-solid fa-floppy-disk"></i> Save Dynamic Site Configurations
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
