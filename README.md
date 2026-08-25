# The Bokki

> **Your digital notebooks, your way.**

The Bokki is a desktop-first digital notebook designed to combine the freedom of a physical notebook with the flexibility of a rich-text editor and the visual organization of a free-form canvas.

The project was created from a simple idea: digital note-taking tools often make you choose between structured productivity and the personal feeling of writing in a notebook. The Bokki aims to bring these experiences together in one local, customizable application.

The application is planned to work **offline and locally on the user's computer**, with support for **Windows and Linux**. Notes and notebooks are intended to belong to the user as local data rather than depending on a cloud account.

## ✨ Concept

The Bokki is built around the idea of a **digital bookshelf of personal notebooks**.

Each notebook can have its own cover, pages, visual style and content. Inside a page, the user can write rich text using movable text boxes, place stickers and other visual elements wherever they want, and organize important pages with bookmarks.

The experience is inspired by different tools and objects, but the goal is not to reproduce any of them exactly:

- **Physical notebooks** — the feeling of pages, covers, bookmarks and personalization.
- **OneNote** — flexible, positionable content containers on a page.
- **Obsidian / Markdown** — structured text, portability.
- **Rich-text editors** — formatting such as bold, italic, highlights, colors and lists.
- **Digital stationery** — stickers, decorative elements, themes and visual customization.

The result should feel like a notebook rather than a conventional productivity dashboard.


## 📚 Planned Features

The following features describe the **planned product vision**. They are not all expected to be implemented at the beginning of development.


### 📖 Notebooks

- Create multiple notebooks.
    
- Give each notebook its own name.
    
- Customize notebook covers.
    
- Open a notebook as an interactive book-like interface.
    
- Navigate through pages.
    
- Customize the appearance of pages.
    
- Support long pages that can grow vertically as the user writes.


### ✍️ Rich Text Editing

Each text area on a page is intended to work as a rich-text editor.

Planned formatting includes:

- Bold.
    
- Italic.
    
- Underline.
    
- Strikethrough.
    
- Text colors.
    
- Highlights / text marker.
    
- Headings.
    
- Bulleted lists.
    
- Numbered lists.
    
- Checklists.
    
- Blockquotes.
    
- Code blocks.
    
- Inline code.
    
- Links.
    
- Other rich-text features as the editor evolves.

    
### 🖱️ Positionable Page Elements

Instead of treating an entire page as one continuous text document, the page is planned as a visual workspace containing independent elements.

Examples:

- Text boxes.
    
- Stickers.
    
- Images.
    
- Decorative elements.
    
- Future custom elements. 

Each element can have its own position and visual properties, allowing the user to compose a page more freely.


### 🎀 Stickers & Decorations

Stickers are intended to be one of the visual identities of The Bokki.

The planned sticker system includes:

- A base collection of stickers included with the application.
    
- Sticker packs.
    
- Multiple sticker types inside each pack.
    
- Positioning stickers freely on a page.
    
- Resizing stickers.
    
- Rotating stickers.
    
- Reusing stickers while the user still owns units of them.
    
- Decorative elements such as washi tape and other stationery-style assets in future versions.


### 🔖 Page Bookmarks

Users will be able to mark important pages with customizable bookmarks.

A bookmark is expected to contain information such as:

- Page reference.
    
- Color.
    
- Label/name.
    
- Visual position.
  
    
The interface will visually place bookmarks according to the current page. For example, when the user is on page 10, a bookmark for page 5 can appear on the left side of the book, while a bookmark for page 20 can appear on the right. When the user moves to page 30, the page 20 bookmark should automatically appear on the left because that page is now behind the current page.


### 📝 Quick Notes

The home screen is planned to include a visible area for quick notes.

Quick notes are intentionally simple and fast:

- Short text notes.
    
- Checkable items.
    
- Easy creation.
    
- Easy visibility from the home screen.

    
The goal is to support small thoughts and reminders without requiring the user to open a notebook first.


### 🪙 Daily Rewards

A future version of The Bokki will include an internal currency system used by the sticker shop.

The planned reward cycle has ten consecutive login days:

Day 1 → reward
Day 2 → reward
Day 3 → reward
...
Day 10 → reward
Day 11 → back to Day 1

The streak is based on consecutive days of opening the application. Missing the required consecutive login interval resets the cycle to Day 1.


### 🛍️ Sticker Shop

A future version will contain an in-app sticker shop using The Bokki's internal currency.

Users will be able to:

- Browse sticker packs.
    
- View pack contents.
    
- Purchase packs using internal coins.
    
- Receive sticker units after purchasing a pack.
    
- See their remaining sticker inventory.

Example:
  Cute Pack
    10 🪙

  🐰 Bunny ×3,
  🎀 Bow   ×3,
  🌸 Flower ×3.

If the user places one Bunny sticker on a page, the inventory becomes:

🐰 Bunny ×2,
🎀 Bow   ×3,
🌸 Flower ×3.

After three uses, the Bunny units from that purchase are exhausted. The user must obtain another pack to receive more units.


## 🛠️ Planned Tech Stack
### Frontend

- Angular
- TypeScript 
- HTML  
- Tailwind CSS

Angular: Frontend framework used to build the application's interface and components.

Tailwind CSS: Utility-first CSS framework used for styling and building the user interface.

### Desktop

- Tauri 2  
- Rust

Tauri 2: Desktop application framework that packages the Angular frontend as a native desktop application.

Rust: Used by Tauri for native desktop and system-level functionality.

### Data

- SQLite
    
SQLite is planned as the local database for notebooks, pages, bookmarks, rewards, inventory and application settings.

### Rich Text
- Tiptap

Tiptap is being considered for the rich-text editing layer inside movable text elements.

## 🎨 UI Preview
The following prototypes serve as a visual guide for the planned interface and user experience of The Bokki. They represent the current design direction and may contain unfinished or placeholder elements. The final interface may change throughout development.

### Home

<img width="2398" height="1462" alt="image" src="https://github.com/user-attachments/assets/a45ac135-ba61-4c73-acb1-eb982210332f" />


### Notebook/Bokki

<img width="2398" height="1462" alt="image" src="https://github.com/user-attachments/assets/22948c8f-24f2-4c25-8b93-b35c0b7331ad" />

#### Example of the page bookmarking feature.
<img width="2398" height="1462" alt="image" src="https://github.com/user-attachments/assets/11afbf78-484e-4cf0-8210-200978ee0238" />

#### Example with the sticker inventory open.
<img width="2398" height="1462" alt="image" src="https://github.com/user-attachments/assets/e7b10acc-8c92-46a1-86ba-0dd00fabafd1" />


### Sticker Shoop

<img width="2398" height="1462" alt="image" src="https://github.com/user-attachments/assets/8e356132-606a-4f0e-b8bd-d18482c66972" />






