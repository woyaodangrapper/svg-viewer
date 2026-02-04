import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Chip, Link } from '@heroui/react';

interface IconLibraryItem {
  id: string;
  name: string;
  description: string;
  url: string;
  iconCount: string;
  license: string;
  tags: string[];
}

const iconLibraries: IconLibraryItem[] = [
  {
    id: 'gravity-ui',
    name: 'Gravity UI Icons',
    description: 'Yandex 开源的现代图标库，包含超过 1000+ 个精美图标',
    url: 'https://gravity-ui.com/zh/icons',
    iconCount: '1000+',
    license: 'MIT',
    tags: ['企业级', '现代', 'SVG']
  },
  {
    id: 'google-icons',
    name: 'Material Symbols',
    description: 'Google 官方 Material Design 图标系统，支持多种样式和粗细',
    url: 'https://fonts.google.com/icons',
    iconCount: '2500+',
    license: 'Apache 2.0',
    tags: ['Material', 'Google', '官方']
  },
  {
    id: 'iconify',
    name: 'Iconify',
    description: '统一的图标框架，集成了 150+ 个图标集，超过 200,000 个图标',
    url: 'https://icon-sets.iconify.design/',
    iconCount: '200,000+',
    license: '多种',
    tags: ['聚合', '海量', 'CDN']
  },
  {
    id: 'heroicons',
    name: 'Heroicons',
    description: 'Tailwind CSS 团队打造的精美 SVG 图标，完全免费开源',
    url: 'https://heroicons.com/',
    iconCount: '292',
    license: 'MIT',
    tags: ['Tailwind', '简洁', 'React']
  },
  {
    id: 'lucide',
    name: 'Lucide',
    description: 'Feather Icons 的社区分支，简洁优雅的开源图标库',
    url: 'https://lucide.dev/',
    iconCount: '1400+',
    license: 'ISC',
    tags: ['简洁', '开源', '社区']
  },
  {
    id: 'tabler',
    name: 'Tabler Icons',
    description: '超过 5000 个免费开源图标，可定制且易于使用',
    url: 'https://tabler.io/icons',
    iconCount: '5000+',
    license: 'MIT',
    tags: ['开源', '可定制', '现代']
  },
  {
    id: 'phosphor',
    name: 'Phosphor Icons',
    description: '灵活的图标家族，支持多种粗细和样式，超过 1200 个图标',
    url: 'https://phosphoricons.com/',
    iconCount: '1200+',
    license: 'MIT',
    tags: ['多样式', '灵活', '现代']
  },
  {
    id: 'radix',
    name: 'Radix Icons',
    description: 'Radix UI 团队设计的清晰、像素完美的图标集',
    url: 'https://www.radix-ui.com/icons',
    iconCount: '318',
    license: 'MIT',
    tags: ['Radix UI', '像素完美', '设计系统']
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap Icons',
    description: 'Bootstrap 官方图标库，包含 2000+ 个免费高质量图标',
    url: 'https://icons.getbootstrap.com/',
    iconCount: '2000+',
    license: 'MIT',
    tags: ['Bootstrap', '官方', 'Web']
  },
  {
    id: 'iconoir',
    name: 'Iconoir',
    description: '简洁优雅的开源图标库，超过 1500 个精心设计的图标',
    url: 'https://iconoir.com/',
    iconCount: '1500+',
    license: 'MIT',
    tags: ['简洁', '优雅', '现代']
  }
];


interface IconLibraryProps {
  library?: string;
}
import { openSvgInWeb } from '../Api';

export const IconLibrary: React.FC<IconLibraryProps> = ({ library = '' }) => {
  const filteredLibraries = iconLibraries.filter(lib =>
    lib.name.toLowerCase().includes(library.toLowerCase()) ||
    lib.description.toLowerCase().includes(library.toLowerCase()) ||
    lib.tags.some(tag => tag.toLowerCase().includes(library.toLowerCase()))
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLibraries.map((library) => (
          <Card key={library.id} variant="tertiary">
            <svg className="size-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="Icon library">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <Card.Header>
              <Card.Title>{library.name}</Card.Title>
              <Card.Description>
                {library.description}
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <Chip size="sm" className="text-[10px]">{library.iconCount} 图标</Chip>
                  <Chip size="sm" className="text-[10px]">{library.license}</Chip>
                  {library.tags.map((tag) => (
                    <Chip key={tag} size="sm" className="text-[10px]">{tag}</Chip>
                  ))}
                </div>
              </Card.Description>
            </Card.Header>
            <Card.Footer>
              <Link
                href={library.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  openSvgInWeb(library.url);
                }}
                aria-label={`访问 ${library.name} (在新标签页打开)`}
              >
                访问图标库
                <Link.Icon aria-hidden="true" />
              </Link>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {filteredLibraries.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>未找到匹配的图标库</p>
        </div>
      )}
    </div>
  );
};

export default IconLibrary;
