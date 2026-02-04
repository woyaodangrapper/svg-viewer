import React, { useState, useMemo } from 'react';
import {
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabsRoot,
  Card,
  CardContent,
  Chip,
  TextField,
  TextFieldRoot,
  Input,
  Label,
  SearchField,
  Button
} from '@heroui/react';
import ImageCard from './components/ImageCard';
import IconLibrary from './components/IconLibrary';
import { t } from './i18n';

interface ImageFile {
  name: string;
  path: string;
  uri: string;
  type: 'svg' | 'image' | 'online';
  extension: string;
}

interface AppProps {
  images: ImageFile[];
}

const App: React.FC<AppProps> = ({ images }) => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const svgs = images.filter(img => img.type === 'svg');
    const imgs = images.filter(img => img.type === 'image');
    const onlines = images.filter(img => img.type === 'online');
    return { all: images, svg: svgs, image: imgs, online: onlines };
  }, [images]);

  const filteredImages = useMemo(() => {
    const list = categories[selectedTab as keyof typeof categories] || categories.all;
    if (!searchQuery.trim()) return list;
    return list.filter(img =>
      img.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, selectedTab, searchQuery]);

  const renderImageCard = (img: ImageFile) => {
    return <ImageCard key={img.path} image={img} />;
  };

  return (
    <div className="h-full max-w-full bg-(--vscode-editor-background) text-(--vscode-editor-foreground) p-4">
      <div className="mb-6">
        <SearchField name="search" className="max-w-md mb-4 px-0 py-2 ">
          <SearchField.Group>
            <SearchField.SearchIcon>
              <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M12.5 4c0 .174-.071.513-.885.888S9.538 5.5 8 5.5s-2.799-.237-3.615-.612C3.57 4.513 3.5 4.174 3.5 4s.071-.513.885-.888S6.462 2.5 8 2.5s2.799.237 3.615.612c.814.375.885.714.885.888m-1.448 2.66C10.158 6.888 9.115 7 8 7s-2.158-.113-3.052-.34l1.98 2.905c.21.308.322.672.322 1.044v3.37q.088.02.25.021c.422 0 .749-.14.95-.316c.185-.162.3-.38.3-.684v-2.39c0-.373.112-.737.322-1.045zM8 1c3.314 0 6 1 6 3a3.24 3.24 0 0 1-.563 1.826l-3.125 4.584a.35.35 0 0 0-.062.2V13c0 1.5-1.25 2.5-2.75 2.5s-1.75-1-1.75-1v-3.89a.35.35 0 0 0-.061-.2L2.563 5.826A3.24 3.24 0 0 1 2 4c0-2 2.686-3 6-3m-.88 12.936q-.015-.008-.013-.01z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </SearchField.SearchIcon>

            <SearchField.Input className="w-70" placeholder={selectedTab !== 'online' ? t('search.placeholder.images') : t('search.placeholder.library')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>


        <Tabs className="w-full" orientation="vertical" selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="图片分类" className='min-w-30'>
              <Tabs.Tab id="all">
                <div className="flex items-center gap-2">{t('tab.all')} <Chip>{categories.all.length}</Chip></div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="svg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M10.218 3.216a.75.75 0 0 0-1.436-.431l-3 10a.75.75 0 0 0 1.436.43zM4.53 4.97a.75.75 0 0 1 0 1.06L2.56 8l1.97 1.97a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0m6.94 6.06a.75.75 0 0 1 0-1.06L13.44 8l-1.97-1.97a.75.75 0 0 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0" clip-rule="evenodd" /></svg>
                {t('tab.vector')}
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="image">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M11.5 3h-7A1.5 1.5 0 0 0 3 4.5v5.027l.962-.7a1.75 1.75 0 0 1 2.079.016l.928.696 2.368-2.03a1.75 1.75 0 0 1 2.325.043L13 8.787V4.5A1.5 1.5 0 0 0 11.5 3m3 7.498V4.5a3 3 0 0 0-3-3h-7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3zm-1.5.33-2.355-2.174a.25.25 0 0 0-.332-.006L7.488 11.07l-.457.392-.481-.361-1.41-1.057a.25.25 0 0 0-.296-.002L3 11.381v.119A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5zM7.5 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" clip-rule="evenodd" /></svg>
                {t('tab.image')}
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="online">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M9.208 12.346c-.485 1-.953 1.154-1.208 1.154s-.723-.154-1.208-1.154c-.372-.768-.647-1.858-.749-3.187a21 21 0 0 0 3.914 0c-.102 1.329-.377 2.419-.75 3.187m.788-4.699C9.358 7.714 8.69 7.75 8 7.75s-1.358-.036-1.996-.103c.037-1.696.343-3.075.788-3.993C7.277 2.654 7.745 2.5 8 2.5s.723.154 1.208 1.154c.445.918.75 2.297.788 3.993m1.478 1.306c-.085 1.516-.375 2.848-.836 3.874a5.5 5.5 0 0 0 2.843-4.364c-.621.199-1.295.364-2.007.49m1.918-2.043c-.572.204-1.21.379-1.901.514-.056-1.671-.354-3.14-.853-4.251a5.5 5.5 0 0 1 2.754 3.737m-8.883.514c.056-1.671.354-3.14.853-4.251A5.5 5.5 0 0 0 2.608 6.91c.572.204 1.21.379 1.901.514M2.52 8.463a5.5 5.5 0 0 0 2.843 4.364c-.46-1.026-.75-2.358-.836-3.874a15.5 15.5 0 0 1-2.007-.49M15 8A7 7 0 1 0 1 8a7 7 0 0 0 14 0" clip-rule="evenodd"></path></svg>
                {t('tab.online')}
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          {/* 每个 Panel 内部显示对应分类图片列表 */}
          <Tabs.Panel id="all">
            {filteredImages.length === 0 ? (
              <Card className="bg-(--vscode-editor-background) border border-(--vscode-panel-border)">
                <CardContent className="text-center py-12">
                  <p className="text-lg text-gray-400">{t('empty.noImages')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredImages.map(renderImageCard)}
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel id="svg">
            {filteredImages.filter(image => image.type === 'svg').length === 0 ? (
              <p className="text-gray-400 text-center py-12">{t('empty.noSvg')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredImages.filter(image => image.type === 'svg').map(renderImageCard)}
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel id="image">
            {filteredImages.filter(image => image.type === 'image').length === 0 ? (
              <p className="text-gray-400 text-center py-12">{t('empty.noImage')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredImages.filter(image => image.type === 'image').map(renderImageCard)}
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel id="online">
            <IconLibrary library={searchQuery} />
          </Tabs.Panel>
        </Tabs>

      </div>
      {selectedTab !== 'online' ? (
        <div className="mt-6 text-sm text-gray-500 text-center">
          {t('footer.totalItems', { count: filteredImages.length })}
        </div>
      ) : null}

    </div>
  );
};

export default App;
