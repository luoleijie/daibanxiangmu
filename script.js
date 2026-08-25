/**
 * AI Todo List - 核心业务逻辑
 * 包含：任务增删改查、状态切换、分类过滤、本地存储持久化与交互反馈
 */

// 常量配置
const STORAGE_KEY = 'ai_todo_list_data';

// 应用状态
class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = 'all'; // 'all' | 'active' | 'completed'
    this.toastTimer = null;

    // DOM 元素引用
    this.form = document.getElementById('todoForm');
    this.input = document.getElementById('todoInput');
    this.listContainer = document.getElementById('todoList');
    this.emptyState = document.getElementById('emptyState');
    this.totalCountEl = document.getElementById('totalCount');
    this.completedCountEl = document.getElementById('completedCount');
    this.badgeAll = document.getElementById('badgeAll');
    this.badgeActive = document.getElementById('badgeActive');
    this.badgeCompleted = document.getElementById('badgeCompleted');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
    this.filterTabs = document.querySelectorAll('.filter-tab');
    this.tagChips = document.querySelectorAll('.tag-chip');
    this.toastEl = document.getElementById('toast');

    this.init();
  }

  /**
   * 初始化应用
   */
  init() {
    this.loadTodos();
    this.bindEvents();
    this.render();
  }

  /**
   * 从 localStorage 读取任务数据
   */
  loadTodos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.todos = JSON.parse(stored);
      } else {
        // 首次加载提供示例初始任务，增强开箱体验
        this.todos = [
          {
            id: 'sample-1',
            text: '欢迎使用 AI Todo List 智能待办清单 🎉',
            completed: false,
            tag: '💡 创意想法',
            createdAt: Date.now() - 1000 * 60 * 10
          },
          {
            id: 'sample-2',
            text: '点击左侧勾选框标记为完成',
            completed: true,
            tag: '🛠️ 需求开发',
            createdAt: Date.now() - 1000 * 60 * 30
          }
        ];
        this.saveTodos();
      }
    } catch (e) {
      console.error('读取 localStorage 失败，使用空数据:', e);
      this.todos = [];
    }
  }

  /**
   * 将当前任务持久化保存到 localStorage
   */
  saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    } catch (e) {
      console.error('保存至 localStorage 失败:', e);
      this.showToast('⚠️ 本地存储保存失败');
    }
  }

  /**
   * 绑定事件监听
   */
  bindEvents() {
    // 表单提交（新增任务）
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddTodo();
      });
    }

    // 快捷标签点击
    this.tagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.getAttribute('data-tag');
        if (this.input) {
          const currentVal = this.input.value.trim();
          // 如果输入框已有内容，在前面或者后面附带标签
          if (!currentVal.startsWith(tag)) {
            this.input.value = `${tag} ${currentVal}`.trim();
          }
          this.input.focus();
        }
      });
    });

    // 过滤选项卡切换
    this.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });

    // 清理已完成任务
    if (this.clearCompletedBtn) {
      this.clearCompletedBtn.addEventListener('click', () => {
        this.clearCompleted();
      });
    }

    // 列表事件委托（勾选完成、删除）
    if (this.listContainer) {
      this.listContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        // 删除按钮触发
        const deleteBtn = target.closest('.btn-delete');
        if (deleteBtn) {
          const todoId = deleteBtn.getAttribute('data-id');
          this.deleteTodo(todoId);
          return;
        }

        // 切换完成状态（点击 todo-left 区域）
        const todoLeft = target.closest('.todo-left');
        if (todoLeft) {
          const todoId = todoLeft.getAttribute('data-id');
          this.toggleTodo(todoId);
        }
      });
    }
  }

  /**
   * 处理新增任务逻辑
   */
  handleAddTodo() {
    if (!this.input) return;
    const rawText = this.input.value.trim();
    if (!rawText) {
      this.showToast('请输入任务内容');
      this.input.focus();
      return;
    }

    // 检测是否有标签前缀
    let tag = '';
    let text = rawText;
    const knownTags = ['🔥 重要紧急', '💡 创意想法', '🛠️ 需求开发', '📚 学习提升'];
    for (const t of knownTags) {
      if (rawText.startsWith(t)) {
        tag = t;
        text = rawText.replace(t, '').trim();
        break;
      }
    }

    const newTodo = {
      id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      text: text || rawText,
      tag: tag,
      completed: false,
      createdAt: Date.now()
    };

    this.todos.unshift(newTodo);
    this.saveTodos();
    this.render();
    this.input.value = '';
    this.showToast('✅ 任务添加成功');
  }

  /**
   * 切换任务完成状态
   * @param {string} id 任务ID
   */
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.render();
      const statusText = todo.completed ? '已标记为完成' : '已恢复为未完成';
      this.showToast(`✨ ${statusText}`);
    }
  }

  /**
   * 删除指定任务
   * @param {string} id 任务ID
   */
  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveTodos();
      this.render();
      this.showToast('🗑️ 任务已删除');
    }
  }

  /**
   * 清理所有已完成任务
   */
  clearCompleted() {
    const prevCount = this.todos.length;
    this.todos = this.todos.filter(t => !t.completed);
    const deletedCount = prevCount - this.todos.length;
    
    if (deletedCount > 0) {
      this.saveTodos();
      this.render();
      this.showToast(`🧹 已清理 ${deletedCount} 项已完成任务`);
    } else {
      this.showToast('ℹ️ 暂无已完成的任务可清理');
    }
  }

  /**
   * 设置过滤视图
   * @param {'all' | 'active' | 'completed'} filter 
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.filterTabs.forEach(tab => {
      if (tab.getAttribute('data-filter') === filter) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    this.render();
  }

  /**
   * 格式化时间戳
   * @param {number} timestamp 
   * @returns {string}
   */
  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }

  /**
   * HTML 安全转义
   * @param {string} str 
   * @returns {string}
   */
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * 渲染待办事项与统计信息
   */
  render() {
    // 计算统计数据
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;

    // 更新统计栏与角标
    if (this.totalCountEl) this.totalCountEl.textContent = total;
    if (this.completedCountEl) this.completedCountEl.textContent = completed;
    if (this.badgeAll) this.badgeAll.textContent = total;
    if (this.badgeActive) this.badgeActive.textContent = active;
    if (this.badgeCompleted) this.badgeCompleted.textContent = completed;

    // 获取当前过滤后的列表
    let filteredTodos = this.todos;
    if (this.currentFilter === 'active') {
      filteredTodos = this.todos.filter(t => !t.completed);
    } else if (this.currentFilter === 'completed') {
      filteredTodos = this.todos.filter(t => t.completed);
    }

    // 渲染空状态或列表
    if (filteredTodos.length === 0) {
      if (this.listContainer) this.listContainer.innerHTML = '';
      if (this.emptyState) this.emptyState.classList.add('show');
    } else {
      if (this.emptyState) this.emptyState.classList.remove('show');
      if (this.listContainer) {
        this.listContainer.innerHTML = filteredTodos.map(todo => {
          const isDone = todo.completed ? 'completed' : '';
          const tagHtml = todo.tag ? `<span class="tag-label">${this.escapeHTML(todo.tag)}</span>` : '';
          const timeStr = this.formatTime(todo.createdAt);

          return `
            <li class="todo-item ${isDone}" data-id="${todo.id}">
              <div class="todo-left" data-id="${todo.id}" role="button" tabindex="0" title="点击切换完成状态">
                <div class="custom-checkbox" aria-checked="${todo.completed}">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="todo-content">
                  <span class="todo-text">${this.escapeHTML(todo.text)}</span>
                  <div class="todo-meta">
                    ${tagHtml}
                    <span class="todo-time">${timeStr}</span>
                  </div>
                </div>
              </div>
              <button class="btn-delete" data-id="${todo.id}" title="删除任务" aria-label="删除任务">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </li>
          `;
        }).join('');
      }
    }
  }

  /**
   * 触发操作提示消息 (Toast)
   * @param {string} msg 
   */
  showToast(msg) {
    if (!this.toastEl) return;
    this.toastEl.textContent = msg;
    this.toastEl.classList.add('show');

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 2200);
  }
}

// 页面加载完成后实例化应用
document.addEventListener('DOMContentLoaded', () => {
  window.todoApp = new TodoApp();
});
