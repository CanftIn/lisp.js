function map(f, l) {
  var r = [];
  for (var i = 0; i < l.length; ++i)
    r.push(f(l[i]));
  return r;
}

function filter(f, l) {
  var r = [];
  for (var i = 0; i < l.length; ++i)
    f(l[i]) && r.push(l[i]);
  return r;
}

function reduce(f, v, l) {
  for (var i = 0; i < l.length; ++i)
    v = f(v, l[i]);
  return v;
}

function type(a) {
  return typeof a;
}

function range(a) {
  var r = [];
  for (var i = 0; i < a; ++i)
    r[i] = i;
  return r;
}

function apply(f, a) {
  return f.apply(null, a);
}

module.exports = {
  map,
  filter,
  reduce,
  type,
  range,
  apply
};
