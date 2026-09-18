import type { Channel } from '@/data/channels';

const ACCENTS = ['#62E6CF', '#A991FF', '#FFCB77', '#FF8FA3', '#7DB7FF'] as const;

function attribute(line: string, name: string) {
  const match = line.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return match?.[1]?.trim() || '';
}

function slug(value: string, index: number) {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${normalized || 'channel'}-${index}`;
}

function qualityFor(name: string) {
  if (/\b(4k|uhd)\b/i.test(name)) return '4K';
  if (/\b(fhd|1080)\b/i.test(name)) return 'FHD';
  return /\b(hd|720)\b/i.test(name) ? 'HD' : 'SD';
}

function titleFromExtInf(line: string) {
  const comma = line.indexOf(',');
  return comma >= 0 ? line.slice(comma + 1).trim() : '';
}

export function parseM3U(input: string): Channel[] {
  const lines = input.replace(/^\uFEFF/, '').split(/\r?\n/);
  const parsed: Channel[] = [];
  let pending: { extinf: string; group: string } | null = null;
  let pendingGroup = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('#EXTGRP:')) {
      pendingGroup = line.slice('#EXTGRP:'.length).trim();
      continue;
    }

    if (line.startsWith('#EXTINF:')) {
      pending = { extinf: line, group: pendingGroup || attribute(line, 'group-title') || 'Khác' };
      pendingGroup = '';
      continue;
    }

    if (line.startsWith('#')) continue;
    if (!pending && !/^https?:\/\//i.test(line)) continue;

    const extinf = pending?.extinf || '';
    const name = titleFromExtInf(extinf) || attribute(extinf, 'tvg-name') || `Kênh ${parsed.length + 1}`;
    const group = pending?.group || 'Khác';
    const streamUrl = line;
    const logoUrl = attribute(extinf, 'tvg-logo');
    const accent = ACCENTS[parsed.length % ACCENTS.length];

    parsed.push({
      id: slug(name, parsed.length),
      name,
      shortName: name.slice(0, 3).toUpperCase(),
      group,
      category: group,
      language: 'IPTV',
      quality: qualityFor(name),
      description: `Phát trực tiếp từ ${group}.`,
      schedule: 'Live stream',
      accent,
      logoColor: '#17273A',
      logoUrl: logoUrl || undefined,
      streamUrl,
      isLive: true,
    });
    pending = null;
  }

  return parsed;
}