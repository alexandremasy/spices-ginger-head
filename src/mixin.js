import { hasHeadInfo, isFunction, isUndefined, rootConfigKey } from './utils'

let appId = 1;

export default function createMixin( Vue, options ){
  return {
    beforeCreate(){
      const rootKey = '$root';
      const $root = this[rootKey];
      const $options = this.$options;
  
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
  
      // coerce function-style metaInfo to a computed prop so we can observe
      // it on creation
      console.log('opts', $options[options.keyName]);
      if (isFunction($options[options.keyName])) {
        $options.computed = $options.computed || {}
        $options.computed.$headInfo = $options[options.keyName]
  
        if (!this.$isServer) {
          // if computed $metaInfo exists, watch it for updates & trigger a refresh
          // when it changes (i.e. automatically handle async actions that affect metaInfo)
          // credit for this suggestion goes to [Sébastien Chopin](https://github.com/Atinux)
          this.$on('hook:created', function () {
            this.$watch('$headInfo', function () {
              triggerUpdate(options, this[rootKey], 'watcher')
            })
          })
        }
      }
    }
  }
}