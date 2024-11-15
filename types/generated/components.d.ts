import type { Struct, Schema } from '@strapi/strapi';

export interface LayoutVideo extends Struct.ComponentSchema {
  collectionName: 'components_layout_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    title: Schema.Attribute.String;
    description: Schema.Attribute.String;
    videoId: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
    clip: Schema.Attribute.Component<'elements.video-clip', true>;
  };
}

export interface LayoutTopNav extends Struct.ComponentSchema {
  collectionName: 'components_layout_top_navs';
  info: {
    displayName: 'TopNav';
    description: '';
  };
  attributes: {
    logoLink: Schema.Attribute.Component<'elements.link', false>;
    navItem: Schema.Attribute.Component<'elements.link', true>;
  };
}

export interface LayoutPostList extends Struct.ComponentSchema {
  collectionName: 'components_layout_post_lists';
  info: {
    displayName: 'Post List';
  };
  attributes: {
    title: Schema.Attribute.String;
    description: Schema.Attribute.String;
    posts: Schema.Attribute.Relation<'oneToMany', 'api::post.post'>;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    heading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    buttonLink: Schema.Attribute.Component<'elements.button-link', true>;
  };
}

export interface LayoutCode extends Struct.ComponentSchema {
  collectionName: 'components_layout_codes';
  info: {
    displayName: 'Code';
    description: '';
  };
  attributes: {
    title: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    code: Schema.Attribute.Text;
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
  };
}

export interface ElementsVideoClip extends Struct.ComponentSchema {
  collectionName: 'components_elements_video_clips';
  info: {
    displayName: 'Video Clip';
  };
  attributes: {
    start: Schema.Attribute.Float;
    end: Schema.Attribute.Float;
    title: Schema.Attribute.String;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
    description: '';
  };
  attributes: {
    text: Schema.Attribute.String;
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ElementsButtonLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_button_links';
  info: {
    displayName: 'Button Link';
    description: '';
  };
  attributes: {
    text: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
    href: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.video': LayoutVideo;
      'layout.top-nav': LayoutTopNav;
      'layout.post-list': LayoutPostList;
      'layout.hero': LayoutHero;
      'layout.code': LayoutCode;
      'elements.video-clip': ElementsVideoClip;
      'elements.link': ElementsLink;
      'elements.button-link': ElementsButtonLink;
    }
  }
}
