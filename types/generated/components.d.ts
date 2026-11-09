import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_grids';
  info: {
    displayName: 'Card Grid';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.card', true>;
  };
}

export interface BlocksContentWithImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content_with_images';
  info: {
    displayName: 'Content With Image';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'shared.link', false>;
    reversed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface BlocksFaqs extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faqs';
  info: {
    displayName: 'Faqs';
  };
  attributes: {
    faq: Schema.Attribute.Component<'shared.card', true>;
  };
}

export interface BlocksFeaturedArticles extends Struct.ComponentSchema {
  collectionName: 'components_blocks_featured_articles';
  info: {
    displayName: 'Featured Articles';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    links: Schema.Attribute.Component<'shared.link', true>;
    text: Schema.Attribute.RichText;
  };
}

export interface BlocksMarkdown extends Struct.ComponentSchema {
  collectionName: 'components_blocks_markdowns';
  info: {
    displayName: 'Markdown';
  };
  attributes: {
    content: Schema.Attribute.RichText;
  };
}

export interface BlocksNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_blocks_newsletters';
  info: {
    displayName: 'Newsletter';
  };
  attributes: {
    formId: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    label: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksPersonCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_person_cards';
  info: {
    displayName: 'Person Card';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    personJob: Schema.Attribute.String;
    personName: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_blocks_section_headings';
  info: {
    displayName: 'Section Heading';
  };
  attributes: {
    anchorLink: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.String;
  };
}

export interface LayoutBanner extends Struct.ComponentSchema {
  collectionName: 'components_layout_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    description: Schema.Attribute.Text;
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.Component<'shared.link', false>;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    logo: Schema.Attribute.Component<'shared.logo-link', false>;
    navItems: Schema.Attribute.Component<'shared.link', true>;
    socialLinks: Schema.Attribute.Component<'shared.logo-link', true>;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>;
    logo: Schema.Attribute.Component<'shared.logo-link', false>;
    navItems: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    heading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isButtonLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
  };
}

export interface SharedLogoLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_logo_links';
  info: {
    displayName: 'Logo Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
  };
}

export interface YtkbActionStep extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_action_steps';
  info: {
    description: 'A concrete step the reader can take. Repeatable; the post renders these as a numbered plan at the end of the summary.';
    displayName: 'Action step';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface YtkbDigestContradiction extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_digest_contradictions';
  info: {
    description: 'A genuine disagreement between source videos on one concrete topic, with the positions taken by each side.';
    displayName: 'Digest Contradiction';
  };
  attributes: {
    positions: Schema.Attribute.Component<
      'ytkb.digest-contradiction-position',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          min: 2;
        },
        number
      >;
    topic: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface YtkbDigestContradictionPosition
  extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_digest_contradiction_positions';
  info: {
    description: "One video's stance on a contested topic. Nested under a contradiction component (\u22652 positions per topic).";
    displayName: 'Digest Contradiction Position';
  };
  attributes: {
    stance: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    videoTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface YtkbDigestSharedTheme extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_digest_shared_themes';
  info: {
    description: 'A theme that appears across two or more source videos of a digest.';
    displayName: 'Digest Shared Theme';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1500;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    videoTitles: Schema.Attribute.Component<'ytkb.digest-video-title', true>;
  };
}

export interface YtkbDigestUniqueInsight extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_digest_unique_insights';
  info: {
    description: 'What one specific source video uniquely contributes to a digest, beyond what the others cover.';
    displayName: 'Digest Unique Insight';
  };
  attributes: {
    insight: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    videoTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface YtkbDigestVideoTitle extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_digest_video_titles';
  info: {
    description: "Single verbatim video title string. Used inside shared-theme components to list which source videos cover the theme \u2014 a nested repeatable component stands in for a `string[]` field, which Strapi doesn't natively support.";
    displayName: 'Digest Video Title';
  };
  attributes: {
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface YtkbDigestViewingOrder extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_digest_viewing_orders';
  info: {
    description: "One entry in the recommended viewing sequence for a digest's source videos. Populated only when order matters (one video is prerequisite to another).";
    displayName: 'Digest Viewing Order';
  };
  attributes: {
    videoTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    why: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface YtkbSection extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_sections';
  info: {
    description: 'A content section. `timeSec` is optional \u2014 populated for video posts (clickable seek), omitted for articles/blogs.';
    displayName: 'Section';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2000;
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    timeSec: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface YtkbTakeaway extends Struct.ComponentSchema {
  collectionName: 'components_ytkb_takeaways';
  info: {
    description: 'A single key-takeaway bullet. Repeatable on posts (video summaries, future articles/blogs).';
    displayName: 'Takeaway';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 280;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.card-grid': BlocksCardGrid;
      'blocks.content-with-image': BlocksContentWithImage;
      'blocks.faqs': BlocksFaqs;
      'blocks.featured-articles': BlocksFeaturedArticles;
      'blocks.hero': BlocksHero;
      'blocks.markdown': BlocksMarkdown;
      'blocks.newsletter': BlocksNewsletter;
      'blocks.person-card': BlocksPersonCard;
      'blocks.section-heading': BlocksSectionHeading;
      'layout.banner': LayoutBanner;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'shared.card': SharedCard;
      'shared.link': SharedLink;
      'shared.logo-link': SharedLogoLink;
      'ytkb.action-step': YtkbActionStep;
      'ytkb.digest-contradiction': YtkbDigestContradiction;
      'ytkb.digest-contradiction-position': YtkbDigestContradictionPosition;
      'ytkb.digest-shared-theme': YtkbDigestSharedTheme;
      'ytkb.digest-unique-insight': YtkbDigestUniqueInsight;
      'ytkb.digest-video-title': YtkbDigestVideoTitle;
      'ytkb.digest-viewing-order': YtkbDigestViewingOrder;
      'ytkb.section': YtkbSection;
      'ytkb.takeaway': YtkbTakeaway;
    }
  }
}
