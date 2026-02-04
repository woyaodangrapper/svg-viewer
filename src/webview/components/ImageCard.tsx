import React, { JSX, useState } from 'react';
import {
  Disclosure,
  DisclosureContent,
  DisclosureHeading,
  DisclosureBody,
  DisclosureIndicator,
  Button,
  ButtonGroup,
  Tooltip,
  Avatar,
  Dropdown,
  Label,
  Accordion,
  AccordionItem,
  Link
} from '@heroui/react';

interface ImageFile {
  name: string;
  path: string;
  uri: string;
  type: 'svg' | 'image' | 'online';
  extension: string;
}

interface ImageCardProps {
  image: ImageFile;
}

import { openSvgInEditor, goToSvgInLocate } from '../Api';
import { t } from '../i18n';

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const typeColors: Record<string, string> = {
    svg: 'bg-green-500',
    png: 'bg-blue-500',
    jpg: 'bg-purple-500',
    jpeg: 'bg-purple-500',
    gif: 'bg-pink-500',
    webp: 'bg-cyan-500',
    ico: 'bg-orange-500',
    bmp: 'bg-yellow-500'
  };
  return (
    <div className="w-full break-inside-avoid mb-3">
      <Disclosure isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
        <DisclosureHeading>
          <Button
            slot="trigger"
            variant="secondary"
            className="w-full justify-start gap-2 bg-(--vscode-input-background) border border-(--vscode-panel-border) hover:bg-(--vscode-list-hoverBackground) px-2 py-1.5 h-auto"
          >
            {/* 缩略图 */}
            <div className="w-6 h-6 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
              <Dropdown>
                <Dropdown.Trigger>
                  {hasError ? (
                    <span className="text-[8px]  text-red-400 h-[23px] w-[23px] flex items-center justify-center">ERR</span>
                  ) : (
                    <Avatar className="bg-surface">
                      <Avatar.Image className='p-2.5'
                        alt={image.name}
                        src={image.uri}
                      />
                    </Avatar>
                  )}
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                      {hasError ? (
                        <span className="text-[8px]  text-red-400">ERR</span>
                      ) : (
                        <Avatar size="sm">
                          <Avatar.Image className='p-1'
                            alt={image.name}
                            src={image.uri}
                          />
                        </Avatar>
                      )}
                      <div className="flex flex-col gap-0 max-w-50 pb-2">
                        <p className="text-sm leading-5 font-medium truncate">{image.name}</p>
                        <p className="text-xs leading-none text-muted">{image.extension}</p>
                      </div>
                    </div>
                  </div>
                  <Dropdown.Menu>
                    <Dropdown.Item id="edit" textValue="Edit" onClick={openSvgInEditor(image.path)}>
                      <Label>{t('action.edit')}</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="locate" textValue="Locate" onClick={goToSvgInLocate(image.path)}>
                      <Label>{t('action.locate')}</Label>
                    </Dropdown.Item>
                    {/* <Dropdown.Item id="profile" textValue="Profile">
                        <Label>Profile</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="settings" textValue="Settings">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label>Settings</Label>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item id="new-project" textValue="New project">
                        <div className="flex w-full items-center justify-between gap-2">
                          <Label>Create Team</Label>
                        </div>
                      </Dropdown.Item> */}

                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>

            </div>

            {/* 类型标签 */}
            <span
              className={`px-1 py-0.5 text-[8px] font-bold uppercase rounded text-white shrink-0 ${typeColors[image.extension] || 'bg-gray-500'}`}
            >
              {image.extension}
            </span>
            {/* 文件名 */}
            <span className="text-xs truncate flex-1 text-left text-(--vscode-editor-foreground)">
              {image.name}
            </span>
            <DisclosureIndicator />
          </Button>
        </DisclosureHeading>
        <DisclosureContent>
          <Disclosure.Body className="shadow-panel flex flex-col items-center rounded-3xl bg-surface p-4 text-center">


            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {hasError ? (
              <div className="text-red-400 text-sm p-4">加载失败</div>
            ) : (
              <img
                src={image.uri}
                alt={image.name}
                className={`max-w-full h-50 object-contain transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                loading="lazy"
              />
            )}
            <p className="text-xs text-(--vscode-descriptionForeground) mt-2 text-center break-all">
              {image.name}
            </p>
          </Disclosure.Body>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
};

export default ImageCard;
