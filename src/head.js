export default class GingerHTMLHead{
  
  constructor(options){
    this.current = null;
    this.entry = null;
    this.updater = null;

    this.options = options;
  }

  /**
   * Set the current route
   * 
   * @param {Object} route 
   */
  setCurrentRoute(route){
    if (route && this.current !== route){
      this.current = route;
      this.update();
    }
  }

  /**
   * Orchestrate the header update based on the component head
   */
  update(){
    this.entry = {
      head: this.current.components.default.head,
      instance: this.current.instances.default
    };
    
    this.updateTitle();
  }

  /**
   * Set the document title based on the active routes
   */
  updateTitle(){  
    let title = '';
    const { head, instance } = this.entry;

    if (head.hasOwnProperty('title')){
      let prop = head.title;

      title = head.title
      if (typeof prop === 'function'){
        title = head.title.apply(instance);
      }
    }

    if (title && title.length > 0){
      document.title = title;
    }
  }
}