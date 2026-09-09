export interface Brand {
  name: string;
  tagline: string;
  location: string;
  phones: string[];
  whatsapp: string[];
  instagram: string;
}

export interface Collection {
  id: string;
  title: string;
  overline: string;
  desc: string;
  image: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export interface Feature {
  title: string;
  desc: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  city: string;
}

export const BRAND: Brand = {
  name: "D SAJAWAT",
  tagline: "Where Elegance Meets Celebration",
  location: "Ludhiana, Punjab, India",
  phones: ["+91 98889 19983", "+91 73555 55649"],
  whatsapp: ["919888919983", "917355555649"],
  instagram: "https://www.instagram.com/d_sajawat/",
};

export const COLLECTIONS: Collection[] = [
  { id: "round-table-covers", title: "Round Table Covers", overline: "Series 01", desc: "Premium fabric table covers for flawless event setups.", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800" },
  { id: "chair-covers", title: "Chair Covers", overline: "Series 02", desc: "Transform ordinary chairs into elegant statements.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800" },
  { id: "chair-bows", title: "Chair Cover Bows", overline: "Series 03", desc: "Add a touch of elegance with beautifully crafted bows.", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800" },
  { id: "ceiling-drapes", title: "Ceiling Drapes", overline: "Series 04", desc: "Create magical ceiling transformations.", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800" },
  { id: "chandeliers", title: "Chandeliers", overline: "Series 05", desc: "Elegant chandeliers for grand celebrations.", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800" },
  { id: "hangings", title: "Hangings & Decorations", overline: "Series 06", desc: "Unique hangings for memorable venues.", image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800" },
  { id: "floral", title: "Floral Decoration", overline: "Series 07", desc: "Premium materials for stunning floral displays.", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" },
  { id: "finish-fabrics", title: "Finish Fabrics", overline: "Series 08", desc: "Refined finish fabrics for detailed elegance.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" },
];

export const STATS: Stat[] = [
  { label: "Years of Craft", value: 12, suffix: "+" },
  { label: "Events Adorned", value: 1800, suffix: "+" },
  { label: "Cities Reached", value: 240, suffix: "+" },
  { label: "Decorators Trust Us", value: 350, suffix: "+" },
];

export const FEATURES: Feature[] = [
  { title: "Trend-Driven Selection", desc: "Modern colours, textures and event-focused designs.", icon: "Palette" },
  { title: "Custom Size Support", desc: "Share your measurements - we help align the right fabric.", icon: "Ruler" },
  { title: "Bulk Supply Ready", desc: "Professional-grade fabric for decorators and planners.", icon: "Package" },
  { title: "Pan India Delivery", desc: "From metros to small towns - trusted delivery.", icon: "Truck" },
  { title: "Premium Quality", desc: "Every roll inspected for sheen and durability.", icon: "Award" },
  { title: "Trusted by Pros", desc: "Preferred by India's top decorators.", icon: "Heart" },
];

export const TESTIMONIALS: Testimonial[] = [
  { quote: "D SAJAWAT has been our trusted partner for every wedding event. The fabrics are exceptional.", name: "Priya Sharma", role: "Wedding Decorator", city: "Chandigarh" },
  { quote: "Excellent quality and timely delivery. Our go-to for all fabric requirements.", name: "Rajesh Events", role: "Event Planner", city: "Delhi" },
  { quote: "The finish on their drapes turned our hall into a fairytale.", name: "Aanya Decor Studio", role: "Senior Decorator", city: "Jaipur" },
  { quote: "Bulk supply ready and pan-India delivery on time.", name: "Vikrant Banquet Co.", role: "Banquet Operations", city: "Mumbai" },
];
