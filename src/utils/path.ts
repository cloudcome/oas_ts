import path from 'node:path';

export function toRelative(to: string, from?: string) {
    if (!from) return to;
    if (!path.isAbsolute(to)) return to;

    const relative = path.relative(from, to);
    return relative.startsWith('.') ? relative : `./${relative}`;
}
