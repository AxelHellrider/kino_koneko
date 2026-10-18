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
    figureSide?: 'left' | 'right';
    figureSideApplyTo?: 'both' | 'desktop' | 'mobile';
    figureAnimation?: {
        type?: 'slide' | 'fade' | 'slide-fade' | 'none';
        direction?: 'auto' | 'left' | 'right' | 'top' | 'bottom';
        ease?: string;
        duration?: number;
        delay?: number;
    };
    titleColor?: {hex?: string};
    titleShadowColor?: {hex?: string};
    bodyColorMode?: 'same' | 'custom';
    bodyColor?: {hex?: string};
    buttonTheme?: string;
    buttonShape?: string;
    buttonColor?: {hex?: string};
    buttonTextColor?: {hex?: string};
    theme?: 'none' | 'twewy' | 'persona5' | 'comic' | 'onepiece';
    layout?: 'split' | 'poster';
    posterFigure?: 'left' | 'center' | 'right';
    backdropText?: string;
    backdropColor?: {hex?: string};
    tags?: string[];
    sideText?: string;
    titleAccentLine?: number;
    titleAccentColor?: {hex?: string};
}

const BANNER_QUERY = `
  *[_type == "banner" && active != false] | order(order asc) {
    _id, title, description,
    background{ ..., "alt": alt },
    figure{ ..., "alt": alt },
    linkLabel, linkHref,
    figureSide, figureSideApplyTo, figureAnimation,
    titleColor{hex}, titleShadowColor{hex}, bodyColorMode, bodyColor{hex},
    buttonTheme, buttonShape, buttonColor{hex}, buttonTextColor{hex},
    theme, layout, posterFigure, backdropText, backdropColor{hex}, tags, sideText, titleAccentLine, titleAccentColor{hex}
  }
`;

export const getBanners = () => sanityClient.fetch<Banner[]>(BANNER_QUERY);
