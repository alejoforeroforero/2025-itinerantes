import React, { JSX } from "react";

interface BaseNode {
  type: string;
  version: 1;
  format: string | number;
  indent?: number;
  direction?: string | null;
  children?: Node[];
}

interface RootNode extends BaseNode {
  type: "root";
  children: Node[];
}

interface TextNode extends BaseNode {
  type: "text";
  detail: number;
  mode: "normal";
  style: string;
  text: string;
  format: number;
}

interface ParagraphNode extends BaseNode {
  type: "paragraph";
  textFormat: number;
  textStyle: string;
}

interface HeadingNode extends BaseNode {
  type: "heading";
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

interface YouTubeNode extends BaseNode {
  type: "youtube";
  videoID: string;
}

interface ListNode extends BaseNode {
  type: "list";
  listType: "bullet" | "number" | "check";
}

interface ListItemNode extends BaseNode {
  type: "listitem";
  nested?: boolean;
  checked?: boolean;
}

interface QuoteNode extends BaseNode {
  type: "quote";
}

interface LinkNode extends BaseNode {
  type: "link";
  url: string;
}

interface ImageNode extends BaseNode {
  type: "image";
  src: string;
  altText: string;
  width?: number | "inherit";
  height?: number | "inherit";
  maxWidth?: number;
  showCaption?: boolean;
  caption?: EditorState;
}



type Node =
  | RootNode
  | TextNode
  | ParagraphNode
  | HeadingNode
  | YouTubeNode
  | ListNode
  | ListItemNode
  | QuoteNode
  | LinkNode
  | ImageNode

interface EditorState {
  root: RootNode;
}

export const convertToHTMLDynamic = (jsonText: string) => {
  try {
    const editorState: EditorState = JSON.parse(jsonText);
    // Ensure we're not conditionally rendering hooks
    return (
      <div className="editor-content">{generateHTML(editorState.root)}</div>
    );
  } catch (error) {
    console.error("Error converting to HTML:", error);
    return <div className="error-content">Error processing content</div>;
  }
};

function generateHTML(node: Node): JSX.Element | JSX.Element[] | string {
  if (!node) return "";

  switch (node.type) {
    case "root": {
      return (
        <div className="editor-root">
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{generateHTML(child)}</React.Fragment>
          ))}
        </div>
      );
    }

    case "paragraph": {
      const classes = ["editor-paragraph"];

      // Add direction classes
      if (node.direction === "ltr") classes.push("ltr");
      if (node.direction === "rtl") classes.push("rtl");

      // Add alignment classes
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      // Add indentation
      if (node.indent) classes.push(`editor-indent-${node.indent}`);

      const style = node.textStyle ? { style: parseStyle(node.textStyle) } : {};

      return (
        <p className={classes.join(" ")} {...style}>
          {node.children?.length === 0 && "\u00A0"}
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{generateHTML(child)}</React.Fragment>
          )) || "\u00A0"}
        </p>
      );
    }

    case "text": {
      const content = node.text;
      const classes: string[] = [];

      // Apply text formatting
      if (node.format) {
        if (node.format & 1) classes.push("editor-text-bold");
        if (node.format & 2) classes.push("editor-text-italic");
        if (node.format & 4) classes.push("editor-text-underline");
        if (node.format & 8) classes.push("editor-text-strikethrough");
        if (node.format & 16) classes.push("editor-text-code");
      }

      const style = node.style ? { style: parseStyle(node.style) } : {};

      return classes.length > 0 || node.style ? (
        <span className={classes.join(" ")} {...style}>
          {content}
        </span>
      ) : (
        content
      );
    }

    case "heading": {
      const classes = [`editor-heading-${node.tag || "h1"}`];

      // Add direction classes
      if (node.direction === "ltr") classes.push("ltr");
      if (node.direction === "rtl") classes.push("rtl");

      // Add alignment classes
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      // Add indentation
      if (node.indent) classes.push(`editor-indent-${node.indent}`);

      const HeadingTag = node.tag || "h1";

      return (
        <HeadingTag className={classes.join(" ")}>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{generateHTML(child)}</React.Fragment>
          ))}
        </HeadingTag>
      );
    }

    case "youtube": {
      const classes = ["youtube-embed"];

      // Add alignment classes
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      return (
        <div className={classes.join(" ")}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${node.videoID}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
          />
        </div>
      );
    }

    case "list": {
      const classes = [];

      // Add theme classes (ul/ol specific classes)
      if (node.listType === "bullet") classes.push("editor-list-ul");
      if (node.listType === "number") classes.push("editor-list-ol");

      // Add alignment classes
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      const ListTag = node.listType === "bullet" ? "ul" : "ol";

      return (
        <ListTag className={classes.join(" ")}>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{generateHTML(child)}</React.Fragment>
          ))}
        </ListTag>
      );
    }

    case "listitem": {
      const classes = ["editor-listitem"];

      // Add direction classes
      if (node.direction === "ltr") classes.push("ltr");
      if (node.direction === "rtl") classes.push("rtl");

      // Add indentation
      if (node.indent) classes.push(`editor-indent-${node.indent}`);

      // Add nested class if applicable
      if (node.nested) classes.push("editor-nested-listitem");

      return (
        <li className={classes.join(" ")}>
          {node.children?.length === 0 && "\u00A0"}
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{generateHTML(child)}</React.Fragment>
          )) || "\u00A0"}
        </li>
      );
    }

    case "link": {
      const classes = ["editor-link"];

      // Add alignment classes
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      return (
        <a
          className={classes.join(" ")}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{generateHTML(child)}</React.Fragment>
          ))}
        </a>
      );
    }

    case "image": {
      const imageStyle: React.CSSProperties = {};
      if (node.maxWidth) {
        imageStyle.maxWidth = `${node.maxWidth}px`;
      }

      const imageProps = {
        src: node.src,
        alt: node.altText,
        style: imageStyle,
        ...(node.width && node.width !== "inherit"
          ? { width: node.width }
          : {}),
        ...(node.height && node.height !== "inherit"
          ? { height: node.height }
          : {}),
      };

      const imageElement = <img {...imageProps} />;

      // If there's a caption and showCaption is true, wrap in figure
      if (node.showCaption && node.caption) {
        return (
          <span className="editor-image">
            <figure>
              {imageElement}
              <figcaption>
                {generateHTML(node.caption as unknown as Node)}
              </figcaption>
            </figure>
          </span>
        );
      }

      // Just wrap in span to maintain inline-block without breaking paragraph
      return <span className="editor-image">{imageElement}</span>;
    }

    case "quote": {
      const classes = ["editor-quote"];

      // Add alignment classes
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      return (
        <blockquote className={classes.join(" ")}>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{generateHTML(child)}</React.Fragment>
          ))}
        </blockquote>
      );
    }

    default:
      return "";
  }
}

function parseStyle(styleString: string): React.CSSProperties {
  if (!styleString) return {};

  return styleString
    .split(";")
    .filter((style) => style.trim())
    .reduce((acc, style) => {
      const [property, value] = style.split(":").map((str) => str.trim());
      const camelCaseProperty = property.replace(/-([a-z])/g, (g) =>
        g[1].toUpperCase()
      );
      return { ...acc, [camelCaseProperty]: value };
    }, {});
}
