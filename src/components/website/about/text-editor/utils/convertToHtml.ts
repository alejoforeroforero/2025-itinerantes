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

interface UserNode extends BaseNode {
  type: "user";
  userId: string;
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
  | UserNode;

interface EditorState {
  root: RootNode;
}

export function convertToHTML(jsonText: string): string {
  try {
    const editorState: EditorState = JSON.parse(jsonText);
    return processNode(editorState.root);
  } catch (error) {
    console.error("Error converting to HTML:", error);
    return "";
  }
}

function processNode(node: Node): string {
  if (!node) return "";

  let html = "";
  const themeClasses = getThemeClasses(node);

  switch (node.type) {
    case "root": {
      html =
        node.children?.map((child) => processNode(child as Node)).join("") ||
        "";
      break;
    }

    case "paragraph": {
      const classes: string[] = [...themeClasses];

      // Aplicar clases de dirección según TextEditorTheme
      if (node.direction === "ltr") classes.push("ltr");
      if (node.direction === "rtl") classes.push("rtl");

      // Aplicar formato de alineación
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      // Aplicar indentación
      if (node.indent) classes.push(`editor-indent-${node.indent}`);

      const classAttr =
        classes.length > 0 ? ` class="${classes.join(" ")}"` : "";
      const content =
        node.children?.map((child) => processNode(child as Node)).join("") ||
        "&nbsp;";
      html = `<p${classAttr}>${content}</p>`;
      break;
    }

    case "heading": {
      const classes: string[] = [...themeClasses];

      // Aplicar clases de dirección
      if (node.direction === "ltr") classes.push("ltr");
      if (node.direction === "rtl") classes.push("rtl");

      // Aplicar formato de alineación
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      // Aplicar indentación
      if (node.indent) classes.push(`editor-indent-${node.indent}`);

      const classAttr =
        classes.length > 0 ? ` class="${classes.join(" ")}"` : "";
      const tag = node.tag || "h1";
      html = `<${tag}${classAttr}>${
        node.children?.map((child) => processNode(child as Node)).join("") || ""
      }</${tag}>`;
      break;
    }

    case "text": {
      let content = node.text;

      // Apply text formatting
      if (node.format) {
        if (node.format & 1) content = `<strong>${content}</strong>`;
        if (node.format & 2) content = `<em>${content}</em>`;
        if (node.format & 4) content = `<u>${content}</u>`;
        if (node.format & 8) content = `<s>${content}</s>`;
        if (node.format & 16) content = `<code>${content}</code>`;
      }

      // Apply custom styles if present
      if (node.style) {
        content = `<span style="${node.style}">${content}</span>`;
      }

      html = content;
      break;
    }

    case "youtube": {
      const classes: string[] = ["youtube-embed"];

      // Aplicar formato de alineación
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      const classAttr =
        classes.length > 0 ? ` class="${classes.join(" ")}"` : "";

      html = `<div${classAttr}>
        <iframe 
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${node.videoID}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>`;
      break;
    }


    case "list": {
      const classes: string[] = [...themeClasses];

      // Aplicar formato de alineación
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      const classAttr =
        classes.length > 0 ? ` class="${classes.join(" ")}"` : "";
      const tag = node.listType === "bullet" ? "ul" : "ol";
      html = `<${tag}${classAttr}>${node.children
        ?.map((child) => processNode(child as Node))
        .join("")}</${tag}>`;
      break;
    }

    case "listitem": {
      const classes: string[] = [...themeClasses];

      // Aplicar clases de dirección
      if (node.direction === "ltr") classes.push("ltr");
      if (node.direction === "rtl") classes.push("rtl");

      // Aplicar indentación
      if (node.indent) classes.push(`editor-indent-${node.indent}`);

      const classAttr =
        classes.length > 0 ? ` class="${classes.join(" ")}"` : "";
      const content =
        node.children?.map((child) => processNode(child as Node)).join("") ||
        "&nbsp;";
      html = `<li${classAttr}>${content}</li>`;
      break;
    }

    case "link": {
      const classes: string[] = [...themeClasses];

      // Aplicar formato de alineación
      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      const classAttr =
        classes.length > 0 ? ` class="${classes.join(" ")}"` : "";
      const content =
        node.children?.map((child) => processNode(child as Node)).join("") ||
        "";
      html = `<a${classAttr} href="${node.url}" target="_blank" rel="noopener noreferrer">${content}</a>`;
      break;
    }

    case "image": {
      const width =
        node.width && node.width !== "inherit" ? ` width="${node.width}"` : "";
      const height =
        node.height && node.height !== "inherit"
          ? ` height="${node.height}"`
          : "";
      const maxWidth = node.maxWidth
        ? ` style="max-width: ${node.maxWidth}px;"`
        : "";

      let imageHtml = `<img src="${node.src}" alt="${node.altText}"${width}${height}${maxWidth}>`;

      // Si hay caption y showCaption es true, envolver en figure
      if (node.showCaption && node.caption) {
        const captionHtml = processNode(node.caption as unknown as Node);
        imageHtml = `<figure>${imageHtml}<figcaption>${captionHtml}</figcaption></figure>`;
      }

      // Solo envolver en span para mantener el inline-block sin romper el párrafo
      html = `<span class="editor-image">${imageHtml}</span>`;

      break;
    }

    case "user": {
      const classes: string[] = [...themeClasses];

      if (typeof node.format === "string") {
        classes.push(`text-${node.format}`);
      }

      const classAttr =
        classes.length > 0 ? ` class="${classes.join(" ")}"` : "";

      html = `<div${classAttr}>
        <div>${JSON.parse(node.userId).name}</div>
      </div>`
      break;
    }
  }

  return html;
}


function getThemeClasses(node: Node): string[] {
  const classes: string[] = [];

  switch (node.type) {
    case "heading":
      classes.push(`editor-heading-${node.tag}`);
      break;
    case "paragraph":
      classes.push("editor-paragraph");
      break;
    case "text":
      if (node.format & 1) classes.push("editor-text-bold");
      if (node.format & 2) classes.push("editor-text-italic");
      if (node.format & 4) classes.push("editor-text-underline");
      if (node.format & 8) classes.push("editor-text-strikethrough");
      if (node.format & 16) classes.push("editor-text-code");
      break;
    case "list":
      if (node.listType === "bullet") classes.push("editor-list-ul");
      if (node.listType === "number") classes.push("editor-list-ol");
      break;
    case "listitem":
      classes.push("editor-listitem");
      if (node.nested) classes.push("editor-nested-listitem");
      break;
    case "quote":
      classes.push("editor-quote");
      break;
    case "link":
      classes.push("editor-link");
      break;
    case "user":
      classes.push("bg-blue-100", "p-4", "rounded-lg", "shadow-md", "hover:bg-blue-200", "transition-colors");
      break;
  }

  return classes;
}
