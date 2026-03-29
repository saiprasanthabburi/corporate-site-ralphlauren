var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/homepage.js
  function classToBlockName(className) {
    const parts = className.trim().split(/\s+/);
    const base = parts[0].split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    if (parts.length > 1) {
      return `${base} (${parts.slice(1).join(", ")})`;
    }
    return base;
  }
  function blockDivToTable(blockDiv, document) {
    const className = blockDiv.getAttribute("class");
    const blockName = classToBlockName(className);
    const rows = [...blockDiv.children];
    const maxCols = rows.reduce((max, row) => Math.max(max, row.children.length), 1);
    const table = document.createElement("table");
    const headerTr = document.createElement("tr");
    const th = document.createElement("th");
    th.colSpan = maxCols;
    th.textContent = blockName;
    headerTr.appendChild(th);
    table.appendChild(headerTr);
    for (const row of rows) {
      const tr = document.createElement("tr");
      const cells = [...row.children];
      for (const cell of cells) {
        const td = document.createElement("td");
        while (cell.firstChild) {
          td.appendChild(cell.firstChild);
        }
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    return table;
  }

  // tools/importer/import-homepage.js
  var FIGMA_BASE = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/";
  var SECTION_IMAGES = {
    0: {
      // Hero
      "e4f9cc00-a281-445c-ad7d-eca335ded9f5": { id: "ecc54448-b3aa-4306-8cc3-0c5b6d4971ba", alt: "New York City skyline at dusk" }
    },
    1: {
      // Quote signature
      "f3bc066b-6261-445f-8791-72c1ac353f04": { id: "dd186da6-3d9d-45aa-a0cf-53c2aec6e419", alt: "Ralph Lauren Signature" }
    },
    2: {
      // About Us portrait
      "0b7c45b5-78c4-4bbc-9b56-d5070a9e175c": { id: "8fafd5eb-0ffa-4755-9343-7466c6679a50", alt: "Ralph Lauren portrait" }
    },
    3: {
      // Newsroom
      "5cdc5bca-7a4c-4ce8-b8fb-147c3e293b0d": { id: "71a27b6b-f93a-416e-9f57-71d5838948df", alt: "Ralph Lauren 2025 Q1 Report" },
      "4db07285-439c-4f9e-a83e-098773242359": { id: "f7e4acac-2df8-4501-9872-b33ed88ea6c1", alt: "Polo 67 fragrance" }
    },
    4: {
      // Timeless by Design
      "761cd989-ece6-4248-badd-a0b1f0efb46c": { id: "afcd7640-6384-4063-8c9f-38d593c65eb7", alt: "Timeless by Design landscape" }
    },
    5: {
      // Our Brands cards
      "03e59775-00f6-4eb5-8894-938122aba083": { id: "1d050119-4db3-460b-817d-8990bb9aa7fa", alt: "Purple Label" },
      "2f76e17c-e1e4-40b8-9e77-577e0c85a8cc": { id: "ad6c5711-ca69-44c3-9e00-d9ba5a718abb", alt: "Collection" },
      "761cd989-ece6-4248-badd-a0b1f0efb46c": { id: "9a114c6f-6ea5-4550-ae13-447678e30dc5", alt: "Polo" }
    },
    6: {
      // Hamptons press release
      "e4f9cc00-a281-445c-ad7d-eca335ded9f5": { id: "be0642eb-8763-43cc-97a4-0c0eee45078c", alt: "Ralph Lauren Hamptons fashion experience" }
    }
  };
  function fixImageUrls(element, sectionIndex) {
    const map = SECTION_IMAGES[sectionIndex];
    if (!map) return;
    const imgs = element.querySelectorAll("img");
    for (const img of imgs) {
      const src = img.getAttribute("src") || "";
      for (const [oldId, { id, alt }] of Object.entries(map)) {
        if (src.includes(oldId)) {
          img.setAttribute("src", `${FIGMA_BASE}${id}`);
          img.setAttribute("alt", alt);
        }
      }
    }
  }
  var import_homepage_default = {
    transform: ({ document }) => {
      const body = document.querySelector("body");
      const main = document.createElement("div");
      const sections = [...body.children].filter(
        (el) => el.tagName === "DIV"
      );
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        fixImageUrls(section, i);
        const children = [...section.children];
        for (const child of children) {
          const className = child.getAttribute("class");
          if (className) {
            const table = blockDivToTable(child, document);
            main.appendChild(table);
          } else {
            main.appendChild(child.cloneNode(true));
          }
        }
        if (i < sections.length - 1) {
          main.appendChild(document.createElement("hr"));
        }
      }
      return [
        {
          element: main,
          path: "/homepage"
        }
      ];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
