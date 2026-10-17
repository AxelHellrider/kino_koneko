import {sanityClient} from "sanity:client";
import {createImageUrlBuilder} from "@sanity/image-url";

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: any) => builder.image(source);

/** `src` + `srcset` so each device downloads only the size it needs. */
export const responsiveImage = (source: any, widths: number[]) => {
    const at = (w: number) => urlFor(source).width(w).format('webp').url();
    return {
        src: at(widths[Math.floor(widths.length / 2)]),
        srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
    };
};

// ---------- Products ----------

export interface Colorway {
    colorName: string;
    colorHex: string;
    mockup: any;
    extraImages?: any[];
}

export interface Design {
    name: string;
    artwork: any;
    availability: 'always' | 'seasonal' | 'retired';
    availabilityNote?: string;
    colorways: Colorway[];
}

export interface Product {
    _id: string;
    title: string;
    category: 'tee' | 'postcard' | 'poster' | 'sticker';
    main_artwork: any;
    description?: string;
    order?: number;
    designs: Design[];
}

/** Products by `order` ascending; unordered ones go last, oldest first. */
const PRODUCT_QUERY = `
  *[_type == "product"] | order(coalesce(order, 999999) asc, _createdAt asc) {
    _id, title, category, main_artwork, description, order,
    designs[]{
      name, artwork, availability, availabilityNote,
      colorways[]{ colorName, colorHex, mockup, extraImages }
    }
  }
`;

export const getProducts = () => sanityClient.fetch<Product[]>(PRODUCT_QUERY);

// ---------- Banners ----------

export interface Banner {
    _id: string;
    title: string;
    description?: string;
    background?: any;
    figure: any;
    linkLabel?: string;
    linkHref?: string;
}

const BANNER_QUERY = `
  *[_type == "banner" && active != false] | order(order asc) {
    _id, title, description,
    background{ ..., "alt": alt },
    figure{ ..., "alt": alt },
    linkLabel, linkHref
  }
`;

export const getBanners = () => sanityClient.fetch<Banner[]>(BANNER_QUERY);
