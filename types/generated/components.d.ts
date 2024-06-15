import type { Schema, Attribute } from '@strapi/strapi';

export interface ElementsButtonLink extends Schema.Component {
  collectionName: 'components_elements_button_links';
  info: {
    displayName: 'Button Link';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
    type: Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
    href: Attribute.String;
  };
}

export interface ElementsLink extends Schema.Component {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    href: Attribute.String;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ElementsVideoClip extends Schema.Component {
  collectionName: 'components_elements_video_clips';
  info: {
    displayName: 'Video Clip';
  };
  attributes: {
    start: Attribute.Float;
    end: Attribute.Float;
    title: Attribute.String;
  };
}

export interface LayoutCode extends Schema.Component {
  collectionName: 'components_layout_codes';
  info: {
    displayName: 'Code';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.Text;
    code: Attribute.Text;
    language: Attribute.Enumeration<
      [
        'javascript',
        'typescript',
        'python',
        'go',
        'csharp',
        'html',
        'css',
        'json',
        'markdown',
        'sql',
        'shell',
        'php',
        'plaintext',
        'dockerfile',
        'javascriptreact',
        'typescriptreact',
        'jsonc',
        'c'
      ]
    >;
  };
}

export interface LayoutHero extends Schema.Component {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    heading: Attribute.String;
    text: Attribute.Text;
    image: Attribute.Media<'images'>;
    buttonLink: Attribute.Component<'elements.button-link', true>;
  };
}

export interface LayoutPostList extends Schema.Component {
  collectionName: 'components_layout_post_lists';
  info: {
    displayName: 'Post List';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.String;
    posts: Attribute.Relation<
      'layout.post-list',
      'oneToMany',
      'api::post.post'
    >;
  };
}

export interface LayoutTopNav extends Schema.Component {
  collectionName: 'components_layout_top_navs';
  info: {
    displayName: 'TopNav';
    description: '';
  };
  attributes: {
    logoLink: Attribute.Component<'elements.link'>;
    navItem: Attribute.Component<'elements.link', true>;
  };
}

export interface LayoutVideo extends Schema.Component {
  collectionName: 'components_layout_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    title: Attribute.String;
    description: Attribute.String;
    videoId: Attribute.String;
    videoUrl: Attribute.String;
    clip: Attribute.Component<'elements.video-clip', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'elements.button-link': ElementsButtonLink;
      'elements.link': ElementsLink;
      'elements.video-clip': ElementsVideoClip;
      'layout.code': LayoutCode;
      'layout.hero': LayoutHero;
      'layout.post-list': LayoutPostList;
      'layout.top-nav': LayoutTopNav;
      'layout.video': LayoutVideo;
    }
  }
}
