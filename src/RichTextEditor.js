// src/RichTextEditor.js
import "./styles.css";
import { TRANSLATIONS } from './translations';
export class RichTextEditor {
    constructor(selector, options = {}) {
      this.container = typeof selector === 'string' 
        ? document.querySelector(selector) 
        : selector;

      this.isTextarea = this.container.tagName.toLowerCase() === 'textarea';
      
      if (this.isTextarea) {
        // Store the original textarea
        this.textarea = this.container;
        this.textareaName = this.textarea.getAttribute('name');
        
        // Create a wrapper div
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'rich-editor-wrapper';
        this.textarea.parentNode.insertBefore(this.wrapper, this.textarea);
        
        // Hide the original textarea but keep it in the DOM for form submission
        this.textarea.style.display = 'none';
        
        // Set the wrapper as our container
        this.container = this.wrapper;
      }

      this.options = {
        height: 510,
        width: 896,
        language: this.detectLanguage(), // Auto-detect language by default
        translations: {}, // Custom translations can be provided
        placeholder: 'Start writing here...',
        toolbar: {
          basic: true,
          formatting: true,
          alignment: true,
          lists: true,
          media: true,
        },
        fonts: [
          { name: 'Arial', value: 'Arial' },
          { name: 'Times New Roman', value: 'Times New Roman' },
          { name: 'Courier New', value: 'Courier New' },
          { name: 'Georgia', value: 'Georgia' },
          { name: 'Verdana', value: 'Verdana' }
        ],
        colors: [
          '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
          '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
        ],
        counters: true,
        ...options
      };

      // Merge custom translations with default ones
      this.translations = {
        ...TRANSLATIONS,
        ...this.options.translations
      };
  
      this.init();
    }

    detectLanguage() {
      // Try to detect language from HTML lang attribute
      const htmlLang = document.documentElement.lang;
      if (htmlLang && TRANSLATIONS[htmlLang]) {
        return htmlLang;
      }
  
      // Try to detect from browser
      const browserLang = navigator.language.split('-')[0];
      if (TRANSLATIONS[browserLang]) {
        return browserLang;
      }
  
      // Default to English
      return 'en';
    }
  
    translate(key) {
      const keys = key.split('.');
      let value = this.translations[this.options.language];
      
      for (const k of keys) {
        if (!value) return key;
        value = value[k];
      }
      
      return value || key;
    }
  
    init() {
      this.createStructure();
      this.setupToolbar();
      this.setupEditor();
      this.setupCounters();
    }
  
    createStructure() {
      this.container.classList.add('rich-editor-container');
      // Create dynamic CSS class with dimensions
      const pxToRem = (px) => px / 16; // Conversion from px to rem

      const style = document.createElement('style');
      style.innerHTML = `
        .rich-editor-container {
          max-width: ${pxToRem(this.options.width)}rem; 
          max-height: ${pxToRem(this.options.height)}rem; 
        }
      `;
      document.head.appendChild(style);
      
      // Crear estructura HTML
      this.container.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          ${this.createToolbarHTML()}
          <div class="relative">
            <div
              class="editor min-h-[400px] p-6 focus:outline-none"
              contenteditable="true"
            >
              <p>${this.options.placeholder}</p>
            </div>
          </div>
          ${this.options.counters ? this.createCountersHTML() : ''}
        </div>
      `;
  
      this.editor = this.container.querySelector('.editor');
    }
  
    createToolbarHTML() {
      const tools = [];
      
      if (this.options.toolbar.basic) {
        tools.push(`
          <div class="flex items-center space-x-2 border-r pr-2">
            <select class="format-block toolbar-select">
              <option value="p">${this.translate('toolbar.formatting.normal')}</option>
              <option value="h1">${this.translate('toolbar.formatting.title1')}</option>
              <option value="h2">${this.translate('toolbar.formatting.title2')}</option>
              <option value="h3">${this.translate('toolbar.formatting.title3')}</option>
              <option value="h4">${this.translate('toolbar.formatting.title4')}</option>
              <option value="pre">${this.translate('toolbar.formatting.code')}</option>
            </select>
            
            <select class="font-name toolbar-select">
              ${this.options.fonts.map(font => 
                `<option value="${font.value}">${font.name}</option>`
              ).join('')}
            </select>
          </div>
        `);
      }

      if (this.options.toolbar.formatting) {
        tools.push(`

          <div class="flex items-center space-x-1 border-r pr-2">
            <button data-command="bold" class="toolbar-btn" title="${this.translate('toolbar.buttons.bold')}">
              <i class="fas fa-bold"></i>
            </button>
            <button data-command="italic" class="toolbar-btn" title="${this.translate('toolbar.buttons.italic')}">
              <i class="fas fa-italic"></i>
            </button>
            <button data-command="underline" class="toolbar-btn" title="${this.translate('toolbar.buttons.underline')}">
              <i class="fas fa-underline"></i>
            </button>
            <button data-command="strikethrough" class="toolbar-btn" title="${this.translate('toolbar.buttons.strikethrough')}">
              <i class="fas fa-strikethrough"></i>
            </button>
            <select class="text-color toolbar-select">
              <option value="#374151">${this.translate('toolbar.textColor')}</option>
              ${this.options.colors.map(color => 
                `<option value="${color}" style="background-color: ${color}">${color}</option>`
              ).join('')}
            </select>
  
            <select class="bg-color toolbar-select">
              <option value="">${this.translate('toolbar.backgroundColor')}</option>
              ${this.options.colors.map(color => 
                `<option value="${color}" style="background-color: ${color}">${color}</option>`
              ).join('')}
            </select>
          </div>

        `);
      }

      if(this.options.toolbar.alignment){
        tools.push(`
          <div class="flex items-center space-x-1 border-r pr-2">
              <button data-command="justifyLeft" class="toolbar-btn" title="${this.translate('toolbar.buttons.alignLeft')}">
                <i class="fas fa-align-left"></i>
              </button>
              <button data-command="justifyCenter" class="toolbar-btn" title="${this.translate('toolbar.buttons.alignCenter')}">
                <i class="fas fa-align-center"></i>
              </button>
              <button data-command="justifyRight" class="toolbar-btn" title="${this.translate('toolbar.buttons.alignRight')}">
                <i class="fas fa-align-right"></i>
              </button>
              <button data-command="justifyFull" class="toolbar-btn" title="${this.translate('toolbar.buttons.justify')}">
                <i class="fas fa-align-justify"></i>
              </button>
              <button data-command="indent" class="toolbar-btn" title="${this.translate('toolbar.buttons.indent')}">
                <i class="fas fa-indent"></i>
              </button>
              <button data-command="outdent" class="toolbar-btn" title="${this.translate('toolbar.buttons.outdent')}">
                <i class="fas fa-outdent"></i>
              </button>
          </div>
        `)
      }

      if (this.options.toolbar.lists) {
        tools.push(`
            <div class="flex items-center space-x-1 border-r pr-2">
                <button data-command="insertUnorderedList" class="toolbar-btn" title="${this.translate('toolbar.buttons.bulletList')}">
                    <i class="fas fa-list-ul"></i>
                </button>
                <button data-command="insertOrderedList" class="toolbar-btn" title="${this.translate('toolbar.buttons.numberList')}">
                    <i class="fas fa-list-ol"></i>
                </button>
            </div>
        `);
      }

      if (this.options.toolbar.media) {
        tools.push(`
            <div class="flex items-center space-x-1">
                <button id="link-upload" data-command="createLink" class="toolbar-btn" title="${this.translate('toolbar.buttons.link')}">
                    <i class="fas fa-link"></i>
                </button>
                <button id="image-upload" class="toolbar-btn" title="${this.translate('toolbar.buttons.image')}">
                    <i class="fas fa-image"></i>
                </button>
                <button data-command="undo" class="toolbar-btn" title="${this.translate('toolbar.buttons.undo')}">
                    <i class="fas fa-undo"></i>
                </button>
                <button data-command="redo" class="toolbar-btn" title="${this.translate('toolbar.buttons.redo')}">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `);
      }
  
      // Add more sections according to the options...
  
      return `
        <div class="border-b border-gray-200 p-4">
          <div class="flex flex-wrap gap-2">
            ${tools.join('')}
          </div>
        </div>
      `;
    }
  
    createCountersHTML() {
      return `
        <div class="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between text-sm text-gray-500">
          <div class="char-count">${this.translate('counters.characters')}: 0</div>
          <div class="word-count">${this.translate('counters.words')}: 0</div>
        </div>
      `;
    }
  
    setupToolbar() {
      this.container.querySelectorAll('.toolbar-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const command = button.getAttribute('data-command');
          this.executeCommand(command);
        });
      });
  
      // Setup selects
      const formatBlock = this.container.querySelector('.format-block');
      if (formatBlock) {
        formatBlock.addEventListener('change', () => {
          this.executeCommand('formatBlock', formatBlock.value);
        });
      }

      // fontName
      const fontName = this.container.querySelector('.font-name');
      if (fontName) {
        fontName.addEventListener('change', () => {
          this.executeCommand('fontName', fontName.value);
        });
      }

      // textColor
      const textColor = this.container.querySelector('.text-color');
      if (textColor) {
        textColor.addEventListener('change', () => {
          this.executeCommand('foreColor', textColor.value);
        });
      }

      // bgColor
      const bgColor = this.container.querySelector('.bg-color');
      if (bgColor) {
        bgColor.addEventListener('change', (e) => {
          const selectedValue = e.target.value;
          if (selectedValue === '') {
            // First we try to remove the color using removeFormat
            this.executeCommand('removeFormat');
            
            // As a backup, we also explicitly set the background color to transparent
            try {
              document.execCommand('backColor', false, 'transparent');
              // As a backup, we also explicitly set the background color to transparent:
              document.execCommand('hiliteColor', false, 'transparent');
            } catch(e) {
              console.log('Error al remover color:', e);
            }
          } else {
            this.executeCommand('hiliteColor', selectedValue);
          }
        });
      }

      // Insert images via URL
      const imageUploadButton = this.container.querySelector('#image-upload');
      if (imageUploadButton) {
          imageUploadButton.addEventListener('click', () => {
              const url = prompt(this.translate('toolbar.prompts.imageUrl'));
              if (url) {
                  this.insertImage(url);
              }
          });
      }

      // Insert link via URL
      const linkUploadButton = this.container.querySelector('#link-upload');
      if (linkUploadButton) {
        linkUploadButton.addEventListener('click', () => {
              const command = linkUploadButton.getAttribute('data-command');
              const url = prompt(this.translate('toolbar.prompts.linkUrl'));
              if (url) document.execCommand(command, false, url);
          });
      }
    }
  
    executeCommand(command, value = null) {
      this.editor.focus();
      document.execCommand(command, false, value);
      this.updateButtonStates();
    }

    insertImage(url) {
      document.execCommand('insertImage', false, url);
      this.editor.focus();
    }
  
    setupEditor() {
      this.editor.addEventListener('input', () => {
        this.updateCounters();
        this.syncWithTextarea();
      });
      this.editor.addEventListener('keyup', () => {
        this.updateButtonStates();
        this.syncWithTextarea();
      });
      this.editor.addEventListener('mouseup', () => this.updateButtonStates());

      // If we're working with a textarea, set initial content
      if (this.isTextarea && this.textarea.value) {
        this.setContent(this.textarea.value);
      }
    }

    syncWithTextarea() {
      if (this.isTextarea) {
        this.textarea.value = this.getContent();
        
        // Dispatch change event on the textarea
        const event = new Event('change', { bubbles: true });
        this.textarea.dispatchEvent(event);
      }
    }
  
    setupCounters() {
      if (!this.options.counters) return;
      
      this.charCount = this.container.querySelector('.char-count');
      this.wordCount = this.container.querySelector('.word-count');
      this.updateCounters();
    }
  
    updateCounters() {
      if (!this.options.counters) return;
      
      const text = this.editor.innerText;
      this.charCount.textContent = `${this.translate('counters.characters')}: ${text.length}`;
      this.wordCount.textContent = `${this.translate('counters.words')}: ${text.trim().split(/\s+/).length}`;
    }
  
    updateButtonStates() {
      this.container.querySelectorAll('.toolbar-btn[data-command]').forEach(button => {
        const command = button.getAttribute('data-command');
        if (document.queryCommandState(command)) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
  
    // Public API
    getContent() {
      return this.editor.innerHTML;
    }
  
    setContent(html) {
      this.editor.innerHTML = html;
      this.updateCounters();
    }

    // Add method to change language dynamically
    setLanguage(lang) {
      if (this.translations[lang]) {
        this.options.language = lang;
        this.init(); // Reinitialize the editor with new language
      } else {
        console.warn(`Language '${lang}' not supported`);
      }
    }

    // Add method to add new translations
    addTranslation(lang, translation) {
      this.translations[lang] = {
        ...this.translations[lang],
        ...translation
      };
    }
  
    destroy() {
      if (this.isTextarea) {
        this.textarea.style.display = '';
        this.wrapper.remove();
      } else {
        this.container.innerHTML = '';
      }
    }
  }

// Export as default
export default RichTextEditor;