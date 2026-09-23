const specimens = [
  {
    index: "001",
    type: "HYBRID SPECIMEN",
    kicker: "美丽彩袄蛱蝶杂交体",
    titleHtml: "玫瑰彩袄蛱蝶<br />杂交水波靴蛱蝶",
    titleText: "玫瑰彩袄蛱蝶杂交水波靴蛱蝶",
    latinHtml: "<i>Agrias claudina lugens</i> × <i>Prepona dexamenus</i>",
    images: {
      dorsal: "assets/agrias-dorsal.webp",
      ventral: "assets/agrias-ventral.webp",
    },
    highRes: {
      dorsal: { key: "agrias-dorsal", parts: 3 },
      ventral: { key: "agrias-ventral", parts: 5 },
    },
    alts: {
      dorsal: "玫瑰彩袄蛱蝶杂交水波靴蛱蝶的翅正面：黑色翅面带橙红、玫红与电光蓝色斑纹",
      ventral: "玫瑰彩袄蛱蝶杂交水波靴蛱蝶的翅背面：金褐与橙黄色翅面带有成列眼斑",
    },
    appearance: [
      "翅正面以深绒黑为底，前翅铺展开炽烈的橙红与玫红色块，近基部嵌着一道电光蓝；后翅的宝石蓝斑与奶黄色斑点在暗色翅面上形成鲜明对比。",
      "翅背面则转为金褐、橙黄与奶油白，后翅排列着层次丰富的环状眼斑。正反两面一面浓烈、一面繁复，呈现出两种亲本风格交汇后的独特观赏性。",
    ],
    collection:
      "在美丽彩袄蛱蝶杂交体中，这一组合兼具醒目的翅正面色彩与细节丰富的翅背面纹理，是一只收藏表现突出、性价比较高的标本。",
    price: "350–400",
    priceNote: "绿色形态通常价格更高；实际价值会因完整度、尺寸、展翅状态与市场供求而变化。",
    accents: ["#d9f478", "#ff6544"],
  },
  {
    index: "002",
    type: "SWALLOWTAIL SPECIMEN",
    kicker: "番凤蝶属标本",
    titleHtml: "安绿番凤蝶",
    titleText: "安绿番凤蝶",
    latinHtml: "<i>Parides anchises nephalion</i>",
    images: {
      dorsal: "assets/parides-dorsal.webp",
      ventral: "assets/parides-ventral.webp",
    },
    highRes: {
      dorsal: { key: "parides-dorsal", parts: 3 },
      ventral: { key: "parides-ventral", parts: 3 },
    },
    alts: {
      dorsal: "安绿番凤蝶的翅正面：墨黑翅面带薄荷绿色、乳白色与朱红色斑纹",
      ventral: "安绿番凤蝶的翅背面：橄榄黑色翅面带清晰翅脉与红橙色后翅斑点",
    },
    appearance: [
      "翅正面以近乎丝绒质感的墨黑为底，前翅中央各嵌一块柔和的薄荷绿色斑；后翅内侧展开乳白色长斑，并由两道醒目的朱红色短斑收住视线。波浪状翅缘上的浅色月牙，让深色轮廓更显利落。",
      "翅背面收敛为低调的橄榄黑与深褐色，光线下可见细密而清晰的翅脉。后翅只留下少量红橙色斑点，配合身体两侧的红色点缀，呈现出比正面更沉稳、克制的层次。",
    ],
    collection:
      "安绿番凤蝶以少量高纯度色斑打破大面积深色翅面，辨识度高而不显繁复。正背面对比清楚、展翅轮廓漂亮，是兼顾观赏效果与入门预算的一件标本。",
    price: "80–120",
    priceNote: "参考区间适用于品相完整、展翅自然的个体；实际价格会随尺寸、完整度与市场供求变化。",
    accents: ["#bdebb6", "#ff5038"],
  },
];

const state = { view: "dorsal", specimen: 0 };
const highResCache = new Map();

const page = document.querySelector(".specimen-page");
const stage = document.querySelector("#butterfly-stage");
const sideLabel = document.querySelector("#side-label");
const images = {
  dorsal: document.querySelector("#dorsal-image"),
  ventral: document.querySelector("#ventral-image"),
};
const viewButtons = [...document.querySelectorAll("[data-view]")];
const specimenButtons = [...document.querySelectorAll("[data-specimen]")];

const fields = {
  headerIndex: document.querySelector("#header-index"),
  collectionIndex: document.querySelector("#collection-index"),
  type: document.querySelector("#specimen-type"),
  kicker: document.querySelector("#specimen-kicker"),
  title: document.querySelector("#specimen-title"),
  latin: document.querySelector("#latin-name"),
  appearanceOne: document.querySelector("#appearance-one"),
  appearanceTwo: document.querySelector("#appearance-two"),
  collection: document.querySelector("#collection-copy"),
  price: document.querySelector("#price-range"),
  priceNote: document.querySelector("#price-note"),
};

function getHighResUrl(asset) {
  if (highResCache.has(asset.key)) return highResCache.get(asset.key);

  const request = Promise.all(
    Array.from({ length: asset.parts }, (_, index) =>
      fetch(`assets/full/${asset.key}.${index}.b64`).then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${asset.key}`);
        return response.text();
      }),
    ),
  ).then((chunks) => {
    const binary = window.atob(chunks.join(""));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return URL.createObjectURL(new Blob([bytes], { type: "image/png" }));
  });

  highResCache.set(asset.key, request);
  return request;
}

function upgradeImage(side, specimen) {
  const image = images[side];
  const asset = specimen.highRes[side];
  image.dataset.highResKey = asset.key;

  getHighResUrl(asset)
    .then((url) => {
      if (image.dataset.highResKey === asset.key) image.src = url;
    })
    .catch(() => {
      // Keep the lightweight fallback image if the original is unavailable.
    });
}

function setView(nextView) {
  if (!images[nextView]) return;

  state.view = nextView;
  Object.entries(images).forEach(([view, image]) => {
    image.classList.toggle("is-active", view === nextView);
  });

  viewButtons.forEach((button) => {
    const selected = button.dataset.view === nextView;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  const isDorsal = nextView === "dorsal";
  sideLabel.textContent = isDorsal ? "翅正面 · DORSAL" : "翅背面 · VENTRAL";
  stage.setAttribute("aria-label", isDorsal ? "切换到翅背面" : "切换到翅正面");
}

function renderSpecimen(index) {
  const specimen = specimens[index];
  if (!specimen) return;

  state.specimen = index;
  page.classList.add("is-changing");

  window.setTimeout(() => {
    fields.headerIndex.textContent = specimen.index;
    fields.collectionIndex.textContent = `COLLECTION / ${specimen.index}`;
    fields.type.textContent = specimen.type;
    fields.kicker.textContent = specimen.kicker;
    fields.title.innerHTML = specimen.titleHtml;
    fields.latin.innerHTML = specimen.latinHtml;
    fields.appearanceOne.textContent = specimen.appearance[0];
    fields.appearanceTwo.textContent = specimen.appearance[1];
    fields.collection.textContent = specimen.collection;
    fields.price.innerHTML = `<small>¥</small>${specimen.price}`;
    fields.priceNote.textContent = specimen.priceNote;

    images.dorsal.src = specimen.images.dorsal;
    images.ventral.src = specimen.images.ventral;
    images.dorsal.alt = specimen.alts.dorsal;
    images.ventral.alt = specimen.alts.ventral;

    document.documentElement.style.setProperty("--acid", specimen.accents[0]);
    document.documentElement.style.setProperty("--coral", specimen.accents[1]);
    document.title = `美神蝴蝶标本工作室 · ${specimen.titleText}`;
    document.querySelector('meta[name="description"]').content =
      `${specimen.titleText}标本档案：正反面观察、形态描述与收藏参考。`;

    specimenButtons.forEach((button) => {
      const selected = Number(button.dataset.specimen) === index;
      button.classList.toggle("is-current", selected);
      if (selected) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });

    setView("dorsal");
    page.classList.remove("is-changing");
  }, 140);
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

specimenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextIndex = Number(button.dataset.specimen);
    if (nextIndex === state.specimen) return;
    renderSpecimen(nextIndex);
    window.setTimeout(() => {
      document.querySelector("#top").scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
  });
});

stage.addEventListener("click", () => {
  setView(state.view === "dorsal" ? "ventral" : "dorsal");
});

stage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") setView("dorsal");
  if (event.key === "ArrowRight") setView("ventral");
});

Object.values(images).forEach((image) => {
  image.addEventListener("error", () => {
    if (image.src.endsWith(".webp")) image.src = image.src.replace(/\.webp$/, ".png");
  });
});
