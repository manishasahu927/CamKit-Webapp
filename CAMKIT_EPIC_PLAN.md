# CamKit Website Implementation - Epic Planning Document

**Epic:** Implement CamKit Rentals & Events Website
**Figma Design:** https://www.figma.com/design/ZtUF5eawec0RduMxJK1Ymo/CamKit?node-id=2009-91&p=f
**Technology Stack:** Pure HTML, CSS, JavaScript (No frameworks)
**Target:** Fully responsive website for all screen sizes including mobile

---

## 1. Epic Overview

### Purpose
Convert the CamKit Figma designs into a fully functional, responsive website for a camera equipment rental and event photography services company based in Bengaluru, India.

### User Value
- Customers can browse and select camera equipment for rental
- Users can view event photography services offered
- Easy date selection and booking flow
- Mobile-friendly experience for on-the-go browsing
- Professional presentation building trust with testimonials

### Scope
**Included:**
- Homepage with hero section, rental flow, product catalog, testimonials, footer
- About Us page
- Events page
- Product details modal/page
- Shopping cart functionality
- Responsive design (Desktop, Tablet, Mobile)
- WhatsApp integration for contact

**Excluded:**
- Backend/server implementation
- Payment gateway integration
- User authentication system
- Database implementation
- Admin panel

### Key Stakeholders
- CamKit business owners
- Website visitors (photographers, videographers, event organizers)
- Development team

---

## 2. Epic Goals & Success Metrics

### Primary Goal
Deliver a pixel-perfect, responsive implementation of the CamKit Figma design using pure HTML, CSS, and JavaScript.

### Success Metrics
- 100% design fidelity to Figma mockups
- Lighthouse Performance Score > 90
- Mobile responsiveness across all major breakpoints (320px - 1920px)
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Page load time < 3 seconds

### KPIs
- All interactive elements functional (date pickers, category filters, cart)
- Smooth animations and transitions
- Accessible navigation (keyboard navigable)

---

## 3. Design Specifications

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Font Weights:** 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)

### Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Sage Green | `#81AB90` | Primary accent, "Rentals" button, selected states |
| Dusty Rose | `#E28495` | Secondary accent, "Events" button, highlights |
| Orange | `#EA9026` | Tertiary accent, duration badge, star ratings |
| Warm Beige | `#E7DBC6` | Primary background color |
| Off-White | `#EBECE9` | Card backgrounds, light sections |
| Light Gray | `#E4E5E1` | Neutral elements, borders |
| Dark Brown/Black | `#151312` | Primary text, footer background |

### Breakpoints
| Device | Width |
|--------|-------|
| Mobile | 320px - 767px |
| Tablet | 768px - 1023px |
| Desktop | 1024px - 1440px |
| Large Desktop | 1441px+ |

---

## 4. Page Structure & Components

### 4.1 Homepage (index.html)

#### Header/Navigation
- Logo (left)
- Navigation links: Rentals, Events, About
- Cart icon with item count badge (right)
- Sticky on scroll

#### Hero Section
- Large headline: "your trusted partner for **kit rentals**"
- Subtext describing services
- Customer avatars with 5.0 rating
- Testimonial quote snippet
- Hero image (camera in hands)
- Pink decorative star element
- "Rentals" and "Events" toggle buttons
- WhatsApp floating button

#### Step 1: Choose Your Dates
- Section label "STEP 1"
- "Choose your dates" heading
- Pick-up date input with calendar icon
- Drop-off date input with calendar icon
- Duration display badge (calculated days)

#### Step 2: Select Your Gear
- Section label "STEP 2"
- "Select your gear" heading
- Category filter tabs: All, Cameras, Lenses, Lighting, Audio, Other Equipment
- Product grid (2-column on desktop, 1-column on mobile)
- Product cards with:
  - Category badge (e.g., "FULL-FRAME MIRRORLESS")
  - Product image
  - Product name
  - "ask for price / day" text
  - "details" link with arrow
  - Add to cart button (+)
- "View more" button

#### Shopping Cart Sidebar
- "YOUR CART" heading
- Cart items list with product name, duration, remove button
- Total products count
- Total days
- "Confirm Booking" button

#### Testimonials Section
- "TESTIMONIALS" label
- "read what our customers **say about us.**" heading
- Testimonial cards (4 visible):
  - Customer photo
  - Review text
  - Customer name
  - Star rating
  - Time ago
- Horizontal scroll on mobile

#### Footer
- Large "CamKit" text background (gradient pink to transparent)
- 4-column layout:
  - CAMKIT RENTALS: Cameras, Lenses & Filters, Lighting Kits, Audio Gears
  - CAMKIT EVENTS: Wedding Photography, Corporate Events, Pre-wedding Shoots, Portrait Sessions, Portfolio
  - CONTACT: Address (JP Nagar Phase 5, Bengaluru), Phone, Email
  - COMPANY: About Us, Privacy Policy, Terms of Service
- Copyright notice

### 4.2 About Us Page (about.html)
- Header (same as homepage)
- About content with team/company images
- Company story and values
- Footer (same as homepage)

### 4.3 Events Page (events.html)
- Header (same as homepage)
- Event services listing
- Service cards with images
- Booking/inquiry CTA
- Footer (same as homepage)

### 4.4 Product Details Modal/Page
- Back navigation
- Large product image
- Product specifications
- Pricing information
- Add to cart button
- Related products

---

## 5. Technical Change Overview

| Component | Type | Description | Risk | Priority |
|-----------|------|-------------|------|----------|
| Project Setup | New | Create folder structure, base HTML/CSS/JS files | Low | P0 |
| CSS Variables | New | Define design tokens (colors, fonts, spacing) | Low | P0 |
| Header Component | New | Logo, navigation, cart icon | Low | P1 |
| Hero Section | New | Headlines, hero image, rating badge, CTA buttons | Medium | P1 |
| Date Picker | New | Custom date inputs with calendar functionality | Medium | P1 |
| Category Tabs | New | Filter tabs with active state | Low | P1 |
| Product Grid | New | Responsive product card layout | Low | P1 |
| Product Card | New | Image, title, price, add button | Low | P1 |
| Shopping Cart | New | Sidebar cart with items, totals | Medium | P1 |
| Testimonials | New | Horizontal scrollable testimonial cards | Low | P2 |
| Footer | New | Multi-column footer with links | Low | P2 |
| Mobile Navigation | New | Hamburger menu, mobile nav drawer | Medium | P1 |
| Responsive Styles | New | Media queries for all breakpoints | Medium | P1 |
| About Page | New | About us page content and layout | Low | P2 |
| Events Page | New | Events services page | Low | P2 |
| Animations | New | Hover effects, transitions, scroll animations | Low | P3 |

---

## 6. File Structure

```
D:\CamkitWebapp\
├── index.html                 # Homepage
├── about.html                 # About Us page
├── events.html                # Events page
├── css/
│   ├── styles.css             # Main stylesheet
│   ├── variables.css          # CSS custom properties
│   ├── header.css             # Header styles
│   ├── hero.css               # Hero section styles
│   ├── products.css           # Product grid/cards styles
│   ├── cart.css               # Shopping cart styles
│   ├── testimonials.css       # Testimonials section styles
│   ├── footer.css             # Footer styles
│   └── responsive.css         # Media queries
├── js/
│   ├── main.js                # Main JavaScript
│   ├── cart.js                # Cart functionality
│   ├── datepicker.js          # Date picker functionality
│   ├── filters.js             # Category filter functionality
│   └── navigation.js          # Mobile nav functionality
├── assets/
│   ├── images/                # Optimized images
│   │   ├── hero/
│   │   ├── products/
│   │   ├── testimonials/
│   │   └── about/
│   └── icons/                 # SVG icons
└── Camkit/                    # Original design assets (existing)
```

---

## 7. Implementation Tickets

### Phase 1: Foundation (P0)

#### Ticket 1.1: Project Setup & Base Structure
**Story Points:** 2
- Create folder structure
- Set up base HTML templates with semantic markup
- Create CSS variables file with design tokens
- Set up main JavaScript file
- Link Google Fonts (Inter)

#### Ticket 1.2: CSS Reset & Base Styles
**Story Points:** 1
- Implement CSS reset/normalize
- Set up base typography styles
- Define utility classes
- Set up CSS custom properties for colors and spacing

### Phase 2: Core Components (P1)

#### Ticket 2.1: Header & Navigation
**Story Points:** 3
- Implement desktop header with logo and nav links
- Style navigation with hover states
- Add cart icon with badge counter
- Make header sticky on scroll
- Implement mobile hamburger menu
- Create mobile navigation drawer

#### Ticket 2.2: Hero Section
**Story Points:** 5
- Create hero layout with text and image
- Implement headline with highlighted text styling
- Add customer avatars row with rating
- Add testimonial snippet
- Position decorative star element
- Implement "Rentals" / "Events" toggle buttons
- Add WhatsApp floating button
- Make fully responsive

#### Ticket 2.3: Date Picker Section
**Story Points:** 4
- Create Step 1 section layout
- Implement custom date input styling
- Add calendar icon integration
- Create date picker JavaScript functionality
- Calculate and display duration
- Style duration badge
- Mobile responsive layout

#### Ticket 2.4: Category Filter Tabs
**Story Points:** 2
- Create filter tabs row
- Implement active state styling
- Add JavaScript filter functionality
- Smooth transitions between states

#### Ticket 2.5: Product Grid & Cards
**Story Points:** 5
- Create responsive product grid (CSS Grid)
- Design product card component
- Add category badge styling
- Implement hover effects
- Add "details" link with arrow
- Create add-to-cart button
- Implement "View more" button
- Populate with product data

#### Ticket 2.6: Shopping Cart Sidebar
**Story Points:** 4
- Create cart sidebar layout
- Style cart item rows
- Implement remove item functionality
- Calculate totals
- Style "Confirm Booking" button
- Add cart open/close functionality
- Mobile cart view (full screen or bottom sheet)

#### Ticket 2.7: Mobile Responsiveness - Core
**Story Points:** 4
- Implement mobile header
- Stack hero content vertically
- Single column product grid
- Full-width date inputs
- Touch-friendly cart interactions

### Phase 3: Additional Sections (P2)

#### Ticket 3.1: Testimonials Section
**Story Points:** 3
- Create testimonials section layout
- Design testimonial card component
- Implement horizontal scroll on mobile
- Add customer photos and ratings
- Style "say about us" highlighted text

#### Ticket 3.2: Footer
**Story Points:** 3
- Create 4-column footer layout
- Add large "CamKit" background text with gradient
- Style footer links
- Add contact information with icons
- Make responsive (stack on mobile)
- Add copyright notice

#### Ticket 3.3: About Us Page
**Story Points:** 3
- Create about.html page
- Reuse header and footer components
- Add about content sections
- Include team/company images
- Make responsive

#### Ticket 3.4: Events Page
**Story Points:** 3
- Create events.html page
- Reuse header and footer components
- Add event services content
- Style service cards
- Make responsive

### Phase 4: Polish & Optimization (P3)

#### Ticket 4.1: Animations & Transitions
**Story Points:** 2
- Add hover animations on buttons
- Smooth scroll behavior
- Page load animations
- Cart open/close animations
- Filter tab transitions

#### Ticket 4.2: Image Optimization
**Story Points:** 2
- Optimize all images (compression, sizing)
- Implement lazy loading
- Add image alt texts
- Create responsive image srcsets

#### Ticket 4.3: Performance Optimization
**Story Points:** 2
- Minimize CSS/JS
- Critical CSS extraction
- Async font loading
- Performance audit and fixes

#### Ticket 4.4: Cross-Browser Testing & Fixes
**Story Points:** 2
- Test on Chrome, Firefox, Safari, Edge
- Fix any browser-specific issues
- Test on real mobile devices
- Final responsive adjustments

---

## 8. Asset Inventory

### SVG Icons Available
- `Logo.svg` - CamKit logo
- `Cart.svg` - Shopping cart
- `Add.svg` - Plus/add button
- `Cancel.svg` - Close/remove
- `Arrow.svg` - Navigation arrow
- `Back.svg` - Back navigation
- `Calender.svg` - Calendar icon
- `Call.svg` - Phone icon
- `Location.svg` - Map pin
- `address.svg` - Address icon
- `WhatsApp.svg` - WhatsApp icon
- `Star.svg` - Rating star
- `Check mark.svg` - Checkmark
- `time.svg` - Time/clock
- `Rupee.svg` - Currency symbol
- `shield.svg` - Security badge
- `Doc.svg` - Document icon
- `Pointer arrow.svg` - Pointer

### Product Images
Located in `Camkit/Images/Product Images/`:
- Camera images (Canon EOS 200D, Sony cameras, etc.)
- Lens images (24-70mm, 35mm, 50mm, etc.)
- Lighting equipment
- Tripods and accessories

### Hero & Decorative Images
- `Hero Image.png` - Main hero section image
- `Star 1.png`, `Star 2.png` - Decorative star elements
- `Pin.png` - Location pin

### About Page Images
Located in `Camkit/Images/About us page images/`:
- Team/company photos
- Brand imagery

---

## 9. Testing Strategy

### Unit Testing
- Test cart add/remove functionality
- Test date picker calculations
- Test filter state management
- Test responsive breakpoint triggers

### Visual Testing
- Compare implementation against Figma designs
- Check all color values match specifications
- Verify typography matches design
- Validate spacing and alignment

### Responsive Testing
- Test at all defined breakpoints
- Test on actual devices (iOS, Android)
- Verify touch interactions
- Check orientation changes

### Cross-Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari
- Mobile Chrome

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus indicators

---

## 10. Acceptance Criteria

### Definition of Done
- [ ] All pages implemented (Home, About, Events)
- [ ] Design matches Figma at all breakpoints
- [ ] All interactive elements functional
- [ ] Cart functionality working
- [ ] Date picker working
- [ ] Category filters working
- [ ] Mobile navigation working
- [ ] All images optimized and loading
- [ ] Cross-browser tested
- [ ] Performance score > 90 on Lighthouse
- [ ] Code is clean and well-commented
- [ ] Files organized per structure specification

---

## 11. Open Questions & Assumptions

### Assumptions
1. Website is static/front-end only (no backend)
2. "Confirm Booking" will link to WhatsApp or email
3. Product prices are "ask for price" (no actual pricing)
4. Cart data persists in localStorage
5. Date picker uses native date inputs with custom styling

### Open Questions
1. Should the Events page have a booking form?
2. Are there specific SEO requirements?
3. Should we implement a product details modal or separate page?
4. Is there any analytics tracking required?

---

## 12. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex date picker functionality | Medium | Use proven vanilla JS patterns, test thoroughly |
| Cart state management complexity | Medium | Use localStorage, implement clear data structure |
| Image optimization for performance | Low | Compress images, implement lazy loading |
| Cross-browser date input compatibility | Medium | Implement custom date picker UI if needed |
| Mobile touch interactions | Low | Test on real devices, use touch-friendly sizing |

---

## 13. Timeline Summary

| Phase | Tickets | Estimated Story Points |
|-------|---------|------------------------|
| Phase 1: Foundation | 1.1, 1.2 | 3 |
| Phase 2: Core Components | 2.1 - 2.7 | 27 |
| Phase 3: Additional Sections | 3.1 - 3.4 | 12 |
| Phase 4: Polish & Optimization | 4.1 - 4.4 | 8 |
| **Total** | **15 Tickets** | **50 Story Points** |

---

## Next Steps

After approval of this planning document, run:

```
/create-implementation-plan CAMKIT_EPIC_PLAN.md
```

This will generate a detailed step-by-step implementation guide for each ticket.
