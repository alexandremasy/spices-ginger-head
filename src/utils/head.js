import { isObject, rootConfigKey } from './index'

export function hasHeadInfo(vm){
  vm = vm || this;
  return vm && (vm[rootConfigKey] === true || isObject(vm[rootConfigKey]));
}