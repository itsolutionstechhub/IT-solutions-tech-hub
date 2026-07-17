import React from 'react';
import settings from '../../../../../content/settings.json';
import posts from '../../../../../content/posts.json';
import DetailCarousel from '../../../../components/DetailCarousel';
import BackButton from '../../../../components/BackButton';

// Helper to generate slug for comparison
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Generate static parameters for SSG
export async function generateStaticParams() {
  return posts.map((post) => ({
    id: post.id,
    slug: generateSlug(post.title),
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const post = posts.find(p => p.id === params.id);
  if (!post) {
    return {
      title: "Resource Not Found",
    };
  }

  const cleanDesc = post.description.replace(/<[^>]*>/g, '').substring(0, 150) + "...";
  return {
    title: `${post.title} - ${settings.siteName || "IT Solutions Pro"}`,
    description: cleanDesc,
    alternates: {
      canonical: `/posts/${post.id}/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: cleanDesc,
      type: 'article',
      images: [post.image || ""],
    }
  };
}

export default function PostDetail({ params }) {
  const post = posts.find(p => p.id === params.id);

  if (!post) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <BackButton />
        <h2>Resource Not Found</h2>
        <p>The requested hardware repair file or tech news article could not be found.</p>
      </div>
    );
  }

  const isStore = post.category === 'store';
  const showSpecs = post.showSpecs !== false;

  // Format Category Badge
  let catDisplay = "Repair Article";
  let badgeClass = "bios";
  if (post.category === "tech-news") {
    catDisplay = settings.techNewsLabel || "Tech News";
    badgeClass = "softwares";
  } else if (post.category === "repair-articles") {
    catDisplay = settings.repairArticlesLabel || "Repair Articles";
    badgeClass = "bios";
  } else if (post.category === "store") {
    catDisplay = settings.storeLabel || "Store";
    badgeClass = "shop";
  }

  // Format Date
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // CTA Links
  const rawPhone = (settings.phone || '').replace(/[+\s-]/g, '');
  const waText = encodeURIComponent(`Hi ${settings.siteName}! I am interested in purchasing "${post.title}". Is it currently available?`);
  const waLink = `https://wa.me/${rawPhone}?text=${waText}`;
  const hasDownload = post.downloadLink && post.downloadLink !== '#';

  return (
    <section id="view-post-detail" className="view-section active">
      <BackButton />

      <div className="content-rich-box" style={{ padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--border-color))' }}>
        
        {/* Detail Header */}
        <div style={{ borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '20px', marginBottom: '24px' }}>
          <div className={`card-badge badge-${badgeClass}`} style={{ position: 'static', display: 'inline-block', marginBottom: '12px', fontSize: '11px' }}>
            {catDisplay}
          </div>
          <h1 id="detail-title" className="glow-text" style={{ fontSize: '34px', lineHeight: '1.2', marginBottom: '12px', fontWeight: 800 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'hsl(var(--text-muted))', fontSize: '13px' }}>
            <span>
              <i className="fa-solid fa-calendar-days" style={{ color: 'hsl(var(--primary))', marginRight: '6px' }}></i> 
              Published: {formattedDate}
            </span>
          </div>
        </div>

        {/* Media Carousel */}
        <div 
          id="detail-media-container" 
          style={{ 
            height: '480px', 
            width: '100%', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            background: 'hsl(var(--bg-dark))', 
            border: '1px solid hsl(var(--border-color))', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative', 
            marginBottom: '30px' 
          }}
        >
          <DetailCarousel images={post.images} coverImage={post.image} />
        </div>

        {/* Details Grid layout */}
        <div 
          className="detail-split-layout" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: showSpecs ? '2.2fr 1fr' : '1fr', 
            gap: '30px', 
            alignItems: 'start' 
          }}
        >
          {/* Left Area (Description) */}
          <div>
            <h3 style={{ color: 'hsl(var(--primary))', marginBottom: '15px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-file-waveform"></i> Article Details & Tech Notes
            </h3>
            <div 
              id="detail-description" 
              style={{ color: 'hsl(var(--text-secondary))', fontSize: '15px', lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: post.description }}
            />
          </div>

          {/* Right Area (Specs & CTAs) */}
          {showSpecs && (
            <div id="detail-specs-sidebar" style={{ background: 'hsl(var(--bg-card))', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--border-color))' }}>
              
              {isStore ? (
                <>
                  <h3 id="detail-side-header" style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--accent))' }}>
                    <i className="fa-solid fa-tag"></i> Price: {post.price || "N/A"}
                  </h3>
                  
                  <div id="detail-specs-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid hsl(var(--border-color) / 0.5)', padding: '8px 0' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>Warranty</span>
                      <span style={{ fontWeight: 600 }}>{post.metadata?.warranty || "N/A"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid hsl(var(--border-color) / 0.5)', padding: '8px 0' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>Condition</span>
                      <span style={{ fontWeight: 600 }}>{post.metadata?.condition || "Brand New"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '8px 0' }}>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>Availability</span>
                      <span style={{ fontWeight: 600, color: 'hsl(var(--accent))' }}>{post.metadata?.stock || "In Stock"}</span>
                    </div>
                  </div>

                  <div id="detail-actions-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-shop-buy" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                      <i className="fa-brands fa-whatsapp"></i> Order on WhatsApp
                    </a>
                    {post.link && post.link !== '#' && (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                        <i className="fa-solid fa-earth-americas"></i> Visit Web Page
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 id="detail-side-header" style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--accent))' }}>
                    <i className="fa-solid fa-circle-info"></i> Resource Specs
                  </h3>

                  {post.metadata && (
                    <div id="detail-specs-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid hsl(var(--border-color) / 0.5)', padding: '8px 0' }}>
                        <span style={{ color: 'hsl(var(--text-muted))' }}>Board Code</span>
                        <span style={{ fontWeight: 600 }}>{post.metadata.board || "N/A"}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid hsl(var(--border-color) / 0.5)', padding: '8px 0' }}>
                        <span style={{ color: 'hsl(var(--text-muted))' }}>File Info / Size</span>
                        <span style={{ fontWeight: 600 }}>{post.metadata.size || "N/A"}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '8px 0' }}>
                        <span style={{ color: 'hsl(var(--text-muted))' }}>Version / Code</span>
                        <span style={{ fontWeight: 600 }}>{post.metadata.version || "V1.0"}</span>
                      </div>
                    </div>
                  )}

                  <div id="detail-actions-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <a 
                      href={hasDownload ? post.downloadLink : '#'} 
                      className="btn btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                      download={hasDownload}
                    >
                      <i className="fa-solid fa-cloud-arrow-down"></i> {hasDownload ? 'Download File Asset' : 'Download File Now'}
                    </a>
                    {post.link && post.link !== '#' && (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                        <i className="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Source
                      </a>
                    )}
                  </div>
                </>
              )}

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
