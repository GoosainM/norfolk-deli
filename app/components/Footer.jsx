export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p className="footer-location"> 6 Norfolk Road, Sea Point, Cape Town 8005</p>
        <div className="footer-social">
          <a href="https://www.instagram.com/norfolk.deli/" target="_blank" rel="noopener noreferrer" className="instagram-link" title="Follow us on Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
        </div>
        <div className="footer-map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.871801831872!2d18.388836376829743!3d-33.91802902146917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc67290196bb15%3A0x6bd70db81ed68ad4!2s6%20Norfolk%20Rd%2C%20Sea%20Point%2C%20Cape%20Town%2C%208005!5e0!3m2!1sen!2sza!4v1710000000000!5m2!1sen!2sza" 
            width="100%" 
            height="260" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        {/* Copyright notice */}
<p className="footer-copy" style={{ marginTop: '1.5rem' }}>
  &copy; 2026 Designed by Matthews Developments | All Rights Reserved
</p>
      </div>
    </footer>
  );
}