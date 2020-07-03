export default class GingerHTMLHead{
  
  constructor(options){
    this.current = null;
    this.entries = [];
    this.updater = null;

    this.options = options;
  }

  /**
   * Set the current route
   * 
   * @param {Object} route 
   */
  setCurrentRoute(route){
    if (route.matched && route.matched.length > 0) {
      if (this.updater){
        clearInterval(this.updater);
      }

      this.current = route;
      
      this.updater = setInterval( () => {
        let ready = false;

        this.current.matched.forEach( m => {
          ready = ready || (m.components && m.components.hasOwnProperty('default'))
        });
        
        if (ready){
          clearInterval(this.updater);
          this.update();
        }
      }, 100);
    }
  }

  /**
   * Orchestrate the header update based on the component head
   */
  update(){
    this.entries = this.current.matched.filter( m => m.components.default.hasOwnProperty('head') );
    this.entries = this.entries.map( m => { 
      return { head: m.components.default.head, instance: m.instances.default }
    });

    this.entries.forEach( e => {
      console.log('e', e);
    })

    this.updateTitle();
  }

  /**
   * Set the document title based on the active routes
   */
  updateTitle(){  
    let title = this.entries.map( e => { 
      const { head, instance } = e;
      let ret = null;
      if (head.hasOwnProperty('title')){
        let prop = head.title;

        ret = head.title
        if (typeof prop === 'function'){
          ret = head.title.apply(instance);
        }
      }
      return ret;
    });

    title = title.join(' - ');
    if (title && title.length > 0){
      document.title = title;
    }

  }

}