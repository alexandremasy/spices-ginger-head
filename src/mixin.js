import { hasHeadInfo, isUndefined, rootConfigKey, keyName } from './utils'

let appId = 1;

export default function createMixin({ capabilities, options }){
  return {
    beforeCreate(){
      const rootKey = '$root';
      const $root = this[rootKey];
      const $options = this.$options;

      options = {
        keyName: options.keyName || keyName
      };
  
      Object.defineProperty(this, '_hasHeadInfo', {
        configurable: true,
        get() {
          return hasHeadInfo(this)
        }
      })

      if (isUndefined($options[options.keyName]) || $options[options.keyName] === null) {
        return
      }
  
      if (!$root[rootConfigKey]) {
        $root[rootConfigKey] = { appId }
        appId++
      }

      // to speed up updates we keep track of branches which have a component with head info defined
      // if _vueMeta = true it has info, if _vueMeta = false a child has info
      if (!this[rootConfigKey]) {
        this[rootConfigKey] = true
        
        let parent = this.$parent
        while (parent && parent !== $root) {
          if (isUndefined(parent[rootConfigKey])) {
            parent[rootConfigKey] = false
          }
          parent = parent.$parent
        }
      }

      // force an initial refresh on page load and prevent other lifecycleHooks
      // to triggerUpdate until this initial refresh is finished
      // this is to make sure that when a page is opened in an inactive tab which
      // has throttled rAF/timers we still immediately set the page title
      if (isUndefined($root[rootConfigKey].initialized)) {
        $root[rootConfigKey].initialized = this.$isServer

        if (!$root[rootConfigKey].initialized) {
          // we use the mounted hook here as on page load
          this.$on('hook:mounted', function () {
            const $root = this[rootKey]
            console.log('hook:mounted');

            if ($root[rootConfigKey].initialized) {
              return
            }

            // used in triggerUpdate to check if a change was triggered
            // during initialization
            $root[rootConfigKey].initializing = true;

            // refresh meta in nextTick so all child components have loaded
            this.$nextTick(function () {
              console.log('nextTick');
              $root.$head.refresh($root);
            })
          })
        }
      }

      ['activated', 'deactivated', 'beforeMount'].forEach((hook) => {
        this.$on(`hook:${hook}`, function () {
          $root.$head.refresh($root);
          // triggerUpdate(options, this[rootKey], lifecycleHook)
        })
      })
    }
  }
}