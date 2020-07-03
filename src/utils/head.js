import  { isObject } from './index'

export default function hasHeadInfo(vm){
  vm = vm || this;
  return vm && (vm[rootConfigKey] === true || isObject(vm[rootConfigKey]));
}