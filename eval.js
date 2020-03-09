const T_NULL = Symbol('t_null');
const T_EXPR = Symbol('t_expr');
const T_VARI = Symbol('t_vari');
const T_NUMB = Symbol('t_numb');
const T_STRI = Symbol('t_stri');
const T_BOOL = Symbol('t_bool');

class T {
  constructor(scope = {}, parent = null) {
    this.scope = scope;
    this.parent = parent;
  }

  eval(raw, res = true) {
    let str = raw.replace(/\n/g, ' ').trim();
    let type = T_NULL;
    let args = [];

    switch (true) {
      case !str.length:
        type = T_NULL;
        break;
      case /^null$/.test(str):
        type = T_NULL;
        break;
      case /^\-?(\d+|\d+\.\d*|\d*\.\d+)$/.test(str):
        type = T_NUMB;
        break;
      case /^(true|false)$/.test(str):
        type = T_BOOL;
        break;
      case /^[a-zA-z_\+\-\*/<>=]+[a-zA-Z_0-9]*$/.test(str):
        type = T_VARI;
        break;
      case /^"(\\"|[^"])"$/.test(str):
        type = T_VARI;
        break;
      case /^\(.+\)$/.test(str):
        type = T_EXPR;
        let flag = 0, escape = false, remain = '';
        for (var i = 0; i < str.length; ++i) {
          if (escape) {
            escape = false;
          } else {
            let ch = str[i];
            switch (ch) {
              case '\\':
                escape = true;
                remain += ch;
                break;
              case '(':
                flag += 2;
                remain += ch;
                break;
              case ')':
                flag -= 2;
                remain += ch;
                break;
              case '\"':
                flag ^= 1;
                remain += ch;
                break;
              case ' ':
              case '\n':
              case '\t':
                if (!flag) {
                  if (remain) {
                    args.push(remain);
                  }
                  remain = '';
                } else {
                  remain += ch;
                }
                break;
              default:
                remain += ch;
            }
          }
        }
        args.push(remain);
        break;
    }

    if (!res) {
      return { type, str, args };
    }

    switch (type) {
      case T_NULL:
        return null;
      case T_NUMB:
        return Number(str);
      case T_BOOL:
        return str === 'true';
      case T_VARI:
        let v = this.scope[str];
        if (typeof v === 'undefined') {
          return this.parent.eval(str);
        }
        if (typeof v === 'string') {
          return this.parent.eval(v);
        }
        return v;
      case T_STRI:
        return str.slice(1, -1);
      case T_EXPR:
        return this.eval(args[0]).apply(this, args.slice(1));
    }
  }
}

let define = function (s_a, s_b, s_c) {
  let scope = Object.assign({}, this.scope);
  let a = this.eval(s_a, false);

  if (a.type === T_VARI) {
    scope[a.str] = s_b;
  } else if (a.type === T_EXPR) {
    scope[a.args[0]] = function (...args) {
      let innerScope = Object.assign({}, this.scope);
      for (let i = 1; i < a.args.length; ++i) {
        innerScope[a.args[i]] = args[i - 1];
      }
      return (new T(innerScope, this)).eval(s_b);
    };
  }
  return (new T(scope, this)).eval(s_c);
};

let scope = {
  define,
  '+': function (a, b) {
    return this.eval(a) + this.eval(b);
  },
  '-': function (a, b) {
    return this.eval(a) - this.eval(b);
  },
  '*': function (a, b) {
    return this.eval(a) * this.eval(b);
  },
  '/': function (a, b) {
    return this.eval(a) / this.eval(b);
  },
  '>': function (a, b) {
    return this.eval(a) > this.eval(b);
  },
  '<': function (a, b) {
    return this.eval(a) < this.eval(b);
  },
  '=': function (a, b) {
    return this.eval(a) === this.eval(b);
  }
};

const rootScope = new T(scope);

let t = new T({}, rootScope);

console.log(t.eval('(+ 1 (+ 2 (- 5 21)))'));
