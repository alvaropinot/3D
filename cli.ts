import { ensureDir } from "https://deno.land/std@0.116.0/fs/mod.ts";

// Root directory for the database
const DATABASE_DIR = "database";

// Default content templates
const README_CONTENT = `# 3D Printable Objects Database

A human-readable, Markdown-based database for 3D printable objects. Categories contain links to their respective items, keeping navigation straightforward. Contributions welcome!

### Categories
- [Home Decor](categories/home_decor.md)
- [Office Supplies](categories/office_supplies.md)

### Objects
- [Minimalist Planter](objects/minimalist_planter.md)
- [Modular Wall Art](objects/modular_wall_art.md)
`;

const CATEGORY_TEMPLATE = (name: string, id: string, description: string) => `
# ${name}

ID  ${id}  
Items  ${description}

### Objects
`;

const OBJECT_TEMPLATE = (name: string, id: string, category: string, categoryFile: string, description: string, designer: string, dimensions: string, material: string, tags: string) => `
# ${name}

ID  ${id}  
Category  [${category}](../categories/${categoryFile}.md)  
Description  ${description}  
Designer  ${designer}  
Source  [Printables - ${name}](https://www.printables.com/print/12345)  
Dimensions  ${dimensions}  
Material  ${material}  
Tags  ${tags}
`;

// Function to create a file with content
async function createFile(path: string, content: string) {
  await Deno.writeTextFile(path, content);
  console.log(`Created: ${path}`);
}

// Function to set up the base structure with README and example files
async function setupDatabase() {
  await ensureDir(`${DATABASE_DIR}/categories`);
  await ensureDir(`${DATABASE_DIR}/objects`);

  await createFile(`${DATABASE_DIR}/README.md`, README_CONTENT);

  // Create initial category and object examples
  await createCategory("Home Decor", "cat-01", "Items designed for home decoration, including planters and wall art.");
  await createObject("Minimalist Planter", "obj-01", "Home Decor", "home_decor", "A sleek planter for indoor spaces.", "DesignerX", "100mm x 80mm x 120mm", "PLA recommended", "#planter #home #minimalist");
}

// Function to create a new category
async function createCategory(name: string, id: string, description: string) {
  const content = CATEGORY_TEMPLATE(name, id, description);
  const filePath = `${DATABASE_DIR}/categories/${name.toLowerCase().replace(/ /g, "_")}.md`;
  await createFile(filePath, content);
}

// Function to create a new object
async function createObject(name: string, id: string, category: string, categoryFile: string, description: string, designer: string, dimensions: string, material: string, tags: string) {
  const content = OBJECT_TEMPLATE(name, id, category, categoryFile, description, designer, dimensions, material, tags);
  const filePath = `${DATABASE_DIR}/objects/${name.toLowerCase().replace(/ /g, "_")}.md`;
  await createFile(filePath, content);
}

// Parse command line arguments to create a new category or object
const args = Deno.args;
if (args[0] === "setup") {
  await setupDatabase();
} else if (args[0] === "createCategory") {
  await createCategory(args[1], args[2], args[3]);
} else if (args[0] === "createObject") {
  await createObject(args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
} else {
  console.log("Usage:");
  console.log("  deno run --allow-write generate_db.ts setup");
  console.log("  deno run --allow-write generate_db.ts createCategory <name> <id> <description>");
  console.log("  deno run --allow-write generate_db.ts createObject <name> <id> <category> <categoryFile> <description> <designer> <dimensions> <material> <tags>");
}