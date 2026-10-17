import {sanityClient} from "sanity:client";
import {createImageUrlBuilder} from "@sanity/image-url";

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: any) => builder.image(source);

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

/**
 * Query done via GROG, Sanity's own SQL lingo.
 */
const PRODUCT_QUERY = `
  *[_type == "product"] | order(_createdAt desc) {
    _id, title, category, main_artwork, description, order,
    designs[]{
      name, artwork, availability, availabilityNote,
      colorways[]{ colorName, colorHex, mockup, extraImages }
    }
  }
`;

export const getProducts = () => sanityClient.fetch<Product[]>(PRODUCT_QUERY);

// src/lib/sanity.ts
export interface Banner {
    _id: string;
    title: string;
    description?: string;
    background?: any;
    figure: any;
    linkLabel?: string;
    linkHref?: string;
}

export const getBanners = () =>
    sanityClient.fetch<Banner[]>(`
    *[_type == "banner" && active != false] | order(order asc) {
      _id, title, description,
      background{ ..., "alt": alt },
      figure{ ..., "alt": alt },
      linkLabel, linkHref
    }
  `);