export interface Portfolio {
  id: string;
  name: string;
  title: string;
  company?: string;
  image?: string;
  link?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Difficult';
  link: string;
}

export const portfolios: Portfolio[] = [
  {
    id: '1',
    name: 'Meenakshi Singhrai',
    title: 'Product Manager',
    link: '#'
  },
  {
    id: '2',
    name: 'Mark Progano',
    title: 'SPM at Unstoppable Domains',
    link: '#'
  },
  {
    id: '3',
    name: 'Ben Solomon',
    title: 'PM at Google',
    link: '#'
  },
  {
    id: '4',
    name: 'Manish Soni',
    title: 'Senior Business Analyst at TF Holdings',
    link: '#'
  },
  {
    id: '5',
    name: 'Mark Progano',
    title: 'SPM at Tinkerer',
    link: '#'
  },
  {
    id: '6',
    name: 'Justice Ughelie',
    title: 'PM at Microsoft',
    link: '#'
  },
  {
    id: '7',
    name: 'Thaisa Fernandes',
    title: 'Lead Program Manager at Twitter',
    link: '#'
  },
  {
    id: '8',
    name: 'Yan Xu',
    title: 'UX Designer at Ate Food Journal & Coach Dashboard',
    link: '#'
  },
  {
    id: '9',
    name: 'Pedro Moreno',
    title: 'Senior UX Designer',
    link: '#'
  },
  {
    id: '10',
    name: 'Bikash Joshi',
    title: 'Deputy Manager at Jio',
    link: '#'
  },
  {
    id: '11',
    name: 'Thet Zarni Win',
    title: 'UI Designer at Redlizard Studioz Inc',
    link: '#'
  },
  {
    id: '12',
    name: 'Shubham Singla',
    title: 'PM at JustDial',
    link: '#'
  },
  {
    id: '13',
    name: 'Jones Leung',
    title: 'APM at Crypto.com',
    link: '#'
  },
  {
    id: '14',
    name: 'Ganesh G',
    title: 'UX Designer at ITC Infotech',
    link: '#'
  },
  {
    id: '15',
    name: 'Amulya Jonnala',
    title: 'Senior UX Designer at MyGigsters',
    link: '#'
  },
  {
    id: '16',
    name: 'Luis Jurado',
    title: 'Product Manager at Retail Insight',
    link: '#'
  }
];

export const tools: Tool[] = [
  {
    id: '1',
    name: 'Makers.so',
    description: 'A website builder inside Figma, fully responsive, no-code',
    category: 'Website Builder',
    difficulty: 'Medium',
    link: '#'
  },
  {
    id: '2',
    name: 'Launchaco',
    description: 'The Simplest Way to Build a Website For Your Startup',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '3',
    name: 'Webflow',
    description: 'The site you want — without the dev time',
    category: 'Website Builder',
    difficulty: 'Difficult',
    link: '#'
  },
  {
    id: '4',
    name: 'Daftpage',
    description: 'Next-gen website builder for makers',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '5',
    name: 'Unicorn Platform',
    description: 'Sexy landing page builder for startups',
    category: 'Website Builder',
    difficulty: 'Medium',
    link: '#'
  },
  {
    id: '6',
    name: 'Siter',
    description: 'Freehand design tool, no-code website creating',
    category: 'Website Builder',
    difficulty: 'Medium',
    link: '#'
  },
  {
    id: '7',
    name: 'Popsy',
    description: 'No-code website builder that works like Notion',
    category: 'Notion',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '8',
    name: 'Wix',
    description: 'Create a website',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '9',
    name: 'Potion',
    description: 'Create custom websites in minutes, all on Notion',
    category: 'Notion',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '10',
    name: 'Carrd',
    description: 'Simple, responsive, one-page sites for pretty much anything',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '11',
    name: 'mmm',
    description: 'Make website in less than 5 minutes',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '12',
    name: 'Figment',
    description: 'Figma design to website without coding',
    category: 'Website Builder',
    difficulty: 'Medium',
    link: '#'
  },
  {
    id: '13',
    name: 'Leia: Website Builder',
    description: 'A.I. That Builds Your Website Using Your Voice',
    category: 'Website Builder',
    difficulty: 'Medium',
    link: '#'
  },
  {
    id: '14',
    name: 'Softr',
    description: 'Build web apps & portals from Airtable, no code required',
    category: 'Notion',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '15',
    name: 'Graphite',
    description: 'Create live websites just like in a graphic editor',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '16',
    name: 'Dorik',
    description: 'Build beautiful website in minutes, without code!',
    category: 'Website Builder',
    difficulty: 'Medium',
    link: '#'
  },
  {
    id: '17',
    name: 'Jemi',
    description: 'Beautiful Websites in Minutes',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '18',
    name: 'To-Do-Portfolio',
    description: 'A no-code, customizable & analytics-integrated portfolio for your next interview',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '19',
    name: 'Makeswift',
    description: 'An elegant no-code, Next.js website builder',
    category: 'Website Builder',
    difficulty: 'Easy',
    link: '#'
  },
  {
    id: '20',
    name: 'Super',
    description: 'Create Websites with Notion',
    category: 'Notion',
    difficulty: 'Easy',
    link: '#'
  }
];