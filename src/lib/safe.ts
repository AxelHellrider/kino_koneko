/**
 * Only lets through links that can't run script: in-page anchors, site paths,
 * and http(s)/mailto/tel URLs. Anything else (e.g. `javascript:`) returns undefined.
 */
export const safeHref = (href?: string) => {
    const value = href?.trim();
    if (!value) return undefined;
    if (value.startsWith('#') || (value.startsWith('/') && !value.startsWith('//'))) return value;
    try {
        const {protocol} = new URL(value);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol) ? value : undefined;
    } catch {
        return undefined;
    }
};
