import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsButtonLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_button_links';
  info: {
    description: '';
    displayName: 'Button Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    description: '';
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface ElementsVideoClip extends Struct.ComponentSchema {
  collectionName: 'components_elements_video_clips';
  info: {
    displayName: 'Video Clip';
  };
  attributes: {
    end: Schema.Attribute.Float;
    start: Schema.Attribute.Float;
    title: Schema.Attribute.String;
  };
}

export interface LayoutCode extends Struct.ComponentSchema {
  collectionName: 'components_layout_codes';
  info: {
    description: '';
    displayName: 'Code';
  };
  attributes: {
    code: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    language: Schema.Attribute.Enumeration<
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
        'c',
      ]
    >;
    title: Schema.Attribute.String;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    buttonLink: Schema.Attribute.Component<'elements.button-link', true>;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutPostList extends Struct.ComponentSchema {
  collectionName: 'components_layout_post_lists';
  info: {
    displayName: 'Post List';
  };
  attributes: {
    description: Schema.Attribute.String;
    posts: Schema.Attribute.Relation<'oneToMany', 'api::post.post'>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutTopNav extends Struct.ComponentSchema {
  collectionName: 'components_layout_top_navs';
  info: {
    description: '';
    displayName: 'TopNav';
  };
  attributes: {
    logoLink: Schema.Attribute.Component<'elements.link', false>;
    navItem: Schema.Attribute.Component<'elements.link', true>;
  };
}

export interface LayoutVideo extends Struct.ComponentSchema {
  collectionName: 'components_layout_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    clip: Schema.Attribute.Component<'elements.video-clip', true>;
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
    videoId: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
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
