// Placeholder links.

export interface Link {
  label: string;
  url: string;
  shown: string;
}

export const links: Link[] = [
  { label: 'GitHub', url: 'https://github.com/', shown: 'github.com/[username]' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/', shown: 'linkedin.com/in/[username]' },
  { label: 'Email', url: 'mailto:name@example.com', shown: 'name@example.com' },
];
