# GovSkill Editorial Illustrations System

Source specification and prompt registry for the 5 editorial illustrations powering the GovSkill product website.

---

## Global Style Anchors (Locked Across All 5 Assets)

- **Medium**: Mid-century editorial printmaking, lithograph, and fine pen-and-ink line work.
- **Palette**: Strictly drawn from design system tokens:
  - Cream Ground: `#F5EFE0`
  - Deep Ink: `#0A0A0A`
  - Muted Ink: `#6B6357`
  - Terracotta: `#C97B5A`
  - Olive Drab: `#7B7A4E`
  - Ochre Accent: `#C9A24A`
  - Dusty Blue: `#6B8299`
  - Paper Accent: `#EFE6D2`
- **Texture**: 8–12% fibrous archival paper grain overlay.
- **Figures**: Stylized silhouettes with confident ink contours and flat tone blocks. No photographic rendering, no realistic faces, no glossy 3D CGI.
- **Inclusivity**: Diverse silhouettes and skin tone blocks reflecting state administrative realities.
- **Negative Space**: Generous open field acting as an active typographic container.
- **Negative Prompts**: `3D render, CGI, glossy, photorealistic, neon colors, cyan, magenta, purple gradients, corporate flat vector, clipart, stock photography, busy clutter`.

---

## 1. Hero Illustration — The Civil Servant at Desk

- **Asset Path**: `/illustrations/hero-civil-servant.jpg`
- **Aspect Ratio**: `3:4` (vertical portrait)
- **Target Container**: Hero Section (right 5 columns)
- **Prompt**:
  > Full-bleed editorial lithograph and fine woodcut etching illustration of an Indian civil servant in a heritage administrative office. The officer is seated in three-quarter profile at a solid dark teak desk, holding an official parchment document with both hands under the focused warm golden glow of a vintage brass banker's lamp. On the desk sits an antique glass inkwell, a fountain pen, and a neat stack of bound case files tied with cotton ribbon. Behind him, tall grand arched windows reveal a serene morning horizon featuring the distant majestic dome of a government secretariat and gentle palm trees in soft morning mist. Elegant, refined pen-and-ink cross-hatch shading and fine stippling. Sophisticated muted color palette: warm cream #F5EFE0 background, deep ink #0A0A0A lines, terracotta #C97B5A, muted olive #7B7A4E, and luminous ochre #C9A24A lamp light. Archival paper texture. Full-bleed artwork edge-to-edge, NO borders, NO margins, NO text captions, NO frames, dignified and award-winning editorial craftsmanship.
- **Checklist**:
  - [x] Civil servant figure in quiet three-quarter view
  - [x] Modest wooden desk in teak with tied file stack and fountain pen
  - [x] Warm brass banker's desk lamp casting directional amber glow
  - [x] Grand arched windows with morning mist and Secretariat dome
  - [x] Clean negative space upper-left for balance with headline
  - [x] Interactive SVG animation layer with breathing lamp glow and window shifts

---

## 2. Statement Section — Public Assembly

- **Asset Path**: `/illustrations/statement-assembly.jpg`
- **Aspect Ratio**: `16:9` (panoramic width)
- **Target Container**: Statement Section (full-bleed inset)
- **Prompt**:
  > Prestigious wide 16:9 panoramic editorial lithograph and fine woodcut etching illustration in the refined style of The New Yorker and vintage Penguin printmaking. A grand sunlit public secretariat colonnade and stone plaza in India. Citizens and public civil servants in natural, dignified civic interaction—an officer in a neat Nehru jacket courteously speaking with a family, a woman officer in a handloom sari carrying official files, and stylized citizens in traditional and modern attire walking with purpose across the stone courtyard with gentle perspective rules. Towering classical stone arches frame an expansive, open tranquil morning sky occupying the upper two-thirds of the composition with warm cream #F5EFE0 negative space. Masterful fine pen-and-ink line work, delicate cross-hatch shading, and refined stippling. Sophisticated muted editorial palette: warm cream #F5EFE0, deep charcoal ink #0A0A0A, terracotta #C97B5A, muted olive #7B7A4E, dusty slate blue #6B8299, and warm ochre #C9A24A. NO text labels on books, NO artificial borders, NO speech bubbles, pure majestic civic editorial artwork with rich archival paper texture.
- **Checklist**:
  - [x] Dignified civic interaction across stone courtyard and heritage colonnade
  - [x] Refined woodcut and fine cross-hatch rendering without cartoon labels
  - [x] Diverse citizens and officers in authentic handloom and administrative attire
  - [x] Expansive cream negative space under towering arches for statement overlay
  - [x] Interactive SVG animation with perspective rules and subtle parallax drift

---

## 3. Feature A — Statutory Certificate Inspection

- **Asset Path**: `/illustrations/feature-a-inspection.jpg`
- **Aspect Ratio**: `4:3` (balanced landscape)
- **Target Container**: Feature A Section (left dominant frame)
- **Prompt**:
  > A close-up editorial still life illustration of an official government certificate document resting on a warm olive-wood desk surface. Heavy cream paper with visible typewriter-style ruled lines, delicate ink text, and a terracotta red circular administrative stamp in the bottom right corner with hand-drawn cross-hatch shading. A fountain pen rests diagonally across the paper. A classic brass magnifying glass hovers above a line of text, suggesting forensic scrutiny and inspection. Hand-drawn gestural ink strokes, warm muted palette of cream #F5EFE0, deep ink #0A0A0A, terracotta #C97B5A, and olive wood #7B7A4E. Subtle paper grain texture. Document tilted slightly by 3 degrees. No photographic realism, editorial printmaking aesthetic.
- **Checklist**:
  - [x] Official certificate sheet with ruled lines and subtle typography
  - [x] Hand-shaded terracotta circular administration stamp
  - [x] Classic magnifying glass focused on text inspection
  - [x] Diagonal fountain pen on olive wood grain
  - [x] Interactive SVG animation with circular magnifying glass drift and ink draw-on

---

## 4. Feature B — Sovereign Credential Seal & HMAC

- **Asset Path**: `/illustrations/feature-b-seal.jpg`
- **Aspect Ratio**: `4:3` (balanced landscape)
- **Target Container**: Feature B Section (right dominant frame)
- **Prompt**:
  > Full-bleed museum-grade copperplate engraving and intaglio banknote illustration of an authoritative sovereign credential seal, centered on a heavy fibrous warm cream handmade archival paper sheet (#F5EFE0). The entire composition fills the frame edge-to-edge with continuous archival paper texture, with absolutely NO photorealistic background, NO cutouts, NO outdoor photography, NO wooden table, and NO borders. In the center is a magnificent circular sovereign institutional seal featuring high-security concentric guilloche lace patterns, micro-line lathe security rosettes, and fine geometric cross-hatch intaglio engraving. The outer circular ring has crisp, elegant classical Roman serif lettering: 'SOVEREIGN CREDENTIAL REGISTRY • TAMPER-EVIDENT DIGITAL INTEGRITY'. Inside the circular emblem is an exquisite heraldic crest: a radiant sovereign sun emblem, flanked by fine engraved laurel branches, an institutional shield with fine stippling, and an elegant cryptographic ribbon scroll with delicate geometric wave guilloche lines. Fine engraved corner filigree register marks in deep charcoal ink at the four corners on the paper. Palette: warm cream paper (#F5EFE0), rich deep charcoal intaglio ink (#0A0A0A), burnished antique gold ochre (#C9A24A), and subtle terracotta accents (#C97B5A). Crisp, razor-sharp line work, authentic 19th-century banknote engraving craftsmanship, dignified state authority.
- **Checklist**:
  - [x] Centered circular sovereign seal with concentric guilloche geometry
  - [x] Crisp authentic Roman serif lettering without duplicate wording
  - [x] Hand-drawn heraldic sun crest, laurel branches, and stippled shield
  - [x] Cryptographic guilloche ribbon scroll in deep ink and ochre
  - [x] Corner corner-bracket register marks engraved directly on paper
  - [x] 100% full-bleed continuous warm cream archival paper with zero photographic bleed
  - [x] Interactive SVG animation with gentle gold medallion luster pulse

---

## 5. Final CTA — Golden Hour Horizon

- **Asset Path**: `/illustrations/final-cta-horizon.jpg`
- **Aspect Ratio**: `21:9` (or `16:9` cinematic panoramic)
- **Target Container**: Final CTA Section (backdrop with dark-brown multiply overlay)
- **Prompt**:
  > A wide expansive landscape at golden hour, minimalist editorial print style. A single peaceful pathway curves gently from bottom-left toward the quiet distant horizon at center. Along the path, silhouettes of small stylized figures are walking away toward the distance, representing citizens and public officers in purposeful momentum. The sky occupies the upper 60% of the composition with a soft luminous gradient from warm cream #F5EFE0 down into soft golden ochre #C9A24A, terracotta #C97B5A, and dusty blue #6B8299. Ample quiet negative space across the sky for large typography. Gestural ink linework, fine paper grain texture, calm dignity, quiet public service.
- **Checklist**:
  - [x] Gentle curving pathway leading toward the distant horizon
  - [x] Small purposeful silhouettes of citizens and officers in motion
  - [x] Luminous gradient sky in ochre, terracotta, dusty blue, and cream
  - [x] 60% sky negative space perfectly framing the "Serve better." display serif
  - [x] Interactive SVG animation with ambient sky breathing and path shimmer
