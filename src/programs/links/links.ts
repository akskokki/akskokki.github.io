export interface Link {
  label: string;
  url: string;
  shown: string;
}

export const links: Link[] = [
  { label: 'GitHub', url: 'https://github.com/akskokki', shown: 'github.com/akskokki' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/akseli-kokki',
    shown: 'linkedin.com/in/akseli-kokki',
  },
  { label: 'Email', url: 'mailto:akseli.kokki@gmail.com', shown: 'akseli.kokki@gmail.com' },
];
