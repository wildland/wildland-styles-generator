module.exports = WildlandStylesGenerator

var LAST_ROUTE_REGEX = /(@import '[A-Za-z0-9_-]+-route';)(?![\s\S]*(@import '[A-Za-z0-9_-]+-route';))/;
var LAST_COMPONENT_REGEX = /(@import '[A-Za-z0-9_-]+-component';)(?![\s\S]*(@import '[A-Za-z0-9_-]+-component';))/;

/* Currently this only supports adding imports to .less files. If you need css/sass/stylus, implement it and submit a PR */
function WildlandStylesGenerator(source) {
  this.source = source
}

function addAfterLastRoute(source, codeToAdd) {
  return source.replace(LAST_ROUTE_REGEX, "$1 \n" + codeToAdd);
}

function addAfterLastComponent(source, codeToAdd) {
  return source.replace(LAST_COMPONENT_REGEX, "$1 \n" + codeToAdd);
}

function addBeforeLastRoute(source, codeToAdd) {
  return source.replace(LAST_ROUTE_REGEX, codeToAdd + "\n $1");
}

function routeImportsExist(source) {
  return LAST_ROUTE_REGEX.test(source);
}

function componentImportsExist(source) {
  return LAST_COMPONENT_REGEX.test(source);
}

WildlandStylesGenerator.prototype.addRouteSheetImport = function(routeName) {
  var dasherizedRouteName = routeName.split('/').join('-');
  var routeImportCode = "@import '" + dasherizedRouteName + "-route';";

  if (routeImportsExist(this.source)) {
    this.source = addAfterLastRoute(this.source, routeImportCode);
  } else if (componentImportsExist(this.source)) {
    this.source = addAfterLastComponent(this.source, "\n\n" + routeImportCode);
  } else {
    this.source = this.source + "\n" + routeImportCode;
  }

  return this;
}

WildlandStylesGenerator.prototype.removeRouteSheetImport = function(routeName) {
  throw "Write removeRouteSheetImport function";
}

WildlandStylesGenerator.prototype.addComponentSheetImport = function(componentName) {
  var componentImportCode = "@import '" + componentName + "-component';";

  if (componentImportsExist(this.source)) {
    this.source = addAfterLastComponent(this.source, componentImportCode);
  } else if (routeImportsExist(this.source)) {
    this.source = addBeforeLastRoute(this.source, componentImportCode + "\n\n");
  } else {
    this.source = this.source + "\n\n" + routeImportCode;
  }

  return this;
}

WildlandStylesGenerator.prototype.removeComponentSheetImport = function(componentName) {
  throw "Write removeComponentSheetImport function";
}

WildlandStylesGenerator.prototype.code = function() {
  return this.source;
}
