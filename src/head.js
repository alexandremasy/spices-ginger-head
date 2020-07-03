import { getComponentOption, isFunction } from "./utils";

export default class GingerHTMLHead{
  
  constructor(options){
    this.current = null;
    this.entries = [];
    this.updater = null;

    this.options = options;
  }

  refresh(vm){
    const info = getComponentOption(vm);

    
    Object.keys(info).forEach( key => {
      let value = info[key];

      if (isFunction(value)){
        value = value.apply(value);
      }
      console.log('refresh', key, value);
    })
    
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
      }, 300);
    }
  }

  /**
   * Orchestrate the header update based on the component head
   */
  update(){
    this.entries = this.current.matched.filter( m => m.components.default.hasOwnProperty('head') );
    console.log('entries', this.entries);
    this.entries = this.entries.map( m => m.components.default.head );

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
      let ret = null;
      if (e.hasOwnProperty('title')){
        let prop = e.title;

        ret = e.title
        if (typeof prop === 'function'){
          ret = prop.call(prop);
        }
      }
      return ret;
    });

    title = title.join(' - ');
    if (title && title.length > 0){
      console.log('updateTitle', title);
      document.title = title;
    }

  }

}